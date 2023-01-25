export const promisifyNativeFunction = <T = unknown>(fn: Function) => {
  return (...args: any[]) => {
    return new Promise<T>((resolve, reject) => {
      fn(...args, (err, res) => {
        err ? reject(res) : resolve(res);
      });
    });
  };
};
