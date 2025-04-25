// 音效管理类
class SoundManager {
    constructor() {
        // 音效集
        this.sounds = {
            start: new Audio(),   // 游戏开始音效
            move: new Audio(),    // 移动音效
            eat: new Audio(),     // 吃食音效
            crash: new Audio(),   // 撞墙音效
            pause: new Audio()    // 暂停音效
        };
        
        // 初始化音效
        const soundFiles = {
            start: 'sounds/start.mp3',
            move: 'sounds/move.mp3',
            eat: 'sounds/eat.mp3',
            crash: 'sounds/crash.mp3',
            pause: 'sounds/pause.mp3'
        };
        
        // 预加载所有音效
        Object.entries(soundFiles).forEach(([name, src]) => {
            this.sounds[name].src = src;
            this.sounds[name].load(); // 开始加载
            // 添加加载事件监听
            this.sounds[name].addEventListener('canplaythrough', () => {
                console.log(`音效 ${name} 加载完成`);
            });
            this.sounds[name].addEventListener('error', (e) => {
                console.error(`音效 ${name} 加载失败:`, e);
            });
        });
        
        // 音量设置
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.5;
        });
        
        // 移动音效音量降低
        this.sounds.move.volume = 0.2;
    }
    
    // 播放音效
    async play(soundName) {
        if (this.sounds[soundName]) {
            try {
                // 确保音频已加载
                if (this.sounds[soundName].readyState < 2) { // HAVE_CURRENT_DATA
                    await new Promise((resolve, reject) => {
                        this.sounds[soundName].addEventListener('canplay', resolve, {once: true});
                        this.sounds[soundName].addEventListener('error', reject, {once: true});
                        // 重新加载音频
                        this.sounds[soundName].load();
                    });
                }
                // 若音效正在播放，先重置
                this.sounds[soundName].currentTime = 0;
                await this.sounds[soundName].play();
            } catch (e) {
                console.log('音效播放失败:', e);
            }
        }
    }
    
    // 停止音效
    stop(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].pause();
            this.sounds[soundName].currentTime = 0;
        }
    }
    
    // 停止所有音效
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}