'use client'

import { useState } from 'react'

// ── All images used in the quiz ─────────────────────────────────────────────
// Main selector: 15 images shown in the mood grid
// Question-only: 12 images shown inside projective question options

type ImageSlot = {
  file: string
  label: string
  description: string
  query: string
  section: string
}

const IMAGE_SLOTS: ImageSlot[] = [
  // ── Main selector ──────────────────────────────────────────────────────────
  { file: 'crashing-waves-sunlit.jpg',  label: 'all force and light',               description: 'Ocean waves crashing against rocks in bright sunlight — dramatic spray',      query: 'waves,crashing,rocks,sunlight,ocean,spray,dramatic',    section: 'Main: High arousal + positive' },
  { file: 'bustling-market-color.jpg',  label: 'every color, every voice at once',  description: 'Vibrant bustling market with colorful stalls and crowd energy',               query: 'vibrant,colorful,market,bazaar,crowd',                   section: 'Main: High arousal + positive' },
  { file: 'ink-drop-water.jpg',         label: 'something spreading outward',       description: 'Ink bloom expanding in clear water — macro, dark, abstract',                  query: 'ink,drop,water,macro,bloom,expand,dark,abstract',        section: 'Main: High arousal + positive' },
  { file: 'golden-hour-fields.jpg',     label: 'golden light over open fields',     description: 'Golden hour light over open wheat fields at sunset — warm, no people',       query: 'golden,hour,wheat,fields,sunset,warm',                   section: 'Main: Low arousal + positive' },
  { file: 'cozy-cabin-firelight.jpg',   label: 'firelight and nowhere to be',       description: 'Warm firelight in a cozy cabin interior — no faces, intimate, safe',         query: 'cozy,cabin,fireplace,warm,interior,winter',              section: 'Main: Low arousal + positive' },
  { file: 'sunlight-forest-rays.jpg',   label: 'light finding a way through',       description: 'Sunlight rays fracturing through a forest canopy — green, god rays',         query: 'sunlight,rays,forest,canopy,beams,green',                section: 'Main: Low arousal + positive' },
  { file: 'underwater-soft-light.jpg',  label: 'weightless, drifting',              description: 'Soft underwater light filtering through calm water — peaceful, no people',   query: 'underwater,light,rays,ocean,peaceful',                   section: 'Main: Low arousal + positive' },
  { file: 'neon-arcade-night.jpg',      label: 'neon lights and late-night energy', description: 'Neon-lit arcade or street at night — retro, electric, no faces',             query: 'neon,arcade,night,lights,retro',                         section: 'Main: High arousal + negative' },
  { file: 'rainy-city-neon.jpg',        label: 'rain on glass at midnight',         description: 'Rain on a window reflecting neon city lights at night — moody, blurred',     query: 'rain,window,neon,city,night,reflections',                section: 'Main: High arousal + negative' },
  { file: 'cracked-earth-aerial.jpg',   label: 'surface giving way',                description: 'Cracked dry earth seen from directly above — drought, abstract texture',     query: 'cracked,dry,earth,aerial,overhead,drought,texture',      section: 'Main: High arousal + negative' },
  { file: 'misty-mountains-fog.jpg',    label: 'mountains disappearing into fog',   description: 'Mountains dissolving into dense morning fog — moody, no people',             query: 'misty,mountain,fog,moody,landscape',                     section: 'Main: Low arousal + negative' },
  { file: 'empty-rooftop-dusk.jpg',     label: 'the city below, the sky above',     description: 'Empty rooftop at dusk with city skyline — alone, twilight, no people',      query: 'empty,rooftop,urban,dusk,twilight,city',                 section: 'Main: Low arousal + negative' },
  { file: 'deep-ocean-dark.jpg',        label: 'something vast below the surface',  description: 'Dark deep ocean with faint light source — mysterious, no creatures/people',  query: 'deep,ocean,dark,water,mysterious,abyss',                 section: 'Main: Low arousal + negative' },
  { file: 'bare-winter-trees-fog.jpg',  label: 'nothing left on the branches',      description: 'Bare winter trees dissolving into grey fog — silent, empty, no people',     query: 'bare,winter,trees,fog,grey,empty,forest,silent',         section: 'Main: Low arousal + negative' },
  { file: 'stark-white-desert.jpg',     label: 'silence and salt flats',            description: 'Vast white salt flats under overcast sky — stark, empty, minimal',          query: 'white,salt,flats,desert,empty,silence',                  section: 'Main: Low arousal + negative' },

  // ── Weather question ───────────────────────────────────────────────────────
  { file: 'q-storm-lightning.jpg',  label: 'Thunderstorm at 3am',              description: 'Lightning bolt splitting a dark dramatic night sky — no landscape focus',    query: 'lightning,bolt,dark,dramatic,sky,storm,night',            section: 'Question: Weather' },
  { file: 'q-quiet-snowfall.jpg',   label: 'First snow of the year',           description: 'Snow falling softly on a quiet path or trees — blue-grey light, no people', query: 'quiet,snowfall,path,winter,soft,blue,grey',               section: 'Question: Weather' },
  { file: 'q-golden-fog.jpg',       label: 'Golden morning fog',               description: 'Golden fog drifting through trees at early dawn — warm amber tones',        query: 'golden,morning,fog,trees,dawn,soft,light,warm',           section: 'Question: Weather' },
  { file: 'q-heat-haze.jpg',        label: 'A heatwave that never breaks',     description: 'Heat shimmer distorting a long empty road or landscape — no people',       query: 'heat,haze,shimmer,road,summer,relentless,desert',         section: 'Question: Weather' },

  // ── Animal question ────────────────────────────────────────────────────────
  { file: 'q-wolf-treeline.jpg',    label: 'A wolf alone at the edge of the woods', description: 'Wolf silhouette or portrait at the edge of a dark forest — alone, wild', query: 'wolf,silhouette,treeline,forest,edge,dusk,watching',      section: 'Question: Animal' },
  { file: 'q-cat-sunbeam.jpg',      label: 'A cat in a sun-warmed window',     description: 'Cat curled up in a warm pool of window sunlight — cozy, no people',        query: 'cat,curled,window,sunbeam,warm,cozy,sleeping',            section: 'Question: Animal' },
  { file: 'q-hummingbird.jpg',      label: 'A hummingbird between flowers',    description: 'Hummingbird frozen mid-flight hovering near flowers — motion blur, close',  query: 'hummingbird,hovering,flower,motion,blur,close',           section: 'Question: Animal' },
  { file: 'q-deep-sea.jpg',         label: 'Something slow in the deep ocean', description: 'Bioluminescent creature drifting in pitch-black deep ocean — no faces',    query: 'jellyfish,bioluminescent,dark,ocean,abyss,glow',          section: 'Question: Animal' },

  // ── Texture question ───────────────────────────────────────────────────────
  { file: 'q-broken-glass.jpg',     label: 'Broken glass (sharp, unexpected)', description: 'Fractured glass with sharp irregular shard edges — macro, abstract',        query: 'broken,shattered,glass,fracture,pattern,sharp,macro',    section: 'Question: Texture' },
  { file: 'q-worn-wool.jpg',        label: 'Old wool (rough but familiar)',    description: 'Close-up of soft worn wool textile — warm earthy tones, no people',         query: 'worn,wool,textile,close-up,fabric,texture,warm',          section: 'Question: Texture' },
  { file: 'q-still-water.jpg',      label: 'Still water (smooth, reflective)', description: 'Mirror-flat still pond or lake surface reflecting the sky — perfectly calm', query: 'still,water,mirror,surface,pond,reflection,flat,calm',   section: 'Question: Texture' },
  { file: 'q-static-electric.jpg',  label: 'Static electricity (crackling)',   description: 'Plasma ball or static electricity — abstract crackling energy, purple/blue', query: 'plasma,ball,static,electricity,abstract,crackling,energy', section: 'Question: Texture' },
]

type SlotState = {
  candidates: string[]
  loading: boolean
  selected: string | null
  saved: boolean
  skipped: boolean
  pasting: boolean
  pasteError: string | null
}

const initSlot = (): SlotState => ({ candidates: [], loading: false, selected: null, saved: false, skipped: false, pasting: false, pasteError: null })

export default function ImagePickerPage() {
  const [cacheBust] = useState(() => Date.now())
  const [slots, setSlots] = useState<Record<string, SlotState>>(() =>
    Object.fromEntries(IMAGE_SLOTS.map((s) => [s.file, initSlot()]))
  )

  const fetchCandidates = async (file: string, query: string) => {
    setSlots((prev) => ({ ...prev, [file]: { ...prev[file], loading: true, candidates: [], selected: null } }))
    try {
      const res = await fetch(`/api/admin/fetch-candidates?file=${encodeURIComponent(file)}&query=${encodeURIComponent(query)}`)
      const data = await res.json()
      setSlots((prev) => ({ ...prev, [file]: { ...prev[file], candidates: data.candidates ?? [], loading: false } }))
    } catch {
      setSlots((prev) => ({ ...prev, [file]: { ...prev[file], loading: false } }))
    }
  }

  const handleSave = async (file: string) => {
    const candidatePath = slots[file].selected
    if (!candidatePath) return
    await fetch('/api/admin/select-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, candidatePath }),
    })
    setSlots((prev) => ({ ...prev, [file]: { ...prev[file], saved: true } }))
  }

  const handlePaste = async (file: string, e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items)
    const imageItem = items.find((item) => item.type.startsWith('image/'))
    if (!imageItem) return

    const blob = imageItem.getAsFile()
    if (!blob) return

    setSlots((prev) => ({ ...prev, [file]: { ...prev[file], pasting: true, pasteError: null } }))

    const form = new FormData()
    form.append('file', file)
    form.append('image', blob, file)

    try {
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: form })
      if (!res.ok) throw new Error('Upload failed')
      setSlots((prev) => ({ ...prev, [file]: { ...prev[file], pasting: false, saved: true } }))
    } catch {
      setSlots((prev) => ({ ...prev, [file]: { ...prev[file], pasting: false, pasteError: 'Upload failed' } }))
    }
  }

  // Group slots by section
  const sections = Array.from(new Set(IMAGE_SLOTS.map((s) => s.section)))

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', padding: '40px 32px', fontFamily: 'Inter, sans-serif', color: '#F0EDE6' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 6, color: '#C9A84C' }}>Quiz Image Picker</h1>
      <p style={{ color: '#9A9590', marginBottom: 48, fontSize: '0.85rem', maxWidth: 600 }}>
        All 27 quiz images. Click <strong style={{ color: '#F0EDE6' }}>Load 4 options</strong> to fetch candidates, click one to select it, then <strong style={{ color: '#F0EDE6' }}>Save</strong>. Skip any you want to swap yourself.
      </p>

      {sections.map((section) => (
        <div key={section} style={{ marginBottom: 64 }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9A9590', borderBottom: '1px solid #1C1C1C', paddingBottom: 10, marginBottom: 32 }}>
            {section}
          </h2>

          {IMAGE_SLOTS.filter((s) => s.section === section).map((slot) => {
            const state = slots[slot.file]
            return (
              <div key={slot.file} style={{ marginBottom: 40, display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* Current image */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: '0.65rem', color: '#9A9590', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/quiz-images/${slot.file}?t=${cacheBust}`}
                    alt="current"
                    style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #2a2a2a', display: 'block' }}
                  />
                </div>

                {/* Controls + candidates */}
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{slot.label}</span>
                      <span style={{ fontSize: '0.7rem', color: '#9A9590', fontFamily: 'monospace' }}>{slot.file}</span>
                      {state.saved && <span style={{ fontSize: '0.7rem', color: '#4CAF50', fontWeight: 600 }}>✓ Saved</span>}
                      {state.skipped && <span style={{ fontSize: '0.7rem', color: '#555' }}>Skipped</span>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9A9590', marginTop: 3, fontStyle: 'italic' }}>{slot.description}</div>
                  </div>

                  {/* Paste zone — always visible unless skipped */}
                  {!state.skipped && (
                    <div
                      tabIndex={0}
                      onPaste={(e) => handlePaste(slot.file, e)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 6, marginBottom: 10,
                        border: '1px dashed #3a3a3a', color: '#9A9590', fontSize: '0.8rem',
                        cursor: 'text', outline: 'none', userSelect: 'none',
                        transition: 'border-color 0.15s, color 0.15s',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.color = '#F0EDE6' }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = '#9A9590' }}
                    >
                      {state.pasting ? 'Saving…' : state.pasteError ? `Error: ${state.pasteError}` : 'Click here, then paste an image (⌘V)'}
                    </div>
                  )}

                  {state.skipped ? (
                    <button onClick={() => setSlots((p) => ({ ...p, [slot.file]: { ...p[slot.file], skipped: false } }))} style={ghost}>
                      Undo skip
                    </button>
                  ) : state.loading ? (
                    <span style={{ fontSize: '0.8rem', color: '#9A9590' }}>Fetching candidates…</span>
                  ) : state.candidates.length > 0 ? (
                    <div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                        {state.candidates.map((c, i) =>
                          c ? (
                            <div key={i} onClick={() => setSlots((p) => ({ ...p, [slot.file]: { ...p[slot.file], selected: c } }))} style={{ cursor: 'pointer' }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={c}
                                alt={`option ${i + 1}`}
                                style={{
                                  width: 160, height: 106, objectFit: 'cover', borderRadius: 5, display: 'block',
                                  border: state.selected === c ? '3px solid #C9A84C' : '3px solid transparent',
                                  transition: 'border-color 0.12s',
                                }}
                              />
                              <div style={{ fontSize: '0.65rem', color: state.selected === c ? '#C9A84C' : '#555', textAlign: 'center', marginTop: 3 }}>
                                {state.selected === c ? '● selected' : `${i + 1}`}
                              </div>
                            </div>
                          ) : (
                            <div key={i} style={{ width: 160, height: 106, background: '#141414', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#555' }}>
                              failed
                            </div>
                          )
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleSave(slot.file)} disabled={!state.selected} style={state.selected ? primary : primaryDisabled}>
                          Save selected
                        </button>
                        <button onClick={() => fetchCandidates(slot.file, slot.query)} style={ghost}>Reload</button>
                        <button onClick={() => setSlots((p) => ({ ...p, [slot.file]: { ...p[slot.file], skipped: true } }))} style={ghost}>I'll do this myself</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => fetchCandidates(slot.file, slot.query)} style={primary}>Load 4 options</button>
                      <button onClick={() => setSlots((p) => ({ ...p, [slot.file]: { ...p[slot.file], skipped: true } }))} style={ghost}>I'll do this myself</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

const base: React.CSSProperties = { padding: '7px 16px', borderRadius: 6, fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', border: 'none' }
const primary: React.CSSProperties = { ...base, background: '#C9A84C', color: '#0A0A0A' }
const primaryDisabled: React.CSSProperties = { ...base, background: '#C9A84C', color: '#0A0A0A', opacity: 0.35, cursor: 'not-allowed' }
const ghost: React.CSSProperties = { ...base, background: 'transparent', color: '#9A9590', border: '1px solid #2a2a2a' }
