// 音效管理类 - 八十年代风格
class SoundManager {
    constructor() {
        // 音效集 - 使用Map存储音频对象，便于管理
        this.sounds = new Map();
        
        // 初始化音效
        const soundFiles = {
            start: 'sounds/start.mp3',
            move: 'sounds/move.mp3',
            eat: 'sounds/eat.mp3',
            crash: 'sounds/crash.mp3',
            pause: 'sounds/pause.mp3'
        };
        
        // 创建音频上下文 - 用于添加复古效果
        this.audioContext = null;
        this.audioNodes = {};
        this.audioBuffers = {}; // 存储音频缓冲区
        this.isLoading = {}; // 跟踪加载状态
        
        // 尝试初始化Web Audio API
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
                console.log('音频上下文初始化成功');
                // 优先使用AudioBuffer加载音效
                this.loadSoundBuffers(soundFiles);
            } else {
                // 降级：使用Audio元素
                this.loadAudioElements(soundFiles);
            }
        } catch (e) {
            console.warn('音频上下文初始化失败，将使用基本音效:', e);
            // 降级方案：使用Audio元素
            this.loadAudioElements(soundFiles);
        }
    }
    
    // 使用AudioBuffer加载音效 - 避免CORS问题
    loadSoundBuffers(soundFiles) {
        Object.entries(soundFiles).forEach(([name, src]) => {
            // 标记为加载中
            this.isLoading[name] = true;
            
            // 使用fetch加载音频文件
            fetch(src)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    // 存储解码后的音频缓冲区
                    this.audioBuffers[name] = audioBuffer;
                    this.isLoading[name] = false;
                    console.log(`音效 ${name} 缓冲区加载完成`);
                })
                .catch(error => {
                    console.error(`音效 ${name} 缓冲区加载失败:`, error);
                    this.isLoading[name] = false;
                    // 降级到Audio元素
                    this.loadSingleAudioElement(name, src);
                });
        });
    }
    
    // 降级方案：使用Audio元素加载音效
    loadAudioElements(soundFiles) {
        Object.entries(soundFiles).forEach(([name, src]) => {
            this.loadSingleAudioElement(name, src);
        });
    }
    
    // 加载单个Audio元素
    loadSingleAudioElement(name, src) {
        const audio = new Audio();
        audio.src = src;
        audio.load();
        
        // 添加加载事件监听
        audio.addEventListener('canplaythrough', () => {
            console.log(`音效 ${name} 加载完成`);
        });
        audio.addEventListener('error', (e) => {
            console.error(`音效 ${name} 加载失败:`, e);
        });
        
        // 设置音量
        audio.volume = name === 'move' ? 0.2 : 0.5;
        
        // 存储音频元素
        this.sounds.set(name, audio);
    }
    
    // 播放音效 - 添加8位音效处理
    async play(soundName) {
        // 优先使用AudioBuffer播放
        if (this.audioContext && this.audioBuffers[soundName]) {
            try {
                // 等待音频加载完成
                if (this.isLoading[soundName]) {
                    await new Promise(resolve => {
                        const checkLoading = setInterval(() => {
                            if (!this.isLoading[soundName]) {
                                clearInterval(checkLoading);
                                resolve();
                            }
                        }, 100);
                    });
                }
                
                // 创建音频源
                const source = this.audioContext.createBufferSource();
                source.buffer = this.audioBuffers[soundName];
                
                // 创建低通滤波器 - 模拟8位音效的有限频率响应
                const lowpass = this.audioContext.createBiquadFilter();
                lowpass.type = 'lowpass';
                lowpass.frequency.value = 4000; // 限制高频
                
                // 创建波形整形器 - 增加失真效果
                const distortion = this.audioContext.createWaveShaper();
                distortion.curve = this.makeDistortionCurve(50); // 轻微失真
                
                // 创建增益节点控制音量
                const gainNode = this.audioContext.createGain();
                gainNode.gain.value = soundName === 'move' ? 0.2 : 0.5;
                
                // 连接节点
                source.connect(lowpass);
                lowpass.connect(distortion);
                distortion.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // 播放
                source.start(0);
                
                // 保存节点引用（用于停止）
                this.audioNodes[soundName] = {
                    source,
                    lowpass,
                    distortion,
                    gainNode
                };
                
                return true;
            } catch (e) {
                console.log('音效缓冲区播放失败:', e);
                // 失败时尝试降级方案
            }
        }
        
        // 降级方案：使用Audio元素
        const audio = this.sounds.get(soundName);
        if (audio) {
            try {
                // 确保音频已加载
                if (audio.readyState < 2) { // HAVE_CURRENT_DATA
                    await new Promise((resolve, reject) => {
                        audio.addEventListener('canplay', resolve, {once: true});
                        audio.addEventListener('error', reject, {once: true});
                        // 重新加载音频
                        audio.load();
                    });
                }
                
                // 若音效正在播放，先重置
                audio.currentTime = 0;
                await audio.play();
                return true;
            } catch (e) {
                console.log('音效播放失败:', e);
            }
        }
        
        return false;
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
        // 停止AudioBuffer播放
        if (this.audioNodes[soundName]) {
            try {
                // 停止音频源
                if (this.audioNodes[soundName].source && 
                    typeof this.audioNodes[soundName].source.stop === 'function') {
                    this.audioNodes[soundName].source.stop(0);
                }
                
                // 断开所有节点连接
                if (this.audioNodes[soundName].source) {
                    this.audioNodes[soundName].source.disconnect();
                }
                if (this.audioNodes[soundName].lowpass) {
                    this.audioNodes[soundName].lowpass.disconnect();
                }
                if (this.audioNodes[soundName].distortion) {
                    this.audioNodes[soundName].distortion.disconnect();
                }
                if (this.audioNodes[soundName].gainNode) {
                    this.audioNodes[soundName].gainNode.disconnect();
                }
            } catch (e) {
                console.warn(`断开音频节点 ${soundName} 失败:`, e);
            }
            delete this.audioNodes[soundName];
        }
        
        // 停止Audio元素播放
        const audio = this.sounds.get(soundName);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }
    
    // 停止所有音效
    stopAll() {
        // 停止所有AudioBuffer播放
        Object.keys(this.audioNodes).forEach(soundName => {
            this.stop(soundName);
        });
        
        // 停止所有Audio元素
        this.sounds.forEach((audio, soundName) => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        // 添加8位风格的停止音效
        if (this.audioContext) {
            try {
                // 创建振荡器
                const oscillator = this.audioContext.createOscillator();
                oscillator.type = 'square'; // 方波 - 8位音效特征
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.2);
                
                // 创建增益节点控制音量
                const gainNode = this.audioContext.createGain();
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                
                // 连接节点
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // 播放并自动停止
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
            } catch (e) {
                console.warn('生成停止音效失败:', e);
            }
        }
    }
}

// 导出SoundManager类，使其在全局可用
window.SoundManager = SoundManager;