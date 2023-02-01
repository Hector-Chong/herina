import { terminal } from "terminal-kit";

export const warn = (msg: string) => {
  terminal.yellow().bold("(!) Herina:").yellow.bold(` ${msg}\n`);
};
