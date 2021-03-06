import { randomBytes } from 'crypto';

function createRandomHexId(): string {
  return randomBytes(8).toString('hex');
}

export { createRandomHexId };

// import getRandomValues from 'get-random-values';

// function createRandomHexId(): string {
//   function hex(s: any, b: any) {
//     return (
//       s +
//       (b >>> 4).toString(16) + // high nibble
//       (b & 15).toString(16)
//     ); // low nibble
//   }

//   const r = getRandomValues(new Uint8Array(16));

//   r[6] = (r[6] >>> 4) | 0b01000000; // Set type 4: 0100
//   r[8] = (r[8] >>> 3) | 0b10000000; // Set variant: 100

//   return (
//     r.slice(0, 4).reduce(hex, '') +
//     r.slice(4, 6).reduce(hex, '-') +
//     r.slice(6, 8).reduce(hex, '-') +
//     r.slice(8, 10).reduce(hex, '-') +
//     r.slice(10, 16).reduce(hex, '-')
//   );
// }
