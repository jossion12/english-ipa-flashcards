import chroma from 'chroma-js'

/* ============================================================
 * 英语音标闪卡乐园 · 配色系统（基于 chroma.js）
 * 设计目标：初一学生 —— 明快、活泼、有糖果感，同时保证可读性
 * 所有渐变均用 LCH 模式插值，人眼感知均匀、过渡自然
 * ============================================================ */

/** 品牌主渐变：天蓝 → 薄荷 → 珊瑚（标题、主视觉） */
export const BRAND = chroma.scale(['#38bdf8', '#34d399', '#fb7185']).mode('lch')
export const BRAND_COLORS = BRAND.colors(3)

/** 三组音标的分组色 */
export const GROUP_COLORS = {
  vowel: '#f43f5e', // 珊瑚红 —— 单元音
  diphthong: '#10b981', // 翠绿 —— 双元音
  consonant: '#3b82f6', // 天蓝 —— 辅音
} as const

/** 通用语义色 */
export const SEMANTIC = {
  ok: '#10b981', // 答对
  bad: '#f43f5e', // 答错
  star: '#fbbf24', // 星星 / 奖杯
  ink: '#1e293b', // 深色文字 / 激活按钮
  muted: '#64748b', // 次要文字
} as const

/* ---------- 分组色工具 ---------- */
export const group = {
  /** 加深的分组色（音标符号、标题用） */
  deep: (c: string) => chroma(c).darken(0.9).saturate(0.2).css(),
  /** 浅色底色（徽标背景等） */
  wash: (c: string, alpha = 0.13) => chroma(c).alpha(alpha).css(),
  /** 卡片背面渐变：白 → 分组色极浅 tint */
  back: (c: string) =>
    `linear-gradient(150deg, #ffffff 25%, ${chroma(c).brighten(2.6).desaturate(0.15).css()})`,
  /** 悬停光晕阴影 */
  glow: (c: string) => `0 10px 26px -10px ${chroma(c).alpha(0.5).css()}`,
  /** 悬停边框色（稍亮） */
  borderBright: (c: string) => chroma(c).brighten(0.6).css(),
}

/* ---------- 页面背景：日出暖金 → 樱花粉 → 晴空蓝 ---------- */
const bgStops = chroma
  .scale(['#fde68a', '#fda4af', '#93c5fd'])
  .mode('lch')
  .colors(3)
  .map((c) => chroma(c).brighten(0.85).css())

export const PAGE_BG = `linear-gradient(140deg, ${bgStops[0]} 0%, ${bgStops[1]} 48%, ${bgStops[2]} 100%)`

/* ---------- 闯关模式 ---------- */
/** 大播放按钮：蜜糖橙渐变 */
const playStops = chroma.scale(['#fbbf24', '#f97316']).mode('lch').colors(2)
export const PLAY_BUTTON_BG = `linear-gradient(135deg, ${playStops[0]}, ${playStops[1]})`
export const PLAY_BUTTON_SHADOW = `0 12px 28px -8px ${chroma('#f97316').alpha(0.55).css()}`

/** 进度条：蜜糖金 → 薄荷绿 */
const progStops = chroma.scale(['#fbbf24', '#34d399']).mode('lch').colors(2)
export const PROGRESS_BG = `linear-gradient(90deg, ${progStops[0]}, ${progStops[1]})`

/** 彩带：高饱和糖果六色（LCH 均匀分布） */
export const CONFETTI = chroma
  .scale(['#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'])
  .mode('lch')
  .colors(6)

/** 选关卡片：解锁/锁定状态色 */
export const LEVEL = {
  unlockedBorder: chroma('#f59e0b').alpha(0.55).css(),
  lockedSurface: chroma('#f1f5f9').css(),
  lockedBorder: chroma('#e2e8f0').css(),
  lockedIcon: chroma('#cbd5e1').css(),
  trophyWon: '#f59e0b',
  trophyNew: chroma('#cbd5e1').css(),
}

/** 标题渐变文字（需配合 backgroundClip:text 使用） */
export const TITLE_GRADIENT = `linear-gradient(92deg, ${BRAND_COLORS[0]}, ${BRAND_COLORS[1]} 50%, ${BRAND_COLORS[2]})`

/** 视图切换按钮激活色 */
export const TOGGLE_ACTIVE = SEMANTIC.ink
