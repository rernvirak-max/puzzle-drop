/**
 * Add types (that are not auto-magically added by Quasar CLI already)
 * for your custom variables to avoid TypeScript errors, like dynamic
 * process.env variables or definitions in dotenv files configured ONLY
 * for the /quasar.config file itself.
 *
 * https://quasar.dev/quasar-cli-vite/handling-import-meta-env#type-inference
 *
 * @example
 * interface ImportMetaEnv {
 *   readonly MY_VAR: string;
 *   readonly MY_OTHER_VAR: string;
 * }
 */
interface ImportMetaEnv {}

interface PuzzleDebug {
  prepare?: () => {
    from: { row: number; col: number };
    to: { row: number; col: number };
  } | null;
  prepareJoin?: () => {
    join: {
      from: { row: number; col: number };
      to: { row: number; col: number };
    };
    grow: {
      from: { row: number; col: number };
      to: { row: number; col: number };
    };
    finish: {
      from: { row: number; col: number };
      to: { row: number; col: number };
    };
  };
  theme?: (id: "meadow" | "sunrise" | "breeze") => void;
  armWin?: () => {
    from: { row: number; col: number };
    to: { row: number; col: number };
  };
  swap?: (
    rowA: number,
    colA: number,
    rowB: number,
    colB: number
  ) => Promise<void>;
  busy?: () => boolean;
  good?: () => boolean;
  home?: () => void;
  play?: () => void;
}

interface Window {
  __puzzle?: PuzzleDebug;
}
