import db from './data';

import { storageAvailable } from './storage';
import controller from './controller';


if (storageAvailable('localStorage')) {
  db.initialize();
  
  // test data
  if (!db.fetch_raw().projects[0]) {
    db.add_project('General');
    db.add_task('0', 'Get groceries', '', new Date(2021, 0, 26, 23, 55).getTime());
    db.add_check('0-0', 'milk');
    db.add_check('0-0', 'eggs');
    db.add_check('0-0', 'bread');
    db.add_check('0-0', 'cheese');
    db.add_check('0-0', 'diced tomatoes');
    db.add_check('0-0', 'onions');
    db.add_check('0-0', 'zuccini');
    db.add_check('0-0', 'carrots');
    db.add_check('0-0', 'garlic');
    db.add_check('0-0', 'red peppers');
    db.add_check('0-0', 'spinach');
    db.add_check('0-0', 'mushrooms');
    db.add_check('0-0', 'paper towel');
    db.add_check('0-0', 'batteries');
    db.add_task('0', 'Clean Shower', '', new Date(2021, 0, 26, 23, 55).getTime());
    db.add_task('0', 'Sell Bike', 'dont go less than $500!!!', new Date(2021, 1, 8, 12, 0).getTime());
    db.add_check('0-2', 'take pics');
    db.add_check('0-2', 'post add on kijiji');

    db.add_project('Work');
    db.add_task('1', 'Look for a job', '');
    db.add_check('1-3', 'setup indeed search prefs');
    db.add_check('1-3', 'edit cover letter template');
    db.add_check('1-3', 'make skills resume');

    db.add_project('Code');
    db.add_task('2', 'Finish Cabbage', '');
    db.add_check('2-4', 'add date/time functionality');
    db.add_check('2-4', 'add forms');
    db.add_check('2-4', 'add modals');
    db.add_check('2-4', 'style');
  }

  controller.initHome();
} else {
  alert('Please allow local storage permissions and refresh this page!');
}



