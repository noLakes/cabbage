import { Field, Head, Leaf } from './objects';

const localDB = (function() {
  let local_cabbage = {patches:[]};

  return {

    save() {
      localStorage.setItem('local_cabbage', JSON.stringify(local_cabbage));
    },

    get_data() {
      return local_cabbage;
    }
  }
})()

console.log(localDB.get_data());
