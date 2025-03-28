import defaultBlocklist from './sqids/default-blocklist'

interface SqidsOptions {
  alphabet?: string
  minLength?: number
  blocklist?: Set<string>
}

export const defaultOptions: Required<SqidsOptions> = {
  alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  minLength: 0,
  blocklist: defaultBlocklist,
}

export const minAlphabetLength = 3
export const minLengthLimit = 255
export const maxValue = Number.MAX_SAFE_INTEGER

export default class Sqids {
  private alphabet: string
  private minLength: number
  private blocklist: Set<string>

  constructor(options?: SqidsOptions) {
    const alphabet = options?.alphabet ?? defaultOptions.alphabet
    const minLength = options?.minLength ?? defaultOptions.minLength
    const blocklist = options?.blocklist ?? defaultOptions.blocklist

    if (new Blob([alphabet]).size !== alphabet.length) {
      throw new Error('Alphabet cannot contain multibyte characters')
    }

    if (alphabet.length < minAlphabetLength) {
      throw new Error(`Alphabet length must be at least ${minAlphabetLength}`)
    }

    if (new Set(alphabet).size !== alphabet.length) {
      throw new Error('Alphabet must contain unique characters')
    }

    if (
      typeof minLength !== 'number' ||
      minLength < 0 ||
      minLength > minLengthLimit
    ) {
      throw new Error(
        `Minimum length has to be between 0 and ${minLengthLimit}`,
      )
    }

    const filteredBlocklist = new Set<string>()
    const alphabetChars = alphabet.toLowerCase().split('')
    for (const word of blocklist) {
      if (word.length >= 3) {
        const wordLowercased = word.toLowerCase()
        const wordChars = wordLowercased.split('')
        const intersection = wordChars.filter((c) => alphabetChars.includes(c))
        if (intersection.length === wordChars.length) {
          filteredBlocklist.add(wordLowercased)
        }
      }
    }

    this.alphabet = this.shuffle(alphabet)
    this.minLength = minLength
    this.blocklist = filteredBlocklist
  }

  encode(numbers: number[]): string {
    if (numbers.length === 0) {
      return ''
    }

    const areAllNumbersInRange = numbers.every((n) => n >= 0 && n <= maxValue)
    if (!areAllNumbersInRange) {
      throw new Error(`Encoding supports numbers between 0 and ${maxValue}`)
    }

    return this.encodeNumbers(numbers)
  }

  decode(id: string): number[] {
    const ret: number[] = []

    if (id === '') {
      return ret
    }

    const alphabetChars = this.alphabet.split('')
    for (const c of id.split('')) {
      if (!alphabetChars.includes(c)) {
        return ret
      }
    }

    const prefix = id.charAt(0)
    const offset = this.alphabet.indexOf(prefix)
    let alphabet = this.alphabet.slice(offset) + this.alphabet.slice(0, offset)
    alphabet = alphabet.split('').reverse().join('')
    let slicedId = id.slice(1)

    while (slicedId.length > 0) {
      const separator = alphabet.slice(0, 1)

      const chunks = slicedId.split(separator)
      if (chunks.length > 0) {
        if (chunks[0] === '') {
          return ret
        }

        ret.push(this.toNumber(chunks[0]!, alphabet.slice(1)))
        if (chunks.length > 1) {
          alphabet = this.shuffle(alphabet)
        }
      }

      slicedId = chunks.slice(1).join(separator)
    }

    return ret
  }

  private encodeNumbers(numbers: number[], increment = 0): string {
    if (increment > this.alphabet.length) {
      throw new Error('Reached max attempts to re-generate the ID')
    }

    let offset =
      numbers.reduce(
        (a, v, i) =>
          this.alphabet[v % this.alphabet.length]!.codePointAt(0)! + i + a,
        numbers.length,
      ) % this.alphabet.length

    offset = (offset + increment) % this.alphabet.length
    let alphabet = this.alphabet.slice(offset) + this.alphabet.slice(0, offset)
    const prefix = alphabet.charAt(0)
    alphabet = alphabet.split('').reverse().join('')
    const ret = [prefix]

    for (let i = 0; i !== numbers.length; i++) {
      const num = numbers[i]!

      ret.push(this.toId(num, alphabet.slice(1)))
      if (i < numbers.length - 1) {
        ret.push(alphabet.slice(0, 1))
        alphabet = this.shuffle(alphabet)
      }
    }

    let id = ret.join('')

    if (this.minLength > id.length) {
      id += alphabet.slice(0, 1)

      while (this.minLength - id.length > 0) {
        alphabet = this.shuffle(alphabet)
        id += alphabet.slice(
          0,
          Math.min(this.minLength - id.length, alphabet.length),
        )
      }
    }

    if (this.isBlockedId(id)) {
      id = this.encodeNumbers(numbers, increment + 1)
    }

    return id
  }

  private shuffle(alphabet: string): string {
    const chars = alphabet.split('')

    for (let i = 0, j = chars.length - 1; j > 0; i++, j--) {
      const r =
        (i * j + chars[i]!.codePointAt(0)! + chars[j]!.codePointAt(0)!) %
        chars.length
      ;[chars[i], chars[r]] = [chars[r]!, chars[i]!]
    }

    return chars.join('')
  }

  private toId(num: number, alphabet: string): string {
    const id = []
    const chars = alphabet.split('')

    let result = num

    do {
      id.unshift(chars[result % chars.length])
      result = Math.floor(result / chars.length)
    } while (result > 0)

    return id.join('')
  }

  private toNumber(id: string, alphabet: string): number {
    const chars = alphabet.split('')
    return id.split('').reduce((a, v) => a * chars.length + chars.indexOf(v), 0)
  }

  private isBlockedId(id: string): boolean {
    const lowercaseId = id.toLowerCase()

    for (const word of this.blocklist) {
      if (word.length <= lowercaseId.length) {
        if (lowercaseId.length <= 3 || word.length <= 3) {
          if (lowercaseId === word) {
            return true
          }
        } else if (/\d/.test(word)) {
          if (lowercaseId.startsWith(word) || lowercaseId.endsWith(word)) {
            return true
          }
        } else if (lowercaseId.includes(word)) {
          return true
        }
      }
    }

    return false
  }
}
