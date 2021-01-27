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

  const clearContent = () => {
    elements.content.innerHTML = '';
  }

  const loadField = (uid) => {
    console.log(`asked to load field with uid -> ${uid}`);
    clearContent();
    const field = db.fetch(uid);
    for(let key in field.children) {
      const head = render.head(field.children[key]);
      elements.content.appendChild(head);
    }
  }
  
  const loadBatch = (arr) => {
    clearContent();
    arr.forEach(item => {
      let rendering = null;
      if(item.type === 'head') {
        rendering = render.head(item);
      } else {
        rendering = render.leaf(item);
      }
      if(rendering) elements.content.appendChild(rendering);
    })
  }

  // determines which selection of items to pool and load into the content window
  const loadHandler = (target) => {
    if(target.classList.contains('time-link')) {
      switch(target.id) {
        case 'today':
          const now = new Date();
          const endOfDay = new Date(now.getFullYear()
                                    ,now.getMonth()
                                    ,now.getDate()
                                    ,23,59,59);
          loadBatch(db.dateQuery(endOfDay));
          break
        case 'upcoming':
          const twoWeeks = new Date(Date.now() + 12096e5);
          loadBatch(db.dateQuery(twoWeeks));
          break
        default:
          console.log('load default');
          //load home?
      }
    }
    else {
      console.log(`load field for ${target.dataset.uid}`);
      loadField(target.dataset.uid);
    }
  }

  const activate = (e) => {
    if(e.target.classList.contains('active')) return;
    clearActive();
    e.target.classList.add('active');
    // load content here?
    loadHandler(e.target);
  }

  const initFields = () => {
    const fields = db.fetchFields();
    for(let key in fields) {
      const fieldEl = render.fieldNav(fields[key]);
      fieldEl.addEventListener("click", activate);
      elements.field_links_container.appendChild(fieldEl);
    }
  }

  const initialize = () => {

  }

  elements.static_links.forEach(link => {
    link.addEventListener("click", activate);
  })

  return {
    initFields,
  }
})()

export { controller as default };