// 游戏对象模块 - 负责创建和管理食物、障碍物等游戏元素
class GameObjects {
  constructor(canvasWidth, canvasHeight, blockSize) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.blockSize = blockSize;

    // 食物数组
    this.foods = [];

    // 障碍物数组
    this.obstacles = [];
  }

  // 获取所有可用格子
  getAvailablePositions(snake) {
    const maxX = this.canvasWidth / this.blockSize;
    const maxY = this.canvasHeight / this.blockSize;
    const positions = new Set();

    // 生成所有位置的字符串表示
    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < maxY; y++) {
        positions.add(`${x},${y}`);
      }
    }

    // 移除蛇身位置
    snake.segments.forEach(segment => {
      positions.delete(`${segment.x},${segment.y}`);
    });

    // 移除障碍物位置
    this.obstacles.forEach(obstacle => {
      positions.delete(`${obstacle.x},${obstacle.y}`);
    });

    // 移除现有食物位置
    this.foods.forEach(food => {
      positions.delete(`${food.x},${food.y}`);
    });

    return Array.from(positions).map(pos => {
      const [x, y] = pos.split(',').map(Number);
      return { x, y };
    });
  }

  // 创建食物
  createFood(snake, gameMode, score) {
    // 清理已被蛇吞之食物
    this.foods = this.foods.filter(food => !this.isOnSnake(food, snake));

    // 根据游戏难度、分数和蛇长度动态计算食物数量
    let targetFoodCount;
    const snakeLength = snake.segments.length;
    const baseCount = Math.floor(Math.random() * 3) + 1; // 基础食物数量1-3个

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

      // 根据分数增加食物数量，每10分增加一个食物上限
      const bonusFromScore = Math.floor(score / 10);
      targetFoodCount = Math.min(targetFoodCount + bonusFromScore, 8); // 最多8个食物

      // 根据蛇的长度调整食物数量，蛇越长食物越少
      if (snakeLength > 15) {
        targetFoodCount = Math.max(1, targetFoodCount - 1); // 至少保留1个食物
      }
    }

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
      this.assignFoodType(food, snakeLength, score, gameMode);
      this.foods.push(food);

      // 从可用位置中移除已用之格
      available.splice(idx, 1);
    }

    return this.foods;
  }

  // 根据游戏进程分配食物类型
  assignFoodType(food, snakeLength, score, gameMode) {
    // 默认食物类型概率
    let lifeProb = 0.2; // 生命食物概率
    let speedProb = 0.0; // 速度食物概率
    let scoreProb = 0.0; // 高分食物概率

    // 根据蛇长度和分数调整概率
    if (score > 5) {
      // 分数大于5时，引入高分食物
      scoreProb = 0.15;
      lifeProb = 0.15;
    }

    if (snakeLength > 10) {
      // 蛇长度大于10时，引入速度食物
      speedProb = 0.1;
      // 同时增加生命食物概率
      lifeProb = 0.2;
    }

    // 根据游戏模式调整概率
    if (gameMode) {
      if (gameMode.name === '困难' || gameMode.name === '专家') {
        // 困难和专家模式下，增加生命食物概率
        lifeProb += 0.1;
      }
    }

    // 分配食物类型
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
    const dangerRange = 5;

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
      const scoreFactor = Math.floor(score / 5); // 每5分增加障碍物

      // 根据游戏模式调整障碍物增长速率
      let growthRate = 1; // 默认增长率

      switch (gameMode.name) {
        case '快速':
          // 快速模式障碍物增长较慢
          growthRate = 0.5;
          break;
        case '困难':
          // 困难模式障碍物增长适中
          growthRate = 1;
          break;
        case '专家':
          // 专家模式障碍物增长较快
          growthRate = 1.5;
          break;
        default: // 普通模式
          growthRate = 0.7;
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
      const maxObstacles = Math.floor(((this.canvasWidth * this.canvasHeight) / (this.blockSize * this.blockSize)) * 0.3); // 最多占30%空间
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
      if (gameMode && gameMode.name === '专家' && score > 10 && Math.random() < 0.2) {
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
