import Sqids from '../sqids'

describe('encoding', () => {
  it('simple', () => {
    const sqids = new Sqids()

    const numbers = [1, 2, 3]
    const id = '8QRLaD'

    expect(sqids.encode(numbers)).toBe(id)
    expect(sqids.decode(id)).toEqual(numbers)
  })

  it('different inputs', () => {
    const sqids = new Sqids()

    const numbers = [
      0,
      0,
      0,
      1,
      2,
      3,
      100,
      1_000,
      100_000,
      1_000_000,
      sqids.maxValue(),
    ]
    expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers)
  })

  it('incremental numbers', () => {
    const sqids = new Sqids()

    const ids = {
      bV: [0],
      U9: [1],
      g8: [2],
      Ez: [3],
      V8: [4],
      ul: [5],
      O3: [6],
      AF: [7],
      ph: [8],
      n8: [9],
    }

    for (const [id, numbers] of Object.entries(ids)) {
      expect(sqids.encode(numbers)).toBe(id)
      expect(sqids.decode(id)).toEqual(numbers)
    }
  })

  it('incremental numbers, same index 0', () => {
    const sqids = new Sqids()

    const ids = {
      SrIu: [0, 0],
      nZqE: [0, 1],
      tJyf: [0, 2],
      e86S: [0, 3],
      rtC7: [0, 4],
      sQ8R: [0, 5],
      uz2n: [0, 6],
      '7Td9': [0, 7],
      '3nWE': [0, 8],
      mIxM: [0, 9],
    }

    for (const [id, numbers] of Object.entries(ids)) {
      expect(sqids.encode(numbers)).toBe(id)
      expect(sqids.decode(id)).toEqual(numbers)
    }
  })

  it('incremental numbers, same index 1', () => {
    const sqids = new Sqids()

    const ids = {
      SrIu: [0, 0],
      nbqh: [1, 0],
      t4yj: [2, 0],
      eQ6L: [3, 0],
      r4Cc: [4, 0],
      sL82: [5, 0],
      uo2f: [6, 0],
      '7Zdq': [7, 0],
      '36Wf': [8, 0],
      m4xT: [9, 0],
    }

    for (const [id, numbers] of Object.entries(ids)) {
      expect(sqids.encode(numbers)).toBe(id)
      expect(sqids.decode(id)).toEqual(numbers)
    }
  })

  it('multi input', () => {
    const sqids = new Sqids()

    const numbers = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
      39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
      75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
      93, 94, 95, 96, 97, 98, 99,
    ]
    const output = sqids.decode(sqids.encode(numbers))
    expect(numbers).toEqual(output)
  })

  it('encoding no numbers', () => {
    const sqids = new Sqids()
    expect(sqids.encode([])).toBe('')
  })

  it('decoding empty string', () => {
    const sqids = new Sqids()
    expect(sqids.decode('')).toEqual([])
  })

  it('decoding an ID with an invalid character', () => {
    const sqids = new Sqids()
    expect(sqids.decode('*')).toEqual([])
  })

  it('decoding an invalid ID with a repeating reserved character', () => {
    const sqids = new Sqids()
    expect(sqids.decode('fff')).toEqual([])
  })

  it('encode out-of-range numbers', () => {
    const sqids = new Sqids()
    const err = `Encoding supports numbers between ${sqids.minValue()} and ${sqids.maxValue()}`

    expect(() => sqids.encode([sqids.minValue() - 1])).toThrow(err)
    expect(() => sqids.encode([sqids.maxValue() + 1])).toThrow(err)
  })
})
