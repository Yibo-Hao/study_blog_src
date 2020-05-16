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
  while (
    currNode.next !== null &&
    currNode.next.element !== this.head.element
  ) {
    callback(currNode);
    currNode = currNode.next;
  }
}
function advance(n) {
  let currNode = this.head;
  while (n > 0) {
    currNode = currNode.next;
    n = n - 1;
  }
  return currNode;
}