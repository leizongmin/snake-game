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
  createFood(snake) {
    // 清理已被蛇吞之食物
    this.foods = this.foods.filter(food => !this.isOnSnake(food, snake));

    // 计算所需食物数量
    const targetFoodCount = Math.floor(Math.random() * 5) + 1;

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

      // 随机生成增加生命值之食物，概率为五分之一
      food.type = Math.random() < 0.2 ? 'life' : 'normal';
      this.foods.push(food);

      // 从可用位置中移除已用之格
      available.splice(idx, 1);
    }

    return this.foods;
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
  createObstacles(count, snake) {
    this.obstacles = [];

    // 获取所有可用位置
    const available = this.getAvailablePositions(snake);

    // 过滤掉危险区域
    const safePositions = available.filter(pos => !this.isInDangerZone(pos, snake));

    // 若无安全位置，则返回空数组
    if (safePositions.length === 0) {
      return this.obstacles;
    }

    // 生成指定数量的障碍物
    const obstacleCount = Math.min(count, safePositions.length);
    for (let i = 0; i < obstacleCount; i++) {
      // 随机选择一个安全位置
      const idx = Math.floor(Math.random() * safePositions.length);
      const obstacle = safePositions[idx];

      // 添加到障碍物数组
      this.obstacles.push(obstacle);

      // 从安全位置数组中移除已用位置
      safePositions.splice(idx, 1);
    }

    return this.obstacles;
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
  reset(snake, obstacleCount) {
    this.foods = [];
    this.createFood(snake);
    this.createObstacles(obstacleCount, snake);
  }
}

// 将类绑定至全局window对象，使其可被访问
window.GameObjects = GameObjects;
