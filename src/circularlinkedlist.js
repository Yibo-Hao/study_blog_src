function Node(element) {
  this.element = element;
  this.next = null;
}
function LinkedList(head) {
  this.head = new Node(head);
  this.head.next = this.head;
  this.find = find;
  this.insert = insert;
  this.remove = remove;
  this.findPrevious = findPrevious;
  this.travel = travel;
  this.advance = advance;
}
function find(item) {
  let currNode = this.head;
  while (currNode.element !== item) {
    currNode = currNode.next;
  }
  return currNode;
}
function insert(element, item) {
  let newNode = new Node(element);
  let current = this.find(item);
  newNode.next = current.next;
  current.next = newNode;
}
function remove(item) {
  let preNode = this.findPrevious(item);
  if (preNode) {
    if (this.find(item) === this.head) {
      this.head = this.head.next;
      preNode.next = this.head;
      return;
    }
    preNode.next = preNode.next.next;
  }
}
function findPrevious(item) {
  let currNode = this.head;
  while (currNode.next && currNode.next.element !== item) {
    currNode = currNode.next;
  }
  return currNode;
}
function travel(callback) {
  let currNode = this.head;
  do {
    console.log(currNode.element);
    callback(currNode);
    currNode = currNode.next;
  } while (currNode.element !== this.head.element);
}
function advance(n) {
  let currNode = this.head;
  while (n > 0) {
    currNode = currNode.next;
    n = n - 1;
  }
  return currNode;
}

function code() {
  let list = new LinkedList(1);
  let length = 1;
  let n = 2;
  for (let i = 1; i < 10; i++) {
    list.insert(i + 1, i);
    length += 1;
  }
  list.travel(() => {});
  while (length > 3) {
    list.remove(list.advance(n).element);
    n += 2;
    length -= 1;
  }
}
code();
