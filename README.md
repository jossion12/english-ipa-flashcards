# 英语音标闪卡乐园

面向初一学生的英语国际音标学习网页：翻面闪卡跟读 + 听音选卡闯关测验。

**在线访问：<https://jossion12.github.io/english-ipa-flashcards/>**

## 功能

- **闪卡学习**：48 个国际音标翻转卡片，点卡翻面自动播放音标发音，背面可听例词发音；支持随机打乱
- **闯关测验**：6 关听音选卡，每关 8 题，按错题数评 1-3 星，通关解锁下一关，进度保存在本地

## 技术

- Vite + React 19 + TypeScript + Tailwind CSS
- chroma.js LCH 感知均匀配色
- 全部音频内联为 data URI，构建产物为单个 `index.html`（离线双击即可打开）

## 本地开发

```bash
npm install
npm run dev
```

## 构建与部署

```bash
npm run build   # 产物在 dist/，单文件 index.html
```

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

## 音频来源

音标发音提取自《国际音标表》软件，例词录音来自 Antimoon（英音）及有道词典，仅供个人学习使用。
