import db from './data';
import { Field, Head, Leaf, hasChildren } from './objects';
import { elements, render,} from './dom';
import controller from './controller';


db.initialize();

// test data
if(!db.fetch_raw().fields[0]) {
  db.add_field('General');
    db.add_head('0', 'Get groceries', 'info', false);
      db.add_leaf('0-0', 'milk');
      db.add_leaf('0-0', 'eggs');
      db.add_leaf('0-0', 'bread');
      db.add_leaf('0-0', 'cheese');
      db.add_leaf('0-0', 'diced tomatoes');
      db.add_leaf('0-0', 'onions');
      db.add_leaf('0-0', 'zuccini');
      db.add_leaf('0-0', 'carrots');
      db.add_leaf('0-0', 'garlic');
      db.add_leaf('0-0', 'red peppers');
      db.add_leaf('0-0', 'spinach');
      db.add_leaf('0-0', 'mushrooms');
      db.add_leaf('0-0', 'paper towel');
      db.add_leaf('0-0', 'batteries');
    db.add_head('0', 'Clean Shower', 'info', false);
    db.add_head('0', 'Sell Bike', 'info', false);
      db.add_leaf('0-2', 'take pics');
      db.add_leaf('0-2', 'post add on kijiji');

  db.add_field('Work');
    db.add_head('1', 'Look for a job', 'info', false);
      db.add_leaf('1-3', 'setup indeed search prefs');
      db.add_leaf('1-3', 'edit cover letter template');
      db.add_leaf('1-3', 'make skills resume');
    
  db.add_field('Code');
    db.add_head('2', 'Finish Cabbage', 'info', false);
      db.add_leaf('2-4', 'add date/time functionality');
      db.add_leaf('2-4', 'add forms');
      db.add_leaf('2-4', 'add modals');
      db.add_leaf('2-4', 'style');
}

controller.initFields();

console.log(db.flatten());








