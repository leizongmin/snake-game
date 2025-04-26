// 蛇的逻辑模块 - 负责蛇的移动、碰撞检测等
class Snake {
  constructor(canvasWidth, canvasHeight, blockSize) {
    // 画布尺寸信息
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.blockSize = blockSize;

    // 蛇的初始位置
    this.segments = [
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ];

    // 移动方向
    this.direction = 'right';
    this.nextDirection = 0; // 待行方向

    // 子曰：初始生命值
    this.lives = 1;
  }

  // 重置蛇
  reset() {
    this.segments = [
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ];
    this.direction = 'right';
    this.nextDirection = 0;

    // 子曰：重置生命值
    this.lives = 1;
  }

  // 获取蛇的长度
  get length() {
    return this.segments.length;
  }

  // 获取蛇头位置
  get head() {
    return this.segments[0];
  }

  // 设置移动方向
  setDirection(direction) {
    // 防止反向移动
    if (
      (this.direction === 'left' && direction !== 'right') ||
      (this.direction === 'right' && direction !== 'left') ||
      (this.direction === 'up' && direction !== 'down') ||
      (this.direction === 'down' && direction !== 'up')
    ) {
      this.nextDirection = direction;
    }
  }

  // 移动蛇
  move(food, obstacles) {
    const result = {
      gameOver: false,
      ate: false,
    };

    // 如果有待行方向且不会导致反向，则更新方向
    if (
      this.nextDirection &&
      ((this.direction === 'left' && this.nextDirection !== 'right') ||
        (this.direction === 'right' && this.nextDirection !== 'left') ||
        (this.direction === 'up' && this.nextDirection !== 'down') ||
        (this.direction === 'down' && this.nextDirection !== 'up'))
    ) {
      this.direction = this.nextDirection;
      this.nextDirection = 0;
    }

    // 根据方向计算新的头部位置
    const head = { x: this.segments[0].x, y: this.segments[0].y };
    switch (this.direction) {
      case 'right':
        head.x++;
        break;
      case 'left':
        head.x--;
        break;
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
    }

    // 子曰：检查是否撞墙
    if (head.x < 0 || head.x >= this.canvasWidth / this.blockSize || head.y < 0 || head.y >= this.canvasHeight / this.blockSize) {
      this.lives--;
      result.gameOver = this.lives <= 0;
      return result;
    }

    // 子曰：检查是否撞到障碍物
    if (obstacles && obstacles.some(o => o.x === head.x && o.y === head.y)) {
      this.lives--;
      result.gameOver = this.lives <= 0;
      return result;
    }

    // 子曰：检查是否撞到自己
    if (this.segments.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.lives--;
      result.gameOver = this.lives <= 0;
      return result;
    }

    // 子曰：检查是否吃到食物
    const eatenFood = food.find(f => f.x === head.x && f.y === head.y);
    if (eatenFood) {
      result.ate = true;
      // 子曰：若食用生命之果，则增加生命值
      if (eatenFood.type === 'life') {
        this.lives++;
      }
    } else {
      // 子曰：若未食，则去尾
      this.segments.pop();
    }

    // 在头部添加新的位置
    this.segments.unshift(head);

    return result;
  }

  // 检查位置是否在蛇身上
  isOnSnake(pos) {
    return this.segments.some(segment => segment.x === pos.x && segment.y === pos.y);
  }

  // 检查位置是否在障碍物上
  isOnObstacle(pos, obstacles) {
    return obstacles.some(obstacle => obstacle.x === pos.x && obstacle.y === pos.y);
  }
}

// 将类绑定至全局window对象，使其可被访问
window.Snake = Snake;
