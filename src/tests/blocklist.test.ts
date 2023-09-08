import Sqids from '../sqids'

describe('blocklist', () => {
  it('if no custom blocklist param, use the default blocklist', () => {
    const sqids = new Sqids()

    expect(sqids.decode('aho1e')).toEqual([4_572_721])
    expect(sqids.encode([4_572_721])).toBe('JExTR')
  })

  it(`if an empty blocklist param passed, don't use any blocklist`, () => {
    const sqids = new Sqids({
      blocklist: new Set([]),
    })

    expect(sqids.decode('aho1e')).toEqual([4_572_721])
    expect(sqids.encode([4_572_721])).toBe('aho1e')
  })

  it('if a non-empty blocklist param passed, use only that', () => {
    const sqids = new Sqids({
      blocklist: new Set([
        'ArUO', // originally encoded [100000]
      ]),
    })

    // make sure we don't use the default blocklist
    expect(sqids.decode('aho1e')).toEqual([4_572_721])
    expect(sqids.encode([4_572_721])).toBe('aho1e')

    // make sure we are using the passed blocklist
    expect(sqids.decode('ArUO')).toEqual([100_000])
    expect(sqids.encode([100_000])).toBe('QyG4')
    expect(sqids.decode('QyG4')).toEqual([100_000])
  })

  it('blocklist', () => {
    const sqids = new Sqids({
      blocklist: new Set([
        'JSwXFaosAN', // normal result of 1st encoding, let's block that word on purpose
        'OCjV9JK64o', // result of 2nd encoding
        'rBHf', // result of 3rd encoding is `4rBHfOiqd3`, let's block a substring
        '79SM', // result of 4th encoding is `dyhgw479SM`, let's block the postfix
        '7tE6', // result of 4th encoding is `7tE6jdAHLe`, let's block the prefix
      ]),
    })

    expect(sqids.encode([1_000_000, 2_000_000])).toBe('1aYeB7bRUt')
    expect(sqids.decode('1aYeB7bRUt')).toEqual([1_000_000, 2_000_000])
  })

  it('decoding blocklist words should still work', () => {
    const sqids = new Sqids({
      blocklist: new Set(['86Rf07', 'se8ojk', 'ARsz1p', 'Q8AI49', '5sQRZO']),
    })

    expect(sqids.decode('86Rf07')).toEqual([1, 2, 3])
    expect(sqids.decode('se8ojk')).toEqual([1, 2, 3])
    expect(sqids.decode('ARsz1p')).toEqual([1, 2, 3])
    expect(sqids.decode('Q8AI49')).toEqual([1, 2, 3])
    expect(sqids.decode('5sQRZO')).toEqual([1, 2, 3])
  })

  it('match against a short blocklist word', () => {
    const sqids = new Sqids({
      blocklist: new Set(['pnd']),
    })

    expect(sqids.decode(sqids.encode([1_000]))).toEqual([1_000])
  })

  it('blocklist filtering in constructor', () => {
    const sqids = new Sqids({
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      blocklist: new Set(['sxnzkl']), // lowercase blocklist in only-uppercase alphabet
    })

    const id = sqids.encode([1, 2, 3])
    const numbers = sqids.decode(id)

    expect(id).toBe('IBSHOZ') // without blocklist, would've been "SXNZKL"
    expect(numbers).toEqual([1, 2, 3])
  })

  it('max encoding attempts', () => {
    const alphabet = 'abc'
    const minLength = 3
    const blocklist = new Set(['cab', 'abc', 'bca'])

    const sqids = new Sqids({
      alphabet,
      minLength,
      blocklist,
    })

    expect(alphabet).toHaveLength(minLength)
    expect(blocklist.size).toEqual(minLength)

    expect(() => sqids.encode([0])).toThrow(
      'Reached max attempts to re-generate the ID',
    )
  })
})
