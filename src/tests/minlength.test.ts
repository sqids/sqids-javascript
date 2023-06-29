import Sqids, { defaultOptions } from '../sqids'

describe('min length', () => {
  it('simple', () => {
    const sqids = new Sqids({
      minLength: defaultOptions.alphabet.length,
    })

    const numbers = [1, 2, 3]
    const id = '75JILToVsGerOADWmHlY38xvbaNZKQ9wdFS0B6kcMEtnRpgizhjU42qT1cd0dL'

    expect(sqids.encode(numbers)).toBe(id)
    expect(sqids.decode(id)).toEqual(numbers)
  })

  it('incremental numbers', () => {
    const sqids = new Sqids({
      minLength: defaultOptions.alphabet.length,
    })

    const ids = {
      jf26PLNeO5WbJDUV7FmMtlGXps3CoqkHnZ8cYd19yIiTAQuvKSExzhrRghBlwf: [0, 0],
      vQLUq7zWXC6k9cNOtgJ2ZK8rbxuipBFAS10yTdYeRa3ojHwGnmMV4PDhESI2jL: [0, 1],
      YhcpVK3COXbifmnZoLuxWgBQwtjsSaDGAdr0ReTHM16yI9vU8JNzlFq5Eu2oPp: [0, 2],
      OTkn9daFgDZX6LbmfxI83RSKetJu0APihlsrYoz5pvQw7GyWHEUcN2jBqd4kJ9: [0, 3],
      h2cV5eLNYj1x4ToZpfM90UlgHBOKikQFvnW36AC8zrmuJ7XdRytIGPawqYEbBe: [0, 4],
      '7Mf0HeUNkpsZOTvmcj836P9EWKaACBubInFJtwXR2DSzgYGhQV5i4lLxoT1qdU': [0, 5],
      APVSD1ZIY4WGBK75xktMfTev8qsCJw6oyH2j3OnLcXRlhziUmpbuNEar05QCsI: [0, 6],
      P0LUhnlT76rsWSofOeyRGQZv1cC5qu3dtaJYNEXwk8Vpx92bKiHIz4MgmiDOF7: [0, 7],
      xAhypZMXYIGCL4uW0te6lsFHaPc3SiD1TBgw5O7bvodzjqUn89JQRfk2Nvm4JI: [0, 8],
      '94dRPIZ6irlXWvTbKywFuAhBoECQOVMjDJp53s2xeqaSzHY8nc17tmkLGwfGNl': [0, 9],
    }

    for (const [id, numbers] of Object.entries(ids)) {
      expect(sqids.encode(numbers)).toBe(id)
      expect(sqids.decode(id)).toEqual(numbers)
    }
  })

  it('min lengths', () => {
    const s = new Sqids()

    for (const minLength of [0, 1, 5, 10, defaultOptions.alphabet.length]) {
      for (const numbers of [
        [s.minValue()],
        [0, 0, 0, 0, 0],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [100, 200, 300],
        [1_000, 2_000, 3_000],
        [1_000_000],
        [s.maxValue()],
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
    const s = new Sqids()
    const err = `Minimum length has to be between ${s.minValue()} and ${
      defaultOptions.alphabet.length
    }`

    expect(
      () =>
        new Sqids({
          minLength: -1,
        }),
    ).toThrow(err)

    expect(
      () =>
        new Sqids({
          minLength: defaultOptions.alphabet.length + 1,
        }),
    ).toThrow(err)
  })
})
