import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Shuffle, RotateCcw, Volume2 } from 'lucide-react'

type Group = 'vowel' | 'diphthong' | 'consonant'

interface Card {
  id: string
  sym: string
  group: Group
  word: string // 示例词，随录音一起展示
}

const GROUP_META: Record<Group, { label: string; color: string; ring: string }> = {
  vowel: { label: '单元音', color: 'text-red-600', ring: 'border-red-400' },
  diphthong: { label: '双元音', color: 'text-emerald-600', ring: 'border-emerald-400' },
  consonant: { label: '辅音', color: 'text-sky-600', ring: 'border-sky-400' },
}

// id 与 public/audio/<id>.mp3 一一对应
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

const ORIGINAL: Card[] = [...MONO, ...DIPH, ...CONS]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>(ORIGINAL)
  const [round, setRound] = useState(0)
  const [playing, setPlaying] = useState<{ id: string; kind: 'phoneme' | 'word' } | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const shuffled = cards !== ORIGINAL

  const doShuffle = () => {
    setCards((prev) => shuffle(prev))
    setRound((r) => r + 1)
  }

  const doReset = () => {
    setCards(ORIGINAL)
    setRound(0)
  }

  const play = (c: Card, kind: 'phoneme' | 'word') => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const base = import.meta.env.BASE_URL
    const url =
      kind === 'phoneme' ? `${base}audio/phoneme/${c.id}.mp3` : `${base}audio/${c.id}.mp3`
    const audio = new Audio(url)
    audioRef.current = audio
    setPlaying({ id: c.id, kind })
    const clear = () => setPlaying((p) => (p && p.id === c.id && p.kind === kind ? null : p))
    audio.onended = clear
    audio.onerror = clear
    audio.play().catch(() => setPlaying(null))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="bg-gradient-to-r from-sky-600 via-emerald-500 to-rose-500 bg-clip-text text-4xl font-black tracking-wide text-transparent sm:text-5xl">
            英语国际音标 · 随机打乱
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            共 {ORIGINAL.length} 个音标 · 点击卡片听<strong className="text-foreground">音标发音</strong> ·
            点击下方例词听<strong className="text-foreground">单词发音</strong>
          </p>
        </header>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={doShuffle} className="gap-2 text-base">
            <Shuffle className="h-5 w-5" />
            随机打乱
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={doReset}
            disabled={!shuffled}
            className="gap-2 text-base"
          >
            <RotateCcw className="h-5 w-5" />
            还原顺序
          </Button>
          <div className="flex items-center gap-3 rounded-full border bg-white/70 px-4 py-1.5 text-sm">
            {(['vowel', 'diphthong', 'consonant'] as Group[]).map((g) => (
              <span key={g} className="flex items-center gap-1.5">
                <span className={`h-3 w-3 rounded-full border-2 ${GROUP_META[g].ring}`} />
                <span className={GROUP_META[g].color}>{GROUP_META[g].label}</span>
              </span>
            ))}
          </div>
        </div>

        {round > 0 && (
          <p className="mb-4 text-center text-xs text-muted-foreground">
            已打乱 {round} 次 · 边框颜色代表原属分组
          </p>
        )}

        {/* Card grid */}
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3 md:grid-cols-8">
          {cards.map((c) => {
            const isPlayingPhoneme = playing?.id === c.id && playing.kind === 'phoneme'
            const isPlayingWord = playing?.id === c.id && playing.kind === 'word'
            return (
              <div
                key={c.id}
                title={`${GROUP_META[c.group].label} [${c.sym}]`}
                className={`group flex aspect-square flex-col items-center justify-center rounded-xl border-2 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${GROUP_META[c.group].ring} ${
                  isPlayingPhoneme ? 'scale-95 ring-4 ring-amber-300' : ''
                }`}
              >
                <button
                  onClick={() => play(c, 'phoneme')}
                  title="点击听音标发音"
                  className="flex w-full flex-1 flex-col items-center justify-center gap-0.5"
                >
                  <span className="flex items-center gap-1 text-2xl font-bold tracking-tight text-red-600 sm:text-3xl">
                    [{c.sym}]
                    <Volume2
                      className={`h-4 w-4 transition-opacity ${
                        isPlayingPhoneme
                          ? 'text-amber-500 opacity-100'
                          : 'text-muted-foreground opacity-0 group-hover:opacity-100'
                      }`}
                    />
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {GROUP_META[c.group].label}
                  </span>
                </button>
                <button
                  onClick={() => play(c, 'word')}
                  title={`听例词发音：${c.word}`}
                  className={`flex w-full items-center justify-center gap-1 rounded-b-[10px] border-t py-1 text-[10px] leading-tight transition-colors ${
                    isPlayingWord
                      ? 'bg-amber-100 font-medium text-amber-700'
                      : 'bg-slate-50 text-muted-foreground hover:bg-slate-100'
                  }`}
                >
                  <Volume2 className={`h-3 w-3 ${isPlayingWord ? 'text-amber-500' : ''}`} />
                  {c.word}
                </button>
              </div>
            )
          })}
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground">
          音标发音提取自《国际音标表》软件 · 例词录音来源：Antimoon（英音）及有道词典 · 仅供个人学习使用
        </footer>
      </div>
    </div>
  )
}
