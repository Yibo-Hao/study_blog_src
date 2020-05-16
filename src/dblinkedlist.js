function DbNode(element) {
  this.element = element;
  this.next = null;
  this.previous = null;
}
function DbLinkedList(head) {
  this.head = new DbNode(head);
  this.insert = insert;
  this.find = find;
  this.remove = remove;
}
function insert(element, item) {
  let newNode = new DbNode(element);
  let current = find(item);
  newNode.next = current.next;
  newNode.previous = current;
  current.next = newNode;
}
function find(item) {
  let currNode = this.head;
  while (currNode.element !== item) {
    currNode = currNode.next;
  }
  return currNode;
}
function remove(item) {
  let currNode = find(item);
  if (currNode !== null) {
    currNode.previous.next = currNode.next;
    currNode.next.previous = currNode.previous;
  }
}
