function fibonacc(n) {
  if (n === 0) {
    n = 0;
  } else if (n === 1) {
    n = 1;
  } else {
    n = fibonacc(n - 1) + fibonacc(n - 2);
  }
  return n;
}

function fibonacc2(n) {
  return fibonacc3(2, n, 1, 0);
}
function fibonacc3(start, end, prev1, prev2) {
  if (start === end) {
    start = prev1 + prev2;
  } else {
    fibonacc3(start + 1, end, prev1 + prev2, prev2);
  }
}
function fibonacc4(n) {
  let fibArray = [0, 1];
  for (let i = 0; i <= n - 2; i++) {
    fibArray[i + 2] = fibArray[i + 1] + fibArray[i];
  }
  return fibArray[fibArray.length - 1];
}
function memozi(fn) {
  const cache = {};
  return function(n) {
    if (cache.n === null) {
      cache.n = fn(n);
      return cache.n;
    } else {
      return cache.n;
    }
  };
}

const fibfn = memozi(function(n) {
  if (n === 0) {
    return 0;
  } else if (n === 1) {
    return 1;
  } else {
    return fibfn(n - 1) + fibfn(n - 2);
  }
});
