export const getGlobalContext = (): any =>
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : // @ts-ignore
    typeof window !== "undefined"
    ? // @ts-ignore
      window
    : this;

// @ts-ignore
export const isProd = () => typeof env === "string" && env === "prod";
