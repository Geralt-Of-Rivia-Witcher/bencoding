export type Dictionary = {
  [key: string]: string | number | List | Dictionary;
} & {
  pieces?: Buffer[];
};

export type List = (string | number | List | Dictionary)[];
