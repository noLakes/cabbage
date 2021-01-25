import db from './data';
import { Field, Head, Leaf, hasChildren } from './objects';
import { elements, render,} from './dom';
import controller from './controller';


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

controller.initFields();








