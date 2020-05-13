function Stack() {
  this.dataSource = [];
  this.top = 0;
  this.push = push;
  this.pop = pop;
  this.peek = peek;
  this.clear = clear;
  this.empty = empty;
  this.stackLength = stackLength;
}

function push(element) {
  this.dataSource[this.top++] = element;
}
function pop() {
  return this.dataSource[--this.top];
}
function peek() {
  return this.dataSource[this.top - 1];
}
function clear() {
  this.top = 0;
}
function stackLength() {
  return this.top;
}
function empty() {
  return this.top === 0;
}

function mulBase(num: number, base: number) {
  let result = "";
  if (base < 2 || base > 9) {
    throw "wrong base";
  } else {
    const stack = new Stack();
    do {
      stack.push(num % base);
      num = Math.floor((num /= base));
    } while (num > 0);
    while (stack.stackLength() > 0) {
      result += stack.pop();
    }
  }
  return result;
}
