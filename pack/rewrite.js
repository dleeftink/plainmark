export default function rewrite(func, subs = [{ get: '', set: '' }]) {

  let span = subs.length;
  func = func.toString();

  for (let i = 0; i < span; ++i) {
    func = func.replace(subs[i].get, subs[i].set);
  }

  return new Function('return ' + func).call();

}