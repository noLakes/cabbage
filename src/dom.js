import { Field, Head, Leaf, childCount, childCompleteRatio } from './objects';
import { format, parse, } from 'date-fns'
import db from './data';

// a basic library for global elements and reusable functions
const elements = (function() {
  return {
    main : document.querySelector('.main-container'),
    nav : document.querySelector('.nav-container'),
    static_links : document.querySelectorAll('.static-links a'),
    field_links_container : document.querySelector('.field-links'),
    new_field_button : document.querySelector('button.new-field'),
    content : document.querySelector('.content-container'),
    footer : document.querySelector('.footer-container'),
    modal : document.querySelector('.modal'),

    basic(type, className=undefined, id=undefined) {
      const div = document.createElement(type);
      if (className) {
        className.split(',').forEach(cName => {
          div.classList.add(cName);
        });
      } 
      if (id) div.id = id;
      return div;
    },

  }
})()

// a way to render objects into appropriate dom elements
const render = (function() {
  return {

    leaf_form(edit=false) {
      const container = elements.basic('div', 'leaf-form-container');
        const form = elements.basic('form', 'leaf-form');
        
        const name = elements.basic('input', 'name-input');
        name.placeholder = 'new task!';
        if(edit) {
          name.value = edit.name;
          name.dataset.uid = edit.uid;
        }

        const save = elements.basic('button', 'save-leaf');
        save.innerHTML = 'save';
        save.addEventListener('click', () => {
          if(edit) {
            db.update_item(name.dataset.uid, {name : name.value});
            container.nextSibling.querySelector('.name').innerHTML = name.value;
            container.nextSibling.style.display = 'flex';
          } else {
            db.add_leaf(document.querySelector('.modal-content').dataset.uid, name.value);
            const head = db.fetch(document.querySelector('.modal-content').dataset.uid);
            const newLeaf = Object.values(head.children).filter(i => i.name === name.value)[0];
            container.parentElement.appendChild(this.leaf(newLeaf));
          }
          container.remove();
        })

        const cancel = elements.basic('button', 'cancel-leaf');
        cancel.innerHTML = 'cancel';
        cancel.addEventListener('click', () => {
          if(edit) container.nextSibling.style.display = 'flex';
          container.remove();
        })

        form.appendChild(name);
        form.appendChild(save);
        form.appendChild(cancel);
        container.appendChild(form);
      return container;
    },

    leaf(leaf) {
      const leafContainer = elements.basic('div', 'leaf');
      leafContainer.dataset.uid = leaf.uid;

      const checkboxContainer = elements.basic('label', 'checkbox-container');
        const checkBox = elements.basic('input', 'checkbox');
        checkBox.type = 'checkbox';
        checkBox.checked = leaf.complete;
        checkBox.addEventListener('change', (e) => {
          if(e.target.checked) {
            db.update_item(leaf.uid, {complete : true});
          }else if(!e.target.checked) {
            db.update_item(leaf.uid, {complete : false});
          }
        })
        const checkmark = elements.basic('span', 'checkmark');
        checkboxContainer.appendChild(checkBox);
        checkboxContainer.appendChild(checkmark);
      leafContainer.appendChild(checkboxContainer);

      const name = elements.basic('p', 'name');
        name.innerHTML = leaf.name;
      leafContainer.appendChild(name);

      const actionContainer = elements.basic('div', 'action-container');
        const edit = elements.basic('button', 'edit-leaf');
        edit.innerHTML = 'edit';
        edit.addEventListener('click', () => {
          leafContainer.parentElement.insertBefore(this.leaf_form(leaf), leafContainer);
          leafContainer.style.display = 'none';
        })
        
        const del = elements.basic('button', 'delete-leaf');
        del.innerHTML = 'delete';     
        del.addEventListener('click', () => {
          db.remove(leafContainer.dataset.uid);
          leafContainer.remove();
        })

        actionContainer.appendChild(edit);
        actionContainer.appendChild(del);
      actionContainer.style.display = 'none';
      leafContainer.appendChild(actionContainer);

      leafContainer.addEventListener('mouseenter', (e) => {
        actionContainer.style.display = 'block';
      })
      leafContainer.addEventListener('mouseleave', (e) => {
        actionContainer.style.display = 'none';
      })
      return leafContainer;
    },

    heads_container() {
      return elements.basic('div', 'heads-container');
    },

    head_tile(head) {
      const tile = elements.basic('a', 'head-tile');
      
      const headingContainer = elements.basic('div', 'heading-container');
      const title = elements.basic('h3', 'title');
      title.innerHTML = head.name;
      headingContainer.appendChild(title);
      tile.appendChild(headingContainer);

      const infoContainer = elements.basic('div', 'info-container');

      if(childCount(head)) {
        const listRatio = childCompleteRatio(head);
        const listCounter = elements.basic('p', 'list-counter');
        listCounter.innerHTML = `${listRatio[0]}/${listRatio[1]}`;
        infoContainer.appendChild(listCounter);
      }
      if(head.due) {
        const dueDate = elements.basic('p', 'due-date');
        dueDate.innerHTML = format(head.due, 'MMM/dd');
        infoContainer.appendChild(dueDate);
      }
      tile.appendChild(infoContainer);

      return tile;
    },

    head_modal(head) {
      const modal_content = elements.basic('div', 'modal-content');
      modal_content.dataset.uid = head.uid;

      const headerContainer = elements.basic('div', 'header-container');
        const leftContainer = elements.basic('div', 'left');
          const title = elements.basic('textarea', 'title');
          title.innerHTML = head.name;
          leftContainer.appendChild(title);
          
          const projectTag = elements.basic('p', 'project-tag');
          projectTag.innerHTML = 'in project ';
          const projectLink = elements.basic('a', 'project-link');
          const spanWrapper = elements.basic('span');
          projectLink.innerHTML = db.fetch(head.uid.split('-')[0]).name;
          projectLink.dataset.uid = String(head.uid.split('-')[0]);
          spanWrapper.appendChild(projectLink);
          projectTag.appendChild(spanWrapper);
          leftContainer.appendChild(projectTag);
        headerContainer.appendChild(leftContainer);
        
        const rightContainer = elements.basic('div', 'right');
          const complete = elements.basic('button', 'complete');
          if(head.complete) complete.classList.add('done');
          complete.innerHTML = 'complete';
          
          complete.addEventListener('click', (e) => {
            if(e.target.classList.contains('done')) {
              e.target.classList.remove('done');
              db.update_item(head.uid, {complete : false});
            } else {
              e.target.classList.add('done');
              db.update_item(head.uid, {complete : true});
            }
          })

          rightContainer.appendChild(complete);

          const del = elements.basic('button', 'delete');
          del.innerHTML = 'delete';
          rightContainer.appendChild(del);
        headerContainer.appendChild(rightContainer);

      modal_content.appendChild(headerContainer);

      const dueContainer = elements.basic('div', 'due-container');
      
      const addDue = elements.basic('button', 'add-due');
        addDue.innerHTML = '+ due date';
        if(head.due) addDue.style.display = 'none';
        addDue.addEventListener('click', (e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        })
        dueContainer.appendChild(addDue);
      
      const dueActions = elements.basic('div', 'due-controls');
      if(!head.due) dueActions.style.display = 'none';
        const due = elements.basic('input', 'due-input');
        due.type = 'date';
        due.value = db.formatDateForPicker(head);
        dueActions.appendChild(due);

        const removeDue = elements.basic('button', 'delete-due');
        removeDue.innerHTML = 'remove';
        removeDue.addEventListener('click', (e) => {
          e.target.parentElement.style.display = 'none';
          e.target.parentElement.previousSibling.style.display = 'block';
          due.value = '';
        })
        dueActions.appendChild(removeDue);
      dueContainer.appendChild(dueActions);
      
      modal_content.appendChild(dueContainer);

      const infoContainer = elements.basic('div', 'info-container');
        const info = elements.basic('textarea', 'info');
        info.value = head.info;
        info.placeholder = 'add more information here...';
        infoContainer.appendChild(info);
      modal_content.appendChild(infoContainer);

      const checkListContainer = elements.basic('div', 'checklist-container'); 
        const checkList = elements.basic('div', 'checklist');
        for(let key in head.children) {
          checkList.appendChild(this.leaf(head.children[key]));
        }

        const addItem = elements.basic('button', 'add-item');
        addItem.innerHTML = '+ item';
        addItem.addEventListener('click', () => {
          checkList.appendChild(this.leaf_form());
        })

        checkListContainer.appendChild(checkList);
        checkListContainer.appendChild(addItem);
      modal_content.appendChild(checkListContainer);
      return modal_content;
    },

    edit_field_form(field) {
      const container = elements.basic('div', 'field-heading-container');
      const form = elements.basic('form', 'edit-field');
      
      const name = elements.basic('input', 'edit-field-name');
      name.type = 'text';
      name.value = field.name;
      form.appendChild(name);

      const submit = elements.basic('input', 'submit-edit');
      submit.type = 'button';
      submit.dataset.uid = field.uid;
      submit.value = 'save';
      form.appendChild(submit);

      const cancel = elements.basic('input', 'cancel-edit');
      cancel.type = 'button';
      cancel.value = 'cancel';
      form.appendChild(cancel);

      const del = elements.basic('input', 'delete-field');
      del.type = 'button';
      del.value = 'delete';
      form.appendChild(del);

      container.appendChild(form);
      return container;
    },

    fieldHeading(field, size='h2') {
      const container = elements.basic('div', 'field-heading-container');
      const heading = elements.basic(size, 'field-heading');
      heading.innerHTML = field.name;
      container.appendChild(heading);

      const editButton = elements.basic('button', 'edit-field');
      editButton.innerHTML = 'edit';
      container.appendChild(editButton);
      return container;
    },

    fieldNav(field) {
      const link = elements.basic('a', 'field-link');
      link.dataset.uid = field.uid;
      link.innerHTML = field.name;
      return link;
    },

    new_field_form() {
      const form = elements.basic('form');

      const name = elements.basic('input', 'field_name');
      name.type = 'text';
      name.placeholder = 'new project!';
      form.appendChild(name);

      const submit = elements.basic('input', 'submit_field');
      submit.type = 'button';
      submit.value = 'save';
      form.appendChild(submit);

      const cancel = elements.basic('input', 'cancel_field');
      cancel.type = 'button';
      cancel.value = 'cancel';
      form.appendChild(cancel);

      return form;
    },

    //needs to look the same as a head tile
    new_head_form(parent_uid) {
      const container = elements.basic('div', 'new-head-container');

      const new_head_init = elements.basic('a', 'new-head-init');
      new_head_init.innerHTML = '+ new head';
      container.appendChild(new_head_init);


      const form_container = elements.basic('div', 'form-container');
      form_container.style.display = 'none';

      const form = elements.basic('form', 'new-head-form');
      
      const name = elements.basic('input', 'head-name');
      name.type = 'text';
      name.placeholder = 'new task!';
      form.appendChild(name);

      const submit = elements.basic('input', 'submit-head');
      submit.type = 'button';
      submit.dataset.uid = parent_uid;
      submit.value = 'save';
      form.appendChild(submit);

      const cancel = elements.basic('input', 'cancel-head');
      cancel.type = 'button';
      cancel.value = 'cancel';
      form.appendChild(cancel);

      form_container.appendChild(form);
      container.appendChild(form_container);
      return container;
    },

  }
})()

export { elements, render, };