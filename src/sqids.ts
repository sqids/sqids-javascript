import defaultBlocklist from './blocklist'

interface SqidsOptions {
  alphabet?: string
  minLength?: number
  blocklist?: Set<string>
}

export const defaultOptions = {
  alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  minLength: 0,
  blocklist: new Set<string>(),
}

export default class Sqids {
  private alphabet: string
  private minLength: number
  private blocklist: Set<string>

  constructor(options?: SqidsOptions) {
    const alphabet = options?.alphabet ?? defaultOptions.alphabet
    const minLength = options?.minLength ?? defaultOptions.minLength
    const blocklist = options?.blocklist ?? new Set<string>(defaultBlocklist)

    const minAlphabetLength = 5
    if (alphabet.length < minAlphabetLength) {
      throw new Error('Alphabet length must be at least 5')
    }

    if (new Set(alphabet).size !== alphabet.length) {
      throw new Error('Alphabet must contain unique characters')
    }

    if (
      typeof minLength !== 'number' ||
      minLength < this.minValue() ||
      minLength > alphabet.length
    ) {
      throw new TypeError(
        `Minimum length has to be between ${this.minValue()} and ${
          alphabet.length
        }`,
      )
    }

    const filteredBlocklist = new Set<string>()
    const alphabetChars = alphabet.split('')
    for (const word of blocklist) {
      if (word.length >= 3) {
        const wordChars = word.split('')
        const intersection = wordChars.filter((c) => alphabetChars.includes(c))
        if (intersection.length === wordChars.length) {
          filteredBlocklist.add(word.toLowerCase())
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

    const inRangeNumbers = numbers.filter(
      (n) => n >= this.minValue() && n <= this.maxValue(),
    )
    if (inRangeNumbers.length !== numbers.length) {
      throw new Error(
        `Encoding supports numbers between ${this.minValue()} and ${this.maxValue()}`,
      )
    }

    return this.encodeNumbers(numbers, false)
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
    const partition = alphabet.charAt(1)
    alphabet = alphabet.slice(2)
    let slicedId = id.slice(1)

    const partitionIndex = slicedId.indexOf(partition)
    if (partitionIndex > 0 && partitionIndex < slicedId.length - 1) {
      slicedId = slicedId.slice(partitionIndex + 1)
      alphabet = this.shuffle(alphabet)
    }

    while (slicedId.length > 0) {
      const separator = alphabet.slice(-1)

      const chunks = slicedId.split(separator)
      if (chunks.length > 0) {
        const alphabetWithoutSeparator = alphabet.slice(0, -1)
        for (const c of chunks[0]!) {
          if (!alphabetWithoutSeparator.includes(c)) {
            return []
          }
        }
        ret.push(this.toNumber(chunks[0]!, alphabetWithoutSeparator))

        if (chunks.length > 1) {
          alphabet = this.shuffle(alphabet)
        }
      }

      slicedId = chunks.slice(1).join(separator)
    }

    return ret
  }

  minValue() {
    return 0
  }

  maxValue() {
    return Number.MAX_SAFE_INTEGER
  }

  private encodeNumbers(numbers: number[], partitioned = false): string {
    const offset =
      numbers.reduce(
        (a, v, i) =>
          this.alphabet[v % this.alphabet.length]!.codePointAt(0)! + i + a,
        numbers.length,
      ) % this.alphabet.length

    let alphabet = this.alphabet.slice(offset) + this.alphabet.slice(0, offset)

    const prefix = alphabet.charAt(0)

    const partition = alphabet.charAt(1)

    alphabet = alphabet.slice(2)

    const ret = [prefix]

    for (let i = 0; i !== numbers.length; i++) {
      const num = numbers[i]!

      const alphabetWithoutSeparator = alphabet.slice(0, -1)
      ret.push(this.toId(num, alphabetWithoutSeparator))

      if (i < numbers.length - 1) {
        const separator = alphabet.slice(-1)

        if (partitioned && i === 0) {
          ret.push(partition)
        } else {
          ret.push(separator)
        }

        alphabet = this.shuffle(alphabet)
      }
    }

    let id = ret.join('')

    if (this.minLength > id.length) {
      if (!partitioned) {
        const newNumbers = [0, ...numbers]
        id = this.encodeNumbers(newNumbers, true)
      }

      if (this.minLength > id.length) {
        id =
          id.slice(0, 1) +
          alphabet.slice(0, this.minLength - id.length) +
          id.slice(1)
      }
    }

    if (this.isBlockedId(id)) {
      let newNumbers = numbers

      if (partitioned) {
        if (numbers[0]! + 1 > this.maxValue()) {
          throw new Error('Ran out of range checking against the blocklist')
        } else {
          newNumbers[0] += 1
        }
      } else {
        newNumbers = [0, ...numbers]
      }

      id = this.encodeNumbers(newNumbers, true)
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
