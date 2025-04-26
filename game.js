// 游戏主类
class SheGame {
  constructor() {
    // 画布相关
    this.hb = document.getElementById('gameCanvas');
    this.ctx = this.hb.getContext('2d');
    this.fw = 20;

    // 游戏状态
    this.state = {
      READY: 'ready',
      PLAYING: 'playing',
      PAUSED: 'paused',
      OVER: 'over',
    };
    this.currentState = this.state.READY;

    // 游戏模式
    this.modes = {
      NORMAL: { name: '普通', speed: 150, zhangCount: 5 },
      FAST: { name: '快速', speed: 100, zhangCount: 3 },
      HARD: { name: '困难', speed: 120, zhangCount: 8 },
      EXPERT: { name: '专家', speed: 80, zhangCount: 12 },
    };
    this.currentMode = this.modes.NORMAL;

    // 蛇之属性
    this.she = [
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ];
    this.fx = 'right';
    this.df = 0;
    this.speed = this.currentMode.speed;

    // 障碍物系统
    this.zhang = [];
    this.zhangCount = this.currentMode.zhangCount;

    // 食之位置
    this.shi = this.createFood();

    // 初始化音效管理器
    this.soundManager = new SoundManager();

    // 绑定事件
    this.bindEvents();

    // 开始游戏
    this.showStartScreen();
  }

  // 绘制开始界面
  showStartScreen() {
    this.clear();

    // 绘制标题
    this.ctx.font = '36px 楷体';
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('贪食蛇戏', this.hb.width / 2, this.hb.height / 2 - 100);

    // 绘制模式选择
    this.ctx.font = '24px 楷体';
    this.ctx.fillStyle = '#666';
    Object.values(this.modes).forEach((mode, index) => {
      const y = this.hb.height / 2 - 40 + index * 40;
      const isSelected = mode === this.currentMode;

      // 绘制选择框
      this.ctx.strokeStyle = isSelected ? '#4CAF50' : '#666';
      this.ctx.lineWidth = isSelected ? 2 : 1;
      this.ctx.beginPath();
      this.ctx.roundRect(this.hb.width / 2 - 80, y - 25, 160, 35, 5);
      this.ctx.stroke();

      // 绘制模式名称
      this.ctx.fillStyle = isSelected ? '#4CAF50' : '#666';
      this.ctx.fillText(mode.name, this.hb.width / 2, y);
    });

    // 绘制提示
    this.ctx.font = '20px 楷体';
    this.ctx.fillStyle = '#666';
    if (window.innerWidth <= 600) {
      this.ctx.fillText(
        '点击选择模式并开始',
        this.hb.width / 2,
        this.hb.height / 2 + 120
      );
    } else {
      this.ctx.fillText(
        '按上下键选择模式，空格键开始',
        this.hb.width / 2,
        this.hb.height / 2 + 120
      );
    }
  }

  // 绘制暂停界面
  showPauseScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.hb.width, this.hb.height);

    this.ctx.font = '36px 楷体';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('游戏暂停', this.hb.width / 2, this.hb.height / 2);

    this.ctx.font = '24px 楷体';
    this.ctx.fillText(
      '按空格键继续',
      this.hb.width / 2,
      this.hb.height / 2 + 40
    );
  }

  // 绘制方块
  drawRect(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.roundRect(x * this.fw, y * this.fw, this.fw - 2, this.fw - 2, 5);
    this.ctx.fill();

    // 添加高光效果
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.roundRect(
      x * this.fw + 2,
      y * this.fw + 2,
      (this.fw - 2) / 2,
      (this.fw - 2) / 2,
      3
    );
    this.ctx.fill();
  }

  // 清空画布
  clear() {
    this.ctx.fillStyle = '#fafafa';
    this.ctx.fillRect(0, 0, this.hb.width, this.hb.height);
  }

  // 绘制蛇
  drawSnake() {
    // 绘制蛇身
    for (let i = 1; i < this.she.length; i++) {
      this.drawRect(this.she[i].x, this.she[i].y, '#4CAF50');
    }
    // 绘制蛇头
    this.drawRect(this.she[0].x, this.she[0].y, '#2E7D32');
  }

  // 绘制食物
  drawFood() {
    this.drawRect(this.shi.x, this.shi.y, '#FF5252');
  }

  // 创建食物
  createFood() {
    let food;
    do {
      food = {
        x: Math.floor(Math.random() * (this.hb.width / this.fw)),
        y: Math.floor(Math.random() * (this.hb.height / this.fw)),
      };
    } while (this.isOnSnake(food) || this.isOnObstacle(food));
    return food;
  }

  // 创建障碍物
  createObstacles() {
    this.zhang = [];
    for (let i = 0; i < this.zhangCount; i++) {
      let obstacle;
      do {
        obstacle = {
          x: Math.floor(Math.random() * (this.hb.width / this.fw)),
          y: Math.floor(Math.random() * (this.hb.height / this.fw)),
        };
      } while (
        this.isOnSnake(obstacle) ||
        this.isOnObstacle(obstacle) ||
        (obstacle.x === this.shi.x && obstacle.y === this.shi.y)
      );
      this.zhang.push(obstacle);
    }
  }

  // 检查位置是否在障碍物上
  isOnObstacle(pos) {
    return this.zhang.some(
      obstacle => obstacle.x === pos.x && obstacle.y === pos.y
    );
  }

  // 绘制障碍物
  drawObstacles() {
    this.zhang.forEach(obstacle => {
      this.drawRect(obstacle.x, obstacle.y, '#607D8B');
    });
  }

  // 检查位置是否在蛇身上
  isOnSnake(pos) {
    return this.she.some(segment => segment.x === pos.x && segment.y === pos.y);
  }

  // 移动蛇
  moveSnake() {
    // 如果有待行方向且不会导致反向，则更新方向
    if (
      this.df &&
      ((this.fx === 'left' && this.df !== 'right') ||
        (this.fx === 'right' && this.df !== 'left') ||
        (this.fx === 'up' && this.df !== 'down') ||
        (this.fx === 'down' && this.df !== 'up'))
    ) {
      this.fx = this.df;
      this.df = 0;
    }

    // 根据方向计算新的头部位置
    const head = { x: this.she[0].x, y: this.she[0].y };
    switch (this.fx) {
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

    // 检查是否撞墙
    if (
      head.x < 0 ||
      head.x >= this.hb.width / this.fw ||
      head.y < 0 ||
      head.y >= this.hb.height / this.fw
    ) {
      this.gameOver();
      return;
    }

    // 检查是否撞到自己或障碍物
    if (this.isOnSnake(head) || this.isOnObstacle(head)) {
      this.gameOver();
      return;
    }

    // 在头部插入新位置
    this.she.unshift(head);

    // 检查是否吃到食物
    if (head.x === this.shi.x && head.y === this.shi.y) {
      // 播放吃食物音效
      this.soundManager.play('eat');
      // 更新分数
      document.getElementById('score').textContent =
        '得分：' + (this.she.length - 3);
      // 创建新食物
      this.shi = this.createFood();
    } else {
      // 如果没有吃到食物，删除尾部
      this.she.pop();
    }
  }

  // 游戏主循环
  gameLoop() {
    if (this.currentState !== this.state.PLAYING) return;

    this.moveSnake();

    // 如果游戏未结束，则继续绘制
    if (this.currentState === this.state.PLAYING) {
      requestAnimationFrame(() => {
        this.clear();
        this.drawObstacles();
        this.drawFood();
        this.drawSnake();

        // 继续下一帧
        setTimeout(() => this.gameLoop(), this.speed);
      });
    }
  }

  // 开始游戏
  startGame() {
    if (
      this.currentState === this.state.READY ||
      this.currentState === this.state.OVER
    ) {
      // 重置游戏状态
      this.she = [
        { x: 3, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
      ];
      this.fx = 'right';
      this.df = 0;
      this.speed = this.currentMode.speed;
      this.zhangCount = this.currentMode.zhangCount;
      this.zhang = [];
      this.shi = this.createFood();
      document.getElementById('score').textContent = '得分：0';

      // 创建新的障碍物
      this.createObstacles();

      // 清除画布并绘制初始状态
      this.clear();
      this.drawObstacles();
      this.drawFood();
      this.drawSnake();

      // 播放开始音效
      this.soundManager.play('start');

      // 更新游戏状态并开始游戏循环
      this.currentState = this.state.PLAYING;
      this.gameLoop();
    }
  }

  // 暂停游戏
  pauseGame() {
    if (this.currentState === this.state.PLAYING) {
      this.currentState = this.state.PAUSED;
      this.showPauseScreen();
      // 播放暂停音效
      this.soundManager.play('pause');
    } else if (this.currentState === this.state.PAUSED) {
      this.currentState = this.state.PLAYING;
      this.gameLoop();
      // 播放开始音效
      this.soundManager.play('start');
    }
  }

  // 游戏结束
  gameOver() {
    this.currentState = this.state.OVER;

    // 播放撞击音效
    this.soundManager.play('crash');

    // 绘制游戏结束画面
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.hb.width, this.hb.height);

    // 绘制标题
    this.ctx.font = '48px 楷体';
    this.ctx.fillStyle = '#FF5252';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('游戏结束', this.hb.width / 2, this.hb.height / 2 - 80);

    // 绘制模式和得分
    this.ctx.font = '24px 楷体';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(
      `模式：${this.currentMode.name}`,
      this.hb.width / 2,
      this.hb.height / 2 - 30
    );
    this.ctx.fillText(
      `最终得分：${this.she.length - 3}`,
      this.hb.width / 2,
      this.hb.height / 2 + 10
    );

    // 绘制提示
    this.ctx.font = '20px 楷体';
    if (window.innerWidth <= 600) {
      this.ctx.fillText(
        '点击重新开始',
        this.hb.width / 2,
        this.hb.height / 2 + 60
      );
    } else {
      this.ctx.fillText(
        '按空格键重新开始',
        this.hb.width / 2,
        this.hb.height / 2 + 60
      );
    }

    // 绘制装饰
    this.ctx.strokeStyle = '#FF5252';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(
      this.hb.width / 2 - 120,
      this.hb.height / 2 - 100,
      240,
      200,
      10
    );
    this.ctx.stroke();
  }

  // 处理按键事件
  handleKeyPress(e) {
    // 处理方向键
    const key = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
    }[e.key];

    if (key) {
      e.preventDefault();
      if (this.currentState === this.state.PLAYING) {
        // 设置待行方向
        this.df = key;
      } else if (this.currentState === this.state.READY) {
        // 选择游戏模式
        const modes = Object.values(this.modes);
        const currentIndex = modes.indexOf(this.currentMode);
        if (key === 'up' && currentIndex > 0) {
          this.currentMode = modes[currentIndex - 1];
          this.showStartScreen();
        } else if (key === 'down' && currentIndex < modes.length - 1) {
          this.currentMode = modes[currentIndex + 1];
          this.showStartScreen();
        }
      }
    }

    // 处理空格键
    if (e.code === 'Space') {
      e.preventDefault();
      if (
        this.currentState === this.state.READY ||
        this.currentState === this.state.OVER
      ) {
        this.startGame();
      } else {
        this.pauseGame();
      }
    }
  }

  // 处理点击事件
  handleClick(e) {
    if (this.currentState === this.state.READY) {
      // 获取点击坐标，并考虑设备像素比
      const rect = this.hb.getBoundingClientRect();
      const scaleX = this.hb.width / rect.width;
      const scaleY = this.hb.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      // 检查是否点击了模式选项
      let clickedMode = null;
      Object.values(this.modes).forEach((mode, index) => {
        const buttonY = this.hb.height / 2 - 40 + index * 40;
        if (
          x >= this.hb.width / 2 - 80 &&
          x <= this.hb.width / 2 + 80 &&
          y >= buttonY - 25 &&
          y <= buttonY + 10
        ) {
          clickedMode = mode;
        }
      });

      if (clickedMode) {
        this.currentMode = clickedMode;
        this.showStartScreen();
        // 如果点击的是当前选中的模式，直接开始游戏
        if (clickedMode === this.currentMode) {
          this.startGame();
        }
        return;
      }

      // 如果点击了当前选中的模式，开始游戏
      const selectedY =
        this.hb.height / 2 -
        40 +
        Object.values(this.modes).indexOf(this.currentMode) * 40;
      if (
        x >= this.hb.width / 2 - 80 &&
        x <= this.hb.width / 2 + 80 &&
        y >= selectedY - 25 &&
        y <= selectedY + 10
      ) {
        this.startGame();
      }
    } else if (this.currentState === this.state.OVER) {
      this.startGame();
    } else if (
      this.currentState === this.state.PLAYING ||
      this.currentState === this.state.PAUSED
    ) {
      this.pauseGame();
    }
  }

  // 绑定事件
  bindEvents() {
    // 键盘事件
    document.addEventListener('keydown', e => {
      this.handleKeyPress(e);
    });

    // 画布点击事件
    this.hb.addEventListener('click', e => {
      this.handleClick(e);
    });

    // 触控事件
    let touchStartX = 0;
    let touchStartY = 0;

    this.hb.addEventListener('touchstart', e => {
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    this.hb.addEventListener('touchmove', e => {
      e.preventDefault();
    });

    this.hb.addEventListener('touchend', e => {
      e.preventDefault();
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      // 如果在准备状态，处理模式选择
      if (this.currentState === this.state.READY) {
        const rect = this.hb.getBoundingClientRect();
        const scaleX = this.hb.width / rect.width;
        const scaleY = this.hb.height / rect.height;
        const x = (touchEndX - rect.left) * scaleX;
        const y = (touchEndY - rect.top) * scaleY;

        // 检查是否点击了模式选项
        let clickedMode = null;
        Object.values(this.modes).forEach((mode, index) => {
          const buttonY = this.hb.height / 2 - 40 + index * 40;
          if (
            x >= this.hb.width / 2 - 80 &&
            x <= this.hb.width / 2 + 80 &&
            y >= buttonY - 25 &&
            y <= buttonY + 10
          ) {
            clickedMode = mode;
          }
        });

        if (clickedMode) {
          this.currentMode = clickedMode;
          this.showStartScreen();
          // 如果在触摸屏设备上，直接开始游戏
          if (window.innerWidth <= 600) {
            this.startGame();
          }
          return;
        }

        // 如果点击了当前选中的模式，开始游戏
        const selectedY =
          this.hb.height / 2 -
          40 +
          Object.values(this.modes).indexOf(this.currentMode) * 40;
        if (
          x >= this.hb.width / 2 - 80 &&
          x <= this.hb.width / 2 + 80 &&
          y >= selectedY - 25 &&
          y <= selectedY + 10
        ) {
          this.startGame();
          return;
        }
      }

      // 如果在游戏中，处理方向控制
      if (this.currentState === this.state.PLAYING) {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // 判断滑动方向
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // 水平滑动
          if (deltaX > 0 && this.fx !== 'left') {
            this.df = 'right';
          } else if (deltaX < 0 && this.fx !== 'right') {
            this.df = 'left';
          }
        } else {
          // 垂直滑动
          if (deltaY > 0 && this.fx !== 'up') {
            this.df = 'down';
          } else if (deltaY < 0 && this.fx !== 'down') {
            this.df = 'up';
          }
        }
      }
    });

    // 防止页面滚动
    document.body.addEventListener(
      'touchmove',
      e => {
        e.preventDefault();
      },
      { passive: false }
    );
  }
}

// 创建游戏实例
const game = new SheGame();
