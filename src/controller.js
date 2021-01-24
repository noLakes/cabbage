import db from './data';
import { Field, Head, Leaf, hasChildren } from './objects';
import { elements, render,} from './dom';
import { format, } from 'date-fns'

// a logic controller for the different ways you might want to render/show the content
// contains event listeners for interacting with DOM elements
const controller = (function() {

  const clearActive = () => {
    document.querySelectorAll('.nav-container a').forEach(link => {
      link.classList.remove('active');
    })
  }

  const setActive = (e) => {
    if(e.target.classList.contains('active')) return;
    clearActive();
    console.log('cleared!')
    e.target.classList.add('active');
    // load content here?
  }

  const initFields = () => {
    const fields = db.fetchFields();
    for(let key in fields) {
      const fieldEl = render.fieldNav(fields[key]);
      fieldEl.addEventListener("click", setActive);
      elements.field_links_container.appendChild(fieldEl);
    }
  }

  const clearContent = () => {
    elements.content.innerHTML = '';
  }

  const loadField = (field, withChildren=true) => {
    
  }

  const contentHandler = (e) => {

  }

  const initialize = () => {

  }

  elements.static_links.forEach(link => {
    link.addEventListener("click", setActive);
  })

  return {
    initFields,
    //initNavListeners,
  }
})()

export { controller as default };