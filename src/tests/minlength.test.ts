import Sqids, { defaultOptions } from '../sqids'

describe('min length', () => {
  it('simple', () => {
    const sqids = new Sqids({
      minLength: defaultOptions.alphabet.length,
    })

    const numbers = [1, 2, 3]
    const id = '86Rf07xd4zBmiJXQG6otHEbew02c3PWsUOLZxADhCpKj7aVFv9I8RquYrNlSTM'

    expect(sqids.encode(numbers)).toBe(id)
    expect(sqids.decode(id)).toEqual(numbers)
  })

  it('incremental', () => {
    const numbers = [1, 2, 3]

    const map = {
      6: '86Rf07',
      7: '86Rf07x',
      8: '86Rf07xd',
      9: '86Rf07xd4',
      10: '86Rf07xd4z',
      11: '86Rf07xd4zB',
      12: '86Rf07xd4zBm',
      13: '86Rf07xd4zBmi',
      [defaultOptions.alphabet.length + 0]:
        '86Rf07xd4zBmiJXQG6otHEbew02c3PWsUOLZxADhCpKj7aVFv9I8RquYrNlSTM',
      [defaultOptions.alphabet.length + 1]:
        '86Rf07xd4zBmiJXQG6otHEbew02c3PWsUOLZxADhCpKj7aVFv9I8RquYrNlSTMy',
      [defaultOptions.alphabet.length + 2]:
        '86Rf07xd4zBmiJXQG6otHEbew02c3PWsUOLZxADhCpKj7aVFv9I8RquYrNlSTMyf',
      [defaultOptions.alphabet.length + 3]:
        '86Rf07xd4zBmiJXQG6otHEbew02c3PWsUOLZxADhCpKj7aVFv9I8RquYrNlSTMyf1',
    }

    for (const [minLength, id] of Object.entries(map)) {
      const sqids = new Sqids({
        minLength: Number(minLength),
      })

      expect(sqids.encode(numbers)).toBe(id)
      expect(sqids.encode(numbers)).toHaveLength(Number(minLength))
      expect(sqids.decode(id)).toEqual(numbers)
    }
  })

  it('incremental numbers', () => {
    const sqids = new Sqids({
      minLength: defaultOptions.alphabet.length,
    })

    const ids = {
      SvIzsqYMyQwI3GWgJAe17URxX8V924Co0DaTZLtFjHriEn5bPhcSkfmvOslpBu: [0, 0],
      n3qafPOLKdfHpuNw3M61r95svbeJGk7aAEgYn4WlSjXURmF8IDqZBy0CT2VxQc: [0, 1],
      tryFJbWcFMiYPg8sASm51uIV93GXTnvRzyfLleh06CpodJD42B7OraKtkQNxUZ: [0, 2],
      eg6ql0A3XmvPoCzMlB6DraNGcWSIy5VR8iYup2Qk4tjZFKe1hbwfgHdUTsnLqE: [0, 3],
      rSCFlp0rB2inEljaRdxKt7FkIbODSf8wYgTsZM1HL9JzN35cyoqueUvVWCm4hX: [0, 4],
      sR8xjC8WQkOwo74PnglH1YFdTI0eaf56RGVSitzbjuZ3shNUXBrqLxEJyAmKv2: [0, 5],
      uY2MYFqCLpgx5XQcjdtZK286AwWV7IBGEfuS9yTmbJvkzoUPeYRHr4iDs3naN0: [0, 6],
      '74dID7X28VLQhBlnGmjZrec5wTA1fqpWtK4YkaoEIM9SRNiC3gUJH0OFvsPDdy': [0, 7],
      '30WXpesPhgKiEI5RHTY7xbB1GnytJvXOl2p0AcUjdF6waZDo9Qk8VLzMuWrqCS': [0, 8],
      moxr3HqLAK0GsTND6jowfZz3SUx7cQ8aC54Pl1RbIvFXmEJuBMYVeW9yrdOtin: [0, 9],
    }

    for (const [id, numbers] of Object.entries(ids)) {
      expect(sqids.encode(numbers)).toBe(id)
      expect(sqids.decode(id)).toEqual(numbers)
    }
  })

  it('min lengths', () => {
    for (const minLength of [0, 1, 5, 10, defaultOptions.alphabet.length]) {
      for (const numbers of [
        [0],
        [0, 0, 0, 0, 0],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [100, 200, 300],
        [1_000, 2_000, 3_000],
        [1_000_000],
        [Number.MAX_SAFE_INTEGER],
      ]) {
        const sqids = new Sqids({
          minLength,
        })

        const id = sqids.encode(numbers)
        expect(id.length).toBeGreaterThanOrEqual(minLength)
        expect(sqids.decode(id)).toEqual(numbers)
      }
    }
  })

  it('out-of-range invalid min length', () => {
    const minLengthLimit = 255
    const minLengthError = `Minimum length has to be between 0 and ${minLengthLimit}`

    expect(
      () =>
        new Sqids({
          minLength: -1,
        }),
    ).toThrow(minLengthError)

    expect(
      () =>
        new Sqids({
          minLength: minLengthLimit + 1,
        }),
    ).toThrow(minLengthError)
  })
})
