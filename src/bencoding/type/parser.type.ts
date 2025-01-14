export type Dictionary = {
  [key: string]: Buffer | number | List | Dictionary;
} & {
  pieces?: Buffer;
};

export type List = (Buffer | number | List | Dictionary)[];
