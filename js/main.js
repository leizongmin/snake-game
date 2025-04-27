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
    // 确保设置原始尺寸，解决高DPI屏幕问题
    this.renderer.originalWidth = canvasSize.width;
    this.renderer.originalHeight = canvasSize.height;
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

  // 处理窗口大小变化
  handleResize() {
    // 重新计算画布尺寸
    const canvasSize = this.config.calculateCanvasSize();

    // 更新渲染器中的原始尺寸
    this.renderer.originalWidth = canvasSize.width;
    this.renderer.originalHeight = canvasSize.height;

    // 更新CSS尺寸
    this.canvas.style.width = canvasSize.width + 'px';
    this.canvas.style.height = canvasSize.height + 'px';

    // 重新设置高DPI支持
    this.renderer.setupHiDPI();

    // 重新计算方块大小
    this.blockSize = this.config.calculateBlockSize(canvasSize.width, canvasSize.height);
    this.renderer.blockSize = this.blockSize;

    // 更新蛇和游戏对象的画布尺寸
    this.snake.canvasWidth = canvasSize.width;
    this.snake.canvasHeight = canvasSize.height;
    this.snake.blockSize = this.blockSize;

    this.gameObjects.canvasWidth = canvasSize.width;
    this.gameObjects.canvasHeight = canvasSize.height;
    this.gameObjects.blockSize = this.blockSize;

    // 重绘当前场景
    this.gameState.render();
  }

  // 初始化游戏
  init() {
    // 添加窗口大小变化事件监听
    window.addEventListener('resize', this.handleResize.bind(this));

    // 确保在移动设备上正确显示
    if ('ontouchstart' in window || window.innerWidth <= 600) {
      this.handleResize();
    }
    // 创建初始食物
    for (let i = 0; i < 3; i++) {
      this.gameObjects.createFood(this.snake);
    }

    // 播放背景音乐
    this.soundManager.playBgm();

    // 食物计数器 - 用于障碍物更新
    this.foodCounter = 0;

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

      // 更换画布风格
      this.renderer.resetBackground();

      // 重置食物计数器
      this.foodCounter = 0;

      // 初始化生命值显示
      this.gameState.updateLives(this.snake.lives);

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

        // 更新生命值显示
        this.gameState.updateLives(snake.lives);

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
          // 更新传入的food引用
          food.length = 0;
          newFood.forEach(f => food.push(f));

          // 增加食物计数
          this.foodCounter++;

          // 每吃5个食物，障碍物位置变化一次
          if (this.foodCounter >= 5) {
            // 重置计数器
            this.foodCounter = 0;

            // 获取当前模式的障碍物数量
            const mode = this.gameState.getMode();

            // 重新生成障碍物
            this.gameObjects.createObstacles(mode.zhangCount, snake);

            // 更新传入的obstacles引用，确保游戏循环使用新的障碍物
            obstacles.length = 0; // 清空原数组
            const newObstacles = this.gameObjects.getObstacles();
            newObstacles.forEach(obs => obstacles.push(obs)); // 填充新障碍物

            console.log('障碍物已更新，新数量:', obstacles.length);

            // 播放特殊音效提示障碍物已变化
            this.soundManager.play('pause');

            // 添加视觉提示，使障碍物变化更明显
            // 闪烁效果：先清屏，然后绘制所有元素，再暂停一下
            this.renderer.clear();

            // 绘制新障碍物，使用明显的颜色
            const originalDrawObstacles = this.renderer.drawObstacles;
            this.renderer.drawObstacles = obstacles => {
              // 临时修改障碍物绘制方法，使用橙色高亮
              const originalDrawRect = this.renderer.drawRect;
              this.renderer.drawRect = (x, y, color) => {
                // 忽略传入的颜色，强制使用橙色
                originalDrawRect.call(this.renderer, x, y, '#FFA500');
              };

              // 使用修改后的drawRect方法绘制障碍物
              originalDrawObstacles.call(this.renderer, obstacles);

              // 恢复原始drawRect方法
              this.renderer.drawRect = originalDrawRect;
            };

            // 绘制带高亮的障碍物
            this.renderer.drawObstacles(this.gameObjects.getObstacles());
            this.renderer.drawFood(food);
            this.renderer.drawSnake(snake);

            // 恢复原始绘制函数
            this.renderer.drawObstacles = originalDrawObstacles;

            // 添加闪烁效果，使障碍物变化更明显
            let flashCount = 0;
            const maxFlashes = 3;
            const flashInterval = setInterval(() => {
              flashCount++;

              if (flashCount <= maxFlashes) {
                // 交替显示橙色和原色
                if (flashCount % 2 === 1) {
                  // 恢复原始绘制函数，显示原色
                  this.renderer.drawObstacles = originalDrawObstacles;
                  this.renderer.clear();
                  this.renderer.drawObstacles(this.gameObjects.getObstacles());
                  this.renderer.drawFood(food);
                  this.renderer.drawSnake(snake);
                } else {
                  // 使用橙色高亮
                  const tempDrawRect = this.renderer.drawRect;
                  this.renderer.drawRect = (x, y, color) => {
                    tempDrawRect.call(this.renderer, x, y, '#FFA500');
                  };
                  this.renderer.clear();
                  originalDrawObstacles.call(this.renderer, this.gameObjects.getObstacles());
                  this.renderer.drawRect = tempDrawRect;
                  this.renderer.drawFood(food);
                  this.renderer.drawSnake(snake);
                }
              } else {
                // 闪烁结束，清除定时器
                clearInterval(flashInterval);
                // 确保最后使用原始绘制函数
                this.renderer.drawObstacles = originalDrawObstacles;
                // 在控制台输出提示
                console.log('障碍物位置已更新！食物计数：', this.foodCounter);
              }
            }, 200); // 200毫秒间隔，产生明显闪烁效果
          }

          // 此处已在前文生成新食物，无需重复
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
