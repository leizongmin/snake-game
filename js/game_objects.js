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

  // 创建食物
  createFood(snake) {
    // 子曰：清理已被蛇吞之食物
    this.foods = this.foods.filter(food => !this.isOnSnake(food, snake));

    // 子曰：计算所需食物数量
    const targetFoodCount = Math.floor(Math.random() * 5) + 1;

    // 子曰：若食物不足，则继续生成
    while (this.foods.length < targetFoodCount) {
      // 子曰：寻找可用之格子
      const maxX = this.canvasWidth / this.blockSize;
      const maxY = this.canvasHeight / this.blockSize;
      const available = [];
      for (let x = 0; x < maxX; x++) {
        for (let y = 0; y < maxY; y++) {
          // 子曰：若格子不在蛇身、障碍物及现有食物上，则可用
          if (!this.isOnSnake({ x, y }, snake) && !this.isOnObstacle({ x, y }) && !this.foods.some(food => food.x === x && food.y === y)) {
            available.push({ x, y });
          }
        }
      }

      // 子曰：若无可用格，则跳出循环
      if (available.length === 0) {
        break;
      }

      // 子曰：随机选取一格生成新食物
      const idx = Math.floor(Math.random() * available.length);
      const food = available[idx];

      // 子曰：随机生成增加生命值之食物，概率为五分之一
      food.type = Math.random() < 0.2 ? 'life' : 'normal';
      this.foods.push(food);

      // 子曰：从可用格子中移除已用之格
      available.splice(idx, 1);
    }

    return this.foods;
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
      let inDangerZone;
      do {
        obstacle = {
          x: Math.floor(Math.random() * maxX),
          y: Math.floor(Math.random() * maxY),
        };
        attempts++;
        if (attempts > maxAttempts) {
          break;
        }

        // 子曰：检查是否在蛇头前进方向的5格范围内
        const head = snake.segments[0];
        inDangerZone = (() => {
          switch (snake.direction) {
            case 'right':
              return obstacle.x > head.x && obstacle.x <= head.x + 5 && obstacle.y === head.y;
            case 'left':
              return obstacle.x < head.x && obstacle.x >= head.x - 5 && obstacle.y === head.y;
            case 'up':
              return obstacle.y < head.y && obstacle.y >= head.y - 5 && obstacle.x === head.x;
            case 'down':
              return obstacle.y > head.y && obstacle.y <= head.y + 5 && obstacle.x === head.x;
            default:
              return false;
          }
        })();
      } while (
        this.isOnSnake(obstacle, snake) ||
        this.isOnObstacle(obstacle) ||
        this.foods.some(food => food.x === obstacle.x && food.y === obstacle.y) ||
        inDangerZone
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
