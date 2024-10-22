import rewrite from "../../pack/rewrite.js";

import { check as recheck } from "./util/check.js";
import { store as restore } from "./core/store.js";
import { group as regroup } from "./core/group.js";
import { match as rematch } from "./core/match.js";
import { trace as retrace } from "./core/trace.js";
import { align as realign } from "./core/align.js";
import { slice as reslice } from "./core/slice.js";

const prototype = {

  recheck,
  restore,
  regroup,
  rematch,
  retrace,
  reslice,
  realign: rewrite(realign,[{get: `\\$&`,set:`\\$\\&`}])

}

export default prototype