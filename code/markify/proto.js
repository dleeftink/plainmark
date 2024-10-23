import { parseLine } from "./core/line.js";
import { parseTags } from "./core/tags.js";

import { link } from "./rule/link.js";
import { lead } from "./rule/lead.js"
import { wrap } from "./rule/wrap.js";

const prototype = {
  parseLine,
  parseTags,
  link,
  lead,
  wrap
}

export default prototype