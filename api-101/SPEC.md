# API 101 - spec

GOAL: the viewer knows why a booking app needs timeouts, retries, backoff and idempotency, through one train ticket booking.
OUTPUT: HyperFrames, 1080 x 1080, 30 fps.
TIME: 114.81 s x 30 = 3444 frames, 8 scenes, paced at 2.2 spoken words per second (`tools/script.mjs`).

## Look

- Ground #0F0F11, cards #18181C with a 2 px #2C2C34 stroke and 18 px radius.
- Accents are single strokes only: orange #FF8A3D, blue #4DA3FF, green #3DDC97 (success).
- Safe box: 162 px (15%) on every edge, a 756 px square; title at its top, stage of 524 px below, captions at y 812.
- Titles: Permanent Marker 58 px, typed letter by letter with an orange caret, then a hand-drawn orange underline.
- Technical text: JetBrains Mono, 28 px minimum.

## Objects

- The booking app as a browser mockup with a Book button and spinner.
- Client and server as cards joined by dashed path links, with orange packets travelling along them.
- Terminals for logs, a bookings table, a bank statement, a ticket.

## Motion

- Scene open: safe box fades in, scale 0.94 to 1, back.out(1.6), 0.75 s.
- Card modules: back.out(1.8), 0.55 s; stamps slam from scale 1.45 with power4.out, 0.32 s.
- Typing: about 16 characters a second with seeded uneven intervals.
- Scene close: blur swap, 8 px, 0.3 s; the ground never cuts.

## Shots

1. hook 0-8.2 s: the Book button is clicked, the spinner turns, a wait counter climbs to 30 s.
2. timeouts 8.2-22.8 s: client gives up at 10 s, the server finishes at 12 s, the bookings table still says CONFIRMED.
3. retry 22.8-39.3 s: server crashes, the response is lost, retry 1 returns 200 OK.
4. backoff 39.3-65.5 s: 80 users turn orange, load hits 100% and 503; then the formula, a timeline with +1s, +2s, +4s arcs, and the retry limit.
5. debit 65.5-73.7 s: the bank statement fills with three identical debits.
6. idem 73.7-91.1 s: the same key is sent three times, the server marks it SEEN, the response says charged once.
7. recap 91.1-104.1 s: the four safeguards chain into a confirmed ticket.
8. outro 104.1-114.8 s: a terminal types like, comment, save, follow.

## Banned

Glow and bloom, gradients, three cards in a row, a docked logo, titles that move after they land.
