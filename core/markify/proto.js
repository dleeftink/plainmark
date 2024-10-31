import { wrap as rewrap } from "./core/line.js";
import { form as reform } from "./core/tags.js";

import { dict } from "./rule/dict.js";
import { link } from "./rule/link.js";
import { lead } from "./rule/lead.js";
import { wrap } from "./rule/wrap.js";

const prototype = {
  rewrap,
  reform,
  link,
  lead,
  wrap,
  dict
}

export default prototype