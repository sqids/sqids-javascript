import Sqids, { defaultOptions } from '../sqids'

const maxUint64 = (1n << 64n) - 1n

describe('bigint', () => {
  it('round-trips values across the uint64 range', () => {
    const sqids = new Sqids({ bigint: true })
    const numbers = [0n, 1n, BigInt(Number.MAX_SAFE_INTEGER), maxUint64]

    expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers)
  })

  it('uses the same encoding as number mode for safe integers', () => {
    const numberSqids = new Sqids()
    const bigintSqids = new Sqids({ bigint: true })

    expect(bigintSqids.encode([1n, 2n, 3n])).toBe(numberSqids.encode([1, 2, 3]))
  })

  it('round-trips padded IDs', () => {
    const sqids = new Sqids({
      bigint: true,
      minLength: defaultOptions.alphabet.length,
    })
    const numbers = [0n, maxUint64]

    expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers)
  })

  it('rejects values outside the uint64 range and non-bigints', () => {
    const sqids = new Sqids({ bigint: true })
    const encodingError = /Encoding supports bigints between 0n and/

    expect(() => sqids.encode([-1n])).toThrow(encodingError)
    expect(() => sqids.encode([maxUint64 + 1n])).toThrow(encodingError)

    // @ts-expect-error bigint mode accepts bigint values only
    expect(() => sqids.encode([1])).toThrow(encodingError)
  })

  it('does not decode unsafe bigint values in number mode', () => {
    const bigintSqids = new Sqids({ bigint: true })
    const numberSqids = new Sqids()
    const id = bigintSqids.encode([maxUint64])

    expect(bigintSqids.decode(id)).toEqual([maxUint64])
    expect(numberSqids.decode(id)).toEqual([])
  })

  it('preserves mode-specific return types', () => {
    expectTypeOf(new Sqids().decode('')).toEqualTypeOf<number[]>()
    expectTypeOf(new Sqids({ bigint: true }).decode('')).toEqualTypeOf<
      bigint[]
    >()
  })

  it('rejects bigints in number mode', () => {
    const sqids = new Sqids()
    const encodingError = /Encoding supports numbers between 0 and/

    // @ts-expect-error number mode accepts number values only
    expect(() => sqids.encode([1n])).toThrow(encodingError)
  })
})
