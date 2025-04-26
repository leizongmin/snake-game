// 渲染器模块 - 负责所有绘制功能
class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.blockSize = 0; // 将在初始化时设置
  }

  // 初始化渲染器
  init(blockSize) {
    this.blockSize = blockSize;
  }

  // 清空画布
  clear() {
    this.ctx.fillStyle = '#fafafa';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 绘制方块 - 基础绘制单元
  drawRect(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.roundRect(x * this.blockSize, y * this.blockSize, this.blockSize - 2, this.blockSize - 2, 5);
    this.ctx.fill();

    // 添加高光效果
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.beginPath();
    this.ctx.roundRect(x * this.blockSize + 2, y * this.blockSize + 2, (this.blockSize - 2) / 2, (this.blockSize - 2) / 2, 3);
    this.ctx.fill();
  }

  // 绘制蛇
  drawSnake(snake) {
    // 《论语·为政》曰：“为政以德，譬如北辰，居其所而众星共之。”
    // 校验snake对象及其segments数组之有效性，若无则不绘制
    if (!snake || !Array.isArray(snake.segments) || snake.segments.length === 0) {
      // 若snake未定义或segments为空，则不作绘制
      return;
    }
    // 绘制蛇身
    for (let i = 1; i < snake.segments.length; i++) {
      this.drawRect(snake.segments[i].x, snake.segments[i].y, '#4CAF50');
    }
    // 绘制蛇头
    this.drawRect(snake.segments[0].x, snake.segments[0].y, '#2E7D32');
  }

  // 绘制食物
  drawFood(food) {
    this.drawRect(food.x, food.y, '#FF5252');
  }

  // 绘制障碍物
  drawObstacles(obstacles) {
    obstacles.forEach(obstacle => {
      this.drawRect(obstacle.x, obstacle.y, '#607D8B');
    });
  }

  // 绘制开始界面
  drawStartScreen(currentMode, modes) {
    this.clear();

    // 绘制标题
    this.ctx.font = '36px 楷体';
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('贪食蛇戏', this.canvas.width / 2, this.canvas.height / 2 - 100);

    // 绘制模式选择
    this.ctx.font = '24px 楷体';
    this.ctx.fillStyle = '#666';
    Object.values(modes).forEach((mode, index) => {
      const y = this.canvas.height / 2 - 40 + index * 40;
      const isSelected = mode === currentMode;

      // 绘制选择框
      this.ctx.strokeStyle = isSelected ? '#4CAF50' : '#666';
      this.ctx.lineWidth = isSelected ? 2 : 1;
      this.ctx.beginPath();
      this.ctx.roundRect(this.canvas.width / 2 - 80, y - 25, 160, 35, 5);
      this.ctx.stroke();

      // 绘制模式名称
      this.ctx.fillStyle = isSelected ? '#4CAF50' : '#666';
      this.ctx.fillText(mode.name, this.canvas.width / 2, y);
    });

    // 绘制提示
    this.ctx.font = '20px 楷体';
    this.ctx.fillStyle = '#666';
    if (window.innerWidth <= 600) {
      this.ctx.fillText('点击选择模式并开始', this.canvas.width / 2, this.canvas.height / 2 + 120);
    } else {
      this.ctx.fillText('按上下键选择模式，空格键开始', this.canvas.width / 2, this.canvas.height / 2 + 120);
    }
  }

  // 绘制暂停界面
  drawPauseScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = '36px 楷体';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('游戏暂停', this.canvas.width / 2, this.canvas.height / 2);

    this.ctx.font = '24px 楷体';
    this.ctx.fillText('按空格键继续', this.canvas.width / 2, this.canvas.height / 2 + 40);
  }

  // 绘制游戏结束界面
  drawGameOverScreen(currentMode, score) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制标题
    this.ctx.font = '48px 楷体';
    this.ctx.fillStyle = '#FF5252';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 80);

    // 绘制模式和得分
    this.ctx.font = '24px 楷体';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(`模式：${currentMode.name}`, this.canvas.width / 2, this.canvas.height / 2 - 30);
    this.ctx.fillText(`最终得分：${score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);

    // 绘制提示
    this.ctx.font = '20px 楷体';
    if (window.innerWidth <= 600) {
      this.ctx.fillText('点击重新开始', this.canvas.width / 2, this.canvas.height / 2 + 60);
    } else {
      this.ctx.fillText('按空格键重新开始', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }

    // 绘制装饰
    this.ctx.strokeStyle = '#FF5252';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(this.canvas.width / 2 - 120, this.canvas.height / 2 - 100, 240, 200, 10);
    this.ctx.stroke();
  }

  // 更新分数显示
  updateScore(score) {
    document.getElementById('score').textContent = `得分：${score}`;
  }
}

// 将类绑定至全局window对象，使其可被访问
window.Renderer = Renderer;
