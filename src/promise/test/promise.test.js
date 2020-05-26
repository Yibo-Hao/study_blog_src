const MyPromise = require("../promise");
const chai = require("chai");

const assert = chai.assert;
describe("MyPromise", () => {
  it("类", function() {
    assert.isFunction(MyPromise);
    assert.isObject(MyPromise.prototype);
  });
  it("error", function() {
    assert.throw(() => {
      new MyPromise();
    });
    assert.throw(() => {
      new MyPromise(1);
    });
    assert.throw(() => {
      new MyPromise(false);
    });
  });
  it("fn是立即执行的", function() {
    let called = false;
    const promise = new MyPromise(() => {
      called = true;
    });
    assert(called === true);
  });
  it("fn函数接受两个函数", function() {
    let called = false;
    const promise = new MyPromise((resolve, reject) => {
      called = true;
      assert.isFunction(resolve);
      assert.isFunction(reject);
    });
    assert(called === true);
  });
});
