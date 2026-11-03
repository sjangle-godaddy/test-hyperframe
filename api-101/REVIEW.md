# Review

## Calls I made

- No audio, by request: every scene is timed to the script at 2.2 words a second and the narration shows as captions.
- The script was lightly edited for grammar on screen ("retring", "you money", "Govn employee" became "retrying", "your money", "Govt employees").
- The "₹30" fare, booking #4821 and key 7f3a-91c2 are illustrative.
- Scenes are generated: edit `tools/script.mjs` (lines and timing) or `tools/scenes.mjs` (look and motion), then run `node tools/build.mjs`.
- A real voiceover will not match the estimated timing; record it, transcribe it, and retime the line cues.

## Measured

- `npx hyperframes check`: passes with 0 errors.
- Warnings kept: `film_silent` (asked for no audio), `timeline_track_too_dense` on the captions file (one caption track by design).

## Not checked

- No frames were looked at, per the house rule; the person reviews the Studio preview.
