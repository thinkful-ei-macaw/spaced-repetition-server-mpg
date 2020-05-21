class Node {
  constructor({ value, next }) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor({ id, name, total_score }) {
    this.id = id;
    this.name = name;
    this.total_score = total_score;
    this.head = null;
  }

  insertHead(value) {
    let newHead = new Node({
      value,
      next: this.head,
    });

    this.head = newHead;
  }

  findTail() {
    let tail = this.head;

    while (tail.next)
      tail = tail.next;

    return tail;
  }

  insertTail(value) {
    let newTail = new Node({
      value,
      next: null,
    });

    const tail = this.findTail();

    if (!tail)
      this.head = newTail;
    else
      tail.next = newTail;
  }

  insert(value) {
    if (!this.head)
      this.insertHead(value);
    else
      this.insertTail(value);
  }

  getNodeAt(index) {
    let count = 0;
    let node = this.head;

    while ((count < index) && node) {
      node = node.next;
      count++;
    }

    return node;
  }

  insertAt(index, value) {
    let nodeBeforeIndex = this.getNodeAt(index - 1);

    if (!nodeBeforeIndex)
      return this.insertTail(value);

    let newNode = new Node({
      value,
      next: nodeBeforeIndex.next,
    });

    nodeBeforeIndex.next = newNode;
  }

  clear() {
    this.head = null;
  }

  removeHead() {
    this.head = this.head.next;
  }

  removeTail() {
    let prev = this.head;
    let current = prev.next;

    if (!current)
      return this.clear();

    while (current && current.next) {
      prev = current;
      current = current.next;
    }

    prev.next = null;
  }

  removeAt(index) {
    let nodeBeforeIndex = this.getNodeAt(index - 1);

    if (!nodeBeforeIndex)
      return this.removeTail();

    nodeBeforeIndex.next = nodeBeforeIndex.next.next;
  }

  shiftHeadBy(spaces) {
    let head = this.head;
    this.removeHead();
    this.insertAt(spaces, head.value);
  }

  map(call) {
    let node = this.head;
    let arr = [];
    while (node) {
      arr.push(call(node));
      node = node.next;
    }
    return arr;
  }
}

module.exports = {
  Node,
  LinkedList,
};


// //node
// class _Node {
//     constructor(value = null, next = null) {
//         this.value = value;
//         this.next = next;
//     }
// }

// class LinkedList {
//     constructor(db, language_id) {
//         this.head = null;
//         this.db = db
//         this.language_id = language_id

//     }
//     async loadFromDb() {
//         let languageRow = await this.db.from('language').select('*').where('id', this.language_id).first()
//         let headRow = await this.db.from('word').select('*').where('id', languageRow.head).first()
//         this.head = new _Node(headRow, null)
//query database to get the node


//         //construct link list
//         let node = this.head
//         while (node) {
//             //refers to the first row it finds in the database, selects one n
//             if (node.value.next) {
//                 let nodeRow = await this.db.from('word').select('*').where('id', node.value.next).first()
//                 node.next = new _Node(nodeRow, null)
//             }
//             node = node.next
//         }
//         return this
//     }


//     //insert first
//     insertFirst(item) {
//         //5
//         this.head = new _Node(item, this.head);
//     }
//     insertLast(item) {
//         if (this.head === null) {
//             this.insertFirst(item);
//         }
//         let tempNode = this.head; //3
//         while (tempNode.next !== null) {
//             tempNode = tempNode.next;
//         }
//         tempNode.next = new _Node(item, null);
//     }

//     //retrieval
//     find(item) {
//         // Start at the head
//         let currNode = this.head;
//         // If the list is empty
//         if (!this.head) {
//             return null;
//         }
//         // Check for the item
//         while (currNode.value !== item) {
//             /* Return null if it's the end of the list 
//                      and the item is not on the list */
//             if (currNode.next === null) {
//                 return null;
//             } else {
//                 // Otherwise, keep looking
//                 currNode = currNode.next;
//             }
//         }
//         // Found it
//         return currNode;
//     }

//     remove(item) {
//         // If the list is empty
//         if (!this.head) {
//             return null;
//         }
//         // If the node to be removed is head, make the next node head
//         if (this.head.value === item) {
//             this.head = this.head.next;
//             return;
//         }
//         // Start at the head
//         let currNode = this.head;
//         // Keep track of previous
//         let previousNode = this.head;

//         while (currNode !== null && currNode.value !== item) {
//             // Save the previous node
//             previousNode = currNode;
//             currNode = currNode.next;
//         }
//         if (currNode === null) {
//             console.log("Item not found");
//             return;
//         }
//         previousNode.next = currNode.next;
//     }

//     insertAt(newValue, position) {
//         let count = 1;
//         let currNode = this.head;
//         while (count < position) {
//             if (currNode.next === null) {
//                 console.log('Could not find that position');
//                 return;
//             }
//             count++;
//             currNode = currNode.next;
//         }
//         currNode.next = new _Node(newValue, currNode.next);
//     }


//     removeHead() {
//         this.head = this.head.next
//     }

//     shiftHead(spaces) {
//         let head = this.head
//         this.removeHead()
//         this.insertAt(spaces, head.value)

//     }

//     map(call) {
//         let node = this.head
//         let arr = []
//         while (node) {
//             arr.push(call(node))
//             node = node.next
//         }
//         return arr
//     }

// }

// module.exports = LinkedList

