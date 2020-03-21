import { TwainTextNode } from "../types";

/*
00    h1
01      h2
02        h3
03    h1
04      h3
05        p
06      h2   <-- still comes after the h3, as its sibling
07        p
08        p
09        p
10      h2
12        p
11        h6
13    h1
*/

const levels = [1, 2, 3, 1, 3, 0, 2, 0, 0, 0, 2, 0, 6, 1];
export const basicStack1: TwainTextNode[] = levels.map((num, i) => {
  const tag = num === 0 ? "p" : `h${ num }`;
  return [tag, `${ i }. this is a ${ tag }`]
});
