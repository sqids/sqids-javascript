# [Sqids JavaScript](https://sqids.org/javascript)

[![npm version](https://img.shields.io/npm/v/sqids.svg)](https://www.npmjs.com/package/sqids)
[![Downloads](https://img.shields.io/npm/dm/sqids)](https://www.npmjs.com/package/sqids)

[Sqids](https://sqids.org/javascript) (*pronounced "squids"*) is a small library that lets you **generate unique IDs from numbers**. It's good for link shortening, fast & URL-safe ID generation and decoding back into numbers for quicker database lookups.

Features:

- **Encode multiple numbers** - generate short IDs from one or several non-negative numbers
- **Quick decoding** - easily decode IDs back into numbers
- **Unique IDs** - generate unique IDs by shuffling the alphabet once
- **ID padding** - provide minimum length to make IDs more uniform
- **URL safe** - auto-generated IDs do not contain common profanity
- **Randomized output** - Sequential input provides nonconsecutive IDs
- **Many implementations** - Support for [40+ programming languages](https://sqids.org/)

## 🧰 Use-cases

Good for:

- Generating IDs for public URLs (eg: link shortening)
- Generating IDs for internal systems (eg: event tracking)
- Decoding for quicker database lookups (eg: by primary keys)

Not good for:

- Sensitive data (this is not an encryption library)
- User IDs (can be decoded revealing user count)

## 🚀 Getting started

yarn:

```bash
yarn add sqids
```

[npm](https://www.npmjs.com/package/sqids):

```bash
npm install sqids
```

[cdnjs](https://cdnjs.com/libraries/sqids):

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/sqids/0.3.0/sqids.min.js"></script>
```

[jsDelivr](https://www.jsdelivr.com/package/npm/sqids):

```html
<script src="https://cdn.jsdelivr.net/npm/sqids/dist/sqids.min.js"></script>
```

## 👩‍💻 Examples

Simple encode & decode:

```javascript
const sqids = new Sqids()
const id = sqids.encode([1, 2, 3]) // "86Rf07"
const numbers = sqids.decode(id) // [1, 2, 3]
```

> **Note**
> 🚧 Because of the algorithm's design, **multiple IDs can decode back into the same sequence of numbers**. If it's important to your design that IDs are canonical, you have to manually re-encode decoded numbers and check that the generated ID matches.

Enforce a *minimum* length for IDs:

```javascript
const sqids = new Sqids({
  minLength: 10,
})
const id = sqids.encode([1, 2, 3]) // "86Rf07xd4z"
const numbers = sqids.decode(id) // [1, 2, 3]
```

Randomize IDs by providing a custom alphabet:

```javascript
const sqids = new Sqids({
  alphabet: 'FxnXM1kBN6cuhsAvjW3Co7l2RePyY8DwaU04Tzt9fHQrqSVKdpimLGIJOgb5ZE',
})
const id = sqids.encode([1, 2, 3]) // "B4aajs"
const numbers = sqids.decode(id) // [1, 2, 3]
```

Prevent specific words from appearing anywhere in the auto-generated IDs:

```javascript
const sqids = new Sqids({
  blocklist: new Set(['86Rf07']),
})
const id = sqids.encode([1, 2, 3]) // "se8ojk"
const numbers = sqids.decode(id) // [1, 2, 3]
```

## 📝 License

[MIT](LICENSE)
