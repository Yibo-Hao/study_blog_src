function deepClone(source) {
  if (source instanceof Object) {
    if (source instanceof Array) {
      const dist = [];
      for (let key in source) {
        dist[key] = deepClone(source[key]);
      }
      return dist;
    } else if (source instanceof Function) {
      const dist = function() {
        return source.apply(this, arguments);
      };
      return dist
    } else {
      const dist = {};
      for (let key in source) {
        dist[key] = deepClone(source[key]);
      }
      return dist;
    }
  } else return source;
}
let a = function(a, b) {
  return a + b;
};
debugger;
let b = deepClone(a);
console.dir(b);
