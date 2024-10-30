import rewrite from "../compile/rewrite.js";

import { check as recheck } from "./util/check.js";
import { kinds as reindex } from "./core/kinds.js";
import { store as restore } from "./core/store.js";
import { group as regroup } from "./core/group.js";

const prototype = {

  recheck,
  reindex,
  restore,
  regroup

}

export default prototype