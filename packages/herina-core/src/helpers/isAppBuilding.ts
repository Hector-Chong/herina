const isAppBuilding = () => {
  const args = process.argv || [];
  const devArgIdx = args.findIndex((arg) => arg === "--dev");

  if (devArgIdx >= 0) {
    const nextArg = args[devArgIdx + 1];

    return nextArg.startsWith("--") ? false : !JSON.parse(nextArg);
  } else {
    return false;
  }
};

export default isAppBuilding;
