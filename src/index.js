import { Field, Head, Leaf } from './objects';

const data = (function() {
  let cabbage_db = {fields:[Field('General')]};

  return {

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

    fetch() {
      return cabbage_db;
    }
  }
})()

data.load();

console.table(data.fetch());


