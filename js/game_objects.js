// 游戏对象模块 - 负责创建和管理食物、障碍物等游戏元素
class GameObjects {
  // 游戏常量配置
  static CONSTANTS = {
    // 食物相关常量
    FOOD: {
      MAX_COUNT: 8, // 最大食物数量
      SCORE_BONUS_THRESHOLD: 10, // 每10分增加一个食物上限
      SNAKE_LENGTH_THRESHOLD: 15, // 蛇长度超过15时减少食物
    },
    // 食物类型概率常量
    FOOD_PROBABILITY: {
      DEFAULT_LIFE_PROB: 0.2, // 默认生命食物概率
      DEFAULT_SPEED_PROB: 0.0, // 默认速度食物概率
      DEFAULT_SCORE_PROB: 0.0, // 默认高分食物概率
      SCORE_THRESHOLD: 5, // 分数阈值，超过此值引入高分食物
      SCORE_FOOD_PROB: 0.15, // 高分食物概率
      SNAKE_LENGTH_THRESHOLD: 10, // 蛇长度阈值，超过此值引入速度食物
      SNAKE_LENGTH_SPEED_PROB: 0.1, // 蛇长度超过阈值时的速度食物概率
      DIFFICULT_MODE_BONUS: 0.1, // 困难模式额外生命食物概率
    },
    // 障碍物相关常量
    OBSTACLE: {
      DANGER_RANGE: 5, // 危险区域范围
      SCORE_FACTOR_THRESHOLD: 5, // 每5分增加障碍物
      MAX_SPACE_PERCENTAGE: 0.3, // 障碍物最多占据空间的百分比
      MOVING_OBSTACLE_THRESHOLD: 10, // 专家模式下，分数超过此值可能出现移动障碍物
      MOVING_OBSTACLE_PROB: 0.2, // 专家模式下移动障碍物出现概率
    },
    // 游戏模式相关常量
    GAME_MODE: {
      GROWTH_RATE: {
        FAST: 0.5, // 快速模式障碍物增长率
        NORMAL: 0.7, // 普通模式障碍物增长率
        HARD: 1.0, // 困难模式障碍物增长率
        EXPERT: 1.5, // 专家模式障碍物增长率
      },
    },
  };
  constructor(canvasWidth, canvasHeight, blockSize) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.blockSize = blockSize;

    // 食物数组
    this.foods = [];

    // 障碍物数组
    this.obstacles = [];
  }

  // 获取所有可用格子 - 优化版本
  getAvailablePositions(snake) {
    const maxX = Math.floor(this.canvasWidth / this.blockSize);
    const maxY = Math.floor(this.canvasHeight / this.blockSize);

    // 使用二维数组表示格子状态，避免字符串操作
    // 初始化为全部可用 (true)
    const grid = Array(maxX)
      .fill()
      .map(() => Array(maxY).fill(true));

    // 标记蛇身位置为不可用
    for (const segment of snake.segments) {
      if (segment.x >= 0 && segment.x < maxX && segment.y >= 0 && segment.y < maxY) {
        grid[segment.x][segment.y] = false;
      }
    }

    // 标记障碍物位置为不可用
    for (const obstacle of this.obstacles) {
      if (obstacle.x >= 0 && obstacle.x < maxX && obstacle.y >= 0 && obstacle.y < maxY) {
        grid[obstacle.x][obstacle.y] = false;
      }
    }

    // 标记现有食物位置为不可用
    for (const food of this.foods) {
      if (food.x >= 0 && food.x < maxX && food.y >= 0 && food.y < maxY) {
        grid[food.x][food.y] = false;
      }
    }

    // 收集所有可用位置
    const availablePositions = [];
    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < maxY; y++) {
        if (grid[x][y]) {
          // 直接创建坐标对象，避免中间字符串转换
          availablePositions.push({ x, y });
        }
      }
    }

    return availablePositions;
  }

  // 创建食物
  createFood(snake, gameMode, score) {
    // 清理已被蛇吞之食物
    this.foods = this.foods.filter(food => !this.isOnSnake(food, snake));

    // 计算目标食物数量
    const targetFoodCount = this.calculateTargetFoodCount(snake, gameMode, score);

    // 获取所有可用位置
    const available = this.getAvailablePositions(snake);

    // 若无可用格，则直接返回
    if (available.length === 0) {
      return this.foods;
    }

    // 生成所需数量的食物
    while (this.foods.length < targetFoodCount && available.length > 0) {
      // 随机选取一个位置
      const idx = Math.floor(Math.random() * available.length);
      const food = available[idx];

      // 根据游戏进程动态调整食物类型
      this.assignFoodType(food, snake.segments.length, score, gameMode);
      this.foods.push(food);

      // 从可用位置中移除已用之格
      available.splice(idx, 1);
    }

    return this.foods;
  }

  // 计算目标食物数量
  calculateTargetFoodCount(snake, gameMode, score) {
    const snakeLength = snake.segments.length;
    const baseCount = Math.floor(Math.random() * 3) + 1; // 基础食物数量1-3个
    let targetFoodCount;

    // 根据游戏模式调整食物数量
    if (!gameMode) {
      // 兼容旧代码，如果没有传入gameMode，使用随机数
      targetFoodCount = Math.floor(Math.random() * 5) + 1;
    } else {
      // 根据难度调整基础食物数量
      switch (gameMode.name) {
        case '快速':
          // 快速模式食物较多，便于蛇快速成长
          targetFoodCount = baseCount + 2;
          break;
        case '困难':
          // 困难模式食物适中
          targetFoodCount = baseCount + 1;
          break;
        case '专家':
          // 专家模式食物较少，增加挑战性
          targetFoodCount = baseCount;
          break;
        default: // 普通模式
          targetFoodCount = baseCount + 1;
      }

      // 根据分数增加食物数量
      const bonusFromScore = Math.floor(score / GameObjects.CONSTANTS.FOOD.SCORE_BONUS_THRESHOLD);
      targetFoodCount = Math.min(targetFoodCount + bonusFromScore, GameObjects.CONSTANTS.FOOD.MAX_COUNT);

      // 根据蛇的长度调整食物数量，蛇越长食物越少
      if (snakeLength > GameObjects.CONSTANTS.FOOD.SNAKE_LENGTH_THRESHOLD) {
        targetFoodCount = Math.max(1, targetFoodCount - 1); // 至少保留1个食物
      }
    }

    return targetFoodCount;
  }

  // 根据游戏进程分配食物类型
  assignFoodType(food, snakeLength, score, gameMode) {
    const PROB = GameObjects.CONSTANTS.FOOD_PROBABILITY;

    // 默认食物类型概率
    let lifeProb = PROB.DEFAULT_LIFE_PROB;
    let speedProb = PROB.DEFAULT_SPEED_PROB;
    let scoreProb = PROB.DEFAULT_SCORE_PROB;

    // 根据分数调整概率
    if (score > PROB.SCORE_THRESHOLD) {
      // 分数大于阈值时，引入高分食物
      scoreProb = PROB.SCORE_FOOD_PROB;
      lifeProb = PROB.SCORE_FOOD_PROB; // 同时调整生命食物概率
    }

    // 根据蛇长度调整概率
    if (snakeLength > PROB.SNAKE_LENGTH_THRESHOLD) {
      // 蛇长度大于阈值时，引入速度食物
      speedProb = PROB.SNAKE_LENGTH_SPEED_PROB;
      // 同时增加生命食物概率
      lifeProb = PROB.DEFAULT_LIFE_PROB;
    }

    // 根据游戏模式调整概率
    if (gameMode) {
      if (gameMode.name === '困难' || gameMode.name === '专家') {
        // 困难和专家模式下，增加生命食物概率
        lifeProb += PROB.DIFFICULT_MODE_BONUS;
      }
    }

    // 分配食物类型
    this.determineFoodType(food, lifeProb, speedProb, scoreProb);
  }

  // 根据概率确定食物类型
  determineFoodType(food, lifeProb, speedProb, scoreProb) {
    const rand = Math.random();
    if (rand < lifeProb) {
      food.type = 'life';
    } else if (rand < lifeProb + speedProb) {
      food.type = 'speed';
    } else if (rand < lifeProb + speedProb + scoreProb) {
      food.type = 'score';
    } else {
      food.type = 'normal';
    }
  }

  // 判断位置是否在蛇头前方的危险区域内
  isInDangerZone(pos, snake) {
    const head = snake.segments[0];
    const dangerRange = GameObjects.CONSTANTS.OBSTACLE.DANGER_RANGE;

    switch (snake.direction) {
      case 'right':
        return pos.x > head.x && pos.x <= head.x + dangerRange && pos.y === head.y;
      case 'left':
        return pos.x < head.x && pos.x >= head.x - dangerRange && pos.y === head.y;
      case 'up':
        return pos.y < head.y && pos.y >= head.y - dangerRange && pos.x === head.x;
      case 'down':
        return pos.y > head.y && pos.y <= head.y + dangerRange && pos.x === head.x;
      default:
        return false;
    }
  }

  // 创建障碍物
  createObstacles(count, snake, gameMode, score) {
    this.obstacles = [];

    // 获取所有可用位置
    const available = this.getAvailablePositions(snake);

    // 过滤掉危险区域
    const safePositions = available.filter(pos => !this.isInDangerZone(pos, snake));

    // 若无安全位置，则返回空数组
    if (safePositions.length === 0) {
      return this.obstacles;
    }

    // 动态调整障碍物数量
    let obstacleCount = count;
    const snakeLength = snake.segments.length;

    // 根据游戏模式、分数和蛇长度动态调整障碍物数量
    if (gameMode && score !== undefined) {
      // 基础障碍物数量由游戏模式决定
      obstacleCount = count;

      // 根据分数增加障碍物
      const scoreFactor = Math.floor(score / GameObjects.CONSTANTS.OBSTACLE.SCORE_FACTOR_THRESHOLD);

      // 根据游戏模式调整障碍物增长速率
      let growthRate = GameObjects.CONSTANTS.GAME_MODE.GROWTH_RATE.HARD; // 默认增长率

      switch (gameMode.name) {
        case '快速':
          // 快速模式障碍物增长较慢
          growthRate = GameObjects.CONSTANTS.GAME_MODE.GROWTH_RATE.FAST;
          break;
        case '困难':
          // 困难模式障碍物增长适中
          growthRate = GameObjects.CONSTANTS.GAME_MODE.GROWTH_RATE.HARD;
          break;
        case '专家':
          // 专家模式障碍物增长较快
          growthRate = GameObjects.CONSTANTS.GAME_MODE.GROWTH_RATE.EXPERT;
          break;
        default: // 普通模式
          growthRate = GameObjects.CONSTANTS.GAME_MODE.GROWTH_RATE.NORMAL;
      }

      // 计算额外障碍物数量
      const additionalObstacles = Math.floor(scoreFactor * growthRate);

      // 根据蛇长度调整障碍物数量，避免游戏过难
      let lengthAdjustment = 0;
      if (snakeLength > 20) {
        // 蛇较长时略微减少障碍物，避免难度过高
        lengthAdjustment = -2;
      } else if (snakeLength > 10) {
        // 中等长度时轻微减少
        lengthAdjustment = -1;
      }

      // 计算最终障碍物数量，确保至少有基础数量
      obstacleCount = Math.max(count, obstacleCount + additionalObstacles + lengthAdjustment);

      // 设置障碍物上限，避免过多导致游戏无法进行
      const maxObstacles = Math.floor(
        ((this.canvasWidth * this.canvasHeight) / (this.blockSize * this.blockSize)) * GameObjects.CONSTANTS.OBSTACLE.MAX_SPACE_PERCENTAGE
      );
      obstacleCount = Math.min(obstacleCount, maxObstacles, safePositions.length);
    } else {
      // 兼容旧代码，如果没有传入gameMode和score
      obstacleCount = Math.min(count, safePositions.length);
    }

    // 生成障碍物
    for (let i = 0; i < obstacleCount; i++) {
      // 随机选择一个安全位置
      const idx = Math.floor(Math.random() * safePositions.length);
      const obstacle = safePositions[idx];

      // 根据游戏进程决定是否创建特殊障碍物
      if (
        gameMode &&
        gameMode.name === '专家' &&
        score > GameObjects.CONSTANTS.OBSTACLE.MOVING_OBSTACLE_THRESHOLD &&
        Math.random() < GameObjects.CONSTANTS.OBSTACLE.MOVING_OBSTACLE_PROB
      ) {
        // 专家模式且分数>10时，有20%概率生成移动障碍物
        obstacle.type = 'moving';
        // 随机设置移动方向
        const directions = ['horizontal', 'vertical'];
        obstacle.moveDirection = directions[Math.floor(Math.random() * directions.length)];
      } else {
        obstacle.type = 'normal';
      }

      // 添加到障碍物数组
      this.obstacles.push(obstacle);

      // 从安全位置数组中移除已用位置
      safePositions.splice(idx, 1);
    }

    return this.obstacles;
  }

  // 更新障碍物位置（用于移动障碍物）
  updateObstaclePositions(snake) {
    // 仅处理移动类型的障碍物
    const movingObstacles = this.obstacles.filter(obs => obs.type === 'moving');

    if (movingObstacles.length === 0) return;

    // 获取当前可用位置
    const available = this.getAvailablePositions(snake);

    // 更新每个移动障碍物的位置
    movingObstacles.forEach(obstacle => {
      // 获取当前位置
      const currentX = obstacle.x;
      const currentY = obstacle.y;

      // 根据移动方向计算新位置
      let newX = currentX;
      let newY = currentY;

      if (obstacle.moveDirection === 'horizontal') {
        // 水平移动，随机左右
        newX = currentX + (Math.random() < 0.5 ? 1 : -1);
      } else {
        // vertical
        // 垂直移动，随机上下
        newY = currentY + (Math.random() < 0.5 ? 1 : -1);
      }

      // 检查新位置是否有效（在画布内且不与其他元素重叠）
      const maxX = Math.floor(this.canvasWidth / this.blockSize) - 1;
      const maxY = Math.floor(this.canvasHeight / this.blockSize) - 1;

      // 确保在画布范围内
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      // 检查新位置是否可用
      const newPosAvailable = available.some(pos => pos.x === newX && pos.y === newY);

      if (newPosAvailable) {
        // 更新位置
        obstacle.x = newX;
        obstacle.y = newY;
      }
      // 如果新位置不可用，保持原位置不变
    });
  }

  // 检查位置是否在蛇身上
  isOnSnake(pos, snake) {
    return snake.segments.some(segment => segment.x === pos.x && segment.y === pos.y);
  }

  // 检查位置是否在障碍物上
  isOnObstacle(pos) {
    return this.obstacles.some(obstacle => obstacle.x === pos.x && obstacle.y === pos.y);
  }

  // 获取当前食物位置
  getFood() {
    return this.foods;
  }

  // 获取当前障碍物
  getObstacles() {
    return this.obstacles;
  }

  // 重置游戏对象
  reset(snake, obstacleCount, gameMode, score) {
    this.foods = [];
    this.createFood(snake, gameMode, score || 0);
    this.createObstacles(obstacleCount, snake, gameMode, score || 0);
  }

  // 更新游戏对象状态 - 用于游戏进行中动态调整
  update(snake, gameMode, score) {
    // 更新移动障碍物位置
    this.updateObstaclePositions(snake);

    // 返回当前状态，便于外部处理
    return {
      foods: this.foods,
      obstacles: this.obstacles,
    };
  }
}

// 将类绑定至全局window对象，使其可被访问
window.GameObjects = GameObjects;
