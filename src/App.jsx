import { useState, useRef } from "react";

const C = {
  bg:         "#f4ecdc",
  cardWarm:   "#ebe0c9",
  cardDeep:   "#e0d2b6",
  ink:        "#2a2419",
  inkSoft:    "#4a4032",
  inkMute:    "#6a5e4a",
  rule:       "rgba(42,36,25,0.15)",
  terracotta: "#b8553a",
  terraSoft:  "#d4876a",
  rust:       "#8b4332",
  gold:       "#b8923a",
  goldDeep:   "#8a6c20",
  evergreen:  "#2d4a3e",
  evergreenD: "#1f3329",
  sage:       "#7a8b6f",
};

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  body:    "'Libre Baskerville', Georgia, serif",
  mono:    "'JetBrains Mono', monospace",
};

const CALENDLY = "https://calendly.com/caroline-kosciusko";

function SpectrumBar({ style }) {
  return (
    <div style={{
      height: "3px",
      background: `linear-gradient(to right, ${C.terracotta}, ${C.rust}, ${C.gold}, ${C.evergreen}, ${C.evergreenD})`,
      ...style,
    }} />
  );
}

function Label({ children, color, style }) {
  return (
    <div style={{
      fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.2em",
      textTransform: "uppercase", color: color || C.inkMute,
      marginBottom: "6px", ...style,
    }}>{children}</div>
  );
}

function Card({ children, accent, style }) {
  return (
    <div style={{
      background: C.cardDeep,
      border: `1px solid ${C.rule}`,
      borderLeft: accent ? `3px solid ${accent}` : `1px solid ${C.rule}`,
      borderRadius: "2px", padding: "20px 24px", marginBottom: "14px",
      ...style,
    }}>{children}</div>
  );
}

const PLANET_SYMBOLS = {
  "Sun": "☉", "Moon": "☽", "Rising": "↑", "Mercury": "☿", "Venus": "♀",
  "Mars": "♂", "Jupiter": "♃", "Saturn": "♄", "Chiron": "⚷",
  "North Node": "☊", "South Node": "☋",
};

const PLANET_ACCENTS = {
  "Sun": "#b8923a", "Moon": "#2d4a3e", "Rising": "#b8553a",
  "Mercury": "#7a8b6f", "Venus": "#d4876a", "Mars": "#8b4332",
  "Jupiter": "#b8923a", "Saturn": "#6a5e4a", "Chiron": "#2d4a3e",
  "North Node": "#1f3329", "South Node": "#6a5e4a",
};

function buildTeaserPrompt({ name, date, time, location }) {
  return `You are a warm, precise, and deeply knowledgeable guide in natal astrology, Human Design (Ra Uru Hu's original system), and Gene Keys (Richard Rudd's original text). Your tone is like Evelyn Levenson's in "Becoming an Empowered Projector": warm, practical, relatable, grounded in lived experience. You help people feel seen and understood. No motivational fluff. No vague spiritual language. Specific, behavioral, and real.

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
      "hook": "string — complete this sentence naturally: Your [Planet] in [Sign], House [N] explains... — 1-2 sentences max. Warm, specific, behavioral. What does this actually produce in this person's daily life, relationships, or inner experience? Not a definition — a mirror."
    }
  ],

  "humanDesign": {
    "type": "string",
    "profile": "string (e.g. 5/1)",
    "profileName": "string (e.g. Heretic/Investigator)",
    "authority": "string",
    "strategy": "string",
    "hook": "string — 3 sentences. Start with why they have been struggling (the friction they already feel) before explaining what their type means. Make them recognize themselves immediately. Warm, practical, no jargon dump. Second person."
  },

  "geneKeys": {
    "lifeWork": {
      "number": "number",
      "name": "string",
      "shadow": "string",
      "gift": "string",
      "siddhi": "string",
      "shadowExplained": "string — 1 sentence. What does this shadow look like in this person's actual daily behavior or emotional patterns?",
      "giftExplained": "string — 1 sentence. What becomes available when this shadow is recognized and worked with?",
      "siddhiExplained": "string — 1 sentence. What is the siddhi pointing toward?"
    },
    "evolution": { "number": "number", "name": "string", "shadow": "string", "gift": "string", "siddhi": "string" },
    "radiance":  { "number": "number", "name": "string", "shadow": "string", "gift": "string", "siddhi": "string" },
    "purpose":   { "number": "number", "name": "string", "shadow": "string", "gift": "string", "siddhi": "string" }
  },

  "closingHook": "string — 2-3 sentences. Do not summarize what was already said. Instead, gesture toward what a full reading would reveal. Make them feel they have only seen the first page of something much longer about themselves. Warm, not salesy."
}`;
}

function TeaserDisplay({ data }) {
  return (
    <div>
      {/* Name header */}
      <div style={{ marginBottom: "40px" }}>
        <Label style={{ marginBottom: "10px" }}>Your Luminal Method Reading</Label>
        <h2 style={{ fontFamily: F.display, fontSize: "clamp(28px,4vw,44px)", fontWeight: 600, color: C.ink, margin: "0 0 6px", lineHeight: 1.1 }}>{data.name}</h2>
        <SpectrumBar style={{ maxWidth: "160px", marginTop: "14px" }} />
      </div>

      {/* Planets */}
      <Label color={C.terracotta} style={{ fontSize: "10px", marginBottom: "16px" }}>I · Natal Placements</Label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px", marginBottom: "36px" }}>
        {data.planets?.map((p, i) => (
          <div key={i} style={{
            background: C.cardWarm, border: `1px solid ${C.rule}`,
            borderLeft: `3px solid ${PLANET_ACCENTS[p.planet] || C.terracotta}`,
            borderRadius: "2px", padding: "16px 18px",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: F.display, fontSize: "20px", color: PLANET_ACCENTS[p.planet] || C.terracotta }}>
                {PLANET_SYMBOLS[p.planet] || "·"}
              </span>
              <span style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color: C.ink }}>{p.planet}</span>
              <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.inkMute, letterSpacing: "0.1em" }}>
                {p.sign} · H{p.house}{p.retrograde ? " · Rx" : ""}
              </span>
            </div>
            <p style={{ fontFamily: F.body, fontSize: "13px", color: C.inkSoft, lineHeight: 1.75, margin: 0 }}>{p.hook}</p>
          </div>
        ))}
      </div>

      {/* Human Design */}
      <Label color={C.evergreenD} style={{ fontSize: "10px", marginBottom: "16px" }}>II · Human Design</Label>
      <Card accent={C.evergreen} style={{ marginBottom: "28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "Type", value: data.humanDesign?.type },
            { label: "Profile", value: `${data.humanDesign?.profile} · ${data.humanDesign?.profileName}` },
            { label: "Authority", value: data.humanDesign?.authority },
            { label: "Strategy", value: data.humanDesign?.strategy },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: C.bg, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "12px 14px" }}>
              <Label style={{ marginBottom: "4px" }}>{label}</Label>
              <div style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color: C.ink }}>{value}</div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: F.body, fontSize: "14px", color: C.inkSoft, lineHeight: 1.85, margin: 0 }}>{data.humanDesign?.hook}</p>
      </Card>

      {/* Gene Keys */}
      <Label color={C.goldDeep} style={{ fontSize: "10px", marginBottom: "16px" }}>III · Gene Keys · Activation Sequence</Label>
      <div style={{ background: C.cardWarm, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "20px 24px", marginBottom: "14px" }}>
        <p style={{ fontFamily: F.body, fontSize: "13px", color: C.inkMute, lineHeight: 1.8, marginBottom: "20px", fontStyle: "italic" }}>
          Every Gene Key has three frequencies: a Shadow (the default pattern under pressure), a Gift (what opens up when you see the shadow clearly), and a Siddhi (what the gift becomes when fully lived). Your Life's Work Gene Key is the central arc.
        </p>

        {/* Life's Work featured */}
        {data.geneKeys?.lifeWork && (
          <div style={{ borderLeft: `3px solid ${C.gold}`, paddingLeft: "20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: F.display, fontSize: "18px", fontWeight: 600, color: C.ink }}>{data.geneKeys.lifeWork.name}</span>
              <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.goldDeep, letterSpacing: "0.12em" }}>GENE KEY {data.geneKeys.lifeWork.number} · LIFE'S WORK</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "14px" }}>
              {[
                { label: "Shadow", value: data.geneKeys.lifeWork.shadow, explained: data.geneKeys.lifeWork.shadowExplained, color: C.terracotta, bg: "rgba(184,85,58,0.08)" },
                { label: "Gift",   value: data.geneKeys.lifeWork.gift,   explained: data.geneKeys.lifeWork.giftExplained,   color: C.evergreenD, bg: "rgba(31,51,41,0.08)" },
                { label: "Siddhi", value: data.geneKeys.lifeWork.siddhi, explained: data.geneKeys.lifeWork.siddhiExplained, color: C.goldDeep,    bg: "rgba(138,108,32,0.08)" },
              ].map(({ label, value, explained, color, bg }) => (
                <div key={label} style={{ background: bg, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "12px 14px" }}>
                  <Label style={{ color, marginBottom: "4px" }}>{label}</Label>
                  <div style={{ fontFamily: F.body, fontSize: "13px", fontWeight: 700, color, marginBottom: "8px" }}>{value}</div>
                  {explained && <p style={{ fontFamily: F.body, fontSize: "12px", color: C.inkSoft, lineHeight: 1.7, margin: 0 }}>{explained}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other three — compact */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
          {[data.geneKeys?.evolution, data.geneKeys?.radiance, data.geneKeys?.purpose].map((gk, i) => {
            if (!gk) return null;
            const labels = ["Evolution", "Radiance", "Purpose"];
            return (
              <div key={i} style={{ background: C.cardDeep, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "14px 16px" }}>
                <Label color={C.goldDeep} style={{ marginBottom: "6px", fontSize: "8px" }}>{labels[i]}</Label>
                <div style={{ fontFamily: F.display, fontSize: "14px", fontWeight: 600, color: C.ink, marginBottom: "8px" }}>{gk.name}</div>
                {[{ l: "Shadow", v: gk.shadow, c: C.terracotta }, { l: "Gift", v: gk.gift, c: C.evergreenD }, { l: "Siddhi", v: gk.siddhi, c: C.goldDeep }].map(({ l, v, c }) => (
                  <div key={l} style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "3px" }}>
                    <span style={{ fontFamily: F.mono, fontSize: "8px", color: C.inkMute, letterSpacing: "0.1em", width: "42px" }}>{l}</span>
                    <span style={{ fontFamily: F.body, fontSize: "12px", fontWeight: 700, color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing CTA */}
      {data.closingHook && (
        <div style={{
          marginTop: "48px", background: C.evergreenD,
          borderRadius: "2px", padding: "40px 44px", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <SpectrumBar style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
          <SpectrumBar style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />
          <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.28em", color: C.sage, marginBottom: "16px" }}>WHAT THIS READING IS POINTING TOWARD</div>
          <p style={{ fontFamily: F.display, fontSize: "clamp(17px,2.5vw,24px)", fontStyle: "italic", color: C.cardWarm, lineHeight: 1.6, margin: "0 0 28px", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>
            {data.closingHook}
          </p>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{
            display: "inline-block", padding: "16px 40px",
            background: C.terracotta, color: C.bg,
            fontFamily: F.mono, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase",
            textDecoration: "none", borderRadius: "2px",
          }}>
            Book a Full Reading →
          </a>
          <div style={{ fontFamily: F.body, fontSize: "12px", color: C.sage, fontStyle: "italic", marginTop: "14px" }}>
            You'll receive your full reading PDF before the session so you can sit with it first.
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({ name: "", date: "", time: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const topRef = useRef(null);

  const LOADING_MESSAGES = [
    "Calculating your natal positions...",
    "Reading your Human Design chart...",
    "Mapping your Gene Keys...",
    "Almost there...",
  ];

  const generate = async () => {
    if (!form.name || !form.date || !form.time || !form.location) {
      setError("All four fields are required for an accurate reading.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    let msgIndex = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]);
    }, 5000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 4000,
          messages: [{ role: "user", content: buildTeaserPrompt(form) }],
        }),
      });

      const text = await res.text();
      if (!text) throw new Error("Empty response from server");

      const data = JSON.parse(text);
      if (data.error) throw new Error(data.error);

      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, m => m.replace(/```json\n?|```\n?/g, "")).replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      setResult(parsed);
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError("Something went wrong generating your reading. Please try again.");
      console.error(e);
    }

    clearInterval(msgInterval);
    setLoading(false);
  };

  const inp = {
    width: "100%", background: C.cardWarm, border: `1px solid ${C.rule}`,
    borderRadius: "2px", padding: "12px 16px", color: C.ink,
    fontFamily: F.body, fontSize: "14px", outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: F.body }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.rule}`, position: "sticky", top: 0, background: C.bg, zIndex: 100 }}>
        <SpectrumBar />
        <div style={{ padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: "8px", letterSpacing: "0.3em", color: C.inkMute, marginBottom: "2px" }}>INTEGRATED CHART ANALYSIS</div>
            <div style={{ fontFamily: F.display, fontSize: "20px", fontWeight: 600, color: C.ink, letterSpacing: "0.04em" }}>Luminal Method</div>
          </div>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.15em", color: C.terracotta,
            textDecoration: "none", textTransform: "uppercase",
          }}>Book a Session →</a>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px 100px" }} ref={topRef}>

        {!result && (
          <div>
            <div style={{ marginBottom: "40px", textAlign: "center" }}>
              <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.3em", color: C.inkMute, marginBottom: "16px" }}>ASTROLOGY · HUMAN DESIGN · GENE KEYS</div>
              <h1 style={{ fontFamily: F.display, fontSize: "clamp(30px,5vw,56px)", fontWeight: 600, fontStyle: "italic", lineHeight: 1.15, margin: "0 0 20px", color: C.ink }}>
                Find Out What's Been<br />Running Underneath Everything
              </h1>
              <p style={{ fontFamily: F.body, fontSize: "15px", color: C.inkMute, lineHeight: 1.8, maxWidth: "480px", margin: "0 auto" }}>
                You already know something has been running underneath everything. This is what it is, where it came from, and what to do with it.
              </p>
              <SpectrumBar style={{ maxWidth: "100px", margin: "24px auto 0" }} />
            </div>

            <div style={{ background: C.cardWarm, border: `1px solid ${C.rule}`, borderRadius: "2px", padding: "36px 40px", maxWidth: "600px", margin: "0 auto" }}>
              <SpectrumBar style={{ marginBottom: "28px" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "Full Birth Name", name: "name", type: "text", placeholder: "As on birth certificate", col: "span 2" },
                  { label: "Date of Birth", name: "date", type: "date", col: "span 1" },
                  { label: "Exact Time of Birth", name: "time", type: "time", col: "span 1", note: "Even 4 minutes shifts the chart. Use your birth certificate." },
                  { label: "City, State & Country of Birth", name: "location", type: "text", placeholder: "e.g. Portland, Oregon, USA", col: "span 2" },
                ].map(f => (
                  <div key={f.name} style={{ gridColumn: f.col }}>
                    <Label style={{ marginBottom: "6px" }}>{f.label}</Label>
                    <input type={f.type} value={form[f.name]} onChange={e => setForm(p => ({ ...p, [f.name]: e.target.value }))} placeholder={f.placeholder || ""} style={inp} />
                    {f.note && <p style={{ fontFamily: F.mono, fontSize: "9px", color: C.terracotta, marginTop: "5px", lineHeight: 1.6 }}>{f.note}</p>}
                  </div>
                ))}
              </div>

              {error && <p style={{ fontFamily: F.mono, fontSize: "10px", color: C.terracotta, marginTop: "14px" }}>{error}</p>}

              <button onClick={generate} disabled={loading} style={{
                marginTop: "24px", width: "100%", padding: "16px",
                background: loading ? C.cardDeep : C.terracotta,
                border: "none", borderRadius: "2px",
                color: loading ? C.inkMute : C.bg,
                fontFamily: F.mono, fontSize: "10px", letterSpacing: "0.22em",
                textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
              }}>
                {loading ? "GENERATING YOUR READING..." : "GENERATE MY READING"}
              </button>

              {loading && (
                <p style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "14px", color: C.inkMute, textAlign: "center", marginTop: "14px" }}>
                  {loadingMsg}
                </p>
              )}
            </div>
          </div>
        )}

        {result && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
              <button onClick={() => { setResult(null); setForm({ name: "", date: "", time: "", location: "" }); }} style={{
                padding: "10px 18px", background: "transparent", border: `1px solid ${C.rule}`,
                borderRadius: "2px", fontFamily: F.mono, fontSize: "9px",
                letterSpacing: "0.15em", color: C.inkMute, cursor: "pointer",
              }}>
                ← NEW READING
              </button>
            </div>
            <TeaserDisplay data={result} />
          </div>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${C.rule}`, padding: "20px 32px", textAlign: "center" }}>
        <SpectrumBar style={{ marginBottom: "16px" }} />
        <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "0.2em", color: C.inkMute }}>
          LUMINAL METHOD · CAROLINE KOS
        </div>
      </div>
    </div>
  );
}
