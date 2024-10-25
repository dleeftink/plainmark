import rewrite from "../../pack/rewrite.js";

import { check as recheck } from "./util/check.js";
import { index as reindex } from "./core/index.js";
import { store as restore } from "./core/store.js";
import { group as regroup } from "./core/group.js";
import { kinds as kindsof } from "./core/kinds.js";

const prototype = {

  recheck,
  reindex,
  restore,
  regroup,
  kindsof

}

export default prototype