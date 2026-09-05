# 💗 情侣飞行棋 · Love Flight Chess

一款为两个人（或你 vs. AI 伴侣）打造的飞行棋小游戏。粉蓝对决，掷骰、起飞、跳格、吃子，谁先把两颗心飞回家谁赢。

## ✨ 特性

- **双主题**：
  - 💗 **清新模式**（默认）：粉蓝爱心、温馨惩罚/奖励，适合所有人。
  - 🔥 **情趣模式（R18）**：暗红暧昧主题 + 情侣大冒险惩罚卡，含 **18+ 年龄确认弹窗**，仅供成年人在私密场合娱乐。
- **情侣主题**：你执粉 💗，TA 执蓝 💙，爱心棋子在棋盘上追逐。
- **心动格 💋**：情趣模式下踩到 💋 格子会抽一张惩罚 / 奖励 / 心动卡。
- **5 个难度**（AI 伴侣的智能等级）：
  1. 懵懂小白 — 纯随机走子
  2. 心有灵犀 — 偶尔吃你的子
  3. 默契搭档 — 懂得躲危险、抢安全格
  4. 心有千结 — 会算收益，认真追你
  5. 灵魂伴侣 — 全程最优策略，超难
- **经典规则**：掷 6 起飞、安全格 ★、跳格 +4、暂停格 ✋、越界反弹、把对方棋子送回停机坪。
- **多端适配**：手机、电脑、Mac 浏览器直接玩；也可桌面安装。

## 🎮 在线玩（网页版）

把仓库开启 **GitHub Pages** 后即可访问：
`https://<你的用户名>.github.io/lover-chess/`

> Settings → Pages → Source 选 `main` 分支 / `root`，保存即可。

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
├── index.html   # 游戏本体（单文件，含全部逻辑与样式）
├── main.js      # Electron 桌面入口
├── package.json # 依赖与打包配置
└── README.md
```

## 🕹️ 玩法

1. 选择难度，点「开始游戏」。
2. 轮到你时点「🎲 掷骰子」，掷到 **6** 才能把停机坪里的棋子起飞。
3. 点一颗会发光的棋子走对应步数。
4. 踩到对方的棋子 → 把它送回停机坪 💥；踩到 ★ 安全格则不被吃。
5. 率先把 2 颗棋子飞进终点（爱心之家）的一方获胜。

MIT License · Made with 💗 by XFDG
