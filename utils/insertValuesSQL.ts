export function insertSQLValue(
  array: any[],
  index: number,
  item: string | number
) {
  array.splice(index, 0, item);
}
