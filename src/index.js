import db from './data';
/*
import { Field, Head, Leaf, childCount, childCompleteRatio } from './objects';
import { elements, render,} from './dom';
*/
import controller from './controller';
import { format, parse } from 'date-fns'


db.initialize();

// test data
if(!db.fetch_raw().fields[0]) {
  db.add_field('General');
    db.add_head('0', 'Get groceries', '', new Date(2021, 0, 26, 23, 55).getTime());
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
    db.add_head('0', 'Clean Shower', '', new Date(2021, 0, 26, 23, 55).getTime());
    db.add_head('0', 'Sell Bike', 'dont go less than $500!!!', new Date(2021, 1, 8, 12, 0).getTime());
      db.add_leaf('0-2', 'take pics');
      db.add_leaf('0-2', 'post add on kijiji');

  db.add_field('Work');
    db.add_head('1', 'Look for a job', '');
      db.add_leaf('1-3', 'setup indeed search prefs');
      db.add_leaf('1-3', 'edit cover letter template');
      db.add_leaf('1-3', 'make skills resume');
    
  db.add_field('Code');
    db.add_head('2', 'Finish Cabbage', '');
      db.add_leaf('2-4', 'add date/time functionality');
      db.add_leaf('2-4', 'add forms');
      db.add_leaf('2-4', 'add modals');
      db.add_leaf('2-4', 'style');
}

controller.initHome();

/*
console.log(parse('Jan/30', 'MMM/dd', new Date()));

const date = new Date().getTime();
console.log(format(date, 'MMM/dd'));
*/