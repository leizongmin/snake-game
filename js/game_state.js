// 游戏状态管理模块 - 负责游戏状态转换和核心逻辑
class GameState {
  constructor(renderer, soundManager) {
    this.config = new GameConfig();
    this.renderer = renderer;
    this.soundManager = soundManager;

    // 游戏状态
    this.currentState = this.config.state.READY;
    this.currentMode = this.config.defaultMode;

    // 游戏数据
    this.score = 0;
    this.gameLoopId = null;
  }

  // 初始化游戏状态
  init() {
    this.showStartScreen();
  }

  // 显示开始界面
  showStartScreen() {
    this.currentState = this.config.state.READY;
    this.renderer.drawStartScreen(this.currentMode, this.config.modes);
  }

  // 开始游戏
  startGame(snake, food, obstacles) {
    if (this.currentState === this.config.state.READY || this.currentState === this.config.state.OVER) {
      // 重置游戏数据
      this.score = 0;
      this.renderer.updateScore(this.score);

      // 播放开始音效
      this.soundManager.play('start');

      // 更新游戏状态
      this.currentState = this.config.state.PLAYING;

      // 开始游戏循环
      this.startGameLoop(snake, food, obstacles);
    }
  }

  // 更新分数
  updateScore() {
    this.score = this.score + 1;
    this.renderer.updateScore(this.score);
  }

  // 更新生命值
  updateLives(lives) {
    this.renderer.updateLives(lives);
  }

  // 游戏循环
  startGameLoop(snake, food, obstacles) {
    // 清除之前的游戏循环
    if (this.gameLoopId) {
      clearTimeout(this.gameLoopId);
    }

    const gameLoop = () => {
      if (this.currentState !== this.config.state.PLAYING) return;

      // 移动蛇并检查游戏状态
      const result = snake.move(food, obstacles);

      if (result.gameOver) {
        this.gameOver();
        return;
      }

      // 如果吃到食物，更新分数
      if (result.ate) {
        this.updateScore();
        this.soundManager.play('eat');
      }

      // 绘制游戏元素
      this.renderer.clear();
      this.renderer.drawObstacles(obstacles);
      this.renderer.drawFood(food);
      this.renderer.drawSnake(snake);

      // 继续下一帧
      this.gameLoopId = setTimeout(() => gameLoop(), this.currentMode.speed);
    };

    // 启动游戏循环
    gameLoop();
  }

  // 暂停游戏
  pauseGame() {
    if (this.currentState === this.config.state.PLAYING) {
      this.currentState = this.config.state.PAUSED;
      this.renderer.drawPauseScreen();
      this.soundManager.play('pause');
    } else if (this.currentState === this.config.state.PAUSED) {
      this.currentState = this.config.state.PLAYING;
      // 存储当前游戏对象的引用
      const gameInstance = window.gameInstance;
      if (gameInstance) {
        this.startGameLoop(gameInstance.snake, gameInstance.gameObjects.getFood(), gameInstance.gameObjects.getObstacles());
      }
      this.soundManager.play('start');
    }
  }

  // 游戏结束
  gameOver() {
    this.currentState = this.config.state.OVER;
    this.soundManager.play('crash');
    this.renderer.drawGameOverScreen(this.currentMode, this.score);
  }

  // 切换游戏模式
  changeMode(mode) {
    if (this.currentState === this.config.state.READY) {
      this.currentMode = mode;
      this.renderer.drawStartScreen(this.currentMode, this.config.modes);
    }
  }

  // 获取当前游戏状态
  getState() {
    return this.currentState;
  }

  // 获取当前游戏模式
  getMode() {
    return this.currentMode;
  }

  // 根据当前状态重新渲染游戏界面
  render() {
    // 子曰：根据游戏状态，选择合适之绘制方法
    switch (this.currentState) {
      case this.config.state.READY:
        this.renderer.drawStartScreen(this.currentMode, this.config.modes);
        break;
      case this.config.state.PLAYING:
        // 获取当前游戏实例
        const gameInstance = window.gameInstance;
        if (gameInstance) {
          this.renderer.clear();
          this.renderer.drawObstacles(gameInstance.gameObjects.getObstacles());
          this.renderer.drawFood(gameInstance.gameObjects.getFood());
          this.renderer.drawSnake(gameInstance.snake);
        }
        break;
      case this.config.state.PAUSED:
        this.renderer.drawPauseScreen();
        break;
      case this.config.state.OVER:
        this.renderer.drawGameOverScreen(this.currentMode, this.score);
        break;
    }
  }
}

// 将类绑定至全局window对象，使其可被访问
window.GameState = GameState;
