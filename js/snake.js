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

    // 初始生命值
    this.lives = 1;

    // 无敌状态
    this.invincible = false;
    this.invincibleTimer = null;
    this.invincibleDuration = 2000; // 无敌时间2秒
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

    // 重置生命值
    this.lives = 1;

    // 重置无敌状态
    this.invincible = false;
    if (this.invincibleTimer) {
      clearTimeout(this.invincibleTimer);
      this.invincibleTimer = null;
    }
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
    // 获取蛇头
    const head = this.segments[0];

    // 根据方向计算新头部位置
    const newHead = { ...head };

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

    switch (this.direction) {
      case 'up':
        newHead.y -= 1;
        break;
      case 'down':
        newHead.y += 1;
        break;
      case 'left':
        newHead.x -= 1;
        break;
      case 'right':
        newHead.x += 1;
        break;
    }

    const result = {
      gameOver: false,
      ate: false,
      foodEffect: null,
    };

    // 检查是否撞墙，以二十六格之高，二十格之宽为界
    const maxX = 20;
    const maxY = 26;
    if (newHead.x < 0 || newHead.x >= maxX || newHead.y < 0 || newHead.y >= maxY) {
      if (!this.invincible) {
        this.lives--;
        result.gameOver = this.lives <= 0;
        if (!result.gameOver) {
          this.startInvincibility();
        }
      }
      return result;
    }

    // 检查是否撞到障碍物
    if (obstacles && obstacles.some(o => o.x === newHead.x && o.y === newHead.y)) {
      if (!this.invincible) {
        this.lives--;
        result.gameOver = this.lives <= 0;
        if (!result.gameOver) {
          this.startInvincibility();
        }
      }
      return result;
    }

    // 检查是否撞到自己
    if (this.segments.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      if (!this.invincible) {
        this.lives--;
        result.gameOver = this.lives <= 0;
        if (!result.gameOver) {
          this.startInvincibility();
        }
      }
      return result;
    }

    // 检查是否吃到食物
    const eatenFood = food.find(f => f.x === newHead.x && f.y === newHead.y);
    if (eatenFood) {
      result.ate = true;

      // 根据食物类型应用不同效果
      switch (eatenFood.type) {
        case 'life':
          // 若食用生命之果，则增加生命值，不超十
          if (this.lives < 10) {
            this.lives++;
          }
          result.foodEffect = 'life';
          break;
        case 'speed':
          // 速度食物，临时提升速度
          result.foodEffect = 'speed';
          break;
        case 'score':
          // 高分食物，额外加分
          result.foodEffect = 'score';
          break;
        default:
          // 普通食物，只增长身体
          result.foodEffect = 'normal';
      }
    } else {
      // 若未食，则去尾
      this.segments.pop();
    }

    // 在头部添加新的位置
    this.segments.unshift(newHead);

    // 打印蛇头位置
    console.log(`蛇头位置: (${newHead.x}, ${newHead.y})`);

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

  // 开启无敌状态
  startInvincibility() {
    this.invincible = true;
    if (this.invincibleTimer) {
      clearTimeout(this.invincibleTimer);
    }
    this.invincibleTimer = setTimeout(() => {
      this.invincible = false;
      this.invincibleTimer = null;
    }, this.invincibleDuration);
  }
}

// 将类绑定至全局window对象，使其可被访问
window.Snake = Snake;
