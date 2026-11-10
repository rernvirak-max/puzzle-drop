export interface SourceRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

/** Center-crop a photo to a square so every piece stays square. */
export function coverSquare(
  imageWidth: number,
  imageHeight: number
): SourceRect {
  const size = Math.min(imageWidth, imageHeight);
  return {
    sx: (imageWidth - size) / 2,
    sy: (imageHeight - size) / 2,
    sw: size,
    sh: size
  };
}

/** Source rectangle for the upright slice that belongs in this cell. */
export function pieceSourceRect(
  imageWidth: number,
  imageHeight: number,
  rows: number,
  cols: number,
  row: number,
  col: number
): SourceRect {
  const crop = coverSquare(imageWidth, imageHeight);
  const sw = crop.sw / cols;
  const sh = crop.sh / rows;
  return {
    sx: crop.sx + col * sw,
    sy: crop.sy + row * sh,
    sw,
    sh
  };
}
