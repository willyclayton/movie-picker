# Quiz Images

Add JPG files here (approx 800px wide). All 27 images degrade gracefully if absent — missing images show a dark card with caption text.

There are two categories:

- **Main selector** (15 images) — shown in the `StepImageSelector` grid
- **Question-only** (12 images) — used as visual options inside projective questions; not shown in the main grid

---

## Main selector images (15)

Shown in the image selector step. 5 cols × 3 rows on desktop, 2-column on mobile.

| Filename | Caption | Valence | Arousal |
|---|---|---|---|
| `crashing-waves-sunlit.jpg` | all force and light | +0.7 | +0.9 |
| `bustling-market-color.jpg` | every color, every voice at once | +0.6 | +0.7 |
| `ink-drop-water.jpg` | something spreading outward | +0.4 | +0.6 |
| `golden-hour-fields.jpg` | golden light over open fields | +0.8 | +0.1 |
| `cozy-cabin-firelight.jpg` | firelight and nowhere to be | +0.7 | -0.3 |
| `sunlight-forest-rays.jpg` | light finding a way through | +0.5 | +0.4 |
| `underwater-soft-light.jpg` | weightless, drifting | +0.3 | -0.5 |
| `neon-arcade-night.jpg` | neon lights and late-night energy | +0.2 | +0.8 |
| `rainy-city-neon.jpg` | rain on glass at midnight | -0.3 | +0.4 |
| `cracked-earth-aerial.jpg` | surface giving way | -0.3 | +0.5 |
| `misty-mountains-fog.jpg` | mountains disappearing into fog | +0.1 | -0.4 |
| `empty-rooftop-dusk.jpg` | the city below, the sky above | -0.1 | -0.2 |
| `deep-ocean-dark.jpg` | something vast below the surface | -0.4 | +0.2 |
| `bare-winter-trees-fog.jpg` | nothing left on the branches | -0.3 | -0.5 |
| `stark-white-desert.jpg` | silence and salt flats | -0.5 | -0.6 |

---

## Question-only images (12)

Used as option images inside projective questions. Not shown in the main selector grid.

### Weather question

| Filename | Option | Valence | Arousal |
|---|---|---|---|
| `q-storm-lightning.jpg` | Thunderstorm at 3am | -0.5 | +0.8 |
| `q-quiet-snowfall.jpg` | First snow of the year | +0.1 | -0.4 |
| `q-golden-fog.jpg` | Golden morning fog | +0.2 | -0.5 |
| `q-heat-haze.jpg` | A heatwave that never breaks | -0.3 | +0.5 |

### Animal question

| Filename | Option | Valence | Arousal |
|---|---|---|---|
| `q-wolf-treeline.jpg` | A wolf alone at the edge of the woods | -0.2 | +0.3 |
| `q-cat-sunbeam.jpg` | A cat in a sun-warmed window | +0.6 | -0.5 |
| `q-hummingbird.jpg` | A hummingbird between flowers | +0.5 | +0.7 |
| `q-deep-sea.jpg` | Something slow in the deep ocean | -0.4 | -0.6 |

### Texture question

| Filename | Option | Valence | Arousal |
|---|---|---|---|
| `q-broken-glass.jpg` | Broken glass | -0.6 | +0.7 |
| `q-worn-wool.jpg` | Old wool | +0.2 | -0.3 |
| `q-still-water.jpg` | Still water | +0.1 | -0.7 |
| `q-static-electric.jpg` | Static electricity | -0.1 | +0.8 |

---

Unsplash search queries for sourcing each image are in `src/data/images.ts`.
