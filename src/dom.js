import { Project, Task, Check, childCount, childCompleteRatio } from './objects';
import { format, parse, } from 'date-fns'
import db from './data';

// a basic library for global elements and reusable functions
const elements = (function() {
  return {
    main : document.querySelector('.main-container'),
    nav : document.querySelector('.nav-container'),
    static_links : document.querySelectorAll('.static-links a'),
    project_links_container : document.querySelector('.project-links'),
    new_project_button : document.querySelector('button.new-project'),
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

    check_form(edit=false) {
      const container = elements.basic('div', 'check-form-container');
        const form = elements.basic('form', 'check-form');
        
        const name = elements.basic('input', 'name-input');
        name.placeholder = 'new task!';
        if(edit) {
          name.value = edit.name;
          name.dataset.uid = edit.uid;
        }

        const save = elements.basic('button', 'save-check');
        save.innerHTML = 'save';
        save.addEventListener('click', () => {
          if(edit) {
            db.update_item(name.dataset.uid, {name : name.value});
            container.nextSibling.querySelector('.name').innerHTML = name.value;
            container.nextSibling.style.display = 'flex';
          } else {
            db.add_check(document.querySelector('.modal-content').dataset.uid, name.value);
            const task = db.fetch(document.querySelector('.modal-content').dataset.uid);
            const newCheck = Object.values(task.children).filter(i => i.name === name.value)[0];
            container.parentElement.appendChild(this.check(newCheck));
          }
          container.remove();
        })

        const cancel = elements.basic('button', 'cancel-check');
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

    check(check) {
      const checkContainer = elements.basic('div', 'check');
      checkContainer.dataset.uid = check.uid;

      const checkboxContainer = elements.basic('label', 'checkbox-container');
        const checkBox = elements.basic('input', 'checkbox');
        checkBox.type = 'checkbox';
        checkBox.checked = check.complete;
        checkBox.addEventListener('change', (e) => {
          if(e.target.checked) {
            db.update_item(check.uid, {complete : true});
          }else if(!e.target.checked) {
            db.update_item(check.uid, {complete : false});
          }
        })
        const checkmark = elements.basic('span', 'checkmark');
        checkboxContainer.appendChild(checkBox);
        checkboxContainer.appendChild(checkmark);
      checkContainer.appendChild(checkboxContainer);

      const name = elements.basic('p', 'name');
        name.innerHTML = check.name;
      checkContainer.appendChild(name);

      const actionContainer = elements.basic('div', 'action-container');
        const edit = elements.basic('button', 'edit-check');
        edit.innerHTML = 'edit';
        edit.addEventListener('click', () => {
          checkContainer.parentElement.insertBefore(this.check_form(check), checkContainer);
          checkContainer.style.display = 'none';
        })
        
        const del = elements.basic('button', 'delete-check');
        del.innerHTML = 'delete';     
        del.addEventListener('click', () => {
          db.remove(checkContainer.dataset.uid);
          checkContainer.remove();
        })

        actionContainer.appendChild(edit);
        actionContainer.appendChild(del);
      actionContainer.style.display = 'none';
      checkContainer.appendChild(actionContainer);

      checkContainer.addEventListener('mouseenter', (e) => {
        actionContainer.style.display = 'block';
      })
      checkContainer.addEventListener('mouseleave', (e) => {
        actionContainer.style.display = 'none';
      })
      return checkContainer;
    },

    tasks_container() {
      return elements.basic('div', 'tasks-container');
    },

    task_tile(task) {
      const tile = elements.basic('a', 'task-tile');
      
      const taskingContainer = elements.basic('div', 'heading-container');
      const title = elements.basic('h3', 'title');
      title.innerHTML = task.name;
      taskingContainer.appendChild(title);
      tile.appendChild(taskingContainer);

      const infoContainer = elements.basic('div', 'info-container');

      if(childCount(task)) {
        const listRatio = childCompleteRatio(task);
        const listCounter = elements.basic('p', 'list-counter');
        listCounter.innerHTML = `${listRatio[0]}/${listRatio[1]}`;
        infoContainer.appendChild(listCounter);
      }
      if(task.due) {
        const dueDate = elements.basic('p', 'due-date');
        dueDate.innerHTML = format(task.due, 'MMM/dd').replace(/\//g, ' ');
        infoContainer.appendChild(dueDate);
      }
      tile.appendChild(infoContainer);

      return tile;
    },

    task_modal(task) {
      const modal_content = elements.basic('div', 'modal-content');
      modal_content.dataset.uid = task.uid;

      const taskerContainer = elements.basic('div', 'tasker-container');
        const leftContainer = elements.basic('div', 'left');
          const title = elements.basic('textarea', 'title');
          title.innerHTML = task.name;
          leftContainer.appendChild(title);
          
          const projectTag = elements.basic('p', 'project-tag');
          projectTag.innerHTML = 'in project ';
          const projectLink = elements.basic('a', 'project-link');
          const spanWrapper = elements.basic('span');
          projectLink.innerHTML = db.fetch(task.uid.split('-')[0]).name;
          projectLink.dataset.uid = String(task.uid.split('-')[0]);
          spanWrapper.appendChild(projectLink);
          projectTag.appendChild(spanWrapper);
          leftContainer.appendChild(projectTag);
        taskerContainer.appendChild(leftContainer);
        
        const rightContainer = elements.basic('div', 'right');
          const complete = elements.basic('button', 'complete');
          if(task.complete) complete.classList.add('done');
          complete.innerHTML = 'complete';
          
          complete.addEventListener('click', (e) => {
            if(e.target.classList.contains('done')) {
              e.target.classList.remove('done');
              db.update_item(task.uid, {complete : false});
            } else {
              e.target.classList.add('done');
              db.update_item(task.uid, {complete : true});
            }
          })

          rightContainer.appendChild(complete);

          const del = elements.basic('button', 'delete');
          del.innerHTML = 'delete';
          rightContainer.appendChild(del);
        taskerContainer.appendChild(rightContainer);

      modal_content.appendChild(taskerContainer);

      const dueContainer = elements.basic('div', 'due-container');
      
      const addDue = elements.basic('button', 'add-due');
        addDue.innerHTML = '+ due date';
        if(task.due) addDue.style.display = 'none';
        addDue.addEventListener('click', (e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        })
        dueContainer.appendChild(addDue);
      
      const dueActions = elements.basic('div', 'due-controls');
      if(!task.due) dueActions.style.display = 'none';
        const due = elements.basic('input', 'due-input');
        due.type = 'date';
        due.value = db.formatDateForPicker(task);
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
        info.value = task.info;
        info.placeholder = 'add more information here...';
        infoContainer.appendChild(info);
      modal_content.appendChild(infoContainer);

      const checkListContainer = elements.basic('div', 'checklist-container'); 
        const checkList = elements.basic('div', 'checklist');
        for(let key in task.children) {
          checkList.appendChild(this.check(task.children[key]));
        }

        const addItem = elements.basic('button', 'add-item');
        addItem.innerHTML = '+ item';
        addItem.addEventListener('click', () => {
          checkList.appendChild(this.check_form());
        })

        checkListContainer.appendChild(checkList);
        checkListContainer.appendChild(addItem);
      modal_content.appendChild(checkListContainer);
      return modal_content;
    },

    edit_project_form(project) {
      const container = elements.basic('div', 'project-heading-container');
      const form = elements.basic('form', 'edit-project');
      
      const name = elements.basic('input', 'edit-project-name');
      name.type = 'text';
      name.value = project.name;
      form.appendChild(name);

      const submit = elements.basic('input', 'submit-edit');
      submit.type = 'button';
      submit.dataset.uid = project.uid;
      submit.value = 'save';
      form.appendChild(submit);

      const cancel = elements.basic('input', 'cancel-edit');
      cancel.type = 'button';
      cancel.value = 'cancel';
      form.appendChild(cancel);

      const del = elements.basic('input', 'delete-project');
      del.type = 'button';
      del.value = 'delete';
      form.appendChild(del);

      container.appendChild(form);
      return container;
    },

    projectHeading(project, size='h2') {
      const container = elements.basic('div', 'project-heading-container');
      const heading = elements.basic(size, 'project-heading');
      heading.innerHTML = project.name;
      container.appendChild(heading);

      const editButton = elements.basic('button', 'edit-project');
      editButton.innerHTML = 'edit';
      container.appendChild(editButton);
      return container;
    },

    projectNav(project) {
      const link = elements.basic('a', 'project-link');
      link.dataset.uid = project.uid;
      link.innerHTML = project.name;
      return link;
    },

    new_project_form() {
      const form = elements.basic('form');

      const name = elements.basic('input', 'project-name');
      name.type = 'text';
      name.placeholder = 'new project!';
      form.appendChild(name);

      const submit = elements.basic('input', 'submit-project');
      submit.type = 'button';
      submit.value = 'save';
      form.appendChild(submit);

      const cancel = elements.basic('input', 'cancel-project');
      cancel.type = 'button';
      cancel.value = 'cancel';
      form.appendChild(cancel);

      return form;
    },

    //needs to look the same as a task tile
    new_task_form(parent_uid) {
      const container = elements.basic('div', 'new-task-container');

      const new_task_init = elements.basic('a', 'new-task-init');
      new_task_init.innerHTML = '+ new task';
      container.appendChild(new_task_init);


      const form_container = elements.basic('div', 'form-container');
      form_container.style.display = 'none';

      const form = elements.basic('form', 'new-task-form');
      
      const name = elements.basic('input', 'task-name');
      name.type = 'text';
      name.placeholder = 'new task!';
      form.appendChild(name);

      const submit = elements.basic('input', 'submit-task');
      submit.type = 'button';
      submit.dataset.uid = parent_uid;
      submit.value = 'save';
      form.appendChild(submit);

      const cancel = elements.basic('input', 'cancel-task');
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