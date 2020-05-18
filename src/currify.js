let currify = (fn, params = []) => {
  return arg => {
    const params2 = params.concat(arg);
    if (params2.length === fn.length) {
      return fn(...params2);
    } else {
      return currify(fn, params2);
    }
  };
};
const addTwo = function(a, b) {
  return a + b;
};
let newAddTwo = currify(addTwo);
newAddTwo(1)(2);
