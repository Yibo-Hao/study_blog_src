function Queue() {
  this.dataSource = [];
  this.enqueue = enqueue;
  this.dequeue = dequeue;
  this.front = front;
  this.back = back;
  this.toString = toString;
  this.clear = clear;
  this.empty = empty;
}

function enqueue(element) {
  this.dataSource.push(element);
}
function dequeue() {
  return this.dataSource.shift();
}
function front() {
  return this.dataSource[0];
}
function back() {
  return this.dataSource[this.dataSource.length - 1];
}
function toString() {
  let retStr = "";
  for (let i = 0; i < this.dataSource.length; ++i) {
    retStr += this.dataSource[i] + "\n";
  }
  return retStr;
}
function empty() {
  return this.dataSource.length === 0;
}
function clear() {
  this.dataSource = [];
}
function distribute(nums, queues, digit) {
  for (let i = 0; i < nums.length; i++) {
    if (digit === 1) {
      queues[nums[i] % 10].enqueue(nums[i]);
    } else {
      queues[Math.floor(nums[i] / 10)].enqueue(nums[i]);
    }
  }
}
function collect(queues, nums) {
  let i = 0;
  for (let digit = 0; digit < 10; ++digit) {
    while (!queues[digit].empty()) {
      nums[i++] = queues[digit].dequeue();
    }
  }
}
let nums = [45, 78, 78, 89, 45, 45, 42, 14, 48];
let queues = [];
for (let i = 0; i < 10; ++i) {
  queues[i] = new Queue();
}
distribute(nums, queues, 1);
collect(queues,nums);
distribute(nums, queues, 10);
collect(queues,nums);
