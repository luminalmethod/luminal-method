import { useState, useRef } from "react";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  black:      "#f4ecdc",   // parchment — main background
  offblack:   "#ebe0c9",   // parchment-warm — card background
  card:       "#e0d2b6",   // parchment-deep — inset card
  charcoal:   "#e0d2b6",
  mid:        "#6a5e4a",   // ink-mute
  faint:      "#6a5e4a",   // ink-mute
  ghost:      "#4a4032",   // ink-soft
  rule:       "rgba(42,36,25,0.15)",
  parchment:  "#2a2419",   // ink — main text
  maroon:     "#b8553a",   // terracotta
  maroonSoft: "#d4876a",   // terracotta-soft
  burnt:      "#8b4332",   // rust
  gold:       "#8a6c20",   // gold-deep
  goldSoft:   "#b8923a",   // gold
  forest:     "#1f3329",   // evergreen-deep
  forestSoft: "#2d4a3e",   // evergreen
  navy:       "#2d4a3e",   // evergreen (reuse for navy slots)
  navySoft:   "#7a8b6f",   // sage
};

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  body:    "'Libre Baskerville', Georgia, serif",
  mono:    "'JetBrains Mono', monospace",
};

// ─── ATOMS ────────────────────────────────────────────────────────────────────
function SpectrumBar({ height = "3px", style }) {
  return (
    <div style={{
      height,
      background: `linear-gradient(to right, ${C.maroon}, ${C.burnt}, ${C.gold}, ${C.forest}, ${C.navy})`,
      ...style,
    }} />
  );
}

function Label({ children, color, style }) {
  return (
    <div style={{
      fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.2em",
      textTransform: "uppercase", color: color || C.faint,
      marginBottom: "6px", ...style,
    }}>{children}</div>
  );
}

function Rule({ style }) {
  return <div style={{ height: "1px", background: C.rule, ...style }} />;
}

function Card({ children, accent, style }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.rule}`,
      borderLeft: accent ? `3px solid ${accent}` : `1px solid ${C.rule}`,
      borderRadius: "2px", padding: "20px 24px", marginBottom: "14px",
      ...style,
    }}>{children}</div>
  );
}

function CoachNote({ children }) {
  return (
    <div style={{
      background: "rgba(160,120,32,0.10)", border: `1px solid ${C.gold}`,
      borderLeft: `3px solid ${C.gold}`, borderRadius: "2px",
      padding: "16px 20px", marginTop: "14px",
    }}>
      <Label color={C.goldSoft} style={{ marginBottom: "8px" }}>Coach Note</Label>
      <p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{children}</p>
    </div>
  );
}

function SectionHead({ number, title, accent }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      {number && <div style={{ fontFamily: F.mono, fontSize: "9px", color: C.mid, letterSpacing: "0.2em", marginBottom: "6px" }}>{number}</div>}
      <h2 style={{ fontFamily: F.display, fontSize: "26px", fontWeight: 600, color: C.parchment, margin: "0 0 10px", lineHeight: 1.1 }}>{title}</h2>
      <div style={{ width: "36px", height: "2px", background: accent || C.maroon }} />
    </div>
  );
}

// ─── PROMPTS ──────────────────────────────────────────────────────────────────

function buildTeaserPrompt({ name, date, time, location }) {
  return `You are a warm, precise, and deeply knowledgeable guide in natal astrology, Human Design (Ra Uru Hu's original system), and Gene Keys (Richard Rudd's original text). Your tone is like Evelyn Levenson's in "Becoming an Empowered Projector": warm, practical, relatable, grounded in lived experience. You help people feel seen and understood, not like they've stumbled into a cult. No motivational fluff. No vague spiritual language. Specific, behavioral, and real.

This is a TEASER reading for a website visitor. It should feel genuinely personal and make them feel seen — specific enough to be slightly unsettling in its accuracy — while leaving them wanting more. The goal is for them to understand just enough to feel compelled to book a full session.

Birth Data:
Full Name: ${name}
Date of Birth: ${date}
Time of Birth: ${time}
Birth Location: ${location}

Respond ONLY with valid JSON. No markdown. No backticks. Nothing outside the JSON object.

{
  "name": "string",

  "planets": [
    {
      "planet": "string (Sun, Moon, Rising, Mercury, Venus, Mars, Jupiter, Saturn, Chiron, North Node, South Node)",
      "sign": "string",
      "house": "number",
      "retrograde": "boolean",
      "hook": "string — complete this sentence naturally: 'Your [Planet] in [Sign], House [N] explains...' — 1-2 sentences max. Warm, specific, behavioral. What does this actually produce in this person's daily life, relationships, or inner experience? Not a definition — a mirror."
    }
  ],

  "humanDesign": {
    "type": "string",
    "profile": "string (e.g. 5/1)",
    "profileName": "string (e.g. Heretic/Investigator)",
    "authority": "string",
    "strategy": "string",
    "hook": "string — 3 sentences. Start with why they've been struggling (the friction they already feel in their life) before explaining what their type means. Make them recognize themselves immediately. Warm, practical, no jargon dump. Second person."
  },

  "geneKeys": {
    "lifeWork": {
      "number": "number",
      "name": "string",
      "shadow": "string (keyword)",
      "gift": "string (keyword)",
      "siddhi": "string (keyword)",
      "shadowExplained": "string — 1 sentence. What does this shadow look like in this person's actual daily behavior or emotional patterns? Not the keyword, the behavior.",
      "giftExplained": "string — 1 sentence. What becomes available when this shadow is recognized and worked with?",
      "siddhiExplained": "string — 1 sentence. What is the siddhi pointing toward, without making it sound like a goal to achieve?"
    },
    "evolution": {
      "number": "number",
      "name": "string",
      "shadow": "string",
      "gift": "string",
      "siddhi": "string"
    },
    "radiance": {
      "number": "number",
      "name": "string",
      "shadow": "string",
      "gift": "string",
      "siddhi": "string"
    },
    "purpose": {
      "number": "number",
      "name": "string",
      "shadow": "string",
      "gift": "string",
      "siddhi": "string"
    }
  },

  "closingHook": "string — 2-3 sentences. Do not summarize what was already said. Instead, gesture toward what a full reading would reveal — the layers underneath this teaser. Make them feel that they've only seen the first page of something much longer about themselves. Warm, not salesy."
}`;
}

function buildClientPDFPrompt({ name, date, time, location }) {
  const today = new Date().toISOString().split("T")[0];
  return `You are a warm, precise, and deeply knowledgeable guide in Gene Keys (Richard Rudd's original text), Human Design (Ra Uru Hu's original system), natal astrology, and Chiron. Your tone follows Evelyn Levenson's approach in "Becoming an Empowered Projector": warm, practical, lived-experience-grounded, making complex systems feel immediately relevant and personally recognizable. Help people feel seen. No motivational fluff. No vague spiritual language. Specific, behavioral, real.

This is the CLIENT PDF — a full reading the client receives before their session with their practitioner. They will read this on their own first, then review it together in the session. The order matters: Gene Keys first (the core identity arc, shadow to siddhi), then Human Design (how to operationalize that arc with least friction), then Astrology (the familiar confirmation layer that makes everything click), then Chiron (the teaching wound, placed mid-document with context already built), then Current Sky (what's active right now). Second person throughout except where noted.

Today's date for transits: ${today}

Birth Data:
Full Name: ${name}
Date of Birth: ${date}
Time of Birth: ${time}
Birth Location: ${location}

Respond ONLY with valid JSON. No markdown. No backticks. Nothing outside the JSON.

{
  "name": "string",
  "birthData": { "date": "string", "time": "string", "location": "string" },

  "geneKeys": {
    "intro": "string — 2-3 sentences introducing Gene Keys to someone who may not know the system. What is the shadow-gift-siddhi arc? Why does it matter? Warm, not academic.",
    "activationSequence": [
      {
        "position": "Life's Work (Conscious Sun)",
        "number": "number",
        "name": "string",
        "shadow": "string",
        "gift": "string",
        "siddhi": "string",
        "shadowDeep": "string — 3-4 sentences. This is the frequency this person defaults to under pressure. Name what it looks like in actual behavior — the specific emotional pattern, the recurring situation, the thing they keep bumping into. Second person, warm but honest.",
        "giftDeep": "string — 3-4 sentences. What becomes available when the shadow is seen clearly rather than acted from. This is not a reward — it's a natural shift. What does life start to look and feel like? Specific and behavioral.",
        "siddhiNote": "string — 2 sentences. The siddhi is not a goal. It is what the gift becomes when fully lived. Point toward it without making it a destination."
      },
      {
        "position": "Evolution (Conscious Earth)",
        "number": "number",
        "name": "string",
        "shadow": "string",
        "gift": "string",
        "siddhi": "string",
        "shadowDeep": "string — 3 sentences on this shadow as a grounding challenge.",
        "giftDeep": "string — 3 sentences on the gift in the grounding position.",
        "siddhiNote": "string — 2 sentences."
      },
      {
        "position": "Radiance (Unconscious Sun)",
        "number": "number",
        "name": "string",
        "shadow": "string",
        "gift": "string",
        "siddhi": "string",
        "shadowDeep": "string — 3 sentences. This is what others see before the person sees it in themselves.",
        "giftDeep": "string — 3 sentences.",
        "siddhiNote": "string — 2 sentences."
      },
      {
        "position": "Purpose (Unconscious Earth)",
        "number": "number",
        "name": "string",
        "shadow": "string",
        "gift": "string",
        "siddhi": "string",
        "shadowDeep": "string — 3 sentences. Deepest layer, often the last recognized.",
        "giftDeep": "string — 3 sentences.",
        "siddhiNote": "string — 2 sentences."
      }
    ],
    "summary": "string — 3-4 sentences synthesizing the Gene Keys arc as a whole. What is the central movement across all four positions? What shadow pattern threads through multiple positions? What does this person's specific combination point toward?"
  },

  "humanDesign": {
    "type": "string",
    "authority": "string",
    "profile": "string",
    "profileName": "string",
    "strategy": "string",
    "signature": "string",
    "notSelf": "string",
    "definition": "string",
    "incarnationCross": "string",
    "definedCenters": ["array"],
    "undefinedCenters": ["array"],
    "intro": "string — 2-3 sentences introducing Human Design as the operational layer that explains how to live the Gene Keys arc with least friction. Connect it directly to what was just covered in Gene Keys.",
    "typeDeep": "string — 4 sentences. Start with the friction this person has likely already experienced — the specific ways living out of alignment with their type creates exhaustion, resentment, bitterness, or invisibility. Then explain what their aura actually does, mechanically. Then what strategy corrects for. Warm, practical, Evelyn-voiced.",
    "authorityDeep": "string — 3-4 sentences. How does this authority work in the body? What does a correct decision feel like vs an incorrect one? Give a real-life example scenario. Second person.",
    "profileDeep": "string — 3-4 sentences. Not keywords — what does this profile configuration set up as a life structure? What is the tension between the two lines, and what does living it well look like?",
    "openCentersDeep": "string — 3 sentences. What gets amplified and conditioned through the open centers? What pattern does that create?",
    "incarnationCrossDeep": "string — 3 sentences. What is this person here to do at the level of life direction? Mechanical and specific.",
    "channels": [
      {
        "channel": "string (e.g. 34-20)",
        "name": "string",
        "circuitry": "string",
        "interpretation": "string — 2-3 sentences on what this channel produces in this person specifically."
      }
    ],
    "summary": "string — 3-4 sentences synthesizing Human Design. What is the single most important structural fact of this design? What changes when they operate correctly?"
  },

  "astrology": {
    "intro": "string — 2 sentences. Frame astrology as the confirmation layer — the familiar map that makes the Gene Keys and HD picture click into place.",
    "sunSign": "string", "moonSign": "string", "risingSign": "string",
    "chartRuler": "string", "dominantElement": "string",
    "overview": "string — 3-4 sentences on the overall chart architecture. What do the Sun-Moon-Rising together produce as a triadic structure? Not three separate descriptions — what do they do together?",
    "planets": [
      {
        "planet": "string",
        "symbol": "string",
        "sign": "string",
        "house": "number",
        "degree": "number",
        "retrograde": "boolean",
        "aspects": "string",
        "interpretation": "string — 3 sentences. What does this placement actually produce in behavior, psychology, recurring patterns? Connect to HD or Gene Keys where relevant. Second person."
      }
    ],
    "angles": {
      "MC": { "sign": "string", "degree": "number", "interpretation": "string — 2 sentences." },
      "IC": { "sign": "string", "degree": "number", "interpretation": "string — 2 sentences." },
      "ASC": { "sign": "string", "degree": "number", "interpretation": "string — 2 sentences." },
      "DSC": { "sign": "string", "degree": "number", "interpretation": "string — 2 sentences." }
    },
    "keyAspects": "string — 2-3 sentences on the 2-3 most significant aspects and what they produce together.",
    "summary": "string — 3 sentences synthesizing the astrology. What does the chart confirm about what was already revealed in Gene Keys and HD?"
  },

  "chiron": {
    "sign": "string",
    "house": "number",
    "degree": "number",
    "aspects": "string",
    "intro": "string — 2 sentences framing Chiron before naming the wound. Chiron is not a flaw. It is the place where the deepest teaching lives.",
    "corePattern": "string — 3 sentences. What recurring pattern of sensitivity, inadequacy, or exile does this placement produce? Name the behavior specifically, not just the archetype. Second person.",
    "teachingCapacity": "string — 3 sentences. What this person is able to see in others with unusual clarity precisely because of this placement. What they are positioned to offer.",
    "navigationNote": "string — 2-3 sentences. What it looks like to stop bypassing this placement and start working with it. Practical and warm.",
    "summary": "string — 2 sentences synthesizing this Chiron placement."
  },

  "transits": {
    "currentDate": "string",
    "currentChapter": "string — 3-4 sentences synthesizing what this specific window of time is asking of this person. What the sky is collectively activating. Connect to their natal picture.",
    "planets": [
      {
        "transitingPlanet": "string",
        "transitingSign": "string",
        "natalContact": "string",
        "contactType": "string",
        "potency": "string (Defining / Active / Approaching / Separating)",
        "duration": "string",
        "whatIsActive": "string — 2-3 sentences. What this transit is doing. Specific to this chart.",
        "howToWorkWithIt": "string — 2 sentences. Practical guidance."
      }
    ],
    "comingUp": "string or null — any major transit in the next 3 months worth flagging."
  },

  "synthesis": {
    "centralTheme": "string — 1 sentence. The single most defining structural fact across all systems.",
    "convergences": "string — 4-5 sentences. Where Gene Keys, Human Design, astrology, and Chiron confirm each other. Name the specific placements.",
    "shadowPattern": "string — 3 sentences. The dominant shadow pattern across all systems in behavioral terms.",
    "designedFor": "string — 3-4 sentences. What this person is structurally built for.",
    "leveragePoint": "string — 3-4 sentences. The single most practical entry point that has the most downstream effect."
  }
}`;
}

function buildCoachAnnotationPrompt(pdfData) {
  return `You are a rigorous Human Design, Gene Keys, and astrology analyst. You have been given a full client reading in JSON format. Your job is to annotate it with a clinical coaching layer: add coachNote fields, flag technical details worth verifying, note likely resistance points, and add any missing technical precision (exact degrees, orbs, channel gate numbers, HD Variables note). Write all coach notes in third person. No motivational language. State what is mechanically true.

Here is the full reading JSON:
${JSON.stringify(pdfData, null, 2)}

Respond ONLY with valid JSON. No markdown. No backticks. Return the full reading with these additions:
- Add "chartShape", "dominantModality" to astrology if missing
- Add "housesOfNote" to astrology
- Add "coachNote" to astrology, humanDesign, geneKeys (top level), chiron, transits, and synthesis sections
- Add "variablesNote": "Variables/Arrows should be verified against Jovian Archive before session." to humanDesign
- Add "tensions" to synthesis: 3-4 sentences on internal paradoxes across systems
- For each planet in astrology.planets, ensure "degree" and "aspects" are present
- For each Gene Key in geneKeys.activationSequence, add "hexagramName" and "theme" fields
- For each channel in humanDesign.channels, add "gates" field with gate numbers
- Add "determination", "sense", "cognition", "motivation", "perspective", "environment" to humanDesign (mark as "Verify against Jovian Archive" if uncertain)
- Keep ALL existing content exactly as-is. Only add the new fields.`;
}

function buildCheatsheetPrompt({ name, date, time, location }) {
  return `You are generating a quick-reference cheatsheet for a coaching client. This will be saved as a photo on their phone. It must be immediately scannable, practical, and behavioral — not conceptual. Every item should be something they can check against their daily experience in under 10 seconds.

Birth Data:
Full Name: ${name}
Date of Birth: ${date}
Time of Birth: ${time}
Birth Location: ${location}

Respond ONLY with valid JSON. No markdown. No backticks. Nothing outside the JSON.

{
  "name": "string",

  "astrology": {
    "sun": "string (Sign + House)",
    "moon": "string (Sign + House)",
    "rising": "string (Sign)",
    "sunNote": "string — 1 sentence. What this placement means for how they show up and what they need to thrive.",
    "moonNote": "string — 1 sentence. What this placement means for emotional needs and what drains them.",
    "risingNote": "string — 1 sentence. How they come across and what first interactions feel like for them."
  },

  "humanDesign": {
    "type": "string",
    "strategy": "string",
    "authority": "string",
    "notSelf": "string",
    "strategyReminder": "string — 1 sentence, written as a daily instruction. E.g. 'Wait for a clear invitation before initiating major moves — your energy is most powerful when it's been recognized and called forward.'",
    "authorityReminder": "string — 1 sentence behavioral cue. E.g. 'When you feel pressured to decide quickly, that pressure is the signal to wait — correct decisions arrive with clarity, not urgency.'",
    "notSelfSignal": "string — complete this: 'If you are feeling [not-self theme], it is a signal that [what it means]. [What to do instead in one sentence].' Written as a first-person daily reminder.",
    "signatureSignal": "string — 1 sentence. What alignment feels like for this type. The positive signal."
  },

  "geneKeys": [
    {
      "position": "Life's Work",
      "number": "number",
      "name": "string",
      "shadow": "string",
      "gift": "string",
      "siddhi": "string",
      "dailyCue": "string — 1-2 sentences. 'When you notice [shadow behavior], you are operating from [shadow keyword]. The shift toward [gift keyword] looks like [specific behavioral alternative].'"
    },
    {
      "position": "Evolution",
      "number": "number",
      "name": "string",
      "shadow": "string",
      "gift": "string",
      "siddhi": "string",
      "dailyCue": "string — 1-2 sentences same format."
    },
    {
      "position": "Radiance",
      "number": "number",
      "name": "string",
      "shadow": "string",
      "gift": "string",
      "siddhi": "string",
      "dailyCue": "string — 1 sentence."
    },
    {
      "position": "Purpose",
      "number": "number",
      "name": "string",
      "shadow": "string",
      "gift": "string",
      "siddhi": "string",
      "dailyCue": "string — 1 sentence."
    }
  ],

  "chiron": {
    "sign": "string",
    "house": "number",
    "dailyCue": "string — 2 sentences. When this wound gets activated, what does it look like, and what is the one thing to remember in that moment?"
  }
}`;
}

// ─── OUTPUT TABS ENUM ─────────────────────────────────────────────────────────
const OUTPUT_TABS = [
  { id: "teaser",    label: "Website Teaser",  accent: C.maroon  },
  { id: "pdf",       label: "Client PDF",      accent: C.gold    },
  { id: "coaching",  label: "Coaching Tool",   accent: C.forest  },
  { id: "cheatsheet",label: "Cheatsheet",      accent: C.navy    },
];

// ─── TEASER DISPLAY ───────────────────────────────────────────────────────────
function TeaserDisplay({ data }) {
  const PLANET_SYMBOLS = {
    "Sun": "☉", "Moon": "☽", "Rising": "↑", "Mercury": "☿", "Venus": "♀",
    "Mars": "♂", "Jupiter": "♃", "Saturn": "♄", "Chiron": "⚷",
    "North Node": "☊", "South Node": "☋",
  };

  const PLANET_ACCENTS = {
    "Sun": C.gold, "Moon": C.navy, "Rising": C.maroon, "Mercury": C.forestSoft,
    "Venus": C.maroonSoft, "Mars": C.burnt, "Jupiter": C.goldSoft,
    "Saturn": C.faint, "Chiron": C.navySoft, "North Node": C.forest, "South Node": C.mid,
  };

  return (
    <div>
      {/* Name */}
      <div style={{ marginBottom: "40px" }}>
        <Label style={{ marginBottom: "10px" }}>Your Luminal Method Reading</Label>
        <h2 style={{ fontFamily: F.display, fontSize: "clamp(28px,4vw,44px)", fontWeight: 600, color: C.parchment, margin: "0 0 6px", lineHeight: 1.1 }}>{data.name}</h2>
        <SpectrumBar style={{ maxWidth: "160px", marginTop: "14px", height: "2px" }} />
      </div>

      {/* Planet Cards */}
      <div style={{ marginBottom: "8px" }}>
        <Label color={C.maroonSoft} style={{ fontSize: "10px", marginBottom: "16px" }}>I · Natal Placements</Label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px", marginBottom: "36px" }}>
        {data.planets?.map((p, i) => (
          <div key={i} style={{
            background: C.card, border: `1px solid ${C.rule}`,
            borderLeft: `3px solid ${PLANET_ACCENTS[p.planet] || C.maroon}`,
            borderRadius: "2px", padding: "16px 18px",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: F.display, fontSize: "20px", color: PLANET_ACCENTS[p.planet] || C.maroon }}>
                {PLANET_SYMBOLS[p.planet] || "·"}
              </span>
              <span style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color: C.parchment }}>{p.planet}</span>
              <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.ghost, letterSpacing: "0.1em" }}>
                {p.sign} · H{p.house}{p.retrograde ? " · Rx" : ""}
              </span>
            </div>
            <p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.75, margin: 0 }}>{p.hook}</p>
          </div>
        ))}
      </div>

      {/* Human Design */}
      <div style={{ marginBottom: "8px" }}>
        <Label color={C.forestSoft} style={{ fontSize: "10px", marginBottom: "16px" }}>II · Human Design</Label>
      </div>
      <Card accent={C.forest} style={{ marginBottom: "10px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Type", value: data.humanDesign?.type },
            { label: "Profile", value: `${data.humanDesign?.profile} · ${data.humanDesign?.profileName}` },
            { label: "Authority", value: data.humanDesign?.authority },
            { label: "Strategy", value: data.humanDesign?.strategy },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: C.offblack, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "12px 14px" }}>
              <Label style={{ marginBottom: "4px" }}>{label}</Label>
              <div style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color: C.parchment }}>{value}</div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{data.humanDesign?.hook}</p>
      </Card>

      {/* Gene Keys */}
      <div style={{ marginBottom: "8px", marginTop: "28px" }}>
        <Label color={C.goldSoft} style={{ fontSize: "10px", marginBottom: "16px" }}>III · Gene Keys · Activation Sequence</Label>
      </div>

      <div style={{ background: C.offblack, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "20px 24px", marginBottom: "14px" }}>
        <p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, marginBottom: "20px", fontStyle: "italic" }}>
          Every Gene Key has three frequencies: a Shadow (the default pattern under pressure), a Gift (what opens up when you see the shadow clearly), and a Siddhi (what the gift becomes when fully lived). Your Life's Work Gene Key is the central arc.
        </p>

        {/* Life's Work featured */}
        {data.geneKeys?.lifeWork && (
          <div style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: "20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: F.display, fontSize: "18px", fontWeight: 600, color: C.parchment }}>{data.geneKeys.lifeWork.name}</span>
              <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.gold, letterSpacing: "0.12em" }}>GENE KEY {data.geneKeys.lifeWork.number} · LIFE'S WORK</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "14px" }}>
              {[
                { label: "Shadow", value: data.geneKeys.lifeWork.shadow, explained: data.geneKeys.lifeWork.shadowExplained, color: C.maroon, bg: "rgba(122,31,31,0.10)" },
                { label: "Gift", value: data.geneKeys.lifeWork.gift, explained: data.geneKeys.lifeWork.giftExplained, color: C.forestSoft, bg: "rgba(30,74,40,0.10)" },
                { label: "Siddhi", value: data.geneKeys.lifeWork.siddhi, explained: data.geneKeys.lifeWork.siddhiExplained, color: C.goldSoft, bg: "rgba(160,120,32,0.10)" },
              ].map(({ label, value, explained, color, bg }) => (
                <div key={label} style={{ background: bg, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "12px 14px" }}>
                  <Label style={{ color, marginBottom: "4px" }}>{label}</Label>
                  <div style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color, marginBottom: "8px" }}>{value}</div>
                  {explained && <p style={{ fontFamily: F.body, fontSize: "12px", color: C.ghost, lineHeight: 1.7, margin: 0 }}>{explained}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other three positions — compact */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {[data.geneKeys?.evolution, data.geneKeys?.radiance, data.geneKeys?.purpose].map((gk, i) => {
            if (!gk) return null;
            const labels = ["Evolution", "Radiance", "Purpose"];
            return (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "14px 16px" }}>
                <Label color={C.gold} style={{ marginBottom: "6px", fontSize: "8px" }}>{labels[i]}</Label>
                <div style={{ fontFamily: F.display, fontSize: "14px", fontWeight: 600, color: C.parchment, marginBottom: "8px" }}>{gk.name}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {[{ l: "Shadow", v: gk.shadow, c: C.maroon }, { l: "Gift", v: gk.gift, c: C.forestSoft }, { l: "Siddhi", v: gk.siddhi, c: C.goldSoft }].map(({ l, v, c }) => (
                    <div key={l} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <span style={{ fontFamily: F.mono, fontSize: "8px", color: C.faint, letterSpacing: "0.1em", width: "42px" }}>{l}</span>
                      <span style={{ fontFamily: F.body, fontSize: "12px", fontWeight: 700, color: c }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing Hook */}
      {data.closingHook && (
        <div style={{
          marginTop: "48px", background: C.charcoal, border: `1px solid ${C.rule}`,
          borderRadius: "2px", padding: "40px 44px", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <SpectrumBar style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
          <SpectrumBar style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.28em", color: C.ghost, marginBottom: "16px" }}>WHAT THIS READING IS POINTING TOWARD</div>
          <p style={{ fontFamily: F.display, fontSize: "clamp(17px,2.5vw,24px)", fontStyle: "italic", color: C.parchment, lineHeight: 1.6, margin: "0 0 28px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            {data.closingHook}
          </p>
          <a href="YOUR_CALENDLY_LINK_HERE" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-block", padding: "16px 40px",
            background: `linear-gradient(135deg, ${C.maroon}, ${C.navy})`,
            color: C.parchment, fontFamily: F.mono, fontSize: "11px",
            letterSpacing: "0.22em", textTransform: "uppercase",
            textDecoration: "none", borderRadius: "2px",
          }}>
            Book a Full Reading →
          </a>
          <div style={{ fontFamily: F.body, fontSize: "12px", color: C.faint, fontStyle: "italic", marginTop: "14px" }}>
            You'll receive your full reading PDF before the session so you can sit with it first.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CLIENT PDF DISPLAY ───────────────────────────────────────────────────────
function ClientPDFDisplay({ data }) {
  const [activeSection, setActiveSection] = useState("geneKeys");
  const sections = [
    { id: "geneKeys", label: "Gene Keys", accent: C.gold },
    { id: "humanDesign", label: "Human Design", accent: C.forest },
    { id: "astrology", label: "Astrology", accent: C.maroon },
    { id: "chiron", label: "Chiron", accent: C.navy },
    { id: "transits", label: "Current Sky", accent: C.burnt },
    { id: "synthesis", label: "Synthesis", accent: C.parchment },
  ];

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Label style={{ marginBottom: "8px" }}>Client Reading</Label>
        <h2 style={{ fontFamily: F.display, fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 600, color: C.parchment, margin: "0 0 6px" }}>{data.name}</h2>
        <div style={{ fontFamily: F.mono, fontSize: "10px", color: C.faint, letterSpacing: "0.08em" }}>
          {data.birthData?.date} · {data.birthData?.time} · {data.birthData?.location}
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.rule}`, marginBottom: "36px", overflowX: "auto" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            padding: "10px 16px", background: "transparent", border: "none",
            borderBottom: `2px solid ${activeSection === s.id ? s.accent : "transparent"}`,
            fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase",
            color: activeSection === s.id ? s.accent : C.faint,
            cursor: "pointer", whiteSpace: "nowrap", marginBottom: "-1px",
          }}>{s.label}</button>
        ))}
      </div>

      {/* Gene Keys */}
      {activeSection === "geneKeys" && data.geneKeys && (() => {
        const gk = data.geneKeys;
        return (
          <div>
            <SectionHead number="I" title="Gene Keys" accent={C.gold} />
            {gk.intro && <p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, marginBottom: "32px", fontStyle: "italic" }}>{gk.intro}</p>}

            {gk.activationSequence?.map((g, i) => (
              <div key={i} style={{ marginBottom: "40px" }}>
                <Label color={C.goldSoft} style={{ marginBottom: "10px", fontSize: "9px", letterSpacing: "0.2em" }}>{g.position?.toUpperCase()}</Label>
                <div style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: "20px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: F.display, fontSize: "20px", fontWeight: 600, color: C.parchment }}>{g.name}</span>
                    <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.gold, letterSpacing: "0.12em" }}>GENE KEY {g.number}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "16px" }}>
                    {[
                      { label: "Shadow", value: g.shadow, color: C.maroon, bg: "rgba(122,31,31,0.10)" },
                      { label: "Gift", value: g.gift, color: C.forestSoft, bg: "rgba(30,74,40,0.10)" },
                      { label: "Siddhi", value: g.siddhi, color: C.goldSoft, bg: "rgba(160,120,32,0.10)" },
                    ].map(({ label, value, color, bg }) => (
                      <div key={label} style={{ background: bg, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "10px 12px" }}>
                        <Label style={{ color, marginBottom: "4px" }}>{label}</Label>
                        <div style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  {g.shadowDeep && <Card accent={C.maroon} style={{ marginBottom: "10px" }}><Label style={{ marginBottom: "6px" }}>The Shadow Pattern</Label><p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{g.shadowDeep}</p></Card>}
                  {g.giftDeep && <Card accent={C.forest} style={{ marginBottom: "10px" }}><Label color={C.forestSoft} style={{ marginBottom: "6px" }}>The Gift Access</Label><p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{g.giftDeep}</p></Card>}
                  {g.siddhiNote && <Card accent={C.gold} style={{ marginBottom: "0" }}><Label color={C.goldSoft} style={{ marginBottom: "6px" }}>The Siddhi</Label><p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{g.siddhiNote}</p></Card>}
                </div>
              </div>
            ))}
            {gk.summary && <Card style={{ marginTop: "16px" }}><Label style={{ marginBottom: "8px" }}>Gene Keys Summary</Label><p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{gk.summary}</p></Card>}
          </div>
        );
      })()}

      {/* Human Design */}
      {activeSection === "humanDesign" && data.humanDesign && (() => {
        const hd = data.humanDesign;
        return (
          <div>
            <SectionHead number="II" title="Human Design" accent={C.forest} />
            {hd.intro && <p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, marginBottom: "28px", fontStyle: "italic" }}>{hd.intro}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "24px" }}>
              {[
                { label: "Type", value: hd.type, accent: C.forest },
                { label: "Profile", value: `${hd.profile} · ${hd.profileName}`, accent: C.forestSoft },
                { label: "Authority", value: hd.authority, accent: C.forest },
                { label: "Strategy", value: hd.strategy, accent: C.forestSoft },
                { label: "Signature", value: hd.signature },
                { label: "Not-Self Theme", value: hd.notSelf, accent: C.maroon },
                { label: "Definition", value: hd.definition },
                { label: "Incarnation Cross", value: hd.incarnationCross },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{ background: C.offblack, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${accent || C.rule}`, borderRadius: "2px", padding: "12px 16px" }}>
                  <Label style={{ marginBottom: "4px" }}>{label}</Label>
                  <div style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color: C.parchment }}>{value || "—"}</div>
                </div>
              ))}
            </div>
            {[
              { label: "Your Type · Understanding Your Energy", content: hd.typeDeep, accent: C.forest },
              { label: "Your Authority · How to Make Correct Decisions", content: hd.authorityDeep, accent: C.forestSoft },
              { label: "Your Profile · The Shape of Your Life", content: hd.profileDeep, accent: C.forest },
              { label: "Your Open Centers · Where You Get Conditioned", content: hd.openCentersDeep, accent: C.faint },
              { label: "Your Incarnation Cross · Life Direction", content: hd.incarnationCrossDeep, accent: C.gold },
            ].map(({ label, content, accent }) => content && (
              <Card key={label} accent={accent} style={{ marginBottom: "14px" }}>
                <Label style={{ marginBottom: "8px" }}>{label}</Label>
                <p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{content}</p>
              </Card>
            ))}
            {hd.summary && <Card style={{ marginTop: "8px" }}><Label style={{ marginBottom: "8px" }}>Human Design Summary</Label><p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{hd.summary}</p></Card>}
          </div>
        );
      })()}

      {/* Astrology */}
      {activeSection === "astrology" && data.astrology && (() => {
        const a = data.astrology;
        return (
          <div>
            <SectionHead number="III" title="Natal Astrology" accent={C.maroon} />
            {a.intro && <p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, marginBottom: "24px", fontStyle: "italic" }}>{a.intro}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "20px" }}>
              {[{ label: "Sun", value: a.sunSign, accent: C.gold }, { label: "Moon", value: a.moonSign, accent: C.navy }, { label: "Rising", value: a.risingSign, accent: C.maroon }].map(({ label, value, accent }) => (
                <div key={label} style={{ background: C.offblack, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${accent}`, borderRadius: "2px", padding: "14px 16px" }}>
                  <Label style={{ marginBottom: "4px" }}>{label}</Label>
                  <div style={{ fontFamily: F.display, fontSize: "18px", fontWeight: 600, color: C.parchment }}>{value}</div>
                </div>
              ))}
            </div>
            {a.overview && <Card style={{ marginBottom: "24px" }}><Label style={{ marginBottom: "8px" }}>Chart Overview</Label><p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{a.overview}</p></Card>}
            <Rule style={{ margin: "24px 0" }} />
            <Label style={{ marginBottom: "18px", fontSize: "10px" }}>Planetary Placements</Label>
            {a.planets?.map((p, i) => (
              <div key={i} style={{ marginBottom: "22px", paddingBottom: "22px", borderBottom: `1px solid ${C.rule}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span style={{ fontFamily: F.display, fontSize: "20px", color: C.maroon }}>{p.symbol}</span>
                  <span style={{ fontFamily: F.body, fontSize: "15px", fontWeight: 700, color: C.parchment }}>{p.planet}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "10px", color: C.maroonSoft }}>{p.sign}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "10px", color: C.faint }}>H{p.house}</span>
                  {p.retrograde && <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.burnt }}>Rx</span>}
                  {p.aspects && <span style={{ fontFamily: F.mono, fontSize: "10px", color: C.forestSoft }}>{p.aspects}</span>}
                </div>
                <p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{p.interpretation}</p>
              </div>
            ))}
            {a.summary && <Card style={{ marginTop: "8px" }}><Label style={{ marginBottom: "8px" }}>Astrology Summary</Label><p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{a.summary}</p></Card>}
          </div>
        );
      })()}

      {/* Chiron */}
      {activeSection === "chiron" && data.chiron && (() => {
        const ch = data.chiron;
        return (
          <div>
            <SectionHead number="IV" title="Chiron" accent={C.navy} />
            {ch.intro && <p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, marginBottom: "24px", fontStyle: "italic" }}>{ch.intro}</p>}
            <div style={{ background: "rgba(26,42,74,0.35)", border: `1px solid ${C.navy}`, borderRadius: "2px", padding: "20px 24px", marginBottom: "24px" }}>
              <span style={{ fontFamily: F.display, fontSize: "22px", fontWeight: 600, color: C.parchment }}>⚷ Chiron in {ch.sign}</span>
              <span style={{ fontFamily: F.mono, fontSize: "10px", color: C.faint, marginLeft: "12px" }}>House {ch.house} · {ch.degree}°</span>
            </div>
            {[
              { label: "The Pattern", content: ch.corePattern, accent: C.maroon },
              { label: "What It Gives You Access To", content: ch.teachingCapacity, accent: C.forest },
              { label: "How to Work With It", content: ch.navigationNote, accent: C.navy },
            ].map(({ label, content, accent }) => content && (
              <Card key={label} accent={accent} style={{ marginBottom: "14px" }}>
                <Label style={{ marginBottom: "8px" }}>{label}</Label>
                <p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{content}</p>
              </Card>
            ))}
            {ch.summary && <Card style={{ marginTop: "8px" }}><Label style={{ marginBottom: "8px" }}>Chiron Summary</Label><p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{ch.summary}</p></Card>}
          </div>
        );
      })()}

      {/* Transits */}
      {activeSection === "transits" && data.transits && (() => {
        const tr = data.transits;
        const sorted = [...(tr.planets || [])].sort((a, b) => {
          const o = { Defining: 0, Active: 1, Approaching: 2, Separating: 3 };
          return (o[a.potency] ?? 4) - (o[b.potency] ?? 4);
        });
        return (
          <div>
            <SectionHead number="V" title="Current Sky" accent={C.burnt} />
            {tr.currentChapter && <Card style={{ marginBottom: "28px" }}><Label style={{ marginBottom: "8px" }}>What This Season Is Asking of You</Label><p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{tr.currentChapter}</p></Card>}
            {sorted.map((t, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${C.burnt}`, borderRadius: "2px", padding: "20px 24px", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                  <span style={{ fontFamily: F.display, fontSize: "17px", fontWeight: 600, color: C.parchment }}>{t.transitingPlanet} in {t.transitingSign}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.burnt, background: "rgba(184,74,26,0.12)", border: `1px solid ${C.burnt}`, padding: "2px 8px", borderRadius: "1px" }}>{t.potency}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.faint }}>{t.contactType} {t.natalContact}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.faint }}>{t.duration}</span>
                </div>
                <div style={{ marginBottom: "10px" }}><Label style={{ marginBottom: "6px" }}>What's Active</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{t.whatIsActive}</p></div>
                <div><Label color={C.forestSoft} style={{ marginBottom: "6px" }}>How to Work With It</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{t.howToWorkWithIt}</p></div>
              </div>
            ))}
            {tr.comingUp && <Card accent={C.gold} style={{ marginTop: "16px" }}><Label color={C.goldSoft} style={{ marginBottom: "8px" }}>Coming Up · Next 3 Months</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{tr.comingUp}</p></Card>}
          </div>
        );
      })()}

      {/* Synthesis */}
      {activeSection === "synthesis" && data.synthesis && (() => {
        const s = data.synthesis;
        return (
          <div>
            <SectionHead number="VI" title="Synthesis" accent={C.parchment} />
            {s.centralTheme && <Card style={{ marginBottom: "24px", borderLeft: `3px solid ${C.parchment}` }}><Label style={{ marginBottom: "8px" }}>Central Theme</Label><p style={{ fontFamily: F.display, fontSize: "18px", fontStyle: "italic", color: C.parchment, lineHeight: 1.6, margin: 0 }}>{s.centralTheme}</p></Card>}
            {[
              { label: "Where Everything Converges", content: s.convergences, accent: C.forest },
              { label: "The Shadow Pattern Across All Systems", content: s.shadowPattern, accent: C.maroon },
              { label: "What You Are Built For", content: s.designedFor, accent: C.gold },
              { label: "Where to Start", content: s.leveragePoint, accent: C.navy },
            ].map(({ label, content, accent }) => content && (
              <Card key={label} accent={accent} style={{ marginBottom: "14px" }}>
                <Label style={{ marginBottom: "8px" }}>{label}</Label>
                <p style={{ fontFamily: F.body, fontSize: "14px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{content}</p>
              </Card>
            ))}
          </div>
        );
      })()}
    </div>
  );
}

// ─── COACHING TOOL DISPLAY ────────────────────────────────────────────────────
function CoachingDisplay({ data }) {
  const [activeTab, setActiveTab] = useState("astrology");
  const tabs = [
    { id: "astrology", label: "Astrology", accent: C.maroon },
    { id: "humanDesign", label: "Human Design", accent: C.forest },
    { id: "geneKeys", label: "Gene Keys", accent: C.gold },
    { id: "chiron", label: "Chiron", accent: C.navy },
    { id: "transits", label: "Current Sky", accent: C.burnt },
    { id: "synthesis", label: "Synthesis", accent: C.parchment },
    { id: "notes", label: "My Notes", accent: C.gold },
    { id: "verify", label: "Verify Chart", accent: C.faint },
  ];
  const [notes, setNotes] = useState({});

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <Label style={{ marginBottom: "8px" }}>Coaching Tool · Clinical Reference</Label>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(22px,3vw,36px)", fontWeight: 600, color: C.parchment, margin: "0 0 6px" }}>{data.name}</h2>
          <div style={{ fontFamily: F.mono, fontSize: "10px", color: C.faint }}>{data.birthData?.date} · {data.birthData?.time} · {data.birthData?.location}</div>
        </div>
      </div>

      <div style={{ display: "flex", borderBottom: `1px solid ${C.rule}`, marginBottom: "36px", overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: "10px 16px", background: "transparent", border: "none",
            borderBottom: `2px solid ${activeTab === t.id ? t.accent : "transparent"}`,
            fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase",
            color: activeTab === t.id ? t.accent : C.faint,
            cursor: "pointer", whiteSpace: "nowrap", marginBottom: "-1px",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Astrology */}
      {activeTab === "astrology" && data.astrology && (() => {
        const a = data.astrology;
        return (
          <div>
            <SectionHead number="I" title="Natal Astrology" accent={C.maroon} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "20px" }}>
              {[
                { label: "Sun", value: a.sunSign, accent: C.gold },
                { label: "Moon", value: a.moonSign, accent: C.navy },
                { label: "Rising", value: a.risingSign, accent: C.maroon },
                { label: "Chart Ruler", value: a.chartRuler },
                { label: "Dominant Element", value: a.dominantElement },
                { label: "Dominant Modality", value: a.dominantModality },
                { label: "Chart Shape", value: a.chartShape },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{ background: C.card, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${accent || C.rule}`, borderRadius: "2px", padding: "12px 16px" }}>
                  <Label style={{ marginBottom: "4px" }}>{label}</Label>
                  <div style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color: C.parchment }}>{value || "—"}</div>
                </div>
              ))}
            </div>
            {a.overview && <Card style={{ marginBottom: "20px" }}><Label style={{ marginBottom: "6px" }}>Chart Overview</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{a.overview}</p></Card>}

            {a.angles && (
              <div style={{ marginBottom: "24px" }}>
                <Label style={{ marginBottom: "14px", fontSize: "10px" }}>Chart Angles</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {Object.entries(a.angles).map(([angle, d]) => (
                    <div key={angle} style={{ background: C.card, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${C.maroonSoft}`, borderRadius: "2px", padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "baseline", marginBottom: "6px" }}>
                        <span style={{ fontFamily: F.display, fontSize: "15px", fontWeight: 600, color: C.parchment }}>{angle}</span>
                        <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.maroonSoft }}>{d.sign} {d.degree}°</span>
                      </div>
                      <p style={{ fontFamily: F.body, fontSize: "12px", color: C.ghost, lineHeight: 1.75, margin: 0 }}>{d.interpretation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Rule style={{ margin: "20px 0" }} />
            <Label style={{ marginBottom: "16px", fontSize: "10px" }}>Planetary Placements</Label>
            {a.planets?.map((p, i) => (
              <div key={i} style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: `1px solid ${C.rule}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <span style={{ fontFamily: F.display, fontSize: "18px", color: C.maroon }}>{p.symbol}</span>
                  <span style={{ fontFamily: F.body, fontSize: "14px", fontWeight: 700, color: C.parchment }}>{p.planet}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.maroonSoft }}>{p.sign}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.faint }}>H{p.house} · {p.degree}°</span>
                  {p.retrograde && <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.burnt }}>Rx</span>}
                  {p.aspects && <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.forestSoft }}>{p.aspects}</span>}
                </div>
                <p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{p.interpretation}</p>
              </div>
            ))}
            {a.housesOfNote && <Card style={{ marginBottom: "10px" }}><Label style={{ marginBottom: "6px" }}>Houses of Note</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{a.housesOfNote}</p></Card>}
            {a.keyAspects && <Card style={{ marginBottom: "10px" }}><Label style={{ marginBottom: "6px" }}>Key Aspects</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{a.keyAspects}</p></Card>}
            {a.coachNote && <CoachNote>{a.coachNote}</CoachNote>}
          </div>
        );
      })()}

      {/* HD */}
      {activeTab === "humanDesign" && data.humanDesign && (() => {
        const hd = data.humanDesign;
        return (
          <div>
            <SectionHead number="II" title="Human Design" accent={C.forest} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "20px" }}>
              {[
                { label: "Type", value: hd.type, accent: C.forest },
                { label: "Profile", value: `${hd.profile} · ${hd.profileName}`, accent: C.forestSoft },
                { label: "Authority", value: hd.authority, accent: C.forest },
                { label: "Strategy", value: hd.strategy },
                { label: "Signature", value: hd.signature },
                { label: "Not-Self", value: hd.notSelf, accent: C.maroon },
                { label: "Definition", value: hd.definition },
                { label: "Incarnation Cross", value: hd.incarnationCross },
                { label: "Determination", value: hd.determination },
                { label: "Environment", value: hd.environment },
                { label: "Cognition", value: hd.cognition },
                { label: "Motivation", value: hd.motivation },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{ background: C.card, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${accent || C.rule}`, borderRadius: "2px", padding: "12px 14px" }}>
                  <Label style={{ marginBottom: "4px" }}>{label}</Label>
                  <div style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color: C.parchment }}>{value || "—"}</div>
                </div>
              ))}
            </div>
            {hd.variablesNote && <p style={{ fontFamily: F.mono, fontSize: "9px", color: C.maroonSoft, marginBottom: "20px", letterSpacing: "0.05em" }}>* {hd.variablesNote}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
              <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "14px 16px" }}>
                <Label style={{ marginBottom: "8px" }}>Defined Centers</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{hd.definedCenters?.map(c => <span key={c} style={{ fontFamily: F.mono, fontSize: "9px", background: "rgba(30,74,40,0.2)", border: `1px solid ${C.forest}`, color: C.forestSoft, padding: "3px 8px", borderRadius: "2px" }}>{c}</span>)}</div>
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "14px 16px" }}>
                <Label style={{ marginBottom: "8px" }}>Open Centers</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{hd.undefinedCenters?.map(c => <span key={c} style={{ fontFamily: F.mono, fontSize: "9px", background: C.offblack, border: `1px solid ${C.rule}`, color: C.faint, padding: "3px 8px", borderRadius: "2px" }}>{c}</span>)}</div>
              </div>
            </div>
            <Rule style={{ margin: "20px 0" }} />
            {[
              { label: "Type · Aura Mechanics", content: hd.typeStrategy },
              { label: "Authority · Decision Mechanics", content: hd.authorityDeep },
              { label: "Profile · Life Structure", content: hd.profileDeep },
              { label: "Open Centers · Conditioning", content: hd.openCentersDeep },
              { label: "Incarnation Cross · Life Direction", content: hd.incarnationCrossDeep },
            ].map(({ label, content }) => content && (
              <div key={label} style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: `1px solid ${C.rule}` }}>
                <Label style={{ marginBottom: "6px" }}>{label}</Label>
                <p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{content}</p>
              </div>
            ))}
            {hd.channels?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <Label style={{ marginBottom: "14px", fontSize: "10px" }}>Active Channels</Label>
                {hd.channels.map((ch, i) => (
                  <div key={i} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: `1px solid ${C.rule}` }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: F.display, fontSize: "15px", fontWeight: 600, color: C.parchment }}>{ch.channel} · {ch.name}</span>
                      <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.forestSoft }}>{ch.circuitry}</span>
                    </div>
                    {ch.gates && <div style={{ fontFamily: F.mono, fontSize: "9px", color: C.faint, marginBottom: "6px" }}>{ch.gates}</div>}
                    <p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{ch.interpretation}</p>
                  </div>
                ))}
              </div>
            )}
            {hd.hdSummary && <Card style={{ marginBottom: "10px" }}><Label style={{ marginBottom: "6px" }}>HD Summary</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{hd.hdSummary}</p></Card>}
            {hd.coachNote && <CoachNote>{hd.coachNote}</CoachNote>}
          </div>
        );
      })()}

      {/* Gene Keys */}
      {activeTab === "geneKeys" && data.geneKeys && (() => {
        const gk = data.geneKeys;
        return (
          <div>
            <SectionHead number="III" title="Gene Keys" accent={C.gold} />
            {gk.activationSequence?.map((g, i) => (
              <div key={i} style={{ marginBottom: "32px" }}>
                <Label color={C.goldSoft} style={{ marginBottom: "8px", fontSize: "9px" }}>{g.position?.toUpperCase()}</Label>
                <div style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: "18px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "baseline", marginBottom: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: F.display, fontSize: "17px", fontWeight: 600, color: C.parchment }}>{g.hexagramName}</span>
                    <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.gold }}>GENE KEY {g.geneKeyNumber}</span>
                    {g.theme && <span style={{ fontFamily: F.body, fontSize: "12px", fontStyle: "italic", color: C.faint }}>{g.theme}</span>}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px", marginBottom: "10px" }}>
                    {[{ l: "Shadow", v: g.shadow, c: C.maroon, bg: "rgba(122,31,31,0.08)" }, { l: "Gift", v: g.gift, c: C.forestSoft, bg: "rgba(30,74,40,0.08)" }, { l: "Siddhi", v: g.siddhi, c: C.gold, bg: "rgba(160,120,32,0.08)" }].map(({ l, v, c, bg }) => (
                      <div key={l} style={{ background: bg, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "8px 10px" }}>
                        <Label style={{ color: c, marginBottom: "3px" }}>{l}</Label>
                        <div style={{ fontFamily: F.body, fontSize: "12px", fontWeight: 700, color: c }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{g.interpretation}</p>
                </div>
              </div>
            ))}
            <Rule style={{ margin: "20px 0" }} />
            {gk.pathwayOfInitiation && <Card style={{ marginBottom: "10px" }}><Label style={{ marginBottom: "6px" }}>Pathway of Initiation</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{gk.pathwayOfInitiation}</p></Card>}
            {gk.geneKeysSummary && <Card style={{ marginBottom: "10px" }}><Label style={{ marginBottom: "6px" }}>Gene Keys Summary</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{gk.geneKeysSummary}</p></Card>}
            {gk.coachNote && <CoachNote>{gk.coachNote}</CoachNote>}
          </div>
        );
      })()}

      {/* Chiron */}
      {activeTab === "chiron" && data.chiron && (() => {
        const ch = data.chiron;
        return (
          <div>
            <SectionHead number="IV" title="Chiron" accent={C.navy} />
            <div style={{ background: "rgba(26,42,74,0.3)", border: `1px solid ${C.navy}`, borderRadius: "2px", padding: "18px 22px", marginBottom: "20px" }}>
              <span style={{ fontFamily: F.display, fontSize: "20px", fontWeight: 600, color: C.parchment }}>⚷ Chiron in {ch.sign}</span>
              <span style={{ fontFamily: F.mono, fontSize: "10px", color: C.faint, marginLeft: "10px" }}>House {ch.house} · {ch.degree}°</span>
              {ch.aspects && <span style={{ fontFamily: F.mono, fontSize: "10px", color: C.navySoft, marginLeft: "10px" }}>{ch.aspects}</span>}
            </div>
            {[
              { label: "Core Wound · Recurring Pattern", content: ch.coreWound, accent: C.maroon },
              { label: "Teaching Capacity", content: ch.teachingAccess, accent: C.forest },
              { label: "Unconscious Compensation", content: ch.unconsciousCompensation, accent: C.burnt },
              { label: "Working With It", content: ch.workingWithIt, accent: C.navy },
            ].map(({ label, content, accent }) => content && (
              <Card key={label} accent={accent} style={{ marginBottom: "12px" }}>
                <Label style={{ marginBottom: "6px" }}>{label}</Label>
                <p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{content}</p>
              </Card>
            ))}
            {ch.chironSummary && <Card style={{ marginBottom: "10px" }}><Label style={{ marginBottom: "6px" }}>Chiron Summary</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{ch.chironSummary}</p></Card>}
            {ch.coachNote && <CoachNote>{ch.coachNote}</CoachNote>}
          </div>
        );
      })()}

      {/* Transits */}
      {activeTab === "transits" && data.transits && (() => {
        const tr = data.transits;
        const sorted = [...(tr.planets || [])].sort((a, b) => ({ Defining: 0, Active: 1, Approaching: 2, Separating: 3 }[a.potency] ?? 4) - ({ Defining: 0, Active: 1, Approaching: 2, Separating: 3 }[b.potency] ?? 4));
        return (
          <div>
            <SectionHead number="V" title="Current Sky" accent={C.burnt} />
            {tr.currentChapter && <Card style={{ marginBottom: "24px" }}><Label style={{ marginBottom: "6px" }}>Current Chapter</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{tr.currentChapter}</p></Card>}
            {sorted.map((t, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${C.burnt}`, borderRadius: "2px", padding: "18px 22px", marginBottom: "12px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "baseline", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span style={{ fontFamily: F.display, fontSize: "16px", fontWeight: 600, color: C.parchment }}>{t.transitingPlanet} in {t.transitingSign}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.burnt, background: "rgba(184,74,26,0.1)", border: `1px solid ${C.burnt}`, padding: "2px 7px", borderRadius: "1px" }}>{t.potency}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.faint }}>{t.contactType} {t.natalContact} · {t.orb}° orb</span>
                  <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.faint }}>{t.duration}</span>
                </div>
                <div style={{ marginBottom: "8px" }}><Label style={{ marginBottom: "4px" }}>What Is Active</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{t.whatIsActive}</p></div>
                <div><Label color={C.forestSoft} style={{ marginBottom: "4px" }}>How To Work With It</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{t.howToWorkWithIt}</p></div>
              </div>
            ))}
            {tr.comingUp && <Card accent={C.gold} style={{ marginTop: "12px" }}><Label color={C.goldSoft} style={{ marginBottom: "6px" }}>Coming Up · Next 3 Months</Label><p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.8, margin: 0 }}>{tr.comingUp}</p></Card>}
            {tr.coachNote && <CoachNote>{tr.coachNote}</CoachNote>}
          </div>
        );
      })()}

      {/* Synthesis */}
      {activeTab === "synthesis" && data.synthesis && (() => {
        const s = data.synthesis;
        return (
          <div>
            <SectionHead number="VI" title="Synthesis" accent={C.parchment} />
            {s.centralTheme && <Card style={{ borderLeft: `3px solid ${C.parchment}`, marginBottom: "20px" }}><Label style={{ marginBottom: "6px" }}>Central Theme</Label><p style={{ fontFamily: F.display, fontSize: "17px", fontStyle: "italic", color: C.parchment, lineHeight: 1.6, margin: 0 }}>{s.centralTheme}</p></Card>}
            {[
              { label: "Cross-System Convergences", content: s.convergences, accent: C.forest },
              { label: "Internal Tensions", content: s.tensions, accent: C.burnt },
              { label: "Dominant Shadow Pattern", content: s.shadowPattern, accent: C.maroon },
              { label: "Structurally Designed For", content: s.designedFor, accent: C.gold },
              { label: "Leverage Point", content: s.leveragePoint, accent: C.navy },
            ].map(({ label, content, accent }) => content && (
              <Card key={label} accent={accent} style={{ marginBottom: "12px" }}>
                <Label style={{ marginBottom: "6px" }}>{label}</Label>
                <p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.85, margin: 0 }}>{content}</p>
              </Card>
            ))}
            {s.coachNote && <CoachNote>{s.coachNote}</CoachNote>}
          </div>
        );
      })()}

      {/* Notes */}
      {activeTab === "notes" && (
        <div>
          <SectionHead number="VII" title="Session Notes" accent={C.gold} />
          <p style={{ fontFamily: F.body, fontSize: "13px", color: C.faint, lineHeight: 1.7, marginBottom: "28px" }}>Working notes for this session. Copy before closing — these live in this session only.</p>
          {[
            { key: "impressions", label: "Overall Impressions" },
            { key: "gk", label: "Gene Keys Notes" },
            { key: "hd", label: "Human Design Notes" },
            { key: "astro", label: "Astrology Notes" },
            { key: "chiron", label: "Chiron Notes" },
            { key: "transits", label: "Transit Notes" },
            { key: "session", label: "Session Planning" },
            { key: "followup", label: "Follow-Up / Homework" },
          ].map(({ key, label }) => (
            <div key={key} style={{ marginBottom: "18px" }}>
              <Label style={{ marginBottom: "6px" }}>{label}</Label>
              <textarea value={notes[key] || ""} onChange={e => setNotes(n => ({ ...n, [key]: e.target.value }))} rows={4}
                style={{ width: "100%", background: C.offblack, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "12px 14px", fontFamily: F.body, fontSize: "13px", color: C.parchment, lineHeight: 1.7, resize: "vertical", outline: "none", boxSizing: "border-box", colorScheme: "dark" }} />
            </div>
          ))}
        </div>
      )}

      {/* Verify */}
      {activeTab === "verify" && (
        <div>
          <SectionHead number="VIII" title="Verify the Chart" accent={C.faint} />
          <p style={{ fontFamily: F.body, fontSize: "13px", color: C.faint, lineHeight: 1.7, marginBottom: "28px" }}>This reading is AI-generated from birth data. Interpretive content is substantive. For exact degrees, house cusps, Variable arrows, and channel activations, verify against these sources before session.</p>
          {[
            { system: "Astrology", tools: [{ name: "Astro.com · Natal Chart", url: "https://www.astro.com/horoscopes", desc: "Gold standard for free natal chart calculation. Verify Sun, Moon, Rising degrees and all major aspects here.", action: "Calculate natal chart" }, { name: "Astro.com · Current Transits", url: "https://www.astro.com/horoscopes", desc: "Run today's transit chart to verify active transits and exact orbs.", action: "View transits" }] },
            { system: "Human Design", tools: [{ name: "Jovian Archive · Free Chart", url: "https://www.jovianarchive.com/get_your_chart", desc: "Ra Uru Hu's original source. Verify Type, Authority, Profile, Definition, centers, channels, gates, and Variable arrows here.", action: "Generate HD chart" }, { name: "MyBodyGraph", url: "https://www.mybodygraph.com", desc: "Clean visual bodygraph with gate activations and design vs personality columns.", action: "View bodygraph" }] },
            { system: "Gene Keys", tools: [{ name: "Gene Keys Official · Profile", url: "https://genekeys.com/your-profile/", desc: "Richard Rudd's official calculator. Generates the Activation Sequence and verifies Gene Key numbers and positions.", action: "Generate profile" }] },
          ].map(({ system, tools }) => (
            <div key={system} style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ fontFamily: F.mono, fontSize: "9px", color: C.maroonSoft, letterSpacing: "0.2em" }}>{system}</div>
                <div style={{ flex: 1, height: "1px", background: C.rule }} />
              </div>
              {tools.map(tool => (
                <div key={tool.name} style={{ background: C.card, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "16px 20px", marginBottom: "8px", display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color: C.parchment, marginBottom: "4px" }}>{tool.name}</div>
                    <p style={{ fontFamily: F.body, fontSize: "12px", color: C.ghost, lineHeight: 1.75, margin: 0 }}>{tool.desc}</p>
                  </div>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "8px 14px", background: `linear-gradient(135deg, ${C.maroon}, ${C.navy})`, color: C.parchment, fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", borderRadius: "2px", whiteSpace: "nowrap", flexShrink: 0 }}>{tool.action} ↗</a>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CHEATSHEET DISPLAY ───────────────────────────────────────────────────────
function CheatsheetDisplay({ data }) {
  const GK_COLORS = [C.gold, C.forestSoft, C.navySoft, C.maroonSoft];

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <Label style={{ marginBottom: "8px" }}>Quick Reference · Save as Photo</Label>
        <h2 style={{ fontFamily: F.display, fontSize: "clamp(22px,3vw,34px)", fontWeight: 600, color: C.parchment, margin: "0 0 6px" }}>{data.name}</h2>
        <SpectrumBar style={{ maxWidth: "120px", marginTop: "12px", height: "2px" }} />
      </div>

      {/* Astrology */}
      <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${C.maroon}`, borderRadius: "2px", padding: "20px 22px", marginBottom: "14px" }}>
        <Label color={C.maroonSoft} style={{ marginBottom: "14px", fontSize: "10px" }}>Natal Astrology</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px", marginBottom: "14px" }}>
          {[
            { label: "Sun", value: data.astrology?.sun, note: data.astrology?.sunNote, accent: C.gold },
            { label: "Moon", value: data.astrology?.moon, note: data.astrology?.moonNote, accent: C.navy },
            { label: "Rising", value: data.astrology?.rising, note: data.astrology?.risingNote, accent: C.maroon },
          ].map(({ label, value, note, accent }) => (
            <div key={label} style={{ background: C.offblack, border: `1px solid ${C.rule}`, borderTop: `2px solid ${accent}`, borderRadius: "2px", padding: "12px 14px" }}>
              <Label style={{ marginBottom: "4px" }}>{label}</Label>
              <div style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color: C.parchment, marginBottom: "6px" }}>{value}</div>
              {note && <p style={{ fontFamily: F.body, fontSize: "11px", color: C.ghost, lineHeight: 1.7, margin: 0 }}>{note}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* HD */}
      <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${C.forest}`, borderRadius: "2px", padding: "20px 22px", marginBottom: "14px" }}>
        <Label color={C.forestSoft} style={{ marginBottom: "14px", fontSize: "10px" }}>Human Design</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
          {[
            { label: "Type", value: data.humanDesign?.type },
            { label: "Strategy", value: data.humanDesign?.strategy },
            { label: "Authority", value: data.humanDesign?.authority },
            { label: "Not-Self Signal", value: data.humanDesign?.notSelf, accent: C.maroon },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{ background: C.offblack, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "10px 12px" }}>
              <Label style={{ marginBottom: "3px" }}>{label}</Label>
              <div style={{ fontFamily: F.body, fontSize: "12px", fontWeight: 700, color: accent || C.parchment }}>{value}</div>
            </div>
          ))}
        </div>
        {data.humanDesign?.strategyReminder && <div style={{ marginBottom: "8px" }}><Label color={C.forestSoft} style={{ marginBottom: "4px" }}>Strategy Reminder</Label><p style={{ fontFamily: F.body, fontSize: "12px", color: C.ghost, lineHeight: 1.7, margin: 0 }}>{data.humanDesign.strategyReminder}</p></div>}
        {data.humanDesign?.authorityReminder && <div style={{ marginBottom: "8px" }}><Label color={C.forestSoft} style={{ marginBottom: "4px" }}>Authority Reminder</Label><p style={{ fontFamily: F.body, fontSize: "12px", color: C.ghost, lineHeight: 1.7, margin: 0 }}>{data.humanDesign.authorityReminder}</p></div>}
        {data.humanDesign?.notSelfSignal && <div style={{ background: "rgba(122,31,31,0.10)", border: `1px solid ${C.maroon}`, borderRadius: "2px", padding: "12px 14px" }}><Label color={C.maroonSoft} style={{ marginBottom: "4px" }}>When You Feel Off Track</Label><p style={{ fontFamily: F.body, fontSize: "12px", color: C.ghost, lineHeight: 1.7, margin: 0 }}>{data.humanDesign.notSelfSignal}</p></div>}
      </div>

      {/* Gene Keys */}
      <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${C.gold}`, borderRadius: "2px", padding: "20px 22px", marginBottom: "14px" }}>
        <Label color={C.goldSoft} style={{ marginBottom: "14px", fontSize: "10px" }}>Gene Keys · Activation Sequence</Label>
        {data.geneKeys?.map((gk, i) => (
          <div key={i} style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: i < data.geneKeys.length - 1 ? `1px solid ${C.rule}` : "none" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: F.mono, fontSize: "8px", color: GK_COLORS[i], letterSpacing: "0.15em" }}>{gk.position?.toUpperCase()}</span>
              <span style={{ fontFamily: F.display, fontSize: "14px", fontWeight: 600, color: C.parchment }}>{gk.name}</span>
              <span style={{ fontFamily: F.mono, fontSize: "8px", color: C.faint }}>GK {gk.number}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              {[{ l: "Shadow", v: gk.shadow, c: C.maroon }, { l: "Gift", v: gk.gift, c: C.forestSoft }, { l: "Siddhi", v: gk.siddhi, c: C.goldSoft }].map(({ l, v, c }) => (
                <span key={l} style={{ fontFamily: F.mono, fontSize: "9px", color: c, background: C.offblack, border: `1px solid ${C.rule}`, padding: "2px 8px", borderRadius: "1px" }}>{l}: {v}</span>
              ))}
            </div>
            {gk.dailyCue && <p style={{ fontFamily: F.body, fontSize: "12px", color: C.ghost, lineHeight: 1.7, margin: 0 }}>{gk.dailyCue}</p>}
          </div>
        ))}
      </div>

      {/* Chiron */}
      {data.chiron && (
        <div style={{ background: C.card, border: `1px solid ${C.rule}`, borderLeft: `3px solid ${C.navy}`, borderRadius: "2px", padding: "20px 22px", marginBottom: "14px" }}>
          <Label color={C.navySoft} style={{ marginBottom: "10px", fontSize: "10px" }}>Chiron · ⚷ {data.chiron.sign} · House {data.chiron.house}</Label>
          <p style={{ fontFamily: F.body, fontSize: "13px", color: C.ghost, lineHeight: 1.75, margin: 0 }}>{data.chiron.dailyCue}</p>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "32px", padding: "20px", background: C.offblack, border: `1px solid ${C.rule}`, borderRadius: "2px" }}>
        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.25em", color: C.faint }}>LUMINAL METHOD · A METHODOLOGY BY CAROLINE KOS</div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [form, setForm] = useState({ name: "", date: "", time: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [activeOutput, setActiveOutput] = useState("teaser");
  const topRef = useRef(null);

  const LOADING_MESSAGES = [
    "Calculating natal positions...",
    "Reading the Human Design chart...",
    "Mapping the Gene Keys sequence...",
    "Synthesizing across all systems...",
    "Almost there...",
  ];

  const callAPI = async (prompt) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const raw = data.content?.map(b => b.text || "").join("") || "";
    const clean = raw.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m => m.replace(/```json\n?|```\n?/g, "")).replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  };

  const generate = async () => {
    if (!form.name || !form.date || !form.time || !form.location) {
      setError("All four fields are required for an accurate reading.");
      return;
    }
    setError("");
    setLoading(true);
    setResults(null);

    let msgIndex = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]);
    }, 4000);

    try {
      // PDF runs first — coaching is annotated from its output, saving one full API call
      const pdf = await callAPI(buildClientPDFPrompt(form));
      const [teaser, coaching, cheatsheet] = await Promise.all([
        callAPI(buildTeaserPrompt(form)),
        callAPI(buildCoachAnnotationPrompt(pdf)),
        callAPI(buildCheatsheetPrompt(form)),
      ]);
      setResults({ teaser, pdf, coaching, cheatsheet });
      setActiveOutput("teaser");
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError("Generation failed. Please verify all birth data and try again.");
      console.error(e);
    }
    clearInterval(msgInterval);
    setLoading(false);
  };

  const inp = {
    width: "100%", background: C.offblack, border: `1px solid ${C.rule}`,
    borderRadius: "2px", padding: "12px 16px", color: C.parchment,
    fontFamily: F.body, fontSize: "14px", outline: "none",
    boxSizing: "border-box", colorScheme: "dark",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.black, color: C.parchment, fontFamily: F.body }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.black, position: "sticky", top: 0, zIndex: 100, borderBottom: `1px solid ${C.rule}` }}>
        <SpectrumBar />
        <div style={{ padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.3em", color: C.faint, marginBottom: "2px" }}>INTEGRATED CHART ANALYSIS</div>
            <div style={{ fontFamily: F.display, fontSize: "20px", fontWeight: 600, color: C.parchment, letterSpacing: "0.04em" }}>Luminal Method</div>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {[C.maroon, C.burnt, C.gold, C.forest, C.navy].map((c, i) => (
              <div key={i} style={{ width: "7px", height: "7px", background: c, borderRadius: "50%" }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "940px", margin: "0 auto", padding: "48px 24px 100px" }} ref={topRef}>

        {/* Input form */}
        {!results && (
          <div>
            <div style={{ marginBottom: "40px", textAlign: "center" }}>
              <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.3em", color: C.faint, marginBottom: "16px" }}>ASTROLOGY · HUMAN DESIGN · GENE KEYS · CHIRON</div>
              <h1 style={{ fontFamily: F.display, fontSize: "clamp(30px,5vw,56px)", fontWeight: 600, fontStyle: "italic", lineHeight: 1.15, margin: "0 0 20px", color: C.parchment }}>
                Generate a Full Reading
              </h1>
              <p style={{ fontFamily: F.body, fontSize: "14px", color: C.faint, lineHeight: 1.75, maxWidth: "480px", margin: "0 auto" }}>
                You already know something has been running underneath everything. This is what it is, where it came from, and what to do with it.
              </p>
              <SpectrumBar style={{ maxWidth: "100px", margin: "24px auto 0", height: "2px" }} />
            </div>

            <div style={{ background: C.offblack, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "36px 40px", maxWidth: "640px", margin: "0 auto" }}>
              <SpectrumBar style={{ marginBottom: "28px" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "Full Birth Name", name: "name", type: "text", placeholder: "As on birth certificate", col: "span 2" },
                  { label: "Date of Birth", name: "date", type: "date", col: "span 1" },
                  { label: "Exact Time of Birth", name: "time", type: "time", col: "span 1", note: "Even 4 minutes shifts the chart. Use birth certificate." },
                  { label: "City, State & Country of Birth", name: "location", type: "text", placeholder: "e.g. Portland, Oregon, USA", col: "span 2" },
                ].map(f => (
                  <div key={f.name} style={{ gridColumn: f.col }}>
                    <Label style={{ marginBottom: "6px" }}>{f.label}</Label>
                    <input type={f.type} value={form[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} placeholder={f.placeholder || ""} style={inp} />
                    {f.note && <p style={{ fontFamily: F.mono, fontSize: "9px", color: C.maroonSoft, marginTop: "5px", lineHeight: 1.6 }}>{f.note}</p>}
                  </div>
                ))}
              </div>

              {error && <p style={{ fontFamily: F.mono, fontSize: "10px", color: C.maroonSoft, marginTop: "14px", letterSpacing: "0.08em" }}>{error}</p>}

              <button onClick={generate} disabled={loading} style={{
                marginTop: "24px", width: "100%", padding: "16px",
                background: loading ? C.charcoal : `linear-gradient(135deg, ${C.maroon}, ${C.navy})`,
                border: "none", borderRadius: "2px",
                color: loading ? C.faint : C.parchment,
                fontFamily: F.mono, fontSize: "10px", letterSpacing: "0.22em",
                textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
              }}>
                {loading ? "GENERATING ALL FOUR OUTPUTS..." : "GENERATE FULL READING"}
              </button>

              {loading && (
                <p style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "14px", color: C.faint, textAlign: "center", marginTop: "14px" }}>
                  {loadingMsg}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div>
            {/* Output switcher */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "14px" }}>
              <div>
                <Label style={{ marginBottom: "6px" }}>Reading Generated</Label>
                <h2 style={{ fontFamily: F.display, fontSize: "clamp(22px,3vw,34px)", fontWeight: 600, color: C.parchment, margin: 0 }}>
                  {results.teaser?.name || form.name.split(" ")[0]}
                </h2>
              </div>
              <button onClick={() => { setResults(null); setForm({ name: "", date: "", time: "", location: "" }); }} style={{
                padding: "10px 18px", background: "transparent", border: `1px solid ${C.rule}`,
                borderRadius: "2px", fontFamily: F.mono, fontSize: "9px",
                letterSpacing: "0.15em", color: C.faint, cursor: "pointer",
              }}>
                NEW READING
              </button>
            </div>

            {/* Output tabs */}
            <div style={{ display: "flex", borderBottom: `1px solid ${C.rule}`, marginBottom: "40px", gap: "0", overflowX: "auto" }}>
              {OUTPUT_TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveOutput(tab.id)} style={{
                  padding: "12px 20px", background: "transparent", border: "none",
                  borderBottom: `2px solid ${activeOutput === tab.id ? tab.accent : "transparent"}`,
                  fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase",
                  color: activeOutput === tab.id ? tab.accent : C.faint,
                  cursor: "pointer", whiteSpace: "nowrap", marginBottom: "-1px",
                }}>{tab.label}</button>
              ))}
            </div>

            {activeOutput === "teaser"     && results.teaser     && <TeaserDisplay    data={results.teaser}     />}
            {activeOutput === "pdf"        && results.pdf        && <ClientPDFDisplay data={results.pdf}        />}
            {activeOutput === "coaching"   && results.coaching   && <CoachingDisplay  data={results.coaching}   />}
            {activeOutput === "cheatsheet" && results.cheatsheet && <CheatsheetDisplay data={results.cheatsheet} />}
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${C.rule}`, padding: "20px 32px", textAlign: "center" }}>
        <SpectrumBar style={{ marginBottom: "16px" }} />
        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.2em", color: C.faint }}>
          LUMINAL METHOD · CAROLINE KOS
        </div>
      </div>
    </div>
  );
}
