import Sqids from '../sqids'

describe('blocklist', () => {
  it('if no custom blocklist param, use the default blocklist', () => {
    const sqids = new Sqids()

    expect(sqids.decode('sexy')).toEqual([200_044])
    expect(sqids.encode([200_044])).toBe('d171vI')
  })

  it(`if an empty blocklist param passed, don't use any blocklist`, () => {
    const sqids = new Sqids({
      blocklist: new Set([]),
    })

    expect(sqids.decode('sexy')).toEqual([200_044])
    expect(sqids.encode([200_044])).toBe('sexy')
  })

  it('if a non-empty blocklist param passed, use only that', () => {
    const sqids = new Sqids({
      blocklist: new Set([
        'AvTg', // originally encoded [100000]
      ]),
    })

    // make sure we don't use the default blocklist
    expect(sqids.decode('sexy')).toEqual([200_044])
    expect(sqids.encode([200_044])).toBe('sexy')

    // make sure we are using the passed blocklist
    expect(sqids.decode('AvTg')).toEqual([100_000])
    expect(sqids.encode([100_000])).toBe('7T1X8k')
    expect(sqids.decode('7T1X8k')).toEqual([100_000])
  })

  it('blocklist', () => {
    const sqids = new Sqids({
      blocklist: new Set([
        '8QRLaD', // normal result of 1st encoding, let's block that word on purpose
        '7T1cd0dL', // result of 2nd encoding
        'UeIe', // result of 3rd encoding is `RA8UeIe7`, let's block a substring
        'imhw', // result of 4th encoding is `WM3Limhw`, let's block the postfix
        'LfUQ', // result of 4th encoding is `LfUQh4HN`, let's block the prefix
      ]),
    })

    expect(sqids.encode([1, 2, 3])).toBe('TM0x1Mxz')
    expect(sqids.decode('TM0x1Mxz')).toEqual([1, 2, 3])
  })

  it('decoding blocklist words should still work', () => {
    const sqids = new Sqids({
      blocklist: new Set([
        '8QRLaD',
        '7T1cd0dL',
        'RA8UeIe7',
        'WM3Limhw',
        'LfUQh4HN',
      ]),
    })

    expect(sqids.decode('8QRLaD')).toEqual([1, 2, 3])
    expect(sqids.decode('7T1cd0dL')).toEqual([1, 2, 3])
    expect(sqids.decode('RA8UeIe7')).toEqual([1, 2, 3])
    expect(sqids.decode('WM3Limhw')).toEqual([1, 2, 3])
    expect(sqids.decode('LfUQh4HN')).toEqual([1, 2, 3])
  })

  it('match against a short blocklist word', () => {
    const sqids = new Sqids({
      blocklist: new Set(['pPQ']),
    })

    expect(sqids.decode(sqids.encode([1_000]))).toEqual([1_000])
  })
})
