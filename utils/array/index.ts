/** @description 数组对换位置 */
export const arrayMove = <T>(
  list: T[],
  oldIndex: number,
  newIndex: number
): T[] => {
  if (oldIndex < 0 || newIndex > list.length - 1) {
    return list;
  }
  const temp = list[oldIndex];
  list[oldIndex] = list[newIndex];
  list[newIndex] = temp;
  return list;
};
