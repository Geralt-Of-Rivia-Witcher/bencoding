import fs from "fs";

import { classBEncoding } from "./bencoding/parser";

const file = fs.readFileSync("temp.torrent");
console.log(file);

const parser = new classBEncoding(file);
console.log(JSON.stringify(parser.parseContent(), null, 2));
