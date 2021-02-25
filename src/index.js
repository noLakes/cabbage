import db from './data'

import { storageAvailable } from './storage'
import controller from './controller'

if (storageAvailable('localStorage')) {
  db.initialize()

  // default into db
  if (!db.fetchRaw().projects[0]) {
    db.addProject('general')
    db.addTask('0', 'welcome', 'welcome to cabbage! a super lightweight to-do list app made by yours truly in an effort to get better at javascript', 0)
    db.addCheck('0-0', 'add your own projects (they are like a folder for your tasks)')
    db.addCheck('0-0', 'make a new task for your project')
    db.addCheck('0-0', "give that task a lil' description")
    db.addCheck('0-0', 'create a couple of checklist items for your new task')
    db.addCheck('0-0', 'take time in life for the little things')
  }

  controller.initHome()
} else {
  alert('Please allow local storage permissions and refresh this page!')
}
