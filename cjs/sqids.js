"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = void 0;
const blocklist_json_1 = __importDefault(require("./blocklist.json"));
exports.defaultOptions = {
    alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    minLength: 0,
    blocklist: new Set()
};
class Sqids {
    constructor(options) {
        var _a, _b, _c;
        const alphabet = (_a = options === null || options === void 0 ? void 0 : options.alphabet) !== null && _a !== void 0 ? _a : exports.defaultOptions.alphabet;
        const minLength = (_b = options === null || options === void 0 ? void 0 : options.minLength) !== null && _b !== void 0 ? _b : exports.defaultOptions.minLength;
        const blocklist = (_c = options === null || options === void 0 ? void 0 : options.blocklist) !== null && _c !== void 0 ? _c : new Set(blocklist_json_1.default);
        if (alphabet.length < 5) {
            throw new Error('Alphabet length must be at least 5');
        }
        if (new Set(alphabet).size != alphabet.length) {
            throw new Error('Alphabet must contain unique characters');
        }
        if (typeof minLength != 'number' ||
            minLength < this.minValue() ||
            minLength > alphabet.length) {
            throw new TypeError(`Minimum length has to be between ${this.minValue()} and ${alphabet.length}`);
        }
        const filteredBlocklist = new Set();
        const alphabetChars = alphabet.split('');
        for (const word of blocklist) {
            if (word.length >= 3) {
                const wordChars = word.split('');
                const intersection = wordChars.filter((c) => alphabetChars.includes(c));
                if (intersection.length == wordChars.length) {
                    filteredBlocklist.add(word.toLowerCase());
                }
            }
        }
        this.alphabet = this.shuffle(alphabet);
        this.minLength = minLength;
        this.blocklist = filteredBlocklist;
    }
    encode(numbers) {
        if (numbers.length == 0) {
            return '';
        }
        const inRangeNumbers = numbers.filter((n) => n >= this.minValue() && n <= this.maxValue());
        if (inRangeNumbers.length != numbers.length) {
            throw new Error(`Encoding supports numbers between ${this.minValue()} and ${this.maxValue()}`);
        }
        return this.encodeNumbers(numbers, false);
    }
    encodeNumbers(numbers, partitioned = false) {
        const offset = numbers.reduce((a, v, i) => {
            return this.alphabet[v % this.alphabet.length].codePointAt(0) + i + a;
        }, numbers.length) % this.alphabet.length;
        let alphabet = this.alphabet.slice(offset) + this.alphabet.slice(0, offset);
        const prefix = alphabet.charAt(0);
        const partition = alphabet.charAt(1);
        alphabet = alphabet.slice(2);
        const ret = [prefix];
        for (let i = 0; i != numbers.length; i++) {
            const num = numbers[i];
            const alphabetWithoutSeparator = alphabet.slice(0, -1);
            ret.push(this.toId(num, alphabetWithoutSeparator));
            if (i < numbers.length - 1) {
                const separator = alphabet.slice(-1);
                if (partitioned && i == 0) {
                    ret.push(partition);
                }
                else {
                    ret.push(separator);
                }
                alphabet = this.shuffle(alphabet);
            }
        }
        let id = ret.join('');
        if (this.minLength > id.length) {
            if (!partitioned) {
                numbers = [0, ...numbers];
                id = this.encodeNumbers(numbers, true);
            }
            if (this.minLength > id.length) {
                id = id.slice(0, 1) + alphabet.slice(0, this.minLength - id.length) + id.slice(1);
            }
        }
        if (this.isBlockedId(id)) {
            if (partitioned) {
                if (numbers[0] + 1 > this.maxValue()) {
                    throw new Error('Ran out of range checking against the blocklist');
                }
                else {
                    numbers[0] += 1;
                }
            }
            else {
                numbers = [0, ...numbers];
            }
            id = this.encodeNumbers(numbers, true);
        }
        return id;
    }
    decode(id) {
        const ret = [];
        if (id == '') {
            return ret;
        }
        const alphabetChars = this.alphabet.split('');
        for (const c of id.split('')) {
            if (!alphabetChars.includes(c)) {
                return ret;
            }
        }
        const prefix = id.charAt(0);
        const offset = this.alphabet.indexOf(prefix);
        let alphabet = this.alphabet.slice(offset) + this.alphabet.slice(0, offset);
        const partition = alphabet.charAt(1);
        alphabet = alphabet.slice(2);
        id = id.slice(1);
        const partitionIndex = id.indexOf(partition);
        if (partitionIndex > 0 && partitionIndex < id.length - 1) {
            id = id.slice(partitionIndex + 1);
            alphabet = this.shuffle(alphabet);
        }
        while (id.length) {
            const separator = alphabet.slice(-1);
            const chunks = id.split(separator);
            if (chunks.length) {
                const alphabetWithoutSeparator = alphabet.slice(0, -1);
                ret.push(this.toNumber(chunks[0], alphabetWithoutSeparator));
                if (chunks.length > 1) {
                    alphabet = this.shuffle(alphabet);
                }
            }
            id = chunks.slice(1).join(separator);
        }
        return ret;
    }
    minValue() {
        return 0;
    }
    maxValue() {
        return Number.MAX_SAFE_INTEGER;
    }
    shuffle(alphabet) {
        const chars = alphabet.split('');
        for (let i = 0, j = chars.length - 1; j > 0; i++, j--) {
            const r = (i * j + chars[i].codePointAt(0) + chars[j].codePointAt(0)) % chars.length;
            [chars[i], chars[r]] = [chars[r], chars[i]];
        }
        return chars.join('');
    }
    toId(num, alphabet) {
        const id = [];
        const chars = alphabet.split('');
        let result = num;
        do {
            id.unshift(chars[result % chars.length]);
            result = Math.floor(result / chars.length);
        } while (result > 0);
        return id.join('');
    }
    toNumber(id, alphabet) {
        const chars = alphabet.split('');
        return id.split('').reduce((a, v) => a * chars.length + chars.indexOf(v), 0);
    }
    isBlockedId(id) {
        id = id.toLowerCase();
        for (const word of this.blocklist) {
            if (word.length <= id.length) {
                if (id.length <= 3 || word.length <= 3) {
                    if (id == word) {
                        return true;
                    }
                }
                else if (/\d/.test(word)) {
                    if (id.startsWith(word) || id.endsWith(word)) {
                        return true;
                    }
                }
                else if (id.includes(word)) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.default = Sqids;
//# sourceMappingURL=sqids.js.map