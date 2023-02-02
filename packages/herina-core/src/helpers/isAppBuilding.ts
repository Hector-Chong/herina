const isAppBuilding = () => {
  const args = process.argv || [];
  const devArgIdx = args.findIndex((arg) => arg === "--dev");

  if (devArgIdx >= 0) {
    return !JSON.parse(args[devArgIdx + 1]);
  } else {
    return false;
  }
};

export default isAppBuilding;
