// 游戏主类
class SheGame {
    constructor() {
        // 画布相关
        this.hb = document.getElementById('gameCanvas');
        this.ctx = this.hb.getContext('2d');
        this.fw = 20;
        
        // 游戏状态
        this.state = {
            READY: 'ready',
            PLAYING: 'playing',
            PAUSED: 'paused',
            OVER: 'over'
        };
        this.currentState = this.state.READY;
        
        // 蛇之属性
        this.she = [{x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}];
        this.fx = 'right';
        this.df = 0;
        this.speed = 150;
        this.speedIncrement = 2;
        
        // 食之位置
        this.shi = this.createFood();
        
        // 绑定事件
        this.bindEvents();
        
        // 开始游戏
        this.showStartScreen();
    }

    // 绘制开始界面
    showStartScreen() {
        this.clear();
        
        // 绘制标题
        this.ctx.font = '36px 楷体';
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('贪食蛇戏', this.hb.width/2, this.hb.height/2 - 50);
        
        // 绘制提示
        this.ctx.font = '24px 楷体';
        this.ctx.fillStyle = '#666';
        if (window.innerWidth <= 600) {
            this.ctx.fillText('点击开始', this.hb.width/2, this.hb.height/2 + 20);
        } else {
            this.ctx.fillText('按空格键开始', this.hb.width/2, this.hb.height/2 + 20);
        }
        
        // 绘制装饰
        this.ctx.strokeStyle = '#4CAF50';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.roundRect(
            this.hb.width/2 - 100,
            this.hb.height/2 - 80,
            200,
            140,
            10
        );
        this.ctx.stroke();
    }

    // 绘制暂停界面
    showPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.hb.width, this.hb.height);
        
        this.ctx.font = '36px 楷体';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏暂停', this.hb.width/2, this.hb.height/2);
        
        this.ctx.font = '24px 楷体';
        this.ctx.fillText('按空格键继续', this.hb.width/2, this.hb.height/2 + 40);
    }

    // 绘制方块
    drawRect(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.roundRect(
            x * this.fw, 
            y * this.fw, 
            this.fw - 2, 
            this.fw - 2,
            5
        );
        this.ctx.fill();

        // 添加高光效果
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.beginPath();
        this.ctx.roundRect(
            x * this.fw + 2, 
            y * this.fw + 2, 
            (this.fw - 2) / 2, 
            (this.fw - 2) / 2,
            3
        );
        this.ctx.fill();
    }

    // 清屏
    clear() {
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillRect(0, 0, this.hb.width, this.hb.height);
        
        // 绘制网格
        this.ctx.strokeStyle = '#eee';
        this.ctx.lineWidth = 0.5;
        for(let i = 0; i <= this.hb.width; i += this.fw) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.hb.height);
            this.ctx.stroke();
        }
        for(let i = 0; i <= this.hb.height; i += this.fw) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.hb.width, i);
            this.ctx.stroke();
        }
    }

    // 画蛇
    drawSnake() {
        this.she.forEach((seg, i) => {
            if (i === 0) {
                // 蛇头特殊样式
                this.drawRect(seg.x, seg.y, '#4CAF50');
                
                // 绘制蛇眼
                const eyeSize = 3;
                const eyeOffset = 4;
                this.ctx.fillStyle = 'white';
                
                // 根据方向设置蛇眼位置
                let eyeX1, eyeY1, eyeX2, eyeY2;
                switch(this.fx) {
                    case 'right':
                        eyeX1 = seg.x * this.fw + this.fw - eyeOffset;
                        eyeY1 = seg.y * this.fw + eyeOffset;
                        eyeX2 = seg.x * this.fw + this.fw - eyeOffset;
                        eyeY2 = seg.y * this.fw + this.fw - eyeOffset;
                        break;
                    case 'left':
                        eyeX1 = seg.x * this.fw + eyeOffset;
                        eyeY1 = seg.y * this.fw + eyeOffset;
                        eyeX2 = seg.x * this.fw + eyeOffset;
                        eyeY2 = seg.y * this.fw + this.fw - eyeOffset;
                        break;
                    case 'up':
                        eyeX1 = seg.x * this.fw + eyeOffset;
                        eyeY1 = seg.y * this.fw + eyeOffset;
                        eyeX2 = seg.x * this.fw + this.fw - eyeOffset;
                        eyeY2 = seg.y * this.fw + eyeOffset;
                        break;
                    case 'down':
                        eyeX1 = seg.x * this.fw + eyeOffset;
                        eyeY1 = seg.y * this.fw + this.fw - eyeOffset;
                        eyeX2 = seg.x * this.fw + this.fw - eyeOffset;
                        eyeY2 = seg.y * this.fw + this.fw - eyeOffset;
                        break;
                }
                
                this.ctx.beginPath();
                this.ctx.arc(eyeX1, eyeY1, eyeSize, 0, Math.PI * 2);
                this.ctx.arc(eyeX2, eyeY2, eyeSize, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 绘制蛇眼黑色部分
                this.ctx.fillStyle = 'black';
                this.ctx.beginPath();
                this.ctx.arc(eyeX1, eyeY1, eyeSize/2, 0, Math.PI * 2);
                this.ctx.arc(eyeX2, eyeY2, eyeSize/2, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // 蛇身渐变色
                const alpha = 1 - (i / this.she.length) * 0.6;
                this.drawRect(seg.x, seg.y, `rgba(76, 175, 80, ${alpha})`);
            }
        });
    }

    // 画食
    drawFood() {
        const x = this.shi.x * this.fw + this.fw/2 - 1;
        const y = this.shi.y * this.fw + this.fw/2 - 1;
        const radius = this.fw/2 - 2;
        
        // 绘制光晕
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, '#ff8a80');
        gradient.addColorStop(1, '#ff5252');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制高光
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(x - radius/3, y - radius/3, radius/4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 生成食
    createFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * (this.hb.width / this.fw)),
                y: Math.floor(Math.random() * (this.hb.height / this.fw))
            };
        } while (this.she.some(seg => seg.x === food.x && seg.y === food.y));
        return food;
    }

    // 移动
    async move() {
        if (this.currentState !== this.state.PLAYING) return;

        const head = {...this.she[0]};
        switch(this.fx) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // 判断是否吃到食物
        if (head.x === this.shi.x && head.y === this.shi.y) {
            this.shi = this.createFood();
            this.df += 10;
            document.getElementById('score').textContent = `得分：${this.df}`;
            // 加速
            this.speed = Math.max(50, this.speed - this.speedIncrement);
        } else {
            this.she.pop();
        }

        // 判断是否游戏结束
        if (this.isGameOver(head)) {
            this.currentState = this.state.OVER;
            await this.gameOverAnimation();
            return;
        }

        this.she.unshift(head);
    }

    // 判断游戏结束
    isGameOver(head) {
        return head.x < 0 || 
               head.x >= this.hb.width / this.fw ||
               head.y < 0 || 
               head.y >= this.hb.height / this.fw ||
               this.she.some(seg => seg.x === head.x && seg.y === head.y);
    }

    // 游戏结束动画
    async gameOverAnimation() {
        // 闪烁效果
        for(let i = 0; i < 3; i++) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            this.ctx.fillRect(0, 0, this.hb.width, this.hb.height);
            this.ctx.restore();
            await new Promise(resolve => setTimeout(resolve, 200));
            this.clear();
            this.drawSnake();
            this.drawFood();
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // 显示游戏结束文字
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.hb.width, this.hb.height);
        
        this.ctx.font = '36px 楷体';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', this.hb.width/2, this.hb.height/2 - 30);
        
        this.ctx.font = '24px 楷体';
        this.ctx.fillText(`得分：${this.df}`, this.hb.width/2, this.hb.height/2 + 20);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.reset();
    }

    // 重置游戏
    reset() {
        this.she = [{x: 3, y: 1}, {x: 2, y: 1}, {x: 1, y: 1}];
        this.fx = 'right';
        this.df = 0;
        this.speed = 150;
        this.shi = this.createFood();
        this.currentState = this.state.READY;
        document.getElementById('score').textContent = '得分：0';
        this.showStartScreen();
    }

    // 绑定事件
    bindEvents() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                'ArrowUp': 'up',
                'ArrowDown': 'down',
                'ArrowLeft': 'left',
                'ArrowRight': 'right',
                ' ': 'space'
            };
            
            const key = keyMap[e.key];
            if (!key) return;

            if (key === 'space') {
                switch (this.currentState) {
                    case this.state.READY:
                        this.currentState = this.state.PLAYING;
                        this.start();
                        break;
                    case this.state.PLAYING:
                        this.currentState = this.state.PAUSED;
                        this.showPauseScreen();
                        break;
                    case this.state.PAUSED:
                        this.currentState = this.state.PLAYING;
                        break;
                }
                return;
            }
            
            if (this.currentState === this.state.PLAYING) {
                const opposites = {
                    'up': 'down',
                    'down': 'up',
                    'left': 'right',
                    'right': 'left'
                };
                
                if (opposites[key] !== this.fx) {
                    this.fx = key;
                }
            }
        });

        // 移动端控制
        const dpad = document.querySelector('.d-pad');
        if (dpad) {
            dpad.addEventListener('click', (e) => {
                const btn = e.target.closest('.d-btn');
                if (!btn || this.currentState !== this.state.PLAYING) return;

                const direction = btn.dataset.direction;
                const opposites = {
                    'up': 'down',
                    'down': 'up',
                    'left': 'right',
                    'right': 'left'
                };
                
                if (opposites[direction] !== this.fx) {
                    this.fx = direction;
                }
            });
        }

        // 触摸滑动控制
        let touchStartX = 0;
        let touchStartY = 0;
        this.hb.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        this.hb.addEventListener('touchmove', (e) => {
            e.preventDefault(); // 防止页面滚动
        }, { passive: false });

        this.hb.addEventListener('touchend', (e) => {
            if (this.currentState !== this.state.PLAYING) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            // 判断滑动方向
            if (Math.abs(dx) > Math.abs(dy)) {
                // 水平滑动
                if (dx > 0 && this.fx !== 'left') {
                    this.fx = 'right';
                } else if (dx < 0 && this.fx !== 'right') {
                    this.fx = 'left';
                }
            } else {
                // 垂直滑动
                if (dy > 0 && this.fx !== 'up') {
                    this.fx = 'down';
                } else if (dy < 0 && this.fx !== 'down') {
                    this.fx = 'up';
                }
            }
        });
    }

    // 游戏循环
    async update() {
        if (this.currentState === this.state.PLAYING) {
            this.clear();
            await this.move();
            this.drawFood();
            this.drawSnake();
        }
    }

    // 开始游戏
    start() {
        if (this._interval) {
            clearInterval(this._interval);
        }
        this.update();
        this._interval = setInterval(() => this.update(), this.speed);
    }
}

// 启动游戏
new SheGame();