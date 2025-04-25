// 音效管理类 - 八十年代风格
class SoundManager {
  constructor() {
    // 创建音频上下文 - 用于合成8位音效
    this.audioContext = null;
    this.audioNodes = {};
    // 音效缓存 - 减少频繁创建音频上下文的开销
    this.soundCache = {};
    // 默认音量设置
    this.volumeSettings = {
      start: 0.3,
      move: 0.1,
      eat: 0.3,
      crash: 0.4,
      pause: 0.3,
      master: 1.0, // 主音量控制
    };

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

  // 设置音量 - 可调整特定音效或主音量
  setVolume(soundName, volume) {
    // 音量范围限制在0-1之间
    volume = Math.max(0, Math.min(1, volume));

    if (soundName === 'master') {
      // 设置主音量
      this.volumeSettings.master = volume;
      return true;
    } else if (this.volumeSettings[soundName] !== undefined) {
      // 设置特定音效音量
      this.volumeSettings[soundName] = volume;
      return true;
    }
    return false;
  }

  // 获取实际音量 - 考虑主音量
  getEffectiveVolume(soundName) {
    if (this.volumeSettings[soundName] !== undefined) {
      return this.volumeSettings[soundName] * this.volumeSettings.master;
    }
    return 0.3 * this.volumeSettings.master; // 默认音量
  }

  // 创建低通滤波器 - 模拟老式硬件的音质限制
  createLowPassFilter() {
    // 创建低通滤波器节点
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000; // 截止频率 - 模拟老式硬件的频率限制
    filter.Q.value = 1; // 品质因子
    return filter;
  }

  // 播放音效 - 纯8位合成音效
  async play(soundName, options = {}) {
    if (!this.audioContext) {
      console.warn('音频上下文不可用，无法播放音效');
      return false;
    }

    // 停止之前的音效（如果有）
    this.stop(soundName);

    // 检查是否有自定义音量设置
    if (options.volume !== undefined) {
      this.setVolume(soundName, options.volume);
    }

    try {
      // 检查缓存中是否有该音效
      if (this.soundCache[soundName] && !options.bypassCache) {
        console.log(`使用缓存的音效: ${soundName}`);
        // 使用缓存的音效配置重新创建
        const cache = this.soundCache[soundName];
        switch (soundName) {
          case 'start':
            this.createStartSound(cache);
            break;
          case 'move':
            this.createMoveSound(cache);
            break;
          case 'eat':
            this.createEatSound(cache);
            break;
          case 'crash':
            this.createCrashSound(cache);
            break;
          case 'pause':
            this.createPauseSound(cache);
            break;
        }
      } else {
        // 根据音效类型创建不同的合成音效
        switch (soundName) {
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
      }
      return true;
    } catch (e) {
      console.error(`音效播放失败: ${soundName}`, e);
      return false;
    }
  }

  // 创建开始音效 - 上升音阶
  createStartSound(cache = null) {
    const now = this.audioContext.currentTime;
    const duration = 0.6;
    const volume = this.getEffectiveVolume('start');

    // 创建振荡器
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'square'; // 方波 - 8位音效特征

    // 创建增益节点控制音量
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.linearRampToValueAtTime(0.01, now + duration);

    // 创建低通滤波器 - 模拟老式硬件
    const filter = this.createLowPassFilter();

    // 设置频率变化 - 欢快的上升音阶
    if (cache) {
      // 使用缓存的频率设置
      cache.frequencies.forEach(freq => {
        oscillator.frequency.setValueAtTime(freq.value, now + freq.time);
      });
    } else {
      // 创建新的频率设置
      const frequencies = [
        { value: 220, time: 0 },
        { value: 330, time: 0.1 },
        { value: 440, time: 0.2 },
        { value: 554, time: 0.3 },
        { value: 659, time: 0.4 },
        { value: 880, time: 0.5 },
      ];

      frequencies.forEach(freq => {
        oscillator.frequency.setValueAtTime(freq.value, now + freq.time);
      });

      // 缓存音效配置
      this.soundCache['start'] = {
        frequencies,
        duration,
      };
    }

    // 连接节点 - 加入低通滤波器
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 播放并自动停止
    oscillator.start(now);
    oscillator.stop(now + duration);

    // 保存节点引用（用于停止）
    this.audioNodes['start'] = {
      oscillator,
      gainNode,
      filter,
      endTime: now + duration,
    };
  }

  // 创建移动音效 - 短促的滴答声
  createMoveSound(cache = null) {
    const now = this.audioContext.currentTime;
    const duration = 0.05;
    const volume = this.getEffectiveVolume('move');

    // 创建振荡器
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'square';

    // 创建增益节点控制音量
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.linearRampToValueAtTime(0.01, now + duration);

    // 创建低通滤波器 - 模拟老式硬件
    const filter = this.createLowPassFilter();

    // 设置频率
    if (cache) {
      // 使用缓存的频率设置
      oscillator.frequency.setValueAtTime(cache.frequency, now);
    } else {
      // 创建新的频率设置
      const frequency = 220;
      oscillator.frequency.setValueAtTime(frequency, now);

      // 缓存音效配置
      this.soundCache['move'] = {
        frequency,
        duration,
      };
    }

    // 连接节点 - 加入低通滤波器
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 播放并自动停止
    oscillator.start(now);
    oscillator.stop(now + duration);

    // 保存节点引用
    this.audioNodes['move'] = {
      oscillator,
      gainNode,
      filter,
      endTime: now + duration,
    };
  }

  // 创建进食音效 - 上升音调
  createEatSound(cache = null) {
    const now = this.audioContext.currentTime;
    const duration = 0.2;
    const volume = this.getEffectiveVolume('eat');

    // 创建振荡器
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'square';

    // 创建增益节点控制音量
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // 创建低通滤波器 - 模拟老式硬件
    const filter = this.createLowPassFilter();

    // 设置频率
    if (cache) {
      // 使用缓存的频率设置
      oscillator.frequency.setValueAtTime(cache.startFreq, now);
      oscillator.frequency.exponentialRampToValueAtTime(
        cache.endFreq,
        now + duration
      );
    } else {
      // 创建新的频率设置
      const startFreq = 150;
      const endFreq = 800;
      oscillator.frequency.setValueAtTime(startFreq, now);
      oscillator.frequency.exponentialRampToValueAtTime(
        endFreq,
        now + duration
      );

      // 缓存音效配置
      this.soundCache['eat'] = {
        startFreq,
        endFreq,
        duration,
      };
    }

    // 连接节点 - 加入低通滤波器
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 播放并自动停止
    oscillator.start(now);
    oscillator.stop(now + duration);

    // 保存节点引用
    this.audioNodes['eat'] = {
      oscillator,
      gainNode,
      filter,
      endTime: now + duration,
    };
  }

  // 创建碰撞音效 - 噪音
  createCrashSound(cache = null) {
    const now = this.audioContext.currentTime;
    const duration = 0.4; // 延长音效持续时间
    const volume = this.getEffectiveVolume('crash') * 1.2; // 增加音量

    // 创建振荡器
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sawtooth'; // 锯齿波 - 更刺耳的声音

    // 创建第二个振荡器增加音效复杂度
    const oscillator2 = this.audioContext.createOscillator();
    oscillator2.type = 'square'; // 方波 - 增加噪音感

    // 创建增益节点控制音量
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // 创建波形整形器 - 增加失真效果
    const distortion = this.audioContext.createWaveShaper();
    const distortionAmount = 50; // 降低失真度，避免声音过于扭曲
    distortion.curve = this.makeDistortionCurve(distortionAmount);

    // 创建低通滤波器 - 模拟老式硬件
    const filter = this.createLowPassFilter();
    // 提高滤波器频率，使声音更清晰
    filter.frequency.value = 3000;

    // 设置频率
    if (cache) {
      // 使用缓存的频率设置
      oscillator.frequency.setValueAtTime(cache.startFreq, now);
      oscillator.frequency.linearRampToValueAtTime(
        cache.endFreq,
        now + duration
      );
      if (cache.startFreq2 && cache.endFreq2) {
        oscillator2.frequency.setValueAtTime(cache.startFreq2, now);
        oscillator2.frequency.linearRampToValueAtTime(
          cache.endFreq2,
          now + duration
        );
      }
    } else {
      // 创建新的频率设置 - 提高频率使声音更明显
      const startFreq = 200; // 提高起始频率
      const endFreq = 80; // 提高结束频率
      oscillator.frequency.setValueAtTime(startFreq, now);
      oscillator.frequency.linearRampToValueAtTime(endFreq, now + duration);

      // 第二个振荡器使用不同频率
      const startFreq2 = 300;
      const endFreq2 = 120;
      oscillator2.frequency.setValueAtTime(startFreq2, now);
      oscillator2.frequency.linearRampToValueAtTime(endFreq2, now + duration);

      // 缓存音效配置
      this.soundCache['crash'] = {
        startFreq,
        endFreq,
        startFreq2,
        endFreq2,
        distortionAmount,
        duration,
      };
    }

    // 连接节点 - 加入低通滤波器
    oscillator.connect(distortion);
    oscillator2.connect(distortion); // 连接第二个振荡器
    distortion.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 播放并自动停止
    oscillator.start(now);
    oscillator2.start(now);
    oscillator.stop(now + duration);
    oscillator2.stop(now + duration);

    // 保存节点引用
    this.audioNodes['crash'] = {
      oscillator,
      oscillator2,
      gainNode,
      distortion,
      filter,
      endTime: now + duration,
    };
  }

  // 创建暂停音效 - 下降音调
  createPauseSound(cache = null) {
    const now = this.audioContext.currentTime;
    const duration = 0.3;
    const volume = this.getEffectiveVolume('pause');

    // 创建振荡器
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'square';

    // 创建增益节点控制音量
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // 创建低通滤波器 - 模拟老式硬件
    const filter = this.createLowPassFilter();

    // 设置频率
    if (cache) {
      // 使用缓存的频率设置
      oscillator.frequency.setValueAtTime(cache.startFreq, now);
      oscillator.frequency.exponentialRampToValueAtTime(
        cache.endFreq,
        now + duration
      );
    } else {
      // 创建新的频率设置
      const startFreq = 330;
      const endFreq = 110;
      oscillator.frequency.setValueAtTime(startFreq, now);
      oscillator.frequency.exponentialRampToValueAtTime(
        endFreq,
        now + duration
      );

      // 缓存音效配置
      this.soundCache['pause'] = {
        startFreq,
        endFreq,
        duration,
      };
    }

    // 连接节点 - 加入低通滤波器
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 播放并自动停止
    oscillator.start(now);
    oscillator.stop(now + duration);

    // 保存节点引用
    this.audioNodes['pause'] = {
      oscillator,
      gainNode,
      filter,
      endTime: now + duration,
    };
  }

  // 创建失真曲线 - 用于模拟8位音效的粗糙感
  makeDistortionCurve(amount) {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }

    return curve;
  }

  // 停止音效 - 清理音频节点
  stop(soundName) {
    if (this.audioNodes[soundName]) {
      try {
        // 如果音效还在播放，尝试停止
        const now = this.audioContext.currentTime;
        if (this.audioNodes[soundName].endTime > now) {
          // 停止主振荡器
          if (
            this.audioNodes[soundName].oscillator &&
            typeof this.audioNodes[soundName].oscillator.stop === 'function'
          ) {
            this.audioNodes[soundName].oscillator.stop(0);
          }

          // 停止第二振荡器（如果存在）
          if (
            this.audioNodes[soundName].oscillator2 &&
            typeof this.audioNodes[soundName].oscillator2.stop === 'function'
          ) {
            this.audioNodes[soundName].oscillator2.stop(0);
          }
        }

        // 断开所有节点连接
        if (this.audioNodes[soundName].oscillator) {
          this.audioNodes[soundName].oscillator.disconnect();
        }
        if (this.audioNodes[soundName].oscillator2) {
          this.audioNodes[soundName].oscillator2.disconnect();
        }
        if (this.audioNodes[soundName].gainNode) {
          this.audioNodes[soundName].gainNode.disconnect();
        }
        if (this.audioNodes[soundName].distortion) {
          this.audioNodes[soundName].distortion.disconnect();
        }
        if (this.audioNodes[soundName].filter) {
          this.audioNodes[soundName].filter.disconnect();
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
        const volume = this.volumeSettings.master * 0.1; // 使用主音量控制

        // 创建振荡器
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = 'square'; // 方波 - 8位音效特征
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.2);

        // 创建增益节点控制音量
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        // 创建低通滤波器
        const filter = this.createLowPassFilter();

        // 连接节点
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // 播放并自动停止
        oscillator.start(now);
        oscillator.stop(now + 0.2);
      } catch (e) {
        console.warn('生成停止音效失败:', e);
      }
    }
  }

  // 清除音效缓存 - 用于释放内存或重新生成音效
  clearCache(soundName = null) {
    if (soundName) {
      // 清除特定音效的缓存
      if (this.soundCache[soundName]) {
        delete this.soundCache[soundName];
        return true;
      }
      return false;
    } else {
      // 清除所有缓存
      this.soundCache = {};
      return true;
    }
  }
}

// 导出SoundManager类，使其在全局可用
window.SoundManager = SoundManager;
