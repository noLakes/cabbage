import db from './data';
import { Field, Head, Leaf } from './objects';

db.add_field('field 0');
db.add_head('0', 'Test head0', 'info', false);
db.add_head('0', 'Test head1', 'info', false);
db.add_head('0', 'Test head2', 'info', false);
db.add_field('field 1');
db.add_head('1', 'Test head3', 'info', false);
db.add_field('field 2');
db.add_head('2', 'Test head4', 'info', false);
db.add_leaf('1-3', 'leaf 0', false);


db.update_item('1-3-0', {name:'UPDATED LEAF, DESTROYER OF WORLDS'});
console.table(db.fetch_raw().fields);
