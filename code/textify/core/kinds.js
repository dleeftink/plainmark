export function kinds(tagName) {  

  // how: to handle "*" exceptions? (spec)
  // how: to handle "!" exceptions? (mine)
  // how: to more optimal search 
  
  let tags = {
    phrasing: ["a*","span","img","br","script","meta*","link*","i","input","strong","b","label","button","svg","em","noscript","time","iframe","small","select","abbr","sup","ins*","u","picture","area*","code","textarea","video","cite","dfn","del*","date","keygen","Text*","s","wbr","sub","kbd","object","map*","var","embed","canvas","template","bdi","q","audio","mark","samp","ruby","bdo","data","meter","output","slot","progress","math","datalist"],    embedded: ["audio", "canvas", "embed", "iframe", "img", "math", "object", "picture", "svg", "video"],
    heading: ["h1", "h2", "h3", "h4", "h5", "h6", "hgroup"],
    sectioning: ["section","article","nav","aside"],
    metadata: ["base", "link", "meta", "noscript", "script", "style", "template", "title"],
    navigation: ["nav","menu","nav"], // custom field;
    interactive: ["a*","img*","input*","label","button","iframe","select","textarea","video*","keygen","object*","embed","audio*","details"],
    flow: ["div","a","span","li*!","img","br","p","script","ul","meta*","link*","i","input","strong","h2","h3","b","h4","label","table","button","svg","section","article","em","form","h1","noscript","header","time","figure","dl","h5","iframe","hr","footer","nav","small","aside","select","h6","abbr","sup","ins","u","ol","blockquote","picture","fieldset","area*","code","textarea","video","cite","dfn","main*","pre","del","address","date","keygen","search","Text*","s","wbr","sub","kbd","object","map","hgroup","var","embed","menu","canvas","template","bdi","q","audio","mark","details","samp","ruby","bdo","data","meter","output","slot","progress","dialog","math","datalist"],
  };

  let kind = Object.entries(tags)
      .filter(([type, tags]) => tags.some((tag) => tag.split('*')[0] == (tagName ?? "").toLowerCase()))
      .map((d) => d[0])
  
  return kind
}
