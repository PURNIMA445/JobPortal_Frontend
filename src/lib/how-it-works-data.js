// src/lib/how-it-works-data.js
// Pure JS — no "use client" needed. Import freely from server or client.

export const BRAND_BLUE = "rose-500";

export const steps = [
  {
    number: "01",
    title: "Discovery Call",
    subtitle: "We listen first.",
    desc: "We kick off with a focused 30-minute call to understand your goals, constraints, and timeline. No sales pitch — just honest conversation about what you need.",
    icon: "◎",
    tag: "Day 1",
  },
  {
    number: "02",
    title: "Scope & Proposal",
    subtitle: "Clarity before commitment.",
    desc: "Within 48 hours we send a clear, plain-English proposal: what we'll build, how long it'll take, and what it costs. No hidden fees, no vague estimates.",
    icon: "◈",
    tag: "Day 2–3",
  },
  {
    number: "03",
    title: "Design Sprint",
    subtitle: "See it before we build it.",
    desc: "Our designers produce high-fidelity mockups in Figma. You review, give feedback, and sign off before a single line of production code is written.",
    icon: "◐",
    tag: "Week 1–2",
  },
  {
    number: "04",
    title: "Build & Review",
    subtitle: "Iterative, transparent progress.",
    desc: "We build in short cycles and share live previews every week. You always know exactly where things stand — no radio silence, no surprises at the end.",
    icon: "◇",
    tag: "Week 2–6",
  },
  {
    number: "05",
    title: "QA & Polish",
    subtitle: "We sweat the details.",
    desc: "Before anything ships, every screen is tested across devices, browsers, and edge cases. Accessibility, performance, and design fidelity all checked.",
    icon: "◑",
    tag: "Week 6–7",
  },
  {
    number: "06",
    title: "Launch & Handoff",
    subtitle: "Yours, fully.",
    desc: "We deploy, monitor the first 48 hours together, and hand over documentation, source code, and a recorded walkthrough. You own everything.",
    icon: "◉",
    tag: "Week 7–8",
  },
];

export const faqs = [
  {
    q: "How long does a typical project take?",
    a: "Most projects run 6–10 weeks from signed proposal to launch. Scope is the biggest variable — we'll give you a precise estimate after the discovery call.",
  },
  {
    q: "Do you work with early-stage startups?",
    a: "Yes. We've helped founders go from napkin sketch to shipped product. We're comfortable with ambiguity and can help you define scope if you're still figuring it out.",
  },
  {
    q: "What if I need changes after launch?",
    a: "We offer a 30-day post-launch support window at no extra cost. After that, most clients move to a monthly retainer or book us for follow-on sprints.",
  },
  {
    q: "Can I see work you've done before?",
    a: "Absolutely — reach out and we'll share case studies relevant to your industry. Some client work is under NDA, so we share selectively after a quick intro.",
  },
];

export const highlights = [
  { value: "48h",  label: "Proposal turnaround" },
  { value: "100%", label: "Ownership transferred" },
  { value: "30d",  label: "Post-launch support"  },
  { value: "0",    label: "Hidden fees"           },
];

// Framer Motion variants
export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay },
  }),
};