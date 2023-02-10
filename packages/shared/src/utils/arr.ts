export const isArrayWithLength = (arr: any) =>
  Array.isArray(arr) && !!arr.length;

export const getArrayLastOne = <T>(arr: T[]) => arr[arr.length - 1];

export const removeArrDuplicatedItems = <T>(arr: T[]) =>
  [...new Set(arr)] as T[];
