# Puzzle Drop

A private picture-tile puzzle. Several photos are cut into tiles and mixed
across a 4×4 board. Drag any tile onto any other tile to swap them. When one
photo sits together in the right order, it merges, shows a short “Good”,
shrinks away, and that column’s face-down stack refills the gaps.

There is no timer and no move limit. Hint highlights one picture. Magic
finishes one picture for you. Your level and power-up counts stay on this
device.

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

The built-in pictures are real photographs. Credits, source pages, and
licenses are in [CREDITS.md](CREDITS.md). **Use my photo** in Settings plays
a picture from the phone and never uploads it.

## Levels

Level templates live in `src/game/levels.ts`. Each picture is a 2×2, 2×3, or
3×3 block. Extra tiles sit in the four reserve stacks. Add a level by adding
an entry to `LEVELS`.

## Capacitor

`src-capacitor/capacitor.config.ts` is ready for a later wrap
(`app.puzzledrop.game`). iOS and Android projects are not generated yet.
