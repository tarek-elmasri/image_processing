// more about this technique @
// https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
export const isPositiveNum = (num: string) =>
  !isNaN(num as unknown as number) &&
  !isNaN(parseInt(num)) &&
  parseInt(num) > 0;
