// 经典游戏音乐集合 - 八十年代风格
const musicCollection = [
  // 1. 仙剑奇侠传主题
  {
    name: '仙剑奇侠传',
    melody: [
      { note: 392, duration: 0.3 }, // G4
      { note: 440, duration: 0.3 }, // A4
      { note: 523, duration: 0.4 }, // C5
      { note: 440, duration: 0.2 }, // A4
      { note: 392, duration: 0.4 }, // G4
      { note: 349, duration: 0.3 }, // F4
      { note: 392, duration: 0.5 }, // G4
      { note: 0, duration: 0.2 }, // 休止符
      { note: 349, duration: 0.3 }, // F4
      { note: 392, duration: 0.3 }, // G4
      { note: 440, duration: 0.4 }, // A4
      { note: 392, duration: 0.2 }, // G4
      { note: 349, duration: 0.4 }, // F4
      { note: 330, duration: 0.3 }, // E4
      { note: 349, duration: 0.5 }, // F4
    ],
    bass: [
      { note: 98, duration: 0.4 }, // G2
      { note: 110, duration: 0.4 }, // A2
      { note: 130.8, duration: 0.4 }, // C3
      { note: 98, duration: 0.4 }, // G2
      { note: 87.3, duration: 0.4 }, // F2
      { note: 98, duration: 0.4 }, // G2
      { note: 110, duration: 0.4 }, // A2
      { note: 98, duration: 0.4 }, // G2
    ],
    rhythm: [
      { note: 196, duration: 0.1, gain: 0.1 }, // G3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 196, duration: 0.1, gain: 0.05 }, // G3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 220, duration: 0.1, gain: 0.1 }, // A3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 196, duration: 0.1, gain: 0.05 }, // G3
      { note: 0, duration: 0.1, gain: 0 },
    ],
  },
  // 2. 金庸群侠传主题
  {
    name: '金庸群侠传',
    melody: [
      { note: 523, duration: 0.2 }, // C5
      { note: 587, duration: 0.2 }, // D5
      { note: 659, duration: 0.4 }, // E5
      { note: 587, duration: 0.2 }, // D5
      { note: 523, duration: 0.4 }, // C5
      { note: 494, duration: 0.3 }, // B4
      { note: 523, duration: 0.5 }, // C5
      { note: 0, duration: 0.2 }, // 休止符
      { note: 494, duration: 0.3 }, // B4
      { note: 523, duration: 0.3 }, // C5
      { note: 587, duration: 0.4 }, // D5
      { note: 523, duration: 0.2 }, // C5
      { note: 494, duration: 0.4 }, // B4
      { note: 440, duration: 0.3 }, // A4
      { note: 494, duration: 0.5 }, // B4
    ],
    bass: [
      { note: 130.8, duration: 0.4 }, // C3
      { note: 146.8, duration: 0.4 }, // D3
      { note: 164.8, duration: 0.4 }, // E3
      { note: 130.8, duration: 0.4 }, // C3
      { note: 123.5, duration: 0.4 }, // B2
      { note: 130.8, duration: 0.4 }, // C3
      { note: 146.8, duration: 0.4 }, // D3
      { note: 130.8, duration: 0.4 }, // C3
    ],
    rhythm: [
      { note: 261.6, duration: 0.1, gain: 0.1 }, // C4
      { note: 0, duration: 0.1, gain: 0 },
      { note: 261.6, duration: 0.1, gain: 0.05 }, // C4
      { note: 0, duration: 0.1, gain: 0 },
      { note: 293.7, duration: 0.1, gain: 0.1 }, // D4
      { note: 0, duration: 0.1, gain: 0 },
      { note: 261.6, duration: 0.1, gain: 0.05 }, // C4
      { note: 0, duration: 0.1, gain: 0 },
    ],
  },
  // 3. 大话西游主题
  {
    name: '大话西游',
    melody: [
      { note: 440, duration: 0.3 }, // A4
      { note: 494, duration: 0.3 }, // B4
      { note: 523, duration: 0.4 }, // C5
      { note: 494, duration: 0.2 }, // B4
      { note: 440, duration: 0.4 }, // A4
      { note: 392, duration: 0.3 }, // G4
      { note: 440, duration: 0.5 }, // A4
      { note: 0, duration: 0.2 }, // 休止符
      { note: 392, duration: 0.3 }, // G4
      { note: 440, duration: 0.3 }, // A4
      { note: 494, duration: 0.4 }, // B4
      { note: 440, duration: 0.2 }, // A4
      { note: 392, duration: 0.4 }, // G4
      { note: 349, duration: 0.3 }, // F4
      { note: 392, duration: 0.5 }, // G4
    ],
    bass: [
      { note: 110, duration: 0.4 }, // A2
      { note: 123.5, duration: 0.4 }, // B2
      { note: 130.8, duration: 0.4 }, // C3
      { note: 110, duration: 0.4 }, // A2
      { note: 98, duration: 0.4 }, // G2
      { note: 110, duration: 0.4 }, // A2
      { note: 123.5, duration: 0.4 }, // B2
      { note: 110, duration: 0.4 }, // A2
    ],
    rhythm: [
      { note: 220, duration: 0.1, gain: 0.1 }, // A3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 220, duration: 0.1, gain: 0.05 }, // A3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 247, duration: 0.1, gain: 0.1 }, // B3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 220, duration: 0.1, gain: 0.05 }, // A3
      { note: 0, duration: 0.1, gain: 0 },
    ],
  },
  // 4. 简单旋律
  {
    name: '简单旋律',
    melody: [
      { note: 330, duration: 0.2 }, // E4
      { note: 330, duration: 0.2 }, // E4
      { note: 0, duration: 0.1 }, // 休止符
      { note: 330, duration: 0.2 }, // E4
      { note: 0, duration: 0.1 }, // 休止符
      { note: 262, duration: 0.2 }, // C4
      { note: 330, duration: 0.2 }, // E4
      { note: 0, duration: 0.1 }, // 休止符
      { note: 392, duration: 0.4 }, // G4
      { note: 0, duration: 0.4 }, // 休止符
      { note: 196, duration: 0.4 }, // G3
    ],
    bass: [
      { note: 65.4, duration: 0.4 }, // C2
      { note: 65.4, duration: 0.4 }, // C2
      { note: 73.4, duration: 0.4 }, // D2
      { note: 98, duration: 0.4 }, // G2
      { note: 65.4, duration: 0.4 }, // C2
      { note: 65.4, duration: 0.4 }, // C2
    ],
    rhythm: [
      { note: 130.8, duration: 0.1, gain: 0.1 }, // C3
      { note: 0, duration: 0.1, gain: 0 }, // 休止符
      { note: 130.8, duration: 0.1, gain: 0.05 }, // C3 (轻音)
      { note: 0, duration: 0.1, gain: 0 }, // 休止符
      { note: 130.8, duration: 0.1, gain: 0.1 }, // C3
      { note: 0, duration: 0.1, gain: 0 }, // 休止符
      { note: 130.8, duration: 0.1, gain: 0.05 }, // C3 (轻音)
      { note: 0, duration: 0.1, gain: 0 }, // 休止符
    ],
  },
  // 5. 超级马里奥主题
  {
    name: '超级马里奥',
    melody: [
      { note: 330, duration: 0.15 }, // E4
      { note: 0, duration: 0.05 },
      { note: 330, duration: 0.15 }, // E4
      { note: 0, duration: 0.15 },
      { note: 330, duration: 0.15 }, // E4
      { note: 0, duration: 0.15 },
      { note: 262, duration: 0.15 }, // C4
      { note: 330, duration: 0.15 }, // E4
      { note: 0, duration: 0.15 },
      { note: 392, duration: 0.3 }, // G4
      { note: 0, duration: 0.3 },
      { note: 196, duration: 0.3 }, // G3
      { note: 0, duration: 0.15 },
      { note: 262, duration: 0.3 }, // C4
      { note: 0, duration: 0.15 },
      { note: 196, duration: 0.15 }, // G3
      { note: 0, duration: 0.15 },
      { note: 165, duration: 0.3 }, // E3
      { note: 0, duration: 0.15 },
      { note: 220, duration: 0.15 }, // A3
      { note: 0, duration: 0.1 },
      { note: 247, duration: 0.15 }, // B3
      { note: 0, duration: 0.1 },
      { note: 233, duration: 0.15 }, // A#3/Bb3
      { note: 220, duration: 0.15 }, // A3
    ],
    bass: [
      { note: 65.4, duration: 0.3 }, // C2
      { note: 130.8, duration: 0.3 }, // C3
      { note: 65.4, duration: 0.3 }, // C2
      { note: 98, duration: 0.3 }, // G2
      { note: 65.4, duration: 0.3 }, // C2
      { note: 49, duration: 0.3 }, // G1
      { note: 65.4, duration: 0.3 }, // C2
      { note: 73.4, duration: 0.3 }, // D2
      { note: 82.4, duration: 0.3 }, // E2
      { note: 55, duration: 0.3 }, // A1
    ],
    rhythm: [
      { note: 130.8, duration: 0.1, gain: 0.1 }, // C3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 130.8, duration: 0.1, gain: 0.05 }, // C3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 196, duration: 0.1, gain: 0.1 }, // G3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 196, duration: 0.1, gain: 0.05 }, // G3
      { note: 0, duration: 0.1, gain: 0 },
    ],
  },
  // 6. 俄罗斯方块主题
  {
    name: '俄罗斯方块',
    melody: [
      { note: 165, duration: 0.15 }, // E3
      { note: 0, duration: 0.05 },
      { note: 247, duration: 0.15 }, // B3
      { note: 330, duration: 0.15 }, // E4
      { note: 311, duration: 0.15 }, // D#4/Eb4
      { note: 294, duration: 0.15 }, // D4
      { note: 277, duration: 0.3 }, // C#4/Db4
      { note: 247, duration: 0.15 }, // B3
      { note: 262, duration: 0.15 }, // C4
      { note: 294, duration: 0.3 }, // D4
      { note: 0, duration: 0.15 },
      { note: 262, duration: 0.15 }, // C4
      { note: 247, duration: 0.15 }, // B3
      { note: 220, duration: 0.3 }, // A3
      { note: 0, duration: 0.15 },
      { note: 220, duration: 0.15 }, // A3
      { note: 262, duration: 0.15 }, // C4
      { note: 294, duration: 0.3 }, // D4
      { note: 0, duration: 0.15 },
      { note: 262, duration: 0.15 }, // C4
      { note: 247, duration: 0.15 }, // B3
      { note: 220, duration: 0.15 }, // A3
      { note: 247, duration: 0.15 }, // B3
      { note: 262, duration: 0.3 }, // C4
    ],
    bass: [
      { note: 82.4, duration: 0.3 }, // E2
      { note: 123.5, duration: 0.3 }, // B2
      { note: 82.4, duration: 0.3 }, // E2
      { note: 110, duration: 0.3 }, // A2
      { note: 82.4, duration: 0.3 }, // E2
      { note: 110, duration: 0.3 }, // A2
      { note: 82.4, duration: 0.3 }, // E2
      { note: 123.5, duration: 0.3 }, // B2
      { note: 82.4, duration: 0.3 }, // E2
      { note: 110, duration: 0.3 }, // A2
    ],
    rhythm: [
      { note: 165, duration: 0.1, gain: 0.1 }, // E3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 165, duration: 0.1, gain: 0.05 }, // E3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 220, duration: 0.1, gain: 0.1 }, // A3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 165, duration: 0.1, gain: 0.05 }, // E3
      { note: 0, duration: 0.1, gain: 0 },
    ],
  },
  // 7. 塞尔达传说主题
  {
    name: '塞尔达传说',
    melody: [
      { note: 196, duration: 0.2 }, // G3
      { note: 0, duration: 0.05 },
      { note: 262, duration: 0.2 }, // C4
      { note: 0, duration: 0.05 },
      { note: 330, duration: 0.4 }, // E4
      { note: 0, duration: 0.1 },
      { note: 392, duration: 0.4 }, // G4
      { note: 0, duration: 0.1 },
      { note: 330, duration: 0.2 }, // E4
      { note: 392, duration: 0.2 }, // G4
      { note: 494, duration: 0.4 }, // B4
      { note: 0, duration: 0.1 },
      { note: 440, duration: 0.2 }, // A4
      { note: 392, duration: 0.2 }, // G4
      { note: 330, duration: 0.2 }, // E4
      { note: 262, duration: 0.2 }, // C4
      { note: 294, duration: 0.2 }, // D4
      { note: 330, duration: 0.4 }, // E4
    ],
    bass: [
      { note: 98, duration: 0.4 }, // G2
      { note: 130.8, duration: 0.4 }, // C3
      { note: 165, duration: 0.4 }, // E3
      { note: 196, duration: 0.4 }, // G3
      { note: 165, duration: 0.4 }, // E3
      { note: 147, duration: 0.4 }, // D3
      { note: 130.8, duration: 0.4 }, // C3
      { note: 165, duration: 0.4 }, // E3
    ],
    rhythm: [
      { note: 196, duration: 0.1, gain: 0.1 }, // G3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 196, duration: 0.1, gain: 0.05 }, // G3
      { note: 0, duration: 0.1, gain: 0 },
      { note: 262, duration: 0.1, gain: 0.1 }, // C4
      { note: 0, duration: 0.1, gain: 0 },
      { note: 196, duration: 0.1, gain: 0.05 }, // G3
      { note: 0, duration: 0.1, gain: 0 },
    ],
  },
];

// 将类绑定至全局window对象，使其可被访问
window.musicCollection = musicCollection;
