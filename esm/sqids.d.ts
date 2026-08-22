//#region src/sqids.d.ts
type SqidsInteger<BigIntMode extends boolean> = BigIntMode extends true ? bigint : number;
interface SqidsOptions<BigIntMode extends boolean = false> {
  alphabet?: string;
  minLength?: number;
  blocklist?: Set<string>;
  bigint?: BigIntMode;
}
declare const defaultOptions: {
  alphabet: string;
  minLength: number;
  blocklist: Set<string>;
};
declare class Sqids<BigIntMode extends boolean = false> {
  private alphabet;
  private minLength;
  private blocklist;
  private bigintMode;
  constructor(options?: SqidsOptions<BigIntMode>);
  encode(numbers: SqidsInteger<BigIntMode>[]): string;
  decode(id: string): SqidsInteger<BigIntMode>[];
  private encodeNumbers;
  private shuffle;
  private toId;
  private toNumber;
  private isBlockedId;
}
//#endregion
export { SqidsOptions, Sqids as default, defaultOptions };
//# sourceMappingURL=sqids.d.ts.map