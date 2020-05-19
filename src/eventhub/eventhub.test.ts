import EventHub from "./eventhub";

const test1 = message => {
  const eventHub = new EventHub();
  console.assert(eventHub instanceof Object, "eventHub is object");
};

const test2 = message => {
  const eventHub = new EventHub();
  let called = false;
  eventHub.on("xxx", (x, y) => {
    called = true;
    console.assert(x === 1);
    console.log(x);
    console.log(y);
    console.assert(y === 2);
  });
  eventHub.emit("xxx", 1, 2);
  setTimeout(() => {
    console.assert(called === true);
    console.log(message);
  }, 1000);
};
test2("测试多个参数");
