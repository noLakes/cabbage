import db from './data';
import { Field, Head, Leaf, hasChildren } from './objects';
import { elements, render,} from './dom';
import { format, } from 'date-fns'

// a logic controller for the different ways you might want to render/show the content
// contains event listeners for interacting with DOM elements
const controller = (function() {

  const initFields = () => {
    const fields = db.fetchFields();
    for(let key in fields) {
      const fieldEl = render.fieldNav(fields[key]);
      // add event listener here allocation here?
      const listItem = elements.basic('li');
      listItem.appendChild(fieldEl);
      elements.field_links.appendChild(listItem);
    }
  }

  return {
    initFields,

  }
})()

export { controller as default };