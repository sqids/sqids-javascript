import Sqids, { defaultOptions } from '../sqids'

const upper = 1_000_000

describe('uniques', () => {
  it('uniques, with padding', () => {
    const sqids = new Sqids({
      minLength: defaultOptions.alphabet.length,
    })
    const set = new Set<string>()

    for (let i = 0; i !== upper; i++) {
      const numbers = [i]
      const id = sqids.encode(numbers)
      set.add(id)
      expect(sqids.decode(id)).toEqual(numbers)
    }

    expect(set.size).toBe(upper)
  })

  it('uniques, low ranges', () => {
    const sqids = new Sqids()
    const set = new Set<string>()

    for (let i = 0; i !== upper; i++) {
      const numbers = [i]
      const id = sqids.encode(numbers)
      set.add(id)
      expect(sqids.decode(id)).toEqual(numbers)
    }

    expect(set.size).toBe(upper)
  })

  it('uniques, high ranges', () => {
    const sqids = new Sqids()
    const set = new Set<string>()

    for (let i = 100_000_000; i !== 100_000_000 + upper; i++) {
      const numbers = [i]
      const id = sqids.encode(numbers)
      set.add(id)
      expect(sqids.decode(id)).toEqual(numbers)
    }

    expect(set.size).toBe(upper)
  })

  it('uniques, multi', () => {
    const sqids = new Sqids()
    const set = new Set<string>()

    for (let i = 0; i !== upper; i++) {
      const numbers = [i, i, i, i, i]
      const id = sqids.encode(numbers)
      set.add(id)
      expect(sqids.decode(id)).toEqual(numbers)
    }

    expect(set.size).toBe(upper)
  })
})
