// 游戏配置模块 - 集中管理游戏参数
class GameConfig {
  constructor() {
    // 游戏状态
    this.state = {
      READY: 'ready',
      PLAYING: 'playing',
      PAUSED: 'paused',
      OVER: 'over',
    };

    // 游戏模式
    this.modes = {
      NORMAL: { name: '普通', speed: 150, zhangCount: 5 },
      FAST: { name: '快速', speed: 100, zhangCount: 3 },
      HARD: { name: '困难', speed: 120, zhangCount: 8 },
      EXPERT: { name: '专家', speed: 80, zhangCount: 12 },
    };

    // 默认模式
    this.defaultMode = this.modes.NORMAL;
  }

  // 根据画布尺寸计算方块大小
  calculateBlockSize(canvasWidth, canvasHeight) {
    return Math.floor(canvasWidth / 20);
  }

  // 计算合适的画布尺寸
  calculateCanvasSize() {
    const screenHeight = window.innerHeight;
    const maxHeight = screenHeight * 0.8; // 画布高度占屏幕80%
    const aspectRatio = 2 / 3; // 保持宽高比
    const height = Math.min(600, maxHeight);
    const width = height * aspectRatio;

    return { width, height };
  }
}

// 将类绑定至全局window对象，使其可被访问
window.GameConfig = GameConfig;
