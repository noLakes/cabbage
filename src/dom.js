import { Project, Task, Check, childCount, childCompleteRatio } from './objects';
import { format, } from 'date-fns'
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

        const save = elements.basic('button', 'save-check,content-button');
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

        const cancel = elements.basic('button', 'cancel-check,content-button');
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
            e.target.parentElement.parentElement.querySelector('.name').classList.add('checked');
          }else if(!e.target.checked) {
            db.update_item(check.uid, {complete : false});
            e.target.parentElement.parentElement.querySelector('.name').classList.remove('checked');
          }
        })
        const checkmark = elements.basic('span', 'checkmark');
        checkboxContainer.appendChild(checkBox);
        checkboxContainer.appendChild(checkmark);
      checkContainer.appendChild(checkboxContainer);

      const name = elements.basic('p', 'name');
        if(check.complete) name.classList.add('checked');
        name.innerHTML = check.name;
      checkContainer.appendChild(name);

      const actionContainer = elements.basic('div', 'action-container');
        const edit = elements.basic('a', 'edit-check,content-button');
        edit.appendChild(elements.basic('i', 'fas,fa-edit'));
        edit.addEventListener('click', () => {
          checkContainer.parentElement.insertBefore(this.check_form(check), checkContainer);
          checkContainer.style.display = 'none';
        })
        
        const del = elements.basic('a', 'delete-check,content-button');
        del.appendChild(elements.basic('i', 'fas,fa-trash-alt'));
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
      if(task.complete) tile.classList.add('complete');
      
      const headingContainer = elements.basic('div', 'heading-container');
      const title = elements.basic('h3', 'title');
      title.innerHTML = task.name;
      headingContainer.appendChild(title);
      tile.appendChild(headingContainer);

      const infoContainer = elements.basic('div', 'info-container');

      if(task.due) {
        const dueDate = elements.basic('p', 'due-date');
        dueDate.appendChild(elements.basic('i', 'far,fa-clock'));
        dueDate.appendChild(document.createTextNode(format(task.due, 'MMM/dd').replace(/\//g, ' ')));
        infoContainer.appendChild(dueDate);
      }
      if(childCount(task)) {
        const listRatio = childCompleteRatio(task);
        const listCounter = elements.basic('p', 'list-counter');
        listCounter.appendChild(elements.basic('i','far,fa-check-square'))
        listCounter.appendChild(document.createTextNode((`${listRatio[0]}/${listRatio[1]}`)));
        if(listRatio[0] === listRatio[1]) listCounter.classList.add('tasks-complete');
        infoContainer.appendChild(listCounter);
      }
      tile.appendChild(infoContainer);

      return tile;
    },

    task_modal(task) {
      const modal_content = elements.basic('div', 'modal-content');
      modal_content.dataset.uid = task.uid;
      if(task.complete) modal_content.classList.add('done');

      const headerContainer = elements.basic('div', 'header-container');
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
        headerContainer.appendChild(leftContainer);
        
        const rightContainer = elements.basic('div', 'right');
          const complete = elements.basic('button', 'complete,content-button');
          if(task.complete) complete.classList.add('done');
          complete.innerHTML = 'complete';
          
          complete.addEventListener('click', (e) => {
            if(e.target.classList.contains('done')) {
              e.target.classList.remove('done');
              document.querySelector('.modal-content').classList.remove('done');
              db.update_item(task.uid, {complete : false});
            } else {
              e.target.classList.add('done');
              document.querySelector('.modal-content').classList.add('done');
              db.update_item(task.uid, {complete : true});
            }
          })

          rightContainer.appendChild(complete);

          const addDue = elements.basic('button', 'add-due,content-button');
          addDue.innerHTML = '+ due date';
          if (task.due) addDue.style.display = 'none';
          addDue.addEventListener('click', (e) => {
            e.target.style.display = 'none';
            document.querySelector('.due-container').style.display = 'block';
          })
          rightContainer.appendChild(addDue);

          const del = elements.basic('button', 'delete,content-button');
          del.innerHTML = 'delete';
          rightContainer.appendChild(del);
        headerContainer.appendChild(rightContainer);

      modal_content.appendChild(headerContainer);

      const dueContainer = elements.basic('div', 'due-container');

      const dueHeading = elements.basic('h4', 'modal-sub-heading', 'due-heading');
      dueHeading.innerHTML = 'Due';
      dueContainer.appendChild(dueHeading);
      
      const dueActions = elements.basic('div', 'due-controls');
      if(!task.due) dueContainer.style.display = 'none';
        const due = elements.basic('input', 'due-input');
        due.type = 'date';
        due.value = db.formatDateForPicker(task);
        dueActions.appendChild(due);

        const removeDue = elements.basic('button', 'delete-due,content-button');
        removeDue.innerHTML = 'remove';
        removeDue.addEventListener('click', (e) => {
          dueContainer.style.display = 'none';
          document.querySelector('.add-due').style.display = 'block';
          due.value = '';
        })
        dueActions.appendChild(removeDue);
      dueContainer.appendChild(dueActions);
      
      modal_content.appendChild(dueContainer);

      const infoContainer = elements.basic('div', 'info-container');
        
        const infoHeading = elements.basic('h4', 'modal-sub-heading', 'info-heading');
        infoHeading.innerHTML = 'Info';
        infoContainer.appendChild(infoHeading);

        const info = elements.basic('textarea', 'info');
        if(task.info) info.value = task.info;
        info.placeholder = 'add more information here...';
        infoContainer.appendChild(info);
      modal_content.appendChild(infoContainer);

      const checkListContainer = elements.basic('div', 'checklist-container'); 

        const checkHeading = elements.basic('h4', 'modal-sub-heading', 'check-heading');
        checkHeading.innerHTML = 'Checklist';
        checkListContainer.appendChild(checkHeading);

        const checkList = elements.basic('div', 'checklist');
        for(let key in task.children) {
          checkList.appendChild(this.check(task.children[key]));
        }

        const addItem = elements.basic('button', 'add-item,content-button');
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
      const form = elements.basic('form', 'edit-project-form');
      
      const name = elements.basic('input', 'edit-project-name,content-input');
      name.type = 'text';
      name.value = project.name;
      form.appendChild(name);

      const submit = elements.basic('input', 'submit-edit,content-button');
      submit.type = 'button';
      submit.dataset.uid = project.uid;
      submit.value = 'save';
      form.appendChild(submit);

      const cancel = elements.basic('input', 'cancel-edit,content-button');
      cancel.type = 'button';
      cancel.value = 'cancel';
      form.appendChild(cancel);

      const del = elements.basic('input', 'delete-project,content-button');
      del.type = 'button';
      del.value = 'delete';
      form.appendChild(del);

      return form;
    },

    new_task_form(parent_uid) {
      const container = elements.basic('div', 'new-task-tile');

      const form = elements.basic('form', 'new-task-form');
  
      const name = elements.basic('input', 'task-name,content-input');
      name.type = 'text';
      name.placeholder = 'new task!';
      form.appendChild(name);

      const controls = elements.basic('div', 'controls-container');

      const submit = elements.basic('input', 'submit-task,content-button');
      submit.type = 'button';
      submit.dataset.uid = parent_uid;
      submit.value = 'save';
      controls.appendChild(submit);

      const cancel = elements.basic('input', 'cancel-task,content-button');
      cancel.type = 'button';
      cancel.value = 'cancel';
      controls.appendChild(cancel);

      form.appendChild(controls);
      container.appendChild(form);
      return container;
    },

    projectHeading(project, size='h2') {
      const container = elements.basic('div', 'project-heading-container');
      const heading = elements.basic(size, 'project-heading');
      heading.innerHTML = project.name;
      container.appendChild(heading);

      const editButton = elements.basic('a', 'edit-project');
      editButton.appendChild(elements.basic('i', 'fas,fa-edit'));
      container.appendChild(editButton);

      const newTaskButton = elements.basic('button', 'new-task-button,content-button');
      newTaskButton.dataset.uid = project.uid;
      newTaskButton.appendChild(elements.basic('i', 'fas,fa-plus-square'));
      newTaskButton.appendChild(document.createTextNode(' new task'));
      container.appendChild(newTaskButton);

      return container;
    },

    staticHeading(title) {
      const container = elements.basic('div', 'project-heading-container');
      const heading = elements.basic('h2', 'project-heading');
      heading.innerHTML = title;
      container.appendChild(heading);

      return container
    },

    projectNav(project) {
      const item = elements.basic('li', 'project-item');
      const link = elements.basic('a', 'project-link');
      link.dataset.uid = project.uid;
      link.innerHTML = project.name;
      item.appendChild(link)
      return item;
    },

    new_project_form() {
      const form = elements.basic('form');

      const name = elements.basic('input', 'project-name');
      name.type = 'text';
      name.placeholder = 'new project!';
      form.appendChild(name);

      const submit = elements.basic('input', 'submit-project,nav-button');
      submit.type = 'button';
      submit.value = 'save';
      form.appendChild(submit);

      const cancel = elements.basic('input', 'cancel-project,nav-button');
      cancel.type = 'button';
      cancel.value = 'cancel';
      form.appendChild(cancel);

      return form;
    },

    nothingDisplay() {
      const el = elements.basic('p', 'nothing');
      el.innerHTML = 'there is nothing here right now...';
      return el;
    },

  }
})()

export { elements, render, };