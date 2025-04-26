// 主入口文件 - 负责初始化和协调各个模块

class Game {
  constructor() {
    // 获取画布元素
    this.canvas = document.getElementById('gameCanvas');

    // 初始化配置
    this.config = new GameConfig();

    // 设置画布尺寸
    const canvasSize = this.config.calculateCanvasSize();
    this.canvas.width = canvasSize.width;
    this.canvas.height = canvasSize.height;

    // 计算方块大小
    this.blockSize = this.config.calculateBlockSize(this.canvas.width, this.canvas.height);

    // 初始化渲染器
    this.renderer = new Renderer(this.canvas);
    this.renderer.init(this.blockSize);

    // 初始化音效管理器
    this.soundManager = new SoundManager();

    // 初始化蛇
    this.snake = new Snake(this.canvas.width, this.canvas.height, this.blockSize);

    // 初始化游戏对象
    this.gameObjects = new GameObjects(this.canvas.width, this.canvas.height, this.blockSize);

    // 初始化游戏状态
    this.gameState = new GameState(this.renderer, this.soundManager);

    // 初始化输入控制器
    this.inputController = new InputController(this.gameState, this.snake);
    this.inputController.init(this.canvas);

    // 初始化游戏
    this.init();
  }

  // 初始化游戏
  init() {
    // 创建初始食物和障碍物
    this.gameObjects.createFood(this.snake);

    // 播放背景音乐
    this.soundManager.playBgm();

    // 显示开始界面
    this.gameState.init();

    // 扩展游戏状态的startGame方法，添加对象管理
    const originalStartGame = this.gameState.startGame;
    this.gameState.startGame = snake => {
      // 重置蛇
      this.snake.reset();

      // 重置游戏对象
      const mode = this.gameState.getMode();
      this.gameObjects.reset(this.snake, mode.zhangCount);

      // 确保背景音乐播放
      if (!this.soundManager.bgmPlaying) {
        this.soundManager.playBgm();
      }

      // 调用原始方法
      originalStartGame.call(this.gameState, this.snake, this.gameObjects.getFood(), this.gameObjects.getObstacles());
    };

    // 扩展游戏状态的暂停方法，控制背景音乐
    const originalTogglePause = this.gameState.togglePause;
    this.gameState.togglePause = () => {
      // 切换背景音乐状态
      if (this.gameState.currentState === this.config.state.PLAYING) {
        // 如果当前正在播放，即将暂停，则暂停背景音乐
        this.soundManager.stopBgm();
      } else if (this.gameState.currentState === this.config.state.PAUSED) {
        // 如果当前已暂停，即将恢复，则恢复背景音乐
        this.soundManager.playBgm();
      }

      // 调用原始方法
      originalTogglePause.call(this.gameState);
    };

    // 扩展游戏状态的startGameLoop方法，添加食物更新
    const originalStartGameLoop = this.gameState.startGameLoop;
    this.gameState.startGameLoop = (snakeObj, foodObj, obstaclesObj) => {
      // 清除之前的游戏循环
      if (this.gameState.gameLoopId) {
        clearTimeout(this.gameState.gameLoopId);
      }

      // 确保使用传入的参数或默认值
      const snake = snakeObj;
      const food = foodObj;
      const obstacles = obstaclesObj;

      const gameLoop = () => {
        if (this.gameState.currentState !== this.config.state.PLAYING) return;

        // 移动蛇并检查游戏状态
        const result = snake.move(food, obstacles);

        if (result.gameOver) {
          // 游戏结束时停止背景音乐
          this.soundManager.stopBgm();
          this.gameState.gameOver();
          return;
        }

        // 若蛇吃到食物，则生成新食物
        if (result.ate) {
          // 更新分数
          this.gameState.updateScore();
          // 播放音效
          this.soundManager.play('eat');
          // 生成新食物
          const newFood = this.gameObjects.createFood(snake);
          if (newFood) {
            food.x = newFood.x;
            food.y = newFood.y;
          }
        }

        // 绘制游戏元素
        this.renderer.clear();
        this.renderer.drawObstacles(obstacles);
        this.renderer.drawFood(this.gameObjects.getFood());
        this.renderer.drawSnake(snake);

        // 继续下一帧
        this.gameState.gameLoopId = setTimeout(() => gameLoop(), this.gameState.currentMode.speed);
      };

      // 启动游戏循环
      gameLoop();
    };
  }
}

// 当DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
  // 创建游戏实例并存储全局引用
  window.gameInstance = new Game();
});

// 将类绑定至全局window对象，使其可被访问
window.Game = Game;
