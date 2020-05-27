function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    let counter = 1;
    let observe = new MutationObserver(fn);
    let node = document.createTextNode(String(counter));
    observe.observe(node, {
      characterData: true
    });
    counter += 1;
    node.data = String(counter);
  }
}
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = null;
    this.reason = null;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if ((this.state = "pending")) {
        this.state = "fulfilled";
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => {
          fn(this.value);
        });
      }
    };
    let reject = reason => {
      if ((this.state = "pending")) {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => {
          fn(this.reason);
        });
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : err => {
            throw err;
          };
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.state === "fulfilled") {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "rejected") {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "pending") {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  let called;
  if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
            x,
            y => {
              if (called) return;
              called = true;
              resolvePromise(promise2, y, resolve, reject);
            },
            err => {
              if (called) return;
              called = true;
              reject(err);
            }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}