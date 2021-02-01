import { Field, Head, Leaf, childCount } from './objects';
import { format, parse } from 'date-fns'

const db = (function() {
  let cabbage_db = null;
  
  const newDb = () => {
    return {
      fields : {},
      uids : {
        field : -1,
        head : -1,
        leaf : -1,
      }
    }
  }

  const save = () => {
    localStorage.setItem('cabbage_db', JSON.stringify(cabbage_db));
  }

  const load = () => {
    if(localStorage['cabbage_db']) {
      cabbage_db = JSON.parse(localStorage['cabbage_db']);
      console.log('db loaded');
      return true;
    } else {
      return false;
    }
  }

  const initialize = () => {
    if(!load()) {
      cabbage_db = newDb();
      save();
      console.log('new db initialized');
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
    let result = cabbage_db.fields[uid.shift()];
    while(uid.length > 0) {
      result = result.children[uid.shift()];
    }
    return result;
  }

  const fetchFields = () => {
    return cabbage_db.fields;
  }

  const fetchAllHeads = () => {
    const results = [];
    for(const key in cabbage_db.fields) {
      const heads = Object.values(cabbage_db.fields[key].children);
      results.push(heads);
    }
    return results.flat();
  }

  const fetchHeadsByDue = () => {
    const heads = fetchAllHeads();
    return heads.sort((a, b) => {
      if(a.due < b.due) {
        return -1;
      } else if(a.due > b.due) {
        return 1;
      } else {
        return 0;
      }
    })
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
      delete cabbage_db.fields[target];
    } else {
      delete fetch(uid).children[target];
    }
    save();
  }

  const add_field = (name) => {
    const field = Field(name);
    field.uid = request_uid('field');
    cabbage_db.fields[parse_uid(field.uid)[0]] = field;
    save();
  }

  const add_head = (parent_uid, name, info, due) => {
    const head = Head(name, info, due);
    const parent = fetch(parent_uid);
    head.uid = merge_uid(parent.uid, request_uid('head'));
    insert(parent, head);
  }

  const add_leaf = (parent_uid, name) => {
    const leaf = Leaf(name);
    const parent = fetch(parent_uid);
    leaf.uid = merge_uid(parent.uid, request_uid('leaf'));
    insert(parent, leaf);
  }

  // needs to be tested further once DOM event listeners begin calling it
  const update_item = (uid, params) => {
    const item = fetch(uid);
    for(const key in params) {
      item[key] = params[key];
    }
    save();
  }

  const parseDate = (head) => {
    if(!head.due) return;
    return parse(head.due, 'MM/dd/yyyy', new Date());
  }

  const formatDateBrowser = (head) => {
    if(!head.due) return '';
    const date = parseDate(head);
    return format(date, 'yyyy/MM/dd').replace(/\//g,'-');
  }

  const dateQuery = (date) => {
    const results = fetchAllHeads().filter(head => parseDate(head) < date );
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
    fetchFields,
    insert,
    add_field,
    add_head,
    add_leaf,
    update_item,
    save,
    load,
    fetch_raw,
    initialize,
    parseDate,
    dateQuery,
    fetchAllHeads,
    fetchHeadsByDue,
    formatDateBrowser,
    remove,
  }
})()

export { db as default };