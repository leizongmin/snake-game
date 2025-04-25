// 音效管理类 - 八十年代风格
class SoundManager {
    constructor() {
        // 创建音频上下文 - 用于合成8位音效
        this.audioContext = null;
        this.audioNodes = {};
        
        // 尝试初始化Web Audio API
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
                console.log('音频上下文初始化成功');
            }
        } catch (e) {
            console.warn('音频上下文初始化失败:', e);
        }
    }
    
    // 播放音效 - 纯8位合成音效
    async play(soundName) {
        if (!this.audioContext) {
            console.warn('音频上下文不可用，无法播放音效');
            return false;
        }
        
        // 停止之前的音效（如果有）
        this.stop(soundName);
        
        try {
            // 根据音效类型创建不同的合成音效
            switch(soundName) {
                case 'start':
                    this.createStartSound();
                    break;
                case 'move':
                    this.createMoveSound();
                    break;
                case 'eat':
                    this.createEatSound();
                    break;
                case 'crash':
                    this.createCrashSound();
                    break;
                case 'pause':
                    this.createPauseSound();
                    break;
                default:
                    console.warn(`未知音效: ${soundName}`);
                    return false;
            }
            return true;
        } catch (e) {
            console.error(`音效播放失败: ${soundName}`, e);
            return false;
        }
    }
    
    // 创建开始音效 - 上升音阶
    createStartSound() {
        const now = this.audioContext.currentTime;
        const duration = 0.6;
        
        // 创建振荡器
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'square'; // 方波 - 8位音效特征
        
        // 创建增益节点控制音量
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + duration);
        
        // 设置频率变化 - 欢快的上升音阶
        oscillator.frequency.setValueAtTime(220, now);
        oscillator.frequency.setValueAtTime(330, now + 0.1);
        oscillator.frequency.setValueAtTime(440, now + 0.2);
        oscillator.frequency.setValueAtTime(554, now + 0.3);
        oscillator.frequency.setValueAtTime(659, now + 0.4);
        oscillator.frequency.setValueAtTime(880, now + 0.5);
        
        // 连接节点
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 播放并自动停止
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        // 保存节点引用（用于停止）
        this.audioNodes['start'] = {
            oscillator,
            gainNode,
            endTime: now + duration
        };
    }
    
    // 创建移动音效 - 短促的滴答声
    createMoveSound() {
        const now = this.audioContext.currentTime;
        const duration = 0.05;
        
        // 创建振荡器
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(220, now);
        
        // 创建增益节点控制音量
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + duration);
        
        // 连接节点
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 播放并自动停止
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        // 保存节点引用
        this.audioNodes['move'] = {
            oscillator,
            gainNode,
            endTime: now + duration
        };
    }
    
    // 创建进食音效 - 上升音调
    createEatSound() {
        const now = this.audioContext.currentTime;
        const duration = 0.2;
        
        // 创建振荡器
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + duration);
        
        // 创建增益节点控制音量
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        // 连接节点
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 播放并自动停止
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        // 保存节点引用
        this.audioNodes['eat'] = {
            oscillator,
            gainNode,
            endTime: now + duration
        };
    }
    
    // 创建碰撞音效 - 噪音
    createCrashSound() {
        const now = this.audioContext.currentTime;
        const duration = 0.3;
        
        // 创建振荡器
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sawtooth'; // 锯齿波 - 更刺耳的声音
        oscillator.frequency.setValueAtTime(100, now);
        oscillator.frequency.linearRampToValueAtTime(50, now + duration);
        
        // 创建增益节点控制音量
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        // 创建波形整形器 - 增加失真效果
        const distortion = this.audioContext.createWaveShaper();
        distortion.curve = this.makeDistortionCurve(100); // 强失真
        
        // 连接节点
        oscillator.connect(distortion);
        distortion.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 播放并自动停止
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        // 保存节点引用
        this.audioNodes['crash'] = {
            oscillator,
            gainNode,
            distortion,
            endTime: now + duration
        };
    }
    
    // 创建暂停音效 - 下降音调
    createPauseSound() {
        const now = this.audioContext.currentTime;
        const duration = 0.3;
        
        // 创建振荡器
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(330, now);
        oscillator.frequency.exponentialRampToValueAtTime(110, now + duration);
        
        // 创建增益节点控制音量
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        // 连接节点
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 播放并自动停止
        oscillator.start(now);
        oscillator.stop(now + duration);
        
        // 保存节点引用
        this.audioNodes['pause'] = {
            oscillator,
            gainNode,
            endTime: now + duration
        };
    }
    
    // 创建失真曲线 - 用于模拟8位音效的粗糙感
    makeDistortionCurve(amount) {
        const k = amount;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        
        for (let i = 0; i < n_samples; ++i) {
            const x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        
        return curve;
    }
    
    // 停止音效 - 清理音频节点
    stop(soundName) {
        if (this.audioNodes[soundName]) {
            try {
                // 如果音效还在播放，尝试停止
                const now = this.audioContext.currentTime;
                if (this.audioNodes[soundName].endTime > now && 
                    this.audioNodes[soundName].oscillator && 
                    typeof this.audioNodes[soundName].oscillator.stop === 'function') {
                    this.audioNodes[soundName].oscillator.stop(0);
                }
                
                // 断开所有节点连接
                if (this.audioNodes[soundName].oscillator) {
                    this.audioNodes[soundName].oscillator.disconnect();
                }
                if (this.audioNodes[soundName].gainNode) {
                    this.audioNodes[soundName].gainNode.disconnect();
                }
                if (this.audioNodes[soundName].distortion) {
                    this.audioNodes[soundName].distortion.disconnect();
                }
            } catch (e) {
                console.warn(`断开音频节点 ${soundName} 失败:`, e);
            }
            delete this.audioNodes[soundName];
        }
    }
    
    // 停止所有音效
    stopAll() {
        // 停止所有音效
        Object.keys(this.audioNodes).forEach(soundName => {
            this.stop(soundName);
        });
        
        // 添加8位风格的停止音效
        if (this.audioContext) {
            try {
                const now = this.audioContext.currentTime;
                
                // 创建振荡器
                const oscillator = this.audioContext.createOscillator();
                oscillator.type = 'square'; // 方波 - 8位音效特征
                oscillator.frequency.setValueAtTime(150, now);
                oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.2);
                
                // 创建增益节点控制音量
                const gainNode = this.audioContext.createGain();
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                
                // 连接节点
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // 播放并自动停止
                oscillator.start(now);
                oscillator.stop(now + 0.2);
            } catch (e) {
                console.warn('生成停止音效失败:', e);
            }
        }
    }
}

// 导出SoundManager类，使其在全局可用
window.SoundManager = SoundManager;