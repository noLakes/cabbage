import db from './data';
import { Field, Head, Leaf, childCount } from './objects';
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

  const endOfDay = () => {
    const now = new Date();
    return new Date(now.getFullYear()
              ,now.getMonth()
              ,now.getDate()
              ,23,59,59);
  }

  const twoWeeks = () => {
    return new Date(Number(endOfDay()) + 12096e5);
  }

  const initFields = () => {
    const fields = db.fetchFields();
    for(let key in fields) {
      const fieldEl = render.fieldNav(fields[key]);
      fieldEl.addEventListener("click", activate);
      elements.field_links_container.appendChild(fieldEl);
    }
  }

  const reloadFields = () => {
    const activeUid = document.querySelector('.active').dataset.uid;
    elements.field_links_container.innerHTML = '';
    initFields();
    document.querySelector(`[data-uid='${activeUid}']`).classList.add('active');
  }

  const reloadContent = () => {
    clearContent();
    const active = document.querySelector('.active');
    loadHandler(active);
  }

  const open_field_form = () => {
    const form = render.new_field_form();
    
    form.querySelector('input.submit_field').addEventListener('click', (e) => {
      const name = form.querySelector('input.field_name').value;
      db.add_field(name)
      elements.new_field_button.disabled = false;
      e.target.parentElement.remove();
      reloadFields();
    })
    
    form.querySelector('input.cancel_field').addEventListener('click', (e) => {
      elements.new_field_button.disabled = false;
      e.target.parentElement.remove();
    })
    
    elements.field_links_container.appendChild(form);
  }

  const assign_head_form_listeners = (form) => {
    form.querySelector('.new-head-init').addEventListener('click', (e) => {
      e.target.style.display = 'none';
      form.querySelector('.form-container').style.display = 'block';
    })

    form.querySelector('input.submit-head').addEventListener('click', (e) => {
      db.add_head(
        e.target.dataset.uid,
        form.querySelector('.head-name').value,
        form.querySelector('.head-info').value,
        form.querySelector('.head-due').value || undefined,
      )
      form.querySelector('.form-container').style.display = 'none';
      form.querySelector('.new-head-init').style.display = 'block';
      reloadContent();
    })

    form.querySelector('.cancel-head').addEventListener('click', (e) => {
      form.querySelector('.form-container').style.display = 'none';
      form.querySelector('.new-head-init').style.display = 'block';
    })
  }

  const loadNewHeadForm = (uid) => {
    const new_head_form = render.new_head_form(uid);
    assign_head_form_listeners(new_head_form);
    elements.content.appendChild(new_head_form);
  }

  const open_field_edit_form = (field) => {
    const edit_form = render.edit_field_form(field);

    edit_form.querySelector('.submit-edit').addEventListener('click', (e) => {
      db.update_item(field.uid, {name : edit_form.querySelector('.edit-field-name').value});
      reloadFields();
      loadField(field.uid);
    })
    edit_form.querySelector('.cancel-edit').addEventListener('click', (e) => {
      loadField(field.uid);
    })
    elements.content.prepend(edit_form);
  }

  const loadFieldHeading = (field) => {
    const fieldHeading = render.fieldHeading(field);
    fieldHeading.querySelector('.edit-field').addEventListener('click', (e) => {
      e.target.parentElement.remove();
      open_field_edit_form(field);
    })
    elements.content.prepend(fieldHeading);
  }

  const loadField = (uid) => {
    clearContent();
    const field = db.fetch(uid);
    loadFieldHeading(field);
    for(let key in field.children) {
      const head = render.head(field.children[key]);
      elements.content.appendChild(head);
    }
    loadNewHeadForm(uid);
  }

  // determines which selection of items to pool and load into the content window
  const loadHandler = (target) => {
    if(target.classList.contains('time-link')) {
      switch(target.id) {
        case 'today':
          loadBatch(db.dateQuery(endOfDay()));
          break
        case 'upcoming':
          loadBatch(db.dateQuery(twoWeeks()));
          break
        default:
          console.log('load default');
          loadBatch(db.fetchHeadsByDue());
      }
    }
    else {
      loadField(target.dataset.uid);
    }
  }

  const activate = (e) => {
    if(e.target.classList.contains('active')) return;
    clearActive();
    e.target.classList.add('active');
    loadHandler(e.target);
  }

  const initialize = () => {

  }

  // add event listeners to static items

  elements.static_links.forEach(link => {
    link.addEventListener("click", activate);
  })

  elements.new_field_button.addEventListener('click', (e) => {
    open_field_form();
    e.target.disabled = true;
  })

  return {
    initFields,
  }
})()

export { controller as default };