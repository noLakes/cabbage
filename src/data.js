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

  return {

    parse_uid(uid) {
      return uid.split('-').map(i => Number(i));
    },

    uid_to_s(uid) {
      return uid.join('-');
    },

    request_uid(type) {
      cabbage_db['uids'][type] += 1;
      return String(cabbage_db['uids'][type]);
    },

    merge_uid(parent_uid, child_uid) {
      return parent_uid.concat(`-${child_uid}`);
    },

    fetch(uid) {
      if(typeof(uid) === "string") {
        uid = this.parse_uid(uid);
      }
      if (uid.length === 0) return;
      let result = cabbage_db.fields.get(uid.shift());
      //let result = cabbage_db.fields[uid.shift()];
      while(uid.length > 0) {
        result = result.children.get(uid.shift());
        //result = result['children'][uid.shift()];
      }
      return result;
    },

    insert(parent, child) {
      const child_key = this.parse_uid(child.uid).pop();
      parent.children.set(child_key, child);
      //parent.children[child_key] = child;
    },

    add_field(name) {
      const field = Field(name);
      field.uid = this.request_uid('field');
      cabbage_db.fields.set(this.parse_uid(field.uid)[0], field);
      //cabbage_db['fields'][this.parse_uid(field.uid)[0]] = field;
    },

    add_head(parent_uid, name, info, due) {
      const head = Head(name, info, due);
      const parent = this.fetch(parent_uid);
      head.uid = this.merge_uid(parent.uid, this.request_uid('head'));
      this.insert(parent, head);
    },

    add_leaf(parent_uid, name, due) {
      const leaf = Leaf(name, due);
      const parent = this.fetch(parent_uid);
      leaf.uid = this.merge_uid(parent.uid, this.request_uid('leaf'));
      this.insert(parent, leaf);
    },

    // this needs to be tested further once DOM event listeners begin calling it
    update_item(uid, params) {
      const item = this.fetch(uid);
      for(const key in params) {
        item[key] = params[key];
      }
    },

    save() {
      localStorage.setItem('cabbage_db', JSON.stringify(cabbage_db));
    },

    load() {
      if(localStorage['cabbage_db']) {
        cabbage_db = JSON.parse(localStorage['cabbage_db']);
      } else {
        console.warn('could nont load cabbage db');
      }
    },

    //for testing
    fetch_raw() {
      return cabbage_db;
    },

  }
})()

export { db as default };