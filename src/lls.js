function Node(element) {
    this.element = element;
    this.next = null;
}
function LinkedList() {
    this.head = new Node(new Symbol());
    this.find = find;
}
