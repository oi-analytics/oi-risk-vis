/**
 * Common helper functions
 *
 */

function commas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function titleCase(str: string): string {
  const splitStr = str.toLowerCase().split(" ");
  for (let k = 0; k < splitStr.length; k++) {
    splitStr[k] =
      splitStr[k].charAt(0).toUpperCase() + splitStr[k].substring(1);
  }
  return splitStr.join(" ");
}

export { commas, titleCase };
