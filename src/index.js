import { Field, Head, Leaf } from './objects';

// module for setting up and interacting with database
// to add: firebase / check local storage viable / setup function for page load
const db = (function() {
  let cabbage_db = {
    fields : {},
    uids : {
      field : -1,
      head : -1,
      leaf : -1,
    }
  };

  return {

    parse_uid(uid) {
      uid = uid.split('-')
      uid = uid.map(i => Number(i));
      return uid;
    },

    uid_to_s(uid) {
      return uid.join('-');
    },

    request_id(type) {
      cabbage_db['uids'][type] += 1;
      return cabbage_db['uids'][type];
    },

    merge_id(parent_uid, child_id_num) {
      return parent_uid.push(child_id_num);
    },

    fetch(uid) {
      uid = this.parse_uid(uid);
      if (uid.length === 0) return;
      console.table(uid);
      let result = cabbage_db.fields[uid.shift()];
      console.log(`I found ${result}`);
      while(uid.length > 0) {
        result = result['children'][uid.shift];
      }
      return result;
    },

    add_field(name) {
      const field = Field(name);
      field.uid = [this.request_id('field')];
      console.log(field);
      cabbage_db['fields'][field.uid[0]] = field;
    },

    add_head(parent_uid, name, info, due) {
      const head = Head(name, info, due);
      const parent = this.fetch(this.parse_uid(parent_uid));
      head.uid = this.merge_id(parent.uid, this.request_id('head'));
      parent.children[head.uid[head.uid -1]] = head;
    },

    add_leaf(parent_uid, name, due) {
      const leaf = Leaf(name, due);
      const parent = this.fetch(this.parse_uid(parent_uid));
      leaf.uid = this.merge_id(parent.uid, this.request_id('leaf'));
      parent.children[leaf.uid[leaf.uid -1]] = leaf;
    },

    save() {
      localStorage.setItem('cabbage_db', JSON.stringify(cabbage_db));
    },

    load() {
      if(localStorage['cabbage_db']) {
        cabbage_db = JSON.parse(localStorage['cabbage_db']);
      } else {
        this.save();
      }
    },

    //for testing
    fetch_raw() {
      return cabbage_db;
    },

  }
})()

function line() {
  console.log('------------------------------------')
}

db.add_field('test');
db.add_head();




