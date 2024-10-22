import { check as recheck } from "./util/check.js";
import { store as restore } from "./core/store.js";
import { group as regroup } from "./core/group.js";
import { match as rematch } from "./core/match.js";
import { trace as retrace } from "./core/trace.js";

const prototype = {
  recheck,
  restore,
  regroup,
  rematch,
  retrace
}

console.log(prototype)
//export default prototype