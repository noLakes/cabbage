import db from './data';

import { storageAvailable } from './storage';
import controller from './controller';


if (storageAvailable('localStorage')) {
  db.initialize();
  
  // default into db
  if (!db.fetch_raw().projects[0]) {
    db.add_project('general');
    db.add_task('0', 'welcome', 'welcome to cabbage! a super lightweight to-do list app made by yours truly in an effort to get better at javascript', 0);
    db.add_check('0-0', 'add your own projects (they are like a folder for your tasks)');
    db.add_check('0-0', 'make a new task for your project');
    db.add_check('0-0', "give that task a lil' description");
    db.add_check('0-0', 'create a couple of checklist items for your new task');
    db.add_check('0-0', 'take time in life for the little things');
  }

  controller.initHome();
} else {
  alert('Please allow local storage permissions and refresh this page!');
}



