# Puzzle Drop

A private picture-tile puzzle. The home screen lists themed levels. On the
board, drag any tile onto any other to swap them. When a photo sits in the
right order it merges, shows Good, Great, or Perfect, shrinks away, and that
column’s stack refills the gaps. New tiles flip as they land.

There is no timer and no move limit. Hint highlights one picture. Magic
finishes one picture for you. Sound can be muted. Your level and power-up
counts stay on this device.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:9000.

```bash
npm test
npm run lint
npm run format:check
npm run build
```

## Photos

Forty-nine real photographs of Cambodia and Khmer life are included, in
WebP. Credits, source pages, and licenses are in [CREDITS.md](CREDITS.md).
**Use my photo** on the home screen plays a picture from the phone and never
uploads it.

## Levels

Level templates live in `src/game/levels.ts`. Each picture is a 2×2, 2×3, or
3×3 block. Extra tiles sit in the four reserve stacks. Add a level by adding
an entry to `LEVELS`.

## Capacitor

`src-capacitor/capacitor.config.ts` is ready for a later wrap
(`app.puzzledrop.game`). iOS and Android projects are not generated yet.
