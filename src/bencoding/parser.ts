import { Dictionary, List } from "./type/parser.type";

export class classBEncoding {
  index: number;
  file: Buffer<ArrayBufferLike>;
  constructor(file: Buffer<ArrayBufferLike>) {
    this.file = file;
    this.index = 0;
  }

  parseContent(): Dictionary {
    return this.parseDictionary();
  }

  private parseDictionary(): Dictionary {
    const dictionary: Dictionary = {};
    this.index++;
    for (; this.file[this.index] !== 101; ) {
      const key = this.parseString();
      if (key === "pieces") {
        dictionary.pieces = this.getHashes(this.index);
      } else if (this.file[this.index] === 108) {
        dictionary[key] = this.parseList();
      } else if (this.file[this.index] === 100) {
        dictionary[key] = this.parseDictionary();
      } else {
        dictionary[key] = this.parseStringOrNumber();
      }
    }
    this.index++;
    return dictionary;
  }

  private parseList(): List {
    this.index++;
    const list: List = [];
    for (; this.file[this.index] !== 101; ) {
      let parsedData;
      if (this.file[this.index] === 108) {
        parsedData = this.parseList();
      } else if (this.file[this.index] === 100) {
        parsedData = this.parseDictionary();
      } else {
        parsedData = this.parseStringOrNumber();
      }
      list.push(parsedData);
    }
    this.index++;
    return list;
  }

  private parseStringOrNumber(): string | number {
    if (this.file[this.index] === 105) {
      return this.parseInteger();
    }
    return this.parseString();
  }

  private parseInteger(): number {
    let s: string = "",
      position = this.index + 1;
    for (; this.file[position] !== 101; position++) {
      s += String.fromCharCode(this.file[position]);
    }
    this.index = position + 1;
    return parseInt(s);
  }

  private getEndIndex(startIndex: number): number {
    const asciiValue = this.file[startIndex];
    if (asciiValue === 58) {
      return startIndex - 1;
    }
    return this.getEndIndex(startIndex + 1);
  }

  private getLengthOfNextCharacters(endIndex: number): number {
    const startIndex = this.index;
    let asciiCharacters = "";
    for (let pos = startIndex; pos <= endIndex; pos++) {
      asciiCharacters += String.fromCharCode(this.file[pos]);
    }
    return parseInt(asciiCharacters);
  }

  private parseString(): string {
    const endIndex = this.getEndIndex(this.index);
    const length = this.getLengthOfNextCharacters(endIndex);
    let s: string = "";
    let position = endIndex + 2;
    for (; position < endIndex + 2 + length; position++) {
      s += String.fromCharCode(this.file[position]);
    }
    this.index = position;
    return s;
  }

  private getHashes(startIndex: number): Array<Buffer> {
    const endIndex = this.getEndIndex(startIndex);
    const length = this.getLengthOfNextCharacters(endIndex);
    this.index = endIndex + 2 + length;
    const numberOfPieces = length / 20;
    const hashes: Buffer[] = [];
    for (let i = 1; i <= numberOfPieces; i++) {
      hashes.push(this.file.subarray(startIndex, startIndex + 20));
      startIndex += 20;
    }
    return hashes;
  }
}
