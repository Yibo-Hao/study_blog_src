class MyPromise {
  static state = "pending";
  static value = undefined;
  static reason = undefined;
  static resolve = value => {
    if (MyPromise.state === "pending") {
      MyPromise.state = "fulfilled";
      MyPromise.value = value;
    }
  };
  static reject = reason => {
    if (MyPromise.state === "pending") {
      MyPromise.state = "rejected";
      MyPromise.reason = reason;
    }
  };
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new Error("error");
    }
    try {
      executor(MyPromise.resolve, MyPromise.reject);
    } catch (err) {
      MyPromise.reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    if (MyPromise.state === "fulfilled") {
      onFulfilled(MyPromise.value);
    }
    if (MyPromise.state === "rejected") {
      onRejected(MyPromise.reason);
    }
  }
}
module.exports = MyPromise;
