import { wrap as rewrap } from "./core/block.js";
import { form as reform } from "./core/forms.js";

import { dict } from "./rule/dict.js";
import { link } from "./rule/link.js";
import { lead } from "./rule/lead.js";
import { lock } from "./rule/lock.js";

const prototype = {
  rewrap,
  reform,
  link,
  lead,
  lock,
  dict
}

export default prototype