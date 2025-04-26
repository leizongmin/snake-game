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
  // 子曰：绘制苹果
  drawApple(x, y, size) {
    // 苹果主体
    this.ctx.fillStyle = '#FF1744';
    this.ctx.beginPath();
    this.ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    this.ctx.fill();

    // 苹果叶子
    this.ctx.fillStyle = '#00C853';
    this.ctx.beginPath();
    this.ctx.ellipse(x + size / 2, y + size / 4, size / 6, size / 4, -Math.PI / 6, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 子曰：绘制番茄
  drawTomato(x, y, size) {
    // 番茄主体
    this.ctx.fillStyle = '#FF3D00';
    this.ctx.beginPath();
    this.ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    this.ctx.fill();

    // 番茄蒂
    this.ctx.fillStyle = '#00E676';
    this.ctx.beginPath();
    this.ctx.moveTo(x + size / 3, y + size / 4);
    this.ctx.lineTo(x + (size * 2) / 3, y + size / 4);
    this.ctx.lineTo(x + size / 2, y);
    this.ctx.fill();
  }

  // 子曰：绘制土豆
  drawPotato(x, y, size) {
    // 土豆主体
    this.ctx.fillStyle = '#FFD600';
    this.ctx.beginPath();
    this.ctx.ellipse(x + size / 2, y + size / 2, size / 2, size / 3, Math.PI / 4, 0, Math.PI * 2);
    this.ctx.fill();

    // 土豆凸起
    this.ctx.fillStyle = '#FFC400';
    this.ctx.beginPath();
    this.ctx.arc(x + size / 3, y + size / 3, size / 8, 0, Math.PI * 2);
    this.ctx.arc(x + (size * 2) / 3, y + (size * 2) / 3, size / 8, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 子曰：绘制香蕉
  drawBanana(x, y, size) {
    // 香蕉主体
    this.ctx.fillStyle = '#FFEA00';
    this.ctx.beginPath();
    this.ctx.ellipse(x + size / 2, y + size / 2, size / 2, size / 4, Math.PI / 4, 0, Math.PI * 2);
    this.ctx.fill();

    // 香蕉纹理
    this.ctx.strokeStyle = '#FFD600';
    this.ctx.beginPath();
    this.ctx.moveTo(x + size / 4, y + size / 4);
    this.ctx.quadraticCurveTo(x + size / 2, y + size / 2, x + (size * 3) / 4, y + (size * 3) / 4);
    this.ctx.stroke();
  }

  // 子曰：绘制生命之果
  drawLifeFruit(x, y, size) {
    const time = Date.now() / 300; // 加快闪烁速度
    const alpha = 0.5 + 0.5 * Math.sin(time); // 增加透明度变化范围

    // 果实主体
    this.ctx.fillStyle = `rgba(233, 30, 99, ${alpha})`;
    this.ctx.beginPath();
    this.ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    this.ctx.fill();

    // 绘制心形
    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    this.ctx.beginPath();
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const heartSize = size / 4;

    // 左半心
    this.ctx.moveTo(centerX, centerY + heartSize / 4);
    this.ctx.bezierCurveTo(
      centerX - heartSize / 2,
      centerY,
      centerX - heartSize / 2,
      centerY - heartSize / 2,
      centerX,
      centerY - heartSize / 4
    );

    // 右半心
    this.ctx.bezierCurveTo(
      centerX + heartSize / 2,
      centerY - heartSize / 2,
      centerX + heartSize / 2,
      centerY,
      centerX,
      centerY + heartSize / 4
    );
    this.ctx.fill();

    // 绘制数字1，增大字号并加粗
    this.ctx.fillStyle = '#FF0000';
    this.ctx.font = `bold ${size / 2}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('1', centerX, centerY);
  }

  drawRect(x, y, color, type = 'default', snake = null) {
    const size = this.blockSize - 2;
    const xPos = x * this.blockSize;
    const yPos = y * this.blockSize;

    // 子曰：绘制基本形状
    this.ctx.fillStyle = color;
    this.ctx.beginPath();

    if (type === 'head') {
      // 子曰：蛇头圆润，眼睛明亮
      this.ctx.roundRect(xPos, yPos, size, size, 8);
      this.ctx.fill();

      // 子曰：计算眼睛位置
      const segments = snake.segments;
      const head = segments[0];
      const neck = segments[1];
      const dx = head.x - neck.x;
      const dy = head.y - neck.y;

      // 子曰：添加眼睛
      const eyeSize = size / 6;
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      if (dx > 0) {
        // 向右
        this.ctx.arc(xPos + size * 0.7, yPos + size * 0.3, eyeSize, 0, Math.PI * 2);
        this.ctx.arc(xPos + size * 0.7, yPos + size * 0.7, eyeSize, 0, Math.PI * 2);
      } else if (dx < 0) {
        // 向左
        this.ctx.arc(xPos + size * 0.3, yPos + size * 0.3, eyeSize, 0, Math.PI * 2);
        this.ctx.arc(xPos + size * 0.3, yPos + size * 0.7, eyeSize, 0, Math.PI * 2);
      } else if (dy > 0) {
        // 向下
        this.ctx.arc(xPos + size * 0.3, yPos + size * 0.7, eyeSize, 0, Math.PI * 2);
        this.ctx.arc(xPos + size * 0.7, yPos + size * 0.7, eyeSize, 0, Math.PI * 2);
      } else {
        // 向上
        this.ctx.arc(xPos + size * 0.3, yPos + size * 0.3, eyeSize, 0, Math.PI * 2);
        this.ctx.arc(xPos + size * 0.7, yPos + size * 0.3, eyeSize, 0, Math.PI * 2);
      }
      this.ctx.fill();

      // 子曰：眼珠乌黑
      this.ctx.fillStyle = 'black';
      this.ctx.beginPath();
      if (dx > 0) {
        // 向右
        this.ctx.arc(xPos + size * 0.7, yPos + size * 0.3, eyeSize / 2, 0, Math.PI * 2);
        this.ctx.arc(xPos + size * 0.7, yPos + size * 0.7, eyeSize / 2, 0, Math.PI * 2);
      } else if (dx < 0) {
        // 向左
        this.ctx.arc(xPos + size * 0.3, yPos + size * 0.3, eyeSize / 2, 0, Math.PI * 2);
        this.ctx.arc(xPos + size * 0.3, yPos + size * 0.7, eyeSize / 2, 0, Math.PI * 2);
      } else if (dy > 0) {
        // 向下
        this.ctx.arc(xPos + size * 0.3, yPos + size * 0.7, eyeSize / 2, 0, Math.PI * 2);
        this.ctx.arc(xPos + size * 0.7, yPos + size * 0.7, eyeSize / 2, 0, Math.PI * 2);
      } else {
        // 向上
        this.ctx.arc(xPos + size * 0.3, yPos + size * 0.3, eyeSize / 2, 0, Math.PI * 2);
        this.ctx.arc(xPos + size * 0.7, yPos + size * 0.3, eyeSize / 2, 0, Math.PI * 2);
      }
      this.ctx.fill();
    } else if (type === 'tail') {
      // 子曰：蛇尾尖锐，随其行而动
      const segments = snake.segments;
      const tail = segments[segments.length - 1];
      const beforeTail = segments[segments.length - 2];

      // 子曰：计算蛇尾朝向
      const dx = tail.x - beforeTail.x;
      const dy = tail.y - beforeTail.y;

      this.ctx.beginPath();
      if (dx > 0) {
        // 向左
        this.ctx.moveTo(xPos + size, yPos + size / 2);
        this.ctx.lineTo(xPos, yPos);
        this.ctx.lineTo(xPos, yPos + size);
      } else if (dx < 0) {
        // 向右
        this.ctx.moveTo(xPos, yPos + size / 2);
        this.ctx.lineTo(xPos + size, yPos);
        this.ctx.lineTo(xPos + size, yPos + size);
      } else if (dy > 0) {
        // 向上
        this.ctx.moveTo(xPos + size / 2, yPos + size);
        this.ctx.lineTo(xPos, yPos);
        this.ctx.lineTo(xPos + size, yPos);
      } else {
        // 向下
        this.ctx.moveTo(xPos + size / 2, yPos);
        this.ctx.lineTo(xPos, yPos + size);
        this.ctx.lineTo(xPos + size, yPos + size);
      }
      this.ctx.closePath();
      this.ctx.fill();
    } else if (type === 'food') {
      if (color === 'life') {
        // 子曰：绘制生命之果
        this.drawLifeFruit(xPos, yPos, size);
      } else {
        // 子曰：食物形状多变
        const foodTypes = [this.drawApple.bind(this), this.drawTomato.bind(this), this.drawPotato.bind(this), this.drawBanana.bind(this)];
        const foodIndex = Math.floor(x * y) % foodTypes.length;
        foodTypes[foodIndex](xPos, yPos, size);
      }
    } else if (type === 'obstacle') {
      // 子曰：砖石方正
      this.ctx.beginPath();
      this.ctx.rect(xPos, yPos, size, size);
      this.ctx.fill();

      // 子曰：砖纹清晰
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      this.ctx.beginPath();
      // 横纹
      this.ctx.moveTo(xPos, yPos + size / 3);
      this.ctx.lineTo(xPos + size, yPos + size / 3);
      this.ctx.moveTo(xPos, yPos + (size * 2) / 3);
      this.ctx.lineTo(xPos + size, yPos + (size * 2) / 3);
      // 竖纹
      this.ctx.moveTo(xPos + size / 3, yPos);
      this.ctx.lineTo(xPos + size / 3, yPos + size);
      this.ctx.moveTo(xPos + (size * 2) / 3, yPos);
      this.ctx.lineTo(xPos + (size * 2) / 3, yPos + size);
      this.ctx.stroke();
    } else {
      this.ctx.roundRect(xPos, yPos, size, size, 5);
      this.ctx.fill();
    }

    // 子曰：添加光泽
    if (type !== 'obstacle') {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.beginPath();
      this.ctx.roundRect(xPos + 2, yPos + 2, size / 2, size / 2, 3);
      this.ctx.fill();
    }
    this.ctx.fill();
  }

  // 绘制蛇
  drawSnake(snake) {
    // 《论语·为政》曰："为政以德，譬如北辰，居之所而众星共之。"
    // 校验snake对象及其segments数组之有效性，若无则不绘制
    if (!snake || !Array.isArray(snake.segments) || snake.segments.length === 0) {
      // 若snake未定义或segments为空，则不作绘制
      return;
    }
    // 绘制蛇身
    for (let i = 1; i < snake.segments.length - 1; i++) {
      this.drawRect(snake.segments[i].x, snake.segments[i].y, '#4CAF50', 'default', snake);
    }
    // 绘制蛇头，添加眼睛
    this.drawRect(snake.segments[0].x, snake.segments[0].y, '#2E7D32', 'head', snake);
    // 绘制蛇尾，使其尖锐
    if (snake.segments.length > 1) {
      const tail = snake.segments[snake.segments.length - 1];
      this.drawRect(tail.x, tail.y, '#4CAF50', 'tail', snake);
    }
  }

  // 绘制食物
  drawFood(foods) {
    // 子曰：遍历食物数组，逐一绘制
    foods.forEach(food => {
      this.drawRect(food.x, food.y, food.type || null, 'food');
    });
  }

  // 绘制障碍物
  drawObstacles(obstacles) {
    obstacles.forEach(obstacle => {
      this.drawRect(obstacle.x, obstacle.y, '#8B4513', 'obstacle');
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

  // 更新生命值显示
  updateLives(lives) {
    document.getElementById('lives').textContent = `生命：${lives}`;
  }
}

// 将类绑定至全局window对象，使其可被访问
window.Renderer = Renderer;
