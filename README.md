# 💗 情侣飞行棋 · Love Flight Chess

一款为两个人（或你 vs. AI 伴侣）打造的飞行棋小游戏。粉蓝对决，掷骰、起飞、跳格、吃子，谁先把两颗心飞回家谁赢。

## ✨ 特性

- **🔥 R18 情趣主题**：暗红暧昧主题 + 情侣大冒险惩罚卡，**仅供 18+ 成年人在私密场合娱乐**。
- **情侣主题**：你执粉 💗，TA 执蓝 💙，爱心棋子在棋盘上追逐。
- **心动格 💋**：踩到 💋 格子会抽一张惩罚 / 奖励 / 心动卡（共 93 张：惩罚 48 + 奖励 25 + 心动 20）。
- **5 个难度**（AI 伴侣的智能等级）：
  1. 懵懂小白 — 纯随机走子
  2. 心有灵犀 — 偶尔吃你的子
  3. 默契搭档 — 懂得躲危险、抢安全格
  4. 心有千结 — 会算收益，认真追你
  5. 灵魂伴侣 — 全程最优策略，超难
- **经典规则**：掷 6 起飞、安全格 ★、跳格 +4、暂停格 ✋、越界反弹、把对方棋子送回停机坪。
- **多端适配**：手机、电脑、Mac 浏览器直接玩；也可桌面安装。

## 🎮 在线玩（网页版）

直接访问：**https://xfdg.github.io/lover-chess/**

> 首次加载稍慢（需拉取 CSS/JS 模块），稍等几秒即可。

## 💻 桌面版（.exe / .dmg）

需要先安装 [Node.js](https://nodejs.org/)（含 npm）。

```bash
# 安装依赖
npm install

# 本地试玩
npm start

# 打包各平台安装包（输出到 dist/ 目录）
npm run dist:win     # Windows .exe 安装包
npm run dist:mac     # macOS .dmg
npm run dist:linux   # Linux AppImage
npm run dist         # 当前平台
```

打包完成后在 `dist/` 目录里：
- Windows → `情侣飞行棋 Setup 1.0.0.exe`
- macOS → `情侣飞行棋 1.0.0.dmg`
- Linux → `lover-chess-1.0.0.AppImage`

> 跨平台打包提示：在哪个系统上打包，就生成哪个系统的安装包。想要 .exe 就在 Windows 上跑 `npm run dist:win`，想要 .dmg 就在 Mac 上跑 `npm run dist:mac`。

## 📱 手机 / 平板

直接用浏览器打开 `index.html`（或开启 Pages 后的网址）即可，已做触屏与不同屏幕尺寸适配。

## 📂 文件结构

```
lover-chess/
├── index.html              # 页面骨架（仅 HTML 结构）
├── main.js                 # Electron 桌面入口
├── package.json            # 依赖与打包配置
├── .nojekyll               # 绕过 GitHub Pages 的 Jekyll 处理
├── README.md
├── src/
│   ├── css/
│   │   └── style.css       # 全部样式（R18 暗红主题 + 响应式）
│   ├── js/
│   │   ├── config.js       # 棋盘几何 / 格子类型 / 难度配置
│   │   └── game.js         # 游戏逻辑（走子、AI、渲染、事件卡）
│   └── data/
│       └── cards.js        # R18 事件卡数据（惩罚48 / 奖励25 / 心动20）
└── assets/                 # 预留：图标、音效等资源
```

> 采用「结构 / 表现 / 行为 / 数据」分离：改玩法逻辑只动 `src/js/`，换卡池只动 `src/data/`，调样式只动 `src/css/`。

## 🕹️ 玩法

1. 选择难度，点「开始游戏」。
2. 轮到你时点「🎲 掷骰子」，掷到 **6** 才能把停机坪里的棋子起飞。
3. 点一颗会发光的棋子走对应步数。
4. 踩到对方的棋子 → 把它送回停机坪 💥；踩到 ★ 安全格则不被吃。
5. 率先把 2 颗棋子飞进终点（爱心之家）的一方获胜。

MIT License · Made with 💗 by XFDG
