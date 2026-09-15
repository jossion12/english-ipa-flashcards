import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Shuffle, RotateCcw, Volume2, GraduationCap, Home as HomeIcon, Play, Trophy, Star, ChevronRight, Repeat } from 'lucide-react'
import {
  GROUP_COLORS,
  SEMANTIC,
  group,
  PAGE_BG,
  PLAY_BUTTON_BG,
  PLAY_BUTTON_SHADOW,
  PROGRESS_BG,
  CONFETTI,
  LEVEL,
  TITLE_GRADIENT,
  TOGGLE_ACTIVE,
} from '@/lib/palette'

type Group = 'vowel' | 'diphthong' | 'consonant'

interface Card {
  id: string
  sym: string
  group: Group
  word: string
}

const GROUP_META: Record<Group, { label: string; color: string }> = {
  vowel: { label: '单元音', color: GROUP_COLORS.vowel },
  diphthong: { label: '双元音', color: GROUP_COLORS.diphthong },
  consonant: { label: '辅音', color: GROUP_COLORS.consonant },
}

// id 与 public/audio/<id>.mp3、public/audio/phoneme/<id>.mp3 一一对应
const MONO: Card[] = [
  { id: 'm-01', sym: 'iː', group: 'vowel', word: 'see · heat' },
  { id: 'm-02', sym: 'ɪ', group: 'vowel', word: 'hit · sitting' },
  { id: 'm-03', sym: 'e', group: 'vowel', word: 'met · bed' },
  { id: 'm-04', sym: 'æ', group: 'vowel', word: 'cat · black' },
  { id: 'm-05', sym: 'ɑː', group: 'vowel', word: 'arm · father' },
  { id: 'm-06', sym: 'ɒ', group: 'vowel', word: 'hot · rock' },
  { id: 'm-07', sym: 'ɔː', group: 'vowel', word: 'call · four' },
  { id: 'm-08', sym: 'ʊ', group: 'vowel', word: 'put · could' },
  { id: 'm-09', sym: 'uː', group: 'vowel', word: 'blue · food' },
  { id: 'm-10', sym: 'ʌ', group: 'vowel', word: 'cup · luck' },
  { id: 'm-11', sym: 'ɜː', group: 'vowel', word: 'turn · learn' },
  { id: 'm-12', sym: 'ə', group: 'vowel', word: 'away · cinema' },
]

const DIPH: Card[] = [
  { id: 'd-01', sym: 'eɪ', group: 'diphthong', word: 'say · eight' },
  { id: 'd-02', sym: 'aɪ', group: 'diphthong', word: 'five · eye' },
  { id: 'd-03', sym: 'ɔɪ', group: 'diphthong', word: 'boy · join' },
  { id: 'd-04', sym: 'əʊ', group: 'diphthong', word: 'go · home' },
  { id: 'd-05', sym: 'aʊ', group: 'diphthong', word: 'now · out' },
  { id: 'd-06', sym: 'ɪə', group: 'diphthong', word: 'near · here' },
  { id: 'd-07', sym: 'eə', group: 'diphthong', word: 'where · air' },
  { id: 'd-08', sym: 'ʊə', group: 'diphthong', word: 'pure · tourist' },
]

const CONS: Card[] = [
  { id: 'c-01', sym: 'p', group: 'consonant', word: 'pet · map' },
  { id: 'c-02', sym: 'b', group: 'consonant', word: 'bad · lab' },
  { id: 'c-03', sym: 't', group: 'consonant', word: 'tea · getting' },
  { id: 'c-04', sym: 'd', group: 'consonant', word: 'did · lady' },
  { id: 'c-05', sym: 'k', group: 'consonant', word: 'cat · back' },
  { id: 'c-06', sym: 'g', group: 'consonant', word: 'give · flag' },
  { id: 'c-07', sym: 'f', group: 'consonant', word: 'find · if' },
  { id: 'c-08', sym: 'v', group: 'consonant', word: 'voice · five' },
  { id: 'c-09', sym: 's', group: 'consonant', word: 'sun · miss' },
  { id: 'c-10', sym: 'z', group: 'consonant', word: 'zoo · lazy' },
  { id: 'c-11', sym: 'θ', group: 'consonant', word: 'think · both' },
  { id: 'c-12', sym: 'ð', group: 'consonant', word: 'this · mother' },
  { id: 'c-13', sym: 'ʃ', group: 'consonant', word: 'she · crash' },
  { id: 'c-14', sym: 'ʒ', group: 'consonant', word: 'pleasure · vision' },
  { id: 'c-15', sym: 'tʃ', group: 'consonant', word: 'check · church' },
  { id: 'c-16', sym: 'dʒ', group: 'consonant', word: 'just · large' },
  { id: 'c-17', sym: 'tr', group: 'consonant', word: 'tree' },
  { id: 'c-18', sym: 'dr', group: 'consonant', word: 'dress' },
  { id: 'c-19', sym: 'ts', group: 'consonant', word: 'cats' },
  { id: 'c-20', sym: 'dz', group: 'consonant', word: 'beds' },
  { id: 'c-21', sym: 'm', group: 'consonant', word: 'man · lemon' },
  { id: 'c-22', sym: 'n', group: 'consonant', word: 'no · ten' },
  { id: 'c-23', sym: 'ŋ', group: 'consonant', word: 'sing · finger' },
  { id: 'c-24', sym: 'h', group: 'consonant', word: 'how · hello' },
  { id: 'c-25', sym: 'l', group: 'consonant', word: 'leg · little' },
  { id: 'c-26', sym: 'r', group: 'consonant', word: 'red · try' },
  { id: 'c-27', sym: 'w', group: 'consonant', word: 'wet · window' },
  { id: 'c-28', sym: 'j', group: 'consonant', word: 'yes · yellow' },
]

const ALL: Card[] = [...MONO, ...DIPH, ...CONS]
const BY_ID = new Map(ALL.map((c) => [c.id, c]))

const LEVELS: { name: string; sub: string; ids: string[] }[] = [
  { name: '第 1 关', sub: '单元音·上', ids: ['m-01','m-02','m-03','m-04','m-05','m-06','m-07','m-08'] },
  { name: '第 2 关', sub: '单元音·下 + 双元音·上', ids: ['m-09','m-10','m-11','m-12','d-01','d-02','d-03','d-04'] },
  { name: '第 3 关', sub: '双元音·下 + 爆破音', ids: ['d-05','d-06','d-07','d-08','c-01','c-02','c-03','c-04'] },
  { name: '第 4 关', sub: '摩擦音', ids: ['c-05','c-06','c-07','c-08','c-09','c-10','c-11','c-12'] },
  { name: '第 5 关', sub: '破擦音 + 鼻音', ids: ['c-13','c-14','c-15','c-16','c-17','c-18','c-19','c-20'] },
  { name: '第 6 关', sub: '通音乐园', ids: ['c-21','c-22','c-23','c-24','c-25','c-26','c-27','c-28'] },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const PROGRESS_KEY = 'ipa-flash-progress-v1'

interface Progress {
  stars: number[]
  unlocked: number
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (Array.isArray(p.stars) && typeof p.unlocked === 'number') return p
    }
  } catch { /* ignore */ }
  return { stars: [0, 0, 0, 0, 0, 0], unlocked: 0 }
}

/* ---------- 全局音频 ---------- */
let audioRef: HTMLAudioElement | null = null
function stopAudio() {
  if (audioRef) { audioRef.pause(); audioRef = null }
}
function playUrl(url: string, onEnd?: () => void) {
  stopAudio()
  const a = new Audio(url)
  audioRef = a
  if (onEnd) {
    a.onended = onEnd
    a.onerror = onEnd
  }
  a.play().catch(() => { audioRef = null })
}
// 音频经 Vite 打包为 data URI 内联进单文件（由 vite-plugin-singlefile 的 assetsInlineLimit 保证）
const audioModules = import.meta.glob('../assets/audio/**/*.mp3', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const phonemeUrl = (id: string) => audioModules[`../assets/audio/phoneme/${id}.mp3`]
const wordUrl = (id: string) => audioModules[`../assets/audio/${id}.mp3`]

let audioCtx: AudioContext | null = null
function beep(ok: boolean) {
  try {
    audioCtx = audioCtx || new AudioContext()
    const ctx = audioCtx
    const now = ctx.currentTime
    const mk = (freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = type
      o.frequency.value = freq
      g.gain.setValueAtTime(0, now + start)
      g.gain.linearRampToValueAtTime(vol, now + start + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, now + start + dur)
      o.connect(g).connect(ctx.destination)
      o.start(now + start)
      o.stop(now + start + dur + 0.05)
    }
    if (ok) { mk(660, 0, 0.15); mk(880, 0.1, 0.25) } else { mk(180, 0, 0.3, 'square', 0.12) }
  } catch { /* ignore */ }
}

/* ---------- 翻转闪卡 ---------- */
function FlipCard({ card }: { card: Card }) {
  const [flipped, setFlipped] = useState(false)
  const meta = GROUP_META[card.group]
  const c = meta.color

  const toggle = () => {
    const next = !flipped
    setFlipped(next)
    if (next) playUrl(phonemeUrl(card.id)) // 翻面即播放音标发音
  }

  return (
    <div className="group [perspective:1200px]">
      <div
        className={`relative aspect-square w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:-translate-y-1 ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* 正面 */}
        <button
          onClick={toggle}
          title="点击翻面，听音标发音"
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border-2 bg-white shadow-sm transition-shadow duration-300"
          style={{ borderColor: c }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = group.glow(c)
            e.currentTarget.style.borderColor = group.borderBright(c)
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = ''
            e.currentTarget.style.borderColor = c
          }}
        >
          <span className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: group.deep(c) }}>
            [{card.sym}]
          </span>
          <span className="mt-1 text-[10px]" style={{ color: SEMANTIC.muted }}>{meta.label}</span>
          <span className="absolute bottom-1.5 flex items-center gap-0.5 text-[9px]" style={{ color: group.wash(c, 0.9) }}>
            <Repeat className="h-2.5 w-2.5" /> 点我翻面
          </span>
        </button>
        {/* 背面 */}
        <div
          className="absolute inset-0 flex flex-col rounded-xl border-2 shadow-md"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderColor: c, background: group.back(c) }}
        >
          <div className="flex items-center justify-between px-2 pt-1.5">
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-medium"
              style={{ backgroundColor: group.wash(c), color: group.deep(c) }}
            >
              {meta.label}
            </span>
            <button
              onClick={() => playUrl(phonemeUrl(card.id))}
              title="再听一次音标发音"
              className="rounded-full p-1 transition-colors"
              style={{ color: c }}
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <span className="text-xl font-bold" style={{ color: group.deep(c) }}>[{card.sym}]</span>
          </div>
          <button
            onClick={() => playUrl(wordUrl(card.id))}
            title={`听例词发音：${card.word}`}
            className="flex w-full items-center justify-center gap-1 rounded-b-[10px] border-t py-1 text-[10px] leading-tight transition-colors hover:brightness-95"
            style={{ backgroundColor: group.wash(c, 0.07), color: SEMANTIC.muted, borderColor: group.wash(c, 0.25) }}
          >
            <Volume2 className="h-3 w-3" />
            {card.word}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- 闯关测验 ---------- */
interface Question {
  target: Card
  options: Card[]
}

function makeQuestions(levelIdx: number): Question[] {
  const ids = LEVELS[levelIdx].ids
  return shuffle(ids).map((id) => {
    const target = BY_ID.get(id)!
    const pool = shuffle(ids.filter((x) => x !== id)).slice(0, 3)
    const options = shuffle([id, ...pool]).map((x) => BY_ID.get(x)!)
    return { target, options }
  })
}

function Quiz() {
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [screen, setScreen] = useState<'menu' | 'play' | 'result'>('menu')
  const [level, setLevel] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [mistakes, setMistakes] = useState(0)
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [confetti, setConfetti] = useState<number[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mistakesRef = useRef(0)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const startLevel = (idx: number) => {
    setLevel(idx)
    setQuestions(makeQuestions(idx))
    setQIdx(0)
    setPicked(null)
    setPhase('idle')
    setMistakes(0)
    mistakesRef.current = 0
    setCombo(0)
    setBestCombo(0)
    setScreen('play')
  }

  // 每道题开始时自动播放发音
  useEffect(() => {
    if (screen !== 'play' || questions.length === 0) return
    setPicked(null)
    setPhase('idle')
    const t = setTimeout(() => playUrl(phonemeUrl(questions[qIdx].target.id)), 350)
    return () => clearTimeout(t)
  }, [screen, qIdx, questions])

  const answer = (opt: Card) => {
    if (phase !== 'idle') return
    const ok = opt.id === questions[qIdx].target.id
    setPicked(opt.id)
    setPhase(ok ? 'correct' : 'wrong')
    beep(ok)
    if (ok) {
      const c = combo + 1
      setCombo(c)
      setBestCombo((b) => Math.max(b, c))
      setConfetti(Array.from({ length: 26 }, (_, i) => i))
      setTimeout(() => setConfetti([]), 1100)
    } else {
      setCombo(0)
      setMistakes((m) => m + 1)
      mistakesRef.current += 1
    }
    timerRef.current = setTimeout(() => {
      if (qIdx + 1 < questions.length) {
        setQIdx((i) => i + 1)
      } else {
        // 结算（用 ref 确保包含最后一题的判分）
        const wrong = mistakesRef.current
        const stars = wrong === 0 ? 3 : wrong <= 2 ? 2 : 1
        setProgress((p) => {
          const starsArr = [...p.stars]
          starsArr[level] = Math.max(starsArr[level], stars)
          const np = { stars: starsArr, unlocked: Math.max(p.unlocked, Math.min(level + 1, LEVELS.length - 1)) }
          try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(np)) } catch { /* ignore */ }
          return np
        })
        setScreen('result')
      }
    }, ok ? 1100 : 1600)
  }

  const totalStars = progress.stars.reduce((a, b) => a + b, 0)
  const q = questions[qIdx]

  /* 选关界面 */
  if (screen === 'menu') {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black" style={{ color: SEMANTIC.ink }}>🎯 听音选卡 · 闯关模式</h2>
          <p className="mt-1 text-sm" style={{ color: SEMANTIC.muted }}>
            播放发音，从 4 张卡片中选出正确的音标 · 已获 {totalStars} / 18 颗星
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {LEVELS.map((lv, i) => {
            const locked = i > progress.unlocked
            const stars = progress.stars[i]
            return (
              <button
                key={lv.name}
                disabled={locked}
                onClick={() => startLevel(i)}
                className={`relative flex flex-col items-center gap-1 rounded-2xl border-2 bg-white p-5 transition-all duration-300 ${
                  locked ? 'cursor-not-allowed opacity-70' : 'shadow-sm hover:-translate-y-1 hover:shadow-md'
                }`}
                style={locked ? { borderColor: LEVEL.lockedBorder, backgroundColor: LEVEL.lockedSurface } : { borderColor: LEVEL.unlockedBorder }}
              >
                {locked ? (
                  <span className="text-2xl">🔒</span>
                ) : (
                  <Trophy className="h-7 w-7" style={{ color: stars > 0 ? LEVEL.trophyWon : LEVEL.trophyNew }} />
                )}
                <span className="text-base font-bold" style={{ color: locked ? SEMANTIC.muted : SEMANTIC.ink }}>{lv.name}</span>
                <span className="text-xs" style={{ color: SEMANTIC.muted }}>{lv.sub}</span>
                <span className="mt-1 flex gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className="h-4 w-4"
                      style={{ color: s <= stars ? SEMANTIC.star : '#e2e8f0', fill: s <= stars ? SEMANTIC.star : 'none' }}
                    />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-6 text-center text-xs" style={{ color: SEMANTIC.muted }}>
          每关 8 题 · 全对 3 颗星 · 错 1-2 题 2 颗星 · 通关解锁下一关
        </p>
      </div>
    )
  }

  /* 结算界面 */
  if (screen === 'result') {
    const stars = progress.stars[level]
    const titles = ['', '音标新秀 ⭐', '发音达人 🌟', '音标大师 🏆']
    const lastLevel = level >= LEVELS.length - 1
    return (
      <div className="mx-auto max-w-lg text-center">
        <div
          className="rounded-3xl border-2 bg-white p-10 shadow-lg"
          style={{ borderColor: group.wash(SEMANTIC.star, 0.5) }}
        >
          <div className="mb-2 text-5xl">{stars === 3 ? '🏆' : stars === 2 ? '🌟' : '⭐'}</div>
          <h2 className="text-2xl font-black" style={{ color: SEMANTIC.ink }}>{LEVELS[level].name} 通关！</h2>
          <p className="mt-1 text-lg font-medium" style={{ color: '#d97706' }}>{titles[stars]}</p>
          <div className="mt-3 flex justify-center gap-1">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className="h-8 w-8"
                style={{ color: s <= stars ? SEMANTIC.star : '#e2e8f0', fill: s <= stars ? SEMANTIC.star : 'none' }}
              />
            ))}
          </div>
          <p className="mt-4 text-sm" style={{ color: SEMANTIC.muted }}>
            答错 {mistakes} 题 · 最高连对 {bestCombo} · 共获 {totalStars} / 18 颗星
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => startLevel(level)}>
              <Repeat className="mr-1 h-4 w-4" /> 再玩一次
            </Button>
            {!lastLevel && (
              <Button onClick={() => startLevel(level + 1)}>
                下一关 <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" onClick={() => setScreen('menu')}>
              返回选关
            </Button>
          </div>
        </div>
      </div>
    )
  }

  /* 答题界面 */
  return (
    <div className="relative mx-auto max-w-2xl">
      {/* 彩带 */}
      {confetti.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {confetti.map((i) => (
            <span
              key={i}
              className="absolute top-0 block h-2 w-3 rounded-sm"
              style={{
                left: `${(i * 37) % 100}%`,
                backgroundColor: CONFETTI[i % CONFETTI.length],
                animation: `confetti-fall ${0.9 + (i % 5) * 0.15}s ease-in forwards`,
                transform: `rotate(${i * 47}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* 进度与连对 */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: group.wash('#64748b', 0.18) }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((qIdx + (phase !== 'idle' ? 1 : 0)) / questions.length) * 100}%`, background: PROGRESS_BG }}
          />
        </div>
        <span className="text-xs font-medium" style={{ color: SEMANTIC.muted }}>
          {qIdx + 1} / {questions.length}
        </span>
        {combo >= 2 && (
          <span
            className="rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ backgroundColor: group.wash('#f97316', 0.16), color: '#ea580c' }}
          >
            连对 ×{combo} 🔥
          </span>
        )}
      </div>

      {/* 播放区 */}
      <div className="flex flex-col items-center gap-3 rounded-3xl border-2 bg-white p-8 shadow-sm" style={{ borderColor: group.wash('#64748b', 0.2) }}>
        <button
          onClick={() => playUrl(phonemeUrl(q.target.id))}
          title="点击重新播放发音"
          className={`flex h-24 w-24 items-center justify-center rounded-full text-white transition-transform hover:scale-105 active:scale-95 ${
            phase === 'idle' ? 'animate-pulse' : ''
          }`}
          style={{ background: PLAY_BUTTON_BG, boxShadow: PLAY_BUTTON_SHADOW }}
        >
          <Play className="h-10 w-10 fill-white" />
        </button>
        <p className="text-sm" style={{ color: SEMANTIC.muted }}>仔细听 👆 这个发音对应哪个音标？</p>
      </div>

      {/* 选项 */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {q.options.map((opt) => {
          const isTarget = opt.id === q.target.id
          const isPicked = picked === opt.id
          let style: React.CSSProperties = {
            borderColor: '#e2e8f0',
            backgroundColor: '#ffffff',
          }
          let hoverable = true
          if (phase !== 'idle') {
            hoverable = false
            if (isTarget) {
              style = { borderColor: SEMANTIC.ok, backgroundColor: group.wash(SEMANTIC.ok, 0.08), boxShadow: group.glow(SEMANTIC.ok) }
            } else if (isPicked) {
              style = { borderColor: SEMANTIC.bad, backgroundColor: group.wash(SEMANTIC.bad, 0.08) }
            } else {
              style = { borderColor: '#e2e8f0', backgroundColor: '#ffffff', opacity: 0.5 }
            }
          }
          return (
            <button
              key={opt.id}
              onClick={() => answer(opt)}
              disabled={phase !== 'idle'}
              className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                phase === 'wrong' && isPicked ? 'animate-shake' : ''
              } ${hoverable && phase === 'idle' ? 'hover:-translate-y-1 hover:shadow-md' : ''}`}
              style={style}
              onMouseEnter={hoverable && phase === 'idle' ? (e) => { e.currentTarget.style.borderColor = group.wash(SEMANTIC.star, 0.9) } : undefined}
              onMouseLeave={hoverable && phase === 'idle' ? (e) => { e.currentTarget.style.borderColor = '#e2e8f0' } : undefined}
            >
              <span className="text-2xl font-bold sm:text-3xl" style={{ color: group.deep(GROUP_COLORS[opt.group]) }}>
                [{opt.sym}]
              </span>
              <span className="mt-1 text-[10px]" style={{ color: SEMANTIC.muted }}>{GROUP_META[opt.group].label}</span>
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-center text-xs" style={{ color: SEMANTIC.muted }}>
        {phase === 'correct' ? '✅ 答对啦！' : phase === 'wrong' ? `❌ 是 [${q.target.sym}] 哦，记住它！` : ' '}
      </p>
    </div>
  )
}

/* ---------- 主页面 ---------- */
export default function Home() {
  const [view, setView] = useState<'cards' | 'quiz'>('cards')
  const [cards, setCards] = useState<Card[]>(ALL)
  const [round, setRound] = useState(0)

  const shuffled = cards !== ALL

  const doShuffle = () => {
    setCards((prev) => shuffle(prev))
    setRound((r) => r + 1)
  }

  const doReset = () => {
    setCards(ALL)
    setRound(0)
  }

  // 切换视图时停掉正在播放的音频
  useEffect(() => { stopAudio() }, [view])

  const progress = useMemo(loadProgress, [])
  const totalStars = progress.stars.reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: PAGE_BG }}>
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(420px) rotate(540deg); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1
            className="bg-clip-text text-4xl font-black tracking-wide text-transparent sm:text-5xl"
            style={{ backgroundImage: TITLE_GRADIENT }}
          >
            英语国际音标 · 闪卡乐园
          </h1>
          <p className="mt-2 text-sm" style={{ color: SEMANTIC.muted }}>
            共 {ALL.length} 个音标 · 翻面学发音 · 闯关练听力
          </p>
        </header>

        {/* 视图切换 */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setView('cards')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              view === 'cards' ? 'text-white shadow' : 'bg-white hover:shadow-sm'
            }`}
            style={view === 'cards' ? { backgroundColor: TOGGLE_ACTIVE } : { color: SEMANTIC.muted }}
          >
            <HomeIcon className="h-4 w-4" /> 闪卡学习
          </button>
          <button
            onClick={() => setView('quiz')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
              view === 'quiz' ? 'text-white shadow' : 'bg-white hover:shadow-sm'
            }`}
            style={view === 'quiz' ? { backgroundColor: TOGGLE_ACTIVE } : { color: SEMANTIC.muted }}
          >
            <GraduationCap className="h-4 w-4" /> 闯关测验
            {totalStars > 0 && (
              <span className="rounded-full px-1.5 text-xs font-bold text-white" style={{ backgroundColor: SEMANTIC.star }}>
                {totalStars}★
              </span>
            )}
          </button>
        </div>

        {view === 'quiz' ? (
          <Quiz />
        ) : (
          <>
            {/* Controls */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={doShuffle} className="gap-2 text-base">
                <Shuffle className="h-5 w-5" />
                随机打乱
              </Button>
              <Button size="lg" variant="outline" onClick={doReset} disabled={!shuffled} className="gap-2 text-base">
                <RotateCcw className="h-5 w-5" />
                还原顺序
              </Button>
              <div
                className="flex items-center gap-3 rounded-full border bg-white/70 px-4 py-1.5 text-sm"
                style={{ borderColor: group.wash('#64748b', 0.2) }}
              >
                {(['vowel', 'diphthong', 'consonant'] as Group[]).map((g) => (
                  <span key={g} className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full border-2" style={{ borderColor: GROUP_META[g].color }} />
                    <span style={{ color: group.deep(GROUP_META[g].color) }}>{GROUP_META[g].label}</span>
                  </span>
                ))}
              </div>
            </div>

            {round > 0 && (
              <p className="mb-4 text-center text-xs" style={{ color: SEMANTIC.muted }}>已打乱 {round} 次 · 边框颜色代表原属分组</p>
            )}

            {/* 闪卡网格 */}
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3 md:grid-cols-8">
              {cards.map((c) => (
                <FlipCard key={c.id} card={c} />
              ))}
            </div>
          </>
        )}

        <footer className="mt-8 text-center text-xs" style={{ color: SEMANTIC.muted }}>
          音标发音提取自《国际音标表》软件 · 例词录音来源：Antimoon（英音）及有道词典 · 仅供个人学习使用
        </footer>
      </div>
    </div>
  )
}
