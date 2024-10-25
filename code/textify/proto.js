import rewrite from "../../pack/rewrite.js";

import { check as recheck } from "./util/check.js";
import { coder as recoder } from "./util/coder.js";
import { store as restore } from "./core/store.js";
import { group as regroup } from "./core/group.js";
import { kinds as kindsof } from "./core/kinds.js";

const prototype = {

  recheck,
  restore,
  regroup,
  recoder,
  kindsof//: rewrite(kindsof, [{ get: /", "/g , set: '___' }]),

}

export default prototype