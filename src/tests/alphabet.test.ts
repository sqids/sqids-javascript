import Sqids from '../sqids'

describe('alphabet', () => {
  it('simple', () => {
    const sqids = new Sqids({
      alphabet: '0123456789abcdef',
    })

    const numbers = [1, 2, 3]
    const id = '489158'

    expect(sqids.encode(numbers)).toBe(id)
    expect(sqids.decode(id)).toEqual(numbers)
  })

  it('short alphabet', () => {
    const sqids = new Sqids({
      alphabet: 'abc',
    })

    const numbers = [1, 2, 3]
    expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers)
  })

  it('long alphabet', () => {
    const sqids = new Sqids({
      alphabet:
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+|{}[];:\'"/?.>,<`~',
    })

    const numbers = [1, 2, 3]
    expect(sqids.decode(sqids.encode(numbers))).toEqual(numbers)
  })

  it('multibyte characters', () => {
    expect(
      () =>
        new Sqids({
          alphabet: 'ë1092',
        }),
    ).toThrow('Alphabet cannot contain multibyte characters')
  })

  it('repeating alphabet characters', () => {
    expect(
      () =>
        new Sqids({
          alphabet: 'aabcdefg',
        }),
    ).toThrow('Alphabet must contain unique characters')
  })

  it('too short of an alphabet', () => {
    expect(
      () =>
        new Sqids({
          alphabet: 'ab',
        }),
    ).toThrow('Alphabet length must be at least 3')
  })
})
