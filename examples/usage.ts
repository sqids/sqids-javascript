import Sqids from '../src/sqids'

const numberSqids = new Sqids()
const numbers = [1, 2, 3]
const numberId = numberSqids.encode(numbers)

console.log('Number mode:')
console.log('  Input:', numbers)
console.log('  Encoded:', numberId)
console.log('  Decoded:', numberSqids.decode(numberId))

const unsafeNumber = Number.MAX_SAFE_INTEGER + 1

console.log('Number mode with an unsafe integer:')
console.log('  Input:', [unsafeNumber])

try {
  numberSqids.encode([unsafeNumber])
} catch (error) {
  console.log('  Error:', error instanceof Error ? error.message : error)
}

const bigintSqids = new Sqids({ bigint: true })
const bigints = [1n, 2n, BigInt(unsafeNumber)]
const bigintId = bigintSqids.encode(bigints)

console.log('BigInt mode:')
console.log('  Input:', bigints)
console.log('  Encoded:', bigintId)
console.log('  Decoded:', bigintSqids.decode(bigintId))

const maxUint64 = (1n << 64n) - 1n
const maxUint64Id = bigintSqids.encode([maxUint64])

console.log('Largest supported BigInt:')
console.log('  Input:', [maxUint64])
console.log('  Encoded:', maxUint64Id)
console.log('  Decoded:', bigintSqids.decode(maxUint64Id))
