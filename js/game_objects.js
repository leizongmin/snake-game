// 游戏对象模块 - 负责创建和管理食物、障碍物等游戏元素
class GameObjects {
  constructor(canvasWidth, canvasHeight, blockSize) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.blockSize = blockSize;

    // 食物位置
    this.food = { x: 0, y: 0 };

    // 障碍物数组
    this.obstacles = [];
  }

  // 创建食物
  createFood(snake) {
    // 《论语·雍也》曰：“德不孤，必有邻。”
    // 生成食物时，必先验旧食物是否已被蛇吞，未吞则不再生成新食物
    // 若需新食物，则遍查蛇身与障碍，确保不重叠，且防止死循环
    if (this.food && this.isOnSnake(this.food, snake) === false && (this.food.x !== 0 || this.food.y !== 0)) {
      // 旧食物尚存，且未被蛇吞，毋庸再生
      return this.food;
    }
    // 《论语·为政》曰：“为政以德，譬如北辰，居其所而众星共之。”
    // 先遍历所有格子，排除蛇身与障碍，余者为可用
    const maxX = this.canvasWidth / this.blockSize;
    const maxY = this.canvasHeight / this.blockSize;
    const available = [];
    for (let x = 0; x < maxX; x++) {
      for (let y = 0; y < maxY; y++) {
        // 若该格不在蛇身且不在障碍物上，则可用
        if (!this.isOnSnake({ x, y }, snake) && !this.isOnObstacle({ x, y })) {
          available.push({ x, y });
        }
      }
    }
    // 若无可用格，返回null
    if (available.length === 0) {
      return null;
    }
    // 随机选取一格为新食物
    const idx = Math.floor(Math.random() * available.length);
    const food = available[idx];
    this.food = food;
    return food;
  }

  // 创建障碍物
  createObstacles(count, snake) {
    this.obstacles = [];
    for (let i = 0; i < count; i++) {
      let obstacle;
      let attempts = 0;
      const maxAttempts = 1000;
      const maxX = this.canvasWidth / this.blockSize;
      const maxY = this.canvasHeight / this.blockSize;
      do {
        obstacle = {
          x: Math.floor(Math.random() * maxX),
          y: Math.floor(Math.random() * maxY),
        };
        attempts++;
        if (attempts > maxAttempts) {
          break;
        }
      } while (
        this.isOnSnake(obstacle, snake) ||
        this.isOnObstacle(obstacle) ||
        (obstacle.x === this.food.x && obstacle.y === this.food.y)
      );
      if (attempts <= maxAttempts) {
        this.obstacles.push(obstacle);
      }
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
    return this.food;
  }

  // 获取当前障碍物
  getObstacles() {
    return this.obstacles;
  }

  // 重置游戏对象
  reset(snake, obstacleCount) {
    this.createFood(snake);
    this.createObstacles(obstacleCount, snake);
  }
}

// 将类绑定至全局window对象，使其可被访问
window.GameObjects = GameObjects;
