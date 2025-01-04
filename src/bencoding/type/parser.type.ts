export type Dictionary = {
  [key: string]: string | number | List | Dictionary;
};
export type List = (string | number | List | Dictionary)[];
