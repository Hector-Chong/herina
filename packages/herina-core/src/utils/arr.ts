export const isArrayWithLength = (arr: any) =>
  Array.isArray(arr) && !!arr.length;

export const getArrayLastOne = <T>(arr: T[]) => arr[arr.length - 1];
