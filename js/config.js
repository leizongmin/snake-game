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
      NORMAL: { name: '普通', speed: 150, zhangCount: 10 },
      FAST: { name: '快速', speed: 100, zhangCount: 6 },
      HARD: { name: '困难', speed: 120, zhangCount: 16 },
      EXPERT: { name: '专家', speed: 80, zhangCount: 24 },
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
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 移动设备上使用更小的尺寸
    const isMobile = screenWidth <= 600;

    // 移动端屏幕，宜小不宜大，留出边距以避免溢出
    // 移动端使用更小的比例，确保右侧不会溢出
    const maxWidth = isMobile ? screenWidth * 0.85 : screenWidth * 0.6;
    const maxHeight = screenHeight * 0.7; // 画布高度占屏幕70%

    // 保持宽高比，移动端使用更接近正方形的比例
    const aspectRatio = isMobile ? 3 / 4 : 2 / 3;

    // 先根据高度计算宽度
    let height = Math.min(600, maxHeight);
    let width = height * aspectRatio;

    // 如果宽度超出限制，则根据宽度重新计算高度
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    // 确保尺寸为整数，避免小数点导致的溢出问题
    width = Math.floor(width);
    height = Math.floor(height);

    // 移动端额外减少几个像素，确保不会出现滚动条
    if (isMobile) {
      width -= 4;
      height -= 4;
    }

    return { width, height };
  }
}

// 将类绑定至全局window对象，使其可被访问
window.GameConfig = GameConfig;
