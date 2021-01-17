import { Field, Head, Leaf } from './objects';

// module for setting up and interacting with database
// to add: firebase / check local storage viable / setup function for page load
const db = (function() {
  let cabbage_db = {
    fields : new Map(),
    uids : {
      field : -1,
      head : -1,
      leaf : -1,
    }
  };

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
    let result = cabbage_db.fields.get(uid.shift());
    while(uid.length > 0) {
      result = result.children.get(uid.shift());
    }
    return result;
  }

  const insert = (parent, child) => {
    const child_key = parse_uid(child.uid).pop();
    parent.children.set(child_key, child);
  }

  const add_field = (name) => {
    const field = Field(name);
    field.uid = request_uid('field');
    cabbage_db.fields.set(parse_uid(field.uid)[0], field);
  }

  const add_head = (parent_uid, name, info, due) => {
    const head = Head(name, info, due);
    const parent = fetch(parent_uid);
    head.uid = merge_uid(parent.uid, request_uid('head'));
    insert(parent, head);
  }

  const add_leaf = (parent_uid, name, due) => {
    const leaf = Leaf(name, due);
    const parent = fetch(parent_uid);
    leaf.uid = merge_uid(parent.uid, request_uid('leaf'));
    insert(parent, leaf);
  }

  // this needs to be tested further once DOM event listeners begin calling it
  const update_item = (uid, params) => {
    const item = fetch(uid);
    for(const key in params) {
      item[key] = params[key];
    }
  }

  const save = () => {
    localStorage.setItem('cabbage_db', JSON.stringify(cabbage_db));
  }

  const load = () => {
    if(localStorage['cabbage_db']) {
      cabbage_db = JSON.parse(localStorage['cabbage_db']);
    } else {
      console.warn('could nont load cabbage db');
    }
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
    insert,
    add_field,
    add_head,
    add_leaf,
    update_item,
    save,
    load,
    fetch_raw,
  }
})()

export { db as default };