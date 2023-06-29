type SqidsOptions = {
    alphabet?: string;
    minLength?: number;
    blocklist?: Set<string>;
};
export declare const defaultOptions: {
    alphabet: string;
    minLength: number;
    blocklist: Set<string>;
};
export default class Sqids {
    private alphabet;
    private minLength;
    private blocklist;
    constructor(options?: SqidsOptions);
    encode(numbers: number[]): string;
    private encodeNumbers;
    decode(id: string): number[];
    minValue(): number;
    maxValue(): number;
    private shuffle;
    private toId;
    private toNumber;
    private isBlockedId;
}
export {};
