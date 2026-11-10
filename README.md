# Puzzle Drop

A private falling-piece jigsaw. A photo is cut into a grid, the pieces fall
one at a time, and each one locks only when it lands in its own cell, upright.

Week 1 is a local game: no account, no server, no ads. It is meant to be
played on a phone, and Capacitor can wrap the same build later.

## Run

```bash
npm install
npm run dev
```

The dev server opens at http://localhost:9000.

```bash
npm test
npm run lint
npm run format:check
npm run build
```

`npm run build` writes the static site to `dist/spa`.

## Play

- Swipe or drag sideways, or use the arrow keys, to move the falling piece.
- Tap the board, the Turn button, or the up arrow to rotate it.
- Swipe down, the Drop button, or space to hard-drop.
- A correct cell with the gold edge on top locks and scores. Anything else
  costs one of three lives and the piece returns to the queue.
- P or Escape pauses. Best scores are stored on this device, one per picture.

Choose a grid of 3×3, 4×4, or 5×5. **Use my photo** plays an image from the
phone and never uploads it.

## Photos

The built-in pictures are real photographs of Cambodia. Credits, source
pages, and licenses are in [CREDITS.md](CREDITS.md).

## Capacitor

`src-capacitor/capacitor.config.ts` is the Quasar Capacitor config
(`appId` `app.puzzledrop.game`). iOS and Android projects are not generated
yet, and there is no store build.
