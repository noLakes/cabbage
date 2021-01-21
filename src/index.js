import db from './data';
import { Field, Head, Leaf, hasChildren } from './objects';

db.initialize();

if(!db.fetch_raw().fields[0]) {
  db.add_field('General');
  db.add_head('0', 'Test head0', 'info', false);
  db.add_head('0', 'Test head1', 'info', false);
  db.add_head('0', 'Test head2', 'info', false);
  db.add_field('field 1');
  db.add_head('1', 'Test head3', 'info', false);
  db.add_field('field 2');
  db.add_head('2', 'Test head4', 'info', false);
  db.add_leaf('1-3', 'leaf 0', false);
}

const test1 = db.fetch('1-3');
console.log(test1);
console.log(hasChildren(test1));

const test2 = db.fetch('0-2');
console.log(test2);
console.log(hasChildren(test2));

const test3 = db.fetch('1-3-0');
console.log(test3);
console.log(hasChildren(test3));





