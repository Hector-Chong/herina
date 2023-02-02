export const getGlobalContext = (): any =>
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : this;

// @ts-ignore
export const isProd = () => typeof env === "string" && env === "prod";
