# Mood Detection for Movie Recommendation Systems
### Research Reference — Colors, Shapes, Images & Psychological Frameworks

---

## Table of Contents

1. [Core Dimensional Models](#1-core-dimensional-models)
2. [Color Psychology](#2-color-psychology)
3. [Shape Psychology](#3-shape-psychology)
4. [Image-Based Mood Detection](#4-image-based-mood-detection)
5. [Indirect & Projective Question Techniques](#5-indirect--projective-question-techniques)
6. [Validated Mood Measurement Instruments](#6-validated-mood-measurement-instruments)
7. [Mood → Genre Mapping](#7-mood--genre-mapping)
8. [Proposed UI Flow](#8-proposed-ui-flow)
9. [Key Design Principles](#9-key-design-principles)
10. [Sources](#10-sources)

---

## 1. Core Dimensional Models

### Russell's Circumplex Model of Affect (1980)
The foundational framework used across virtually all computational mood systems.
Positions every emotional state in two dimensions:

- **Valence axis**: Unpleasant ↔ Pleasant
- **Arousal axis**: Low/Calm ↔ High/Activated

**Quadrant → Genre mapping:**

| Quadrant | Mood State | Genre Fit |
|---|---|---|
| Positive + High Arousal | Excited, happy, energized | Action, Comedy, Musical, Adventure |
| Negative + High Arousal | Anxious, angry, stressed | Thriller, Horror, Crime |
| Negative + Low Arousal | Sad, fatigued, depressed | Heavy Drama, Tragedy |
| Positive + Low Arousal | Calm, content, relaxed | Romance, Slow Cinema, Docs |

> Reference: [PSU Open Textbook — Circumplex Model](https://psu.pb.unizin.org/psych425/chapter/circumplex-models/)

---

### Thayer's Mood Model
Simplification of Russell's model using more intuitive vocabulary. Two axes:

- **Energy**: Tired ↔ Energetic
- **Tension**: Calm ↔ Tense

| Quadrant | Label | State |
|---|---|---|
| Calm-Energy | Exuberance | Optimal, productive |
| Calm-Tiredness | Contentment | Relaxed, comfortable |
| Tense-Energy | Anxiety/Frantic | Stressed but driven |
| Tense-Tiredness | Depression | Depleted + distressed |

> More UI-friendly vocabulary than Russell. Asking "Are you more tired or energized? More calm or tense?" maps directly onto these quadrants.

---

### Plutchik's Wheel of Emotions (1980)
Eight primary emotions arranged in a circular diagram. Color intensity encodes emotion intensity.

| Color | Emotion (low → high intensity) |
|---|---|
| Red | Annoyance → Anger → Rage |
| Yellow | Serenity → Joy → Ecstasy |
| Blue | Apprehension → Fear → Terror |
| Green | Acceptance → Trust → Admiration |
| Pink/Purple | Distraction → Surprise → Amazement |

**Design use**: A gradient palette picker can encode this — darker, more saturated red = intense anger; light pink = mild irritation or love.

> Reference: [Six Seconds — Plutchik's Wheel](https://www.6seconds.org/2025/02/06/plutchik-wheel-emotions/)

---

## 2. Color Psychology

### Manchester Color Wheel (MCW)
The most clinically validated single-question color-mood instrument.
Developed by Carruthers & Morris, validated across 323 participants (healthy, anxious, depressed).

**Single question**: *"Which color best represents your current mood?"*

| Color Chosen | Mood Signal |
|---|---|
| Yellow | Normal/healthy mood (chosen by 39% of healthy subjects) |
| Grey | Anxious or depressed (chosen by 70–79% of those groups) |
| Blue | Most common "favourite" across all groups (needs disambiguation) |

> High test-retest reliability. Best for "first signal" in a UI.
> Reference: [PMC — MCW Validation](https://pmc.ncbi.nlm.nih.gov/articles/PMC2829580/)

---

### Luscher Color Test
Forced-choice ranking of 8 colors (blue, yellow, red, green, violet, brown, grey, black).
Premise: color preferences are subjective and reveal current psychological state.

- Blue first → calm, need for rest
- Grey first → emotional withdrawal, desire to isolate
- Red first → urgency, desire for action

> Lacks strong construct validity but directional signals are consistent with broader literature.

---

### Empirical Color-Emotion Mappings
Aggregated from a 132-study review (1895–2022, 42,266 participants across 64 countries):

| Color | Primary Emotion Associations |
|---|---|
| Red | Anger (73%), Love/Passion (68%), Danger |
| Yellow | Joy (61%), Optimism, Warmth |
| Blue | Relief, Calm, Sadness (context-dependent) |
| Pink | Pleasure (63%), Tenderness, Romance |
| Orange | Excitement, Energy, Fun |
| Green | Comfort, Trust, Relaxation |
| Grey | Sadness, Boredom, Neutrality |
| Black | Power, Grief, Sophistication |
| Purple | Mystery; Jealousy (varies by culture) |

> Reference: [Psychonomic Society — 128-year color review](https://featuredcontent.psychonomic.org/color-me-impressed-psychology-research-links-colors-and-emotions-for-over-a-century/)

---

### Hue vs. Saturation vs. Brightness
All three dimensions carry independent emotional weight (2017 PubMed study):

| Property | High | Low |
|---|---|---|
| Saturation | Higher arousal, urgency | Lower arousal, calm/negative |
| Brightness | More positive tone | More negative/serious tone |
| Hue (warm) | Stimulating | — |
| Hue (cool) | Calming | — |

> A muted red ≠ a vivid red. Desaturated blue ≠ vivid blue. Always consider all three dimensions.
> Reference: [PubMed — Color and emotion: hue, saturation, brightness](https://pubmed.ncbi.nlm.nih.gov/28612080/)

---

### Color Preference by Personality
- **Introverts** (high cortical arousal) → cool, desaturated colors (blue, green, grey) — already stimulated, seeking calm
- **Extroverts** (low cortical arousal) → warm, saturated colors (red, orange, yellow) — seeking external stimulation
- **Anxious individuals** → gravitate toward warm colors to express their state
- **Depressed individuals** → prefer grey, secondarily blue and purple

> Reference: [PMC — Personality and color preferences](https://pmc.ncbi.nlm.nih.gov/articles/PMC9806338/)

---

## 3. Shape Psychology

### Rounded vs. Angular: Core Finding
Multiple studies confirm shape angularity carries **negative affective valence** and roundness carries **positive affective valence**.

Evolutionary basis: angry faces have angular features (V-shaped brows), happy faces have rounded features (cheeks, mouth).

| Shape Type | Emotional Valence | Arousal |
|---|---|---|
| Circles, curves, ovals | Positive, safe, warm | Low–Medium |
| Squares, rectangles | Neutral-positive, stable, reliable | Low |
| Triangles (upward) | Ambition, tension, dynamic | Medium–High |
| Triangles (downward V) | Threat, danger, unpleasant | High (negative) |
| Sharp angles, spikes | Threat, discomfort, anxiety | High (negative) |
| Flowing, irregular curves | Freedom, organic, relaxed | Low |

> Reference: [PMC — Simple geometric shapes and affective value](https://pmc.ncbi.nlm.nih.gov/articles/PMC6097630/)

---

### Affective Priming via Shape
ERP (brainwave) studies confirm shapes prime emotional responses *before* conscious awareness:
- Rounded → P3 event-related potentials consistent with positive affect
- Angular → patterns consistent with threat vigilance

> Reference: [Frontiers in Psychology — Affective priming by shapes](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00917/full)

---

### Shape and Social/Self Identity
| Shape | Association |
|---|---|
| Circle | Self, close friends — openness, warmth, belonging |
| Square | Reliability, structure, close friends |
| Triangle/Angular | Strangers, the "other," power structures |

**Design use**: "Pick the set of shapes that feels most like you right now" can differentiate open/connected users (circle-choosers) from tense/isolated users (angular-choosers).

> Reference: [Current Psychology — The shape of you](https://link.springer.com/article/10.1007/s12144-021-02297-z)

---

## 4. Image-Based Mood Detection

### IAPS — International Affective Picture System
1,195 color photographs each rated on three dimensions (PAD model):
- **Valence**: unpleasant ↔ pleasant
- **Arousal**: calm ↔ excited
- **Dominance**: controlled ↔ in control

**How to use for mood detection**: Show a set of images and ask which the user is "drawn to" or which "feels right." Average the valence/arousal scores of chosen images to get a circumplex position.

- High-arousal/negative-valence selections → anxious or angry state
- Low-arousal/positive-valence selections → calm or content state

> Reference: [Wikipedia — IAPS](https://en.wikipedia.org/wiki/International_Affective_Picture_System)

---

### OASIS — Open Affective Standardized Image Set
Publicly available, crowd-rated alternative to IAPS with similar normative valence/arousal data.
Free to use for research and application development.

> Reference: [Springer — OASIS](https://link.springer.com/article/10.3758/s13428-016-0715-3)

---

### Abstract Art & Low-Level Image Features
Color, texture, composition, and edge density in abstract images reliably predict emotion category:

| Visual Property | Emotion Evoked |
|---|---|
| Dark, high-contrast, sharp edges | Anger, fear |
| Light, soft edges, warm hues | Joy, trust |
| Low saturation, muted tones, horizontal comp. | Sadness |
| Bright, multicolor, high texture | Excitement, anticipation |
| Smooth, flowing textures | Calm, positive |
| Jagged, rapidly-changing textures | Unease, stimulation |

> Reference: [ResearchGate — Emotional semantics of abstract art](https://www.researchgate.net/publication/221460828_Analyzing_Emotional_Semantics_of_Abstract_Art_Using_Low-Level_Image_Features)

---

## 5. Indirect & Projective Question Techniques

### Core Principle
Projective techniques present **ambiguous stimuli** and ask the subject to respond freely, bypassing conscious self-censorship.

> When people describe something outside themselves (a painting, an animal, a landscape), they unconsciously project their actual internal state.

**Five technique categories:**

| Category | Method |
|---|---|
| Associative | Show a stimulus, ask for first word/feeling that comes to mind |
| Construction | Ask user to "build" or "choose" an image collage |
| Completion | "Right now my energy feels like a ___" |
| Choice/Ordering | Rank images, colors, or scenes |
| Expressive | Choose the abstract image that "feels most like you" |

---

### Weather Metaphor (Clinically Validated)
*"If your mood right now were a weather pattern, what would it be?"*

Removes social desirability bias. Maps intuitively to arousal (storm vs. clear sky) and valence (sunny vs. grey).

| Weather | Mood | Film Fit |
|---|---|---|
| Thunderstorm | Intense, turbulent (high arousal, negative) | Thriller, intense drama |
| Overcast/drizzle | Low, subdued (low arousal, negative) | Quiet drama, introspective |
| Bright sunny | Happy, energized (high arousal, positive) | Comedy, adventure |
| Golden afternoon | Warm, content (low-medium arousal, positive) | Romance, feel-good |
| Foggy | Uncertain, mysterious | Mystery, slow-burn thriller |
| Snowy/still | Peaceful, isolated | Art house, meditative |

> Reference: [Creativity in Therapy — Emotions as weather](https://creativityintherapy.com/2018/05/emotions-as-weather/)

---

### Scene/Landscape Preference
Show a 3×3 grid of landscape images spanning the valence-arousal quadrants.
Ask which the user is most drawn to *right now*.

Each image is pre-scored for valence and arousal → placement in circumplex.
High face validity. Low cognitive effort.

**ZMET-adjacent**: The Zaltman Metaphor Elicitation Technique uses images people bring or select to surface deep emotional associations — this is a simplified version.

---

### Forced-Choice Visual Pairs
Sequential binary A/B image choices (4–6 rounds).
Each pair is designed to differentiate along **one circumplex axis**:
- Round 1–3: High vs. Low arousal
- Round 4–6: Positive vs. Negative valence

Rapid narrowing of circumplex position. Low cognitive fatigue.

---

### Animal Metaphor
*"What animal do you feel most like today?"*

| Animal Type | Mood Signal |
|---|---|
| Predator (wolf, eagle) | Assertive, dominant, possibly aggressive |
| Prey (rabbit, deer) | Anxious, vulnerable |
| Social (dog, dolphin) | Open, connected |
| Solitary (cat, bear) | Withdrawn, self-contained |

---

### Indirect Verbal Questions

| Question | What It Measures |
|---|---|
| "If today were a color, what would it be?" | Valence + arousal |
| "What's the texture of your mood — smooth, rough, spiky, soft?" | Arousal + tension |
| "What time of day does your energy feel like right now?" | Arousal level (morning = high, midnight = low) |
| "What speed is your mind moving — slow, medium, or fast?" | Arousal level |
| "Are you more like a quiet room or a busy street right now?" | Arousal + social openness |
| "What kind of light are you in — bright, dim, warm, or cold?" | Valence + saturation analogue |

---

## 6. Validated Mood Measurement Instruments

### PANAS — Positive and Negative Affect Schedule
Gold standard research tool. 20 adjectives rated 1–5.

**Positive Affect items**: Interested, Excited, Strong, Enthusiastic, Proud, Alert, Inspired, Determined, Attentive, Active
**Negative Affect items**: Distressed, Upset, Guilty, Scared, Hostile, Irritable, Ashamed, Nervous, Jittery, Afraid

Internal consistency (Cronbach's alpha): 0.86–0.90.

> Too long for direct UX use, but word cards displayed as image/icon grids work well as a visual adaptation.
> Reference: [Positive Psychology — PANAS](https://positivepsychology.com/positive-and-negative-affect-schedule-panas/)

---

### Self-Assessment Manikin (SAM)
Non-verbal, pictorial tool. Cartoon figures representing three PAD dimensions on a 9-point scale:
- **Pleasure**: frowning → broadly smiling figure
- **Arousal**: relaxed/sleeping → excited/wide-eyed figure
- **Dominance**: small dominated figure → large powerful figure

Only 3 judgments vs. 18. High correlation with verbal measures. Excellent for UX.

> Reference: [Wikipedia — SAM](https://en.wikipedia.org/wiki/Self-Assessment_Manikin)

---

### Affect Grid (Russell, 1989)
Single-item mood measure. A 9×9 grid where:
- X-axis: Unpleasant ↔ Pleasant
- Y-axis: Low arousal ↔ High arousal

User places a single mark. Takes under 5 seconds. Yields both valence and arousal in one gesture.

**Ideal as a touch/drag UI element** — user drags a point to indicate mood, implicitly mapping to circumplex quadrant.

> Reference: [PubMed — Affect Grid](https://pubmed.ncbi.nlm.nih.gov/7962581/)

---

### Manchester Color Wheel (MCW)
See [Section 2](#2-color-psychology). Single color tap. Best for fast first signal.

---

## 7. Mood → Genre Mapping

### Ekman's 6 Basic Emotions → Genre

| Mood State | Primary Genre | Secondary Genres |
|---|---|---|
| Joy / Elation | Comedy, Musical, Animation, RomCom | Adventure |
| Sadness / Grief | Drama, Tearjerker, Biographical | Quiet Romance |
| Anger / Frustration | Action, Crime, Revenge Thriller | Dark Comedy |
| Fear / Anxiety | Horror, Psychological Thriller | Suspense Drama |
| Disgust / Revulsion | Dark Comedy, Social Satire | Horror |
| Surprise / Anticipation | Mystery, Sci-Fi, Plot-Twist Thrillers | Fantasy |

---

### Genre Emotional Profiles (Research-Backed)

| Genre | Dominant Emotion |
|---|---|
| Musical, Animation | Highest joy ratings |
| Crime, Action, Western | Highest anger/physical arousal |
| Drama, Biographical | Highest sadness |
| Horror, Thriller | Highest fear + anxiety (also highest arousal overall) |

> Reference: [Stephen Follows — Emotional blueprint of genres](https://stephenfollows.com/p/understanding-movie-genres-emotions)

---

### Film Tone Tags (Circumplex-Adjacent)
Tag films internally with emotional descriptors to use as a final filter pass:

`warm` · `intense` · `melancholic` · `buoyant` · `unsettling` · `serene` · `playful` · `bleak` · `tender` · `propulsive`

---

### Mood-Matching vs. Mood-Countering
Users are roughly split between wanting films that:
- **Match** their mood — catharsis, validation (sad user → sad film)
- **Counter** their mood — escape (sad user → uplifting comedy)
- **Explore adjacent** emotions — intellectually curious regardless of state

> This must be captured as a **separate meta-preference question**, not inferred from mood alone.
> Suggested UI: single toggle — *"Lean into how I feel"* vs. *"Take me somewhere else"*

---

## 8. Proposed UI Flow

```
Step 1: Color tap          (2–3 sec)
  → Manchester Color Wheel or palette grid
  → Rough valence/arousal signal

Step 2: Image grid          (5–8 sec)
  → 2×4 OASIS-rated images across all four quadrants
  → User picks 1–2 that "feel right"
  → Average pre-scored valence/arousal values → circumplex position

Step 3: Metaphor question   (3–5 sec)
  → Weather, texture, or landscape forced choice
  → Disambiguates boundary cases
    (e.g., "is that blue calm or sad?")

Step 4: Meta-preference     (1 tap, optional)
  → "Lean into how I feel" vs. "Take me somewhere else"
  → Captures match/counter split

Result: 3–5 film recommendations
  → With emotional framing labels
  → e.g., "For when you're running on empty but need warmth"
```

**Total time target: under 30 seconds.**
Beyond 30 seconds, users shift from intuitive/projective responses to rational calculation, degrading signal quality.

---

## 9. Key Design Principles

1. **Never ask "how do you feel?" directly.**
   Projective/indirect stimuli outperform direct self-report for transient mood states. Social desirability bias and alexithymia both reduce accuracy.

2. **Saturation and brightness matter as much as hue.**
   A muted red ≠ a vivid red. Always consider all three color dimensions.

3. **Always offer a counter-mood path.**
   A significant portion of users want escape, not validation. Ignoring this tanks satisfaction.

4. **Use rounded UI shapes.**
   Angular interfaces prime threat vigilance, contradicting the open/projective mood detection goal.

5. **Pre-rate images with OASIS normative data.**
   So choices map automatically to circumplex coordinates without inference guesswork.

6. **Mood and meta-preference are separate signals.**
   Mood says *where* the user is. Meta-preference says *which direction* they want to go.

7. **For fuzzy/ambiguous states, use weighted blending.**
   A user 60% sad + 40% anxious gets a weighted blend of drama and thriller recommendations.

8. **Keep inference under 30 seconds.**
   Longer flows cause users to override intuitive responses with rational ones.

---

## 10. Sources

| Topic | Source |
|---|---|
| Luscher Color Test | [Wikipedia](https://en.wikipedia.org/wiki/L%C3%BCscher_color_test) |
| 128-year color-emotion review | [Psychonomic Society](https://featuredcontent.psychonomic.org/color-me-impressed-psychology-research-links-colors-and-emotions-for-over-a-century/) |
| Color, hue, saturation, brightness | [PubMed](https://pubmed.ncbi.nlm.nih.gov/28612080/) |
| Manchester Color Wheel | [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC2829580/) |
| MCW in secondary school | [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3567995/) |
| Plutchik's Wheel of Emotions | [Six Seconds](https://www.6seconds.org/2025/02/06/plutchik-wheel-emotions/) |
| Color and personality | [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9806338/) |
| Color, anxiety, depression | [EJGM](https://www.ejgm.co.uk/download/the-correlation-between-color-choices-and-impulsivityanxiety-and-depression-7344.pdf) |
| Geometric shapes + affective value | [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6097630/) |
| Affective priming by shapes | [Frontiers in Psychology](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00917/full) |
| Shape and personal identity | [Current Psychology](https://link.springer.com/article/10.1007/s12144-021-02297-z) |
| Russell's Circumplex Model | [PSU Open Textbook](https://psu.pb.unizin.org/psych425/chapter/circumplex-models/) |
| Thayer's mood model | [ResearchGate](https://www.researchgate.net/figure/Thayers-model-The-Thayers-model-is-proposed-by-Robert-E-Thayer-In-the-model_fig2_330817411) |
| IAPS | [Wikipedia](https://en.wikipedia.org/wiki/International_Affective_Picture_System) |
| OASIS image set | [Springer](https://link.springer.com/article/10.3758/s13428-016-0715-3) |
| Abstract art emotional semantics | [ResearchGate](https://www.researchgate.net/publication/221460828_Analyzing_Emotional_Semantics_of_Abstract_Art_Using_Low-Level_Image_Features) |
| Dynamic textures + emotion | [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3485791/) |
| PANAS | [Positive Psychology](https://positivepsychology.com/positive-and-negative-affect-schedule-panas/) |
| Self-Assessment Manikin | [Wikipedia](https://en.wikipedia.org/wiki/Self-Assessment_Manikin) |
| Affect Grid | [PubMed](https://pubmed.ncbi.nlm.nih.gov/7962581/) |
| Emotion-based movie recommendation | [SpringerLink](https://link.springer.com/chapter/10.1007/978-981-97-5231-7_20) |
| Scoping review: mood + movie recommendation | [Wiley](https://onlinelibrary.wiley.com/doi/10.1155/2022/7831013) |
| Genre emotional profiles | [Stephen Follows](https://stephenfollows.com/p/understanding-movie-genres-emotions) |
| Fuzzy emotion recommendation | [Springer](https://link.springer.com/article/10.1007/s41870-020-00431-x) |
| Projective techniques in UX | [Seissmo](https://seissmo.com/exploratory-research/projective-techniques-and-provocative-questions-in-qualitative-research/) |
| Weather metaphor for emotions | [Creativity in Therapy](https://creativityintherapy.com/2018/05/emotions-as-weather/) |
