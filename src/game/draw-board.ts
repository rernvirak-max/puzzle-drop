import { canActiveFall, columnLandingRow } from "./engine";
import { pieceSourceRect } from "./geometry";
import type { GameSnapshot, Piece, QuarterTurns } from "./types";

export interface LockPulse {
  row: number;
  col: number;
  at: number;
}

export interface Slam {
  pieceId: string;
  fromRow: number;
  toRow: number;
  col: number;
  rotation: QuarterTurns;
  started: number;
  duration: number;
  kind: "lock" | "miss";
}

export interface DrawBoardInput {
  snapshot: GameSnapshot;
  image: CanvasImageSource;
  imageWidth: number;
  imageHeight: number;
  width: number;
  height: number;
  progress: number;
  now: number;
  pulses: readonly LockPulse[];
  slam: Slam | null;
}

const GOLD = "#e4b15c";
const PAPER = "rgba(246, 240, 230, 0.34)";

export function drawBoard(
  ctx: CanvasRenderingContext2D,
  input: DrawBoardInput
): void {
  const { snapshot, width, height } = input;
  const metrics = metricsFor(width, height, snapshot.rows, snapshot.cols);
  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  traceRound(
    ctx,
    metrics.originX,
    metrics.originY,
    metrics.boardWidth,
    metrics.boardHeight,
    18
  );
  ctx.fillStyle = "#1a2c26";
  ctx.fill();

  ctx.save();
  ctx.clip();
  if (input.imageWidth > 0 && input.imageHeight > 0) {
    const crop = pieceSourceRect(
      input.imageWidth,
      input.imageHeight,
      1,
      1,
      0,
      0
    );
    ctx.globalAlpha = 0.22;
    ctx.drawImage(
      input.image,
      crop.sx,
      crop.sy,
      crop.sw,
      crop.sh,
      metrics.originX,
      metrics.originY,
      metrics.boardWidth,
      metrics.boardHeight
    );
    ctx.globalAlpha = 1;
  }

  const hiddenLock = input.slam?.kind === "lock" ? input.slam : null;
  for (let row = 0; row < snapshot.rows; row += 1) {
    for (let col = 0; col < snapshot.cols; col += 1) {
      const id = snapshot.locked[row]?.[col];
      const cell = cellRect(metrics, row, col);
      if (
        !id ||
        (hiddenLock && hiddenLock.toRow === row && hiddenLock.col === col)
      ) {
        ctx.strokeStyle = PAPER;
        ctx.lineWidth = 1;
        ctx.strokeRect(
          cell.x + 0.5,
          cell.y + 0.5,
          cell.size - 1,
          cell.size - 1
        );
        continue;
      }
      const piece = findPiece(snapshot, id);
      if (!piece) continue;
      drawSlice(ctx, input, piece, cell.x, cell.y, cell.size, 0, 1, false);
    }
  }
  ctx.restore();

  const active = snapshot.active;
  if (active && input.imageWidth > 0) {
    const landing = columnLandingRow(snapshot.locked, active.col);
    const visualRow = canActiveFall(snapshot)
      ? active.row + input.progress
      : active.row;
    if (landing >= 0 && Math.abs(visualRow - landing) > 0.12) {
      const ghost = cellRect(metrics, landing, active.col);
      const piece = findPiece(snapshot, active.id);
      if (piece) {
        drawSlice(
          ctx,
          input,
          piece,
          ghost.x,
          ghost.y,
          ghost.size,
          active.rotation,
          0.4,
          true
        );
      }
    }
    const piece = findPiece(snapshot, active.id);
    if (piece) {
      const spot = cellRect(metrics, visualRow, active.col);
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 8;
      drawSlice(
        ctx,
        input,
        piece,
        spot.x,
        spot.y,
        spot.size,
        active.rotation,
        1,
        true
      );
      ctx.restore();
    }
  }

  if (input.slam && input.imageWidth > 0) {
    const slam = input.slam;
    const elapsed = Math.min(1, (input.now - slam.started) / slam.duration);
    const eased = elapsed * elapsed;
    const row = slam.fromRow + (slam.toRow - slam.fromRow) * eased;
    const spot = cellRect(metrics, row, slam.col);
    const piece = findPiece(snapshot, slam.pieceId);
    if (piece) {
      const alpha = slam.kind === "miss" ? 1 - elapsed * 0.8 : 1;
      drawSlice(
        ctx,
        input,
        piece,
        spot.x,
        spot.y,
        spot.size,
        slam.rotation,
        alpha,
        true
      );
    }
  }

  for (const pulse of input.pulses) {
    const age = (input.now - pulse.at) / 360;
    if (age < 0 || age >= 1) continue;
    const cell = cellRect(metrics, pulse.row, pulse.col);
    const inset = (1 - age) * Math.min(12, cell.size * 0.16);
    ctx.save();
    ctx.strokeStyle = `rgba(228, 177, 92, ${1 - age})`;
    ctx.lineWidth = 3;
    ctx.strokeRect(
      cell.x + inset,
      cell.y + inset,
      cell.size - inset * 2,
      cell.size - inset * 2
    );
    ctx.fillStyle = `rgba(255, 244, 214, ${(1 - age) * 0.28})`;
    ctx.fillRect(cell.x, cell.y, cell.size, cell.size);
    ctx.restore();
  }

  traceRound(
    ctx,
    metrics.originX,
    metrics.originY,
    metrics.boardWidth,
    metrics.boardHeight,
    18
  );
  ctx.strokeStyle = "rgba(228, 177, 92, 0.55)";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (input.imageWidth === 0) {
    ctx.fillStyle = "#f6f0e6";
    ctx.font = "600 16px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      "Loading the picture…",
      width / 2,
      metrics.originY + metrics.boardHeight / 2
    );
  }
}

export function drawPieceThumb(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  imageWidth: number,
  imageHeight: number,
  snapshot: GameSnapshot,
  pieceId: string,
  size: number
): void {
  const piece = findPiece(snapshot, pieceId);
  ctx.clearRect(0, 0, size, size);
  if (!piece || imageWidth <= 0) return;
  const rect = pieceSourceRect(
    imageWidth,
    imageHeight,
    snapshot.rows,
    snapshot.cols,
    piece.row,
    piece.col
  );
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(image, rect.sx, rect.sy, rect.sw, rect.sh, 0, 0, size, size);
}

interface Metrics {
  cell: number;
  originX: number;
  originY: number;
  boardWidth: number;
  boardHeight: number;
}

function metricsFor(
  width: number,
  height: number,
  rows: number,
  cols: number
): Metrics {
  const cell = Math.min(width / cols, height / (rows + 1));
  const boardWidth = cell * cols;
  const boardHeight = cell * rows;
  const groupHeight = boardHeight + cell;
  return {
    cell,
    boardWidth,
    boardHeight,
    originX: (width - boardWidth) / 2,
    originY: (height - groupHeight) / 2 + cell
  };
}

function cellRect(metrics: Metrics, row: number, col: number) {
  return {
    x: metrics.originX + col * metrics.cell,
    y: metrics.originY + row * metrics.cell,
    size: metrics.cell
  };
}

function findPiece(snapshot: GameSnapshot, id: string): Piece | undefined {
  return snapshot.pieces.find(piece => piece.id === id);
}

function drawSlice(
  ctx: CanvasRenderingContext2D,
  input: DrawBoardInput,
  piece: Piece,
  x: number,
  y: number,
  size: number,
  turns: QuarterTurns,
  alpha: number,
  mark: boolean
): void {
  const rect = pieceSourceRect(
    input.imageWidth,
    input.imageHeight,
    input.snapshot.rows,
    input.snapshot.cols,
    piece.row,
    piece.col
  );
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate((turns * Math.PI) / 2);
  ctx.drawImage(
    input.image,
    rect.sx,
    rect.sy,
    rect.sw,
    rect.sh,
    -size / 2,
    -size / 2,
    size,
    size
  );
  if (mark) {
    const pip = Math.max(8, size * 0.18);
    ctx.fillStyle = GOLD;
    ctx.beginPath();
    ctx.moveTo(0, -size / 2 + 4);
    ctx.lineTo(pip / 2, -size / 2 + 4 + pip * 0.72);
    ctx.lineTo(-pip / 2, -size / 2 + 4 + pip * 0.72);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function traceRound(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}
