// 渲染器模块 - 负责所有绘制功能
class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.blockSize = 0; // 将在初始化时设置
    this.backgroundStyle = 0; // 初始化背景样式
  }

  // 重置游戏时更新背景样式
  resetBackground() {
    this.backgroundStyle = Math.floor(Math.random() * 6);
  }

  // 初始化渲染器
  init(blockSize) {
    this.blockSize = blockSize;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 根据不同样式绘制背景
    switch (this.backgroundStyle) {
      case 0: // 晴空白云
        this.ctx.fillStyle = '#E6F3FF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制白云
        this.ctx.fillStyle = '#FFFFFF';
        const cloudPositions = [
          { x: 50, y: 50 },
          { x: 200, y: 100 },
          { x: 350, y: 50 },
          { x: 100, y: 200 },
          { x: 300, y: 250 },
          { x: 450, y: 200 },
          { x: 200, y: 350 },
          { x: 400, y: 350 },
        ];

        for (const pos of cloudPositions) {
          // 绘制花瓣状白云
          for (let j = 0; j < 5; j++) {
            this.ctx.beginPath();
            const angle = (j / 5) * Math.PI * 2;
            const px = pos.x + Math.cos(angle) * 30;
            const py = pos.y + Math.sin(angle) * 30;
            this.ctx.arc(px, py, 20, 0, Math.PI * 2);
            this.ctx.fill();
          }

          // 绘制云朵中心
          this.ctx.beginPath();
          this.ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
          this.ctx.fill();
        }
        break;

      case 1: // 绿野草地
        this.ctx.fillStyle = '#F1F8E9';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制静止的草丛
        this.ctx.strokeStyle = '#228B22';
        for (let i = 0; i < 50; i++) {
          const x = (i * this.canvas.width) / 50 + (i % 2) * 10;
          const y = (Math.floor(i / 10) * this.canvas.height) / 5 + 20;
          this.ctx.beginPath();
          this.ctx.moveTo(x, y);
          this.ctx.lineTo(x - 5, y - 15);
          this.ctx.moveTo(x, y);
          this.ctx.lineTo(x + 5, y - 15);
          this.ctx.stroke();
        }
        break;

      case 2: // 黄沙漫漫
        this.ctx.fillStyle = '#FFF3E0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制静止的沙纹
        this.ctx.strokeStyle = '#DEB887';
        for (let i = 0; i < 30; i++) {
          const x = (i % 6) * (this.canvas.width / 6) + 30;
          const y = Math.floor(i / 6) * (this.canvas.height / 5) + 30;
          this.ctx.beginPath();
          this.ctx.arc(x, y, 20, 0, Math.PI * 2);
          this.ctx.stroke();
        }
        break;

      case 3: // 碧海蓝天
        const seaGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        seaGradient.addColorStop(0, '#87CEEB');
        seaGradient.addColorStop(1, '#1E90FF');
        this.ctx.fillStyle = seaGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制静止的海浪纹理
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 5; i++) {
          this.ctx.beginPath();
          this.ctx.moveTo(0, this.canvas.height - 30 * i);
          this.ctx.lineTo(this.canvas.width, this.canvas.height - 30 * i);
          this.ctx.stroke();
        }
        break;

      case 4: // 森林幽境
        this.ctx.fillStyle = '#E8F5E9';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制树木
        for (let i = 0; i < 15; i++) {
          const x = (i % 5) * (this.canvas.width / 5) + 40;
          const y = Math.floor(i / 5) * (this.canvas.height / 3) + 40;

          // 树干
          this.ctx.fillStyle = '#D2B48C';
          this.ctx.fillRect(x - 5, y, 10, 40);

          // 树冠
          this.ctx.fillStyle = '#90EE90';
          this.ctx.beginPath();
          this.ctx.arc(x, y, 20, 0, Math.PI * 2);
          this.ctx.fill();
        }
        break;

      case 5: // 竹林深处
        this.ctx.fillStyle = '#E8F5E9';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制竹子
        for (let i = 0; i < 8; i++) {
          const x = (i * this.canvas.width) / 8 + 10;

          // 竹竿
          this.ctx.strokeStyle = '#98FB98';
          this.ctx.lineWidth = 8;
          this.ctx.beginPath();
          this.ctx.moveTo(x, 0);
          this.ctx.lineTo(x, this.canvas.height);
          this.ctx.stroke();

          // 竹节
          for (let j = 0; j < 8; j++) {
            const y = (j * this.canvas.height) / 8;
            this.ctx.strokeStyle = '#90EE90';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x - 10, y);
            this.ctx.lineTo(x + 10, y);
            this.ctx.stroke();
          }
        }
        break;
    }
  }

  // 绘制祥云
  drawCloud(x, y, size) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    for (let i = 0; i < 3; i++) {
      this.ctx.quadraticCurveTo(x + size / 2, y - size / 2, x + size, y);
      x += size;
    }
    this.ctx.fill();
  }

  // 绘制方块 - 基础绘制单元
  // 绘制苹果
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

  // 绘制番茄
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

  // 绘制土豆
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

  // 绘制香蕉
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

  // 绘制生命之果
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

    // 绘制基本形状
    this.ctx.fillStyle = color;
    this.ctx.beginPath();

    if (type === 'head') {
      // 蛇头圆润，眼睛明亮
      this.ctx.arc(xPos + size / 2, yPos + size / 2, size / 2, 0, Math.PI * 2);
      this.ctx.fill();

      // 计算眼睛位置
      const segments = snake.segments;
      const head = segments[0];
      const neck = segments[1];
      const dx = head.x - neck.x;
      const dy = head.y - neck.y;

      // 添加眼睛
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

      // 眼珠乌黑
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
      // 蛇尾圆润，如珠玉然
      this.ctx.arc(xPos + size / 2, yPos + size / 2, size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (type === 'food') {
      if (color === 'life') {
        // 绘制生命之果
        this.drawLifeFruit(xPos, yPos, size);
      } else {
        // 食物形状多变
        const foodTypes = [this.drawApple.bind(this), this.drawTomato.bind(this), this.drawPotato.bind(this), this.drawBanana.bind(this)];
        const foodIndex = Math.floor(x * y) % foodTypes.length;
        foodTypes[foodIndex](xPos, yPos, size);
      }
    } else if (type === 'obstacle') {
      // 砖石方正
      this.ctx.beginPath();
      this.ctx.rect(xPos, yPos, size, size);
      this.ctx.fill();

      // 砖纹清晰
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
      // 蛇身圆润，如珠玉然
      this.ctx.arc(xPos + size / 2, yPos + size / 2, size / 2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 添加光泽
    if (type !== 'obstacle') {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.beginPath();
      this.ctx.arc(xPos + size / 4, yPos + size / 4, size / 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 绘制蛇
  drawSnake(snake) {
    // 《论语·为政》曰："为政以德，譬如北辰，居之所而众星共之。"
    // 校验snake对象及其segments数组之有效性，若无则不绘制
    if (!snake || !Array.isArray(snake.segments) || snake.segments.length === 0) {
      // 若snake未定义或segments为空，则不作绘制
      return;
    }

    // 若处于无敌状态，则使蛇身闪烁
    const alpha = snake.invincible ? Math.sin(Date.now() / 100) * 0.5 + 0.5 : 1;
    this.ctx.globalAlpha = alpha;

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

    // 恢复透明度
    this.ctx.globalAlpha = 1;
  }

  // 绘制食物
  drawFood(foods) {
    // 遍历食物数组，逐一绘制
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
