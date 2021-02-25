import { Project, Task, Check } from './objects';
import { format, } from 'date-fns'

const db = (function() {
  let cabbage_db = null;
  
  const newDb = () => {
    return {
      projects : {},
      uids : {
        project : -1,
        task : -1,
        check : -1,
      }
    }
  }

  const save = () => {
    localStorage.setItem('cabbage_db', JSON.stringify(cabbage_db));
  }

  const load = () => {
    if(localStorage['cabbage_db']) {
      cabbage_db = JSON.parse(localStorage['cabbage_db']);
      return true;
    } else {
      return false;
    }
  }

  const initialize = () => {
    if(!load()) {
      cabbage_db = newDb();
      save();
    }
  }

  const parse_uid = (uid) => {
    return uid.split('-').map(i => Number(i));
  }

  const uid_to_s = (uid) => {
    return uid.join('-');
  }

  const request_uid = (type) => {
    cabbage_db['uids'][type] += 1;
    return String(cabbage_db['uids'][type]);
  }

  const merge_uid = (parent_uid, child_uid) => {
    return parent_uid.concat(`-${child_uid}`);
  }

  const fetch = (uid) => {
    if(typeof(uid) === "string") {
      uid = parse_uid(uid);
    }
    if (uid.length === 0) return;
    let result = cabbage_db.projects[uid.shift()];
    while(uid.length > 0) {
      result = result.children[uid.shift()];
    }
    return result;
  }

  const fetchProjects = () => {
    return cabbage_db.projects;
  }

  const fetchAllTasks = () => {
    const results = [];
    for(const key in cabbage_db.projects) {
      const tasks = Object.values(cabbage_db.projects[key].children);
      results.push(tasks);
    }
    return results.flat();
  }

  const fetchTasksByDue = () => {
    const tasks = fetchAllTasks();
    const sort1 = tasks.sort((a, b) => {
      if(a.due < b.due) {
        return -1;
      } else if(a.due > b.due) {
        return 1;
      } else {
        return 0;
      }
    })
    return [...sort1.filter(t => t.due), ...sort1.filter(t => !t.due)];
  }

  const insert = (parent, child) => {
    const child_key = parse_uid(child.uid).pop();
    parent.children[child_key] = child;
    save();
  }

  const remove = (uid) => {
    uid = parse_uid(uid);
    const target = uid.pop();

    if(uid.length < 1) {
      delete cabbage_db.projects[target];
    } else {
      delete fetch(uid).children[target];
    }
    save();
  }

  const add_project = (name) => {
    const project = Project(name);
    project.uid = request_uid('project');
    cabbage_db.projects[parse_uid(project.uid)[0]] = project;
    save();
  }

  const add_task = (parent_uid, name, info, due=0) => {
    const task = Task(name, info, due);
    const parent = fetch(parent_uid);
    task.uid = merge_uid(parent.uid, request_uid('task'));
    insert(parent, task);
  }

  const add_check = (parent_uid, name) => {
    const check = Check(name);
    const parent = fetch(parent_uid);
    check.uid = merge_uid(parent.uid, request_uid('check'));
    insert(parent, check);
  }

  // needs to be tested further once DOM event listeners begin calling it
  const update_item = (uid, params) => {
    const item = fetch(uid);
    for(const key in params) {
      item[key] = params[key];
    }
    save();
  }

  const parseDate = (task) => {
    if(!task.due) return;
    return new Date(task.due);
  }

  const formatDateForPicker = (task) => {
    if(!task.due) return '';
    return format(Number(task.due), 'yyyy/MM/dd').replace(/\//g, '-');
  }

  const dateQuery = (date) => {
    const results = fetchAllTasks().filter(task => parseDate(task) < date );
    return results;
  }


  //for testing
  const fetch_raw = () => {
    return cabbage_db;
  }

  return {
    parse_uid,
    uid_to_s,
    request_uid,
    merge_uid,
    fetch,
    fetchProjects,
    insert,
    add_project,
    add_task,
    add_check,
    update_item,
    save,
    load,
    fetch_raw,
    initialize,
    parseDate,
    dateQuery,
    fetchAllTasks,
    fetchTasksByDue,
    formatDateForPicker,
    remove,
  }
})()

export { db as default };