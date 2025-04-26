// 输入控制模块 - 负责处理键盘和触摸事件
class InputController {
  constructor(gameState, snake) {
    this.gameState = gameState;
    this.snake = snake;
    this.touchStartX = 0;
    this.touchStartY = 0;

    // 绑定事件处理方法的上下文
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  // 初始化事件监听
  init(canvas) {
    this.canvas = canvas;
    this.bindEvents();
  }

  // 绑定事件
  bindEvents() {
    // 键盘事件
    document.addEventListener('keydown', this.handleKeyPress);

    // 画布点击事件
    this.canvas.addEventListener('click', this.handleClick);

    // 触控事件
    this.canvas.addEventListener('touchstart', this.handleTouchStart);
    this.canvas.addEventListener('touchmove', this.handleTouchMove);
    this.canvas.addEventListener('touchend', this.handleTouchEnd);

    // 防止页面滚动
    document.body.addEventListener(
      'touchmove',
      e => {
        e.preventDefault();
      },
      { passive: false }
    );
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
      const state = this.gameState.getState();
      const config = this.gameState.config;

      if (state === config.state.PLAYING) {
        // 设置蛇的移动方向
        this.snake.setDirection(key);
      } else if (state === config.state.READY) {
        // 选择游戏模式
        const modes = Object.values(config.modes);
        const currentMode = this.gameState.getMode();
        const currentIndex = modes.indexOf(currentMode);

        if (key === 'up' && currentIndex > 0) {
          this.gameState.changeMode(modes[currentIndex - 1]);
        } else if (key === 'down' && currentIndex < modes.length - 1) {
          this.gameState.changeMode(modes[currentIndex + 1]);
        }
      }
    }

    // 处理空格键
    if (e.code === 'Space') {
      e.preventDefault();
      const state = this.gameState.getState();
      const config = this.gameState.config;

      if (state === config.state.READY || state === config.state.OVER) {
        // 确保snake已正确初始化
        if (window.gameInstance) {
          this.gameState.startGame(window.gameInstance.snake);
        }
      } else {
        this.gameState.pauseGame();
      }
    }
  }

  // 处理点击事件
  handleClick(e) {
    const state = this.gameState.getState();
    const config = this.gameState.config;

    if (state === config.state.READY) {
      // 获取点击坐标，并考虑设备像素比
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      // 检查是否点击了模式选项
      let clickedMode = null;
      Object.values(config.modes).forEach((mode, index) => {
        const buttonY = this.canvas.height / 2 - 40 + index * 40;
        if (x >= this.canvas.width / 2 - 80 && x <= this.canvas.width / 2 + 80 && y >= buttonY - 25 && y <= buttonY + 10) {
          clickedMode = mode;
        }
      });

      if (clickedMode) {
        this.gameState.changeMode(clickedMode);
        // 如果点击的是当前选中的模式，直接开始游戏
        if (clickedMode === this.gameState.getMode() && window.gameInstance) {
          this.gameState.startGame(window.gameInstance.snake);
        }
        return;
      }

      // 如果点击了当前选中的模式，开始游戏
      const selectedY = this.canvas.height / 2 - 40 + Object.values(config.modes).indexOf(this.gameState.getMode()) * 40;
      if (x >= this.canvas.width / 2 - 80 && x <= this.canvas.width / 2 + 80 && y >= selectedY - 25 && y <= selectedY + 10) {
        if (window.gameInstance) {
          this.gameState.startGame(window.gameInstance.snake);
        }
      }
    } else if (state === config.state.OVER) {
      if (window.gameInstance) {
        this.gameState.startGame(window.gameInstance.snake);
      }
    } else if (state === config.state.PLAYING || state === config.state.PAUSED) {
      this.gameState.pauseGame();
    }
  }

  // 处理触摸开始事件
  handleTouchStart(e) {
    e.preventDefault();
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  }

  // 处理触摸移动事件
  handleTouchMove(e) {
    e.preventDefault();
  }

  // 处理触摸结束事件
  handleTouchEnd(e) {
    e.preventDefault();
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    // 如果在准备状态或游戏结束状态，处理模式选择或重新开始
    const state = this.gameState.getState();
    const config = this.gameState.config;

    if (state === config.state.OVER) {
      // 子曰：游戏结束时，确保点击事件能正确重启游戏
      if (window.gameInstance && window.gameInstance.snake) {
        this.gameState.startGame(window.gameInstance.snake);
      }
      return;
    } else if (state === config.state.READY) {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (touchEndX - rect.left) * scaleX;
      const y = (touchEndY - rect.top) * scaleY;

      // 检查是否点击了模式选项
      let clickedMode = null;
      Object.values(config.modes).forEach((mode, index) => {
        const buttonY = this.canvas.height / 2 - 40 + index * 40;
        if (x >= this.canvas.width / 2 - 80 && x <= this.canvas.width / 2 + 80 && y >= buttonY - 25 && y <= buttonY + 10) {
          clickedMode = mode;
        }
      });

      if (clickedMode) {
        this.gameState.changeMode(clickedMode);
        // 如果在触摸屏设备上，直接开始游戏
        if (window.innerWidth <= 600) {
          // 确保snake已正确初始化
          if (this.snake && window.gameInstance) {
            this.gameState.startGame(window.gameInstance.snake);
          }
        }
        return;
      }

      // 如果点击了当前选中的模式，开始游戏
      const selectedY = this.canvas.height / 2 - 40 + Object.values(config.modes).indexOf(this.gameState.getMode()) * 40;
      if (x >= this.canvas.width / 2 - 80 && x <= this.canvas.width / 2 + 80 && y >= selectedY - 25 && y <= selectedY + 10) {
        if (window.gameInstance) {
          this.gameState.startGame(window.gameInstance.snake);
        }
        return;
      }
    }

    // 如果在游戏中，处理方向控制
    if (state === config.state.PLAYING) {
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;

      // 判断滑动方向
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (deltaX > 0 && this.snake.direction !== 'left') {
          this.snake.setDirection('right');
        } else if (deltaX < 0 && this.snake.direction !== 'right') {
          this.snake.setDirection('left');
        }
      } else {
        // 垂直滑动
        if (deltaY > 0 && this.snake.direction !== 'up') {
          this.snake.setDirection('down');
        } else if (deltaY < 0 && this.snake.direction !== 'down') {
          this.snake.setDirection('up');
        }
      }
    }
  }

  // 移除事件监听
  removeEventListeners() {
    document.removeEventListener('keydown', this.handleKeyPress);
    this.canvas.removeEventListener('click', this.handleClick);
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
  }
}

// 将类绑定至全局window对象，使其可被访问
window.InputController = InputController;
