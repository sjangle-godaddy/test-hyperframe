// Single source of truth for the narration timing. Run: node tools/script.mjs
export const WPS = 2.2;
export const scenes = [
  { id: "hook", title: "Morning rush", lines: [
    "Imagine booking a train ticket during the morning rush,",
    "and the app keeps spinning."] },
  { id: "timeouts", title: "Timeouts", lines: [
    "That's where timeouts come in.",
    "Clients can put a limit on waiting;",
    "servers can limit processing time.",
    "But a timeout doesn't automatically cancel or undo a booking."] },
  { id: "retry", title: "Retry", lines: [
    "But you still need that ticket, right?",
    "Maybe the server crashed before sending your response.",
    "This is where retry helps:",
    "it sends the request again, giving it another chance to succeed."] },
  { id: "backoff", title: "Exponential backoff", lines: [
    "But you're not alone retrying, right?",
    "Millions of users retry while the initial requests are still being processed.",
    "This can overload the server.",
    "That's why we use exponential backoff:",
    "increase the delay between retries: one second, then two, then four,",
    "and on top of it, we add a retry limit too."] },
  { id: "debit", title: "Charged twice?", lines: [
    "Your money was already debited.",
    "Will retrying again cause multiple debits from your account?"] },
  { id: "idem", title: "Idempotency", lines: [
    "That's where idempotency comes in.",
    "It sends a unique key with the first booking request and reuses it on retries.",
    "If that booking already succeeded,",
    "the server returns its result without charging again."] },
  { id: "recap", title: "Ship the safeguards", lines: [
    "So when you build an app, include these safeguards,",
    "so everyone can catch the train.",
    "Govt employees, please learn something and improve your app."] },
  { id: "outro", title: "See you next time", lines: [
    "Like, comment, and save if this was useful.",
    "Follow for more interesting content.",
    "See you in the next one."] },
];
const HEAD = 0.6, GAP = 0.3, TAIL = 0.9;
let t = 0;
export const timed = scenes.map((s) => {
  const start = t; let local = HEAD;
  const lines = s.lines.map((text) => {
    const w = text.split(/\s+/).length;
    const dur = +Math.max(1.8, w / WPS).toFixed(2);
    const l = { text, words: w, start: +local.toFixed(2), end: +(local + dur).toFixed(2) };
    local += dur + GAP; return l;
  });
  const duration = +(local - GAP + TAIL).toFixed(2);
  t = +(t + duration).toFixed(2);
  return { ...s, start, duration, lines };
});
if (process.argv[1].endsWith("script.mjs")) {
  for (const s of timed) {
    console.log(`${s.id}  start=${s.start}  dur=${s.duration}`);
    for (const l of s.lines) console.log(`   ${l.start}-${l.end}  (${l.words}w) ${l.text}`);
  }
  console.log("TOTAL", t);
}
