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
    // 先定格数
    const gridWidth = 20;
    const gridHeight = 26;

    // 计算每格像素
    const blockSizeFromWidth = Math.floor(canvasWidth / gridWidth);
    const blockSizeFromHeight = Math.floor(canvasHeight / gridHeight);
    const blockSize = Math.min(blockSizeFromWidth, blockSizeFromHeight);

    // 打印格数与像素
    console.log(`画布方格数量: ${gridWidth}x${gridHeight}, 每格尺寸: ${blockSize}px`);

    // 返回每格像素
    return blockSize;
  }

  // 计算合适的画布尺寸
  calculateCanvasSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 移动设备上使用更小的尺寸
    const isMobile = screenWidth <= 600;

    // 移动端屏幕尽量利用更多空间，但仍留少量边距以避免溢出
    // 移动端使用更大的比例，减小与屏幕边缘的间隙
    const maxWidth = isMobile ? screenWidth * 0.95 : screenWidth * 0.6;
    const maxHeight = screenHeight * 0.8; // 画布高度占屏幕80%

    // 先定格数
    const gridWidth = 20;
    const gridHeight = 26;
    // 保持宽高比为20:26
    const aspectRatio = gridWidth / gridHeight;

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

    // 计算方块大小
    const blockSizeFromWidth = Math.floor(width / gridWidth);
    const blockSizeFromHeight = Math.floor(height / gridHeight);
    const blockSize = Math.min(blockSizeFromWidth, blockSizeFromHeight);

    // 根据方块大小重新计算画布尺寸，确保尺寸与格子数量精确对应
    width = blockSize * gridWidth;
    height = blockSize * gridHeight;

    console.log(`画布实际尺寸: ${width}x${height}像素，方块大小: ${blockSize}，格子数量: ${gridWidth}x${gridHeight}`);

    // 注意：不再为移动端减少像素，以确保画布尺寸与格子数量精确对应
    // 移动端的适配已通过计算合适的方块大小实现

    return { width, height };
  }
}

// 将类绑定至全局window对象，使其可被访问
window.GameConfig = GameConfig;
