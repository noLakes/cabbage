import db from './data';
import { elements, render,} from './dom';
import time from './time';

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

  const initProjects = () => {
    const projects = db.fetchProjects();
    for(let key in projects) {
      const projectEl = render.projectNav(projects[key]);
      projectEl.addEventListener("click", activate);
      elements.project_links_container.appendChild(projectEl);
    }
  }

  const initHome = () => {
    elements.project_links_container.innerHTML = '';
    initProjects();
    clearContent();
    const home = document.querySelector('.time-link#all');
    home.classList.add('active');
    loadHandler(home);
  }

  const reloadProjects = () => {
    const active = document.querySelector('.active');
    elements.project_links_container.innerHTML = '';
    initProjects();
    if(!active.classList.contains('time-link')) {
      document.querySelector(`[data-uid='${active.dataset.uid}']`).classList.add('active');
    }
  }

  const reloadContent = () => {
    clearContent();
    const active = document.querySelector('.active');
    loadHandler(active);
  }

  const open_project_form = () => {
    const form = render.new_project_form();
    
    form.querySelector('input.submit-project').addEventListener('click', (e) => {
      const name = form.querySelector('input.project-name').value;
      if(name.length > 0) {
        db.add_project(name)
        elements.new_project_button.disabled = false;
        e.target.parentElement.remove();
        reloadProjects();
      } else {
        alert('Project name required.');
      }
    })
    
    form.querySelector('input.cancel-project').addEventListener('click', (e) => {
      elements.new_project_button.disabled = false;
      e.target.parentElement.remove();
    })
    
    elements.project_links_container.appendChild(form);
  }

  const assign_task_form_listeners = (form) => {
    form.querySelector('.new-task-init').addEventListener('click', (e) => {
      e.target.style.display = 'none';
      form.querySelector('.form-container').style.display = 'block';
    })

    form.querySelector('input.submit-task').addEventListener('click', (e) => {
      if(form.querySelector('.task-name').value.length > 0) {
        db.add_task(
          e.target.dataset.uid,
          form.querySelector('.task-name').value,
        )
        form.querySelector('.form-container').style.display = 'none';
        form.querySelector('.new-task-init').style.display = 'block';
        reloadContent();
        } else {
          alert('Task name required.');
        }
    })

    form.querySelector('.cancel-task').addEventListener('click', (e) => {
      form.querySelector('.form-container').style.display = 'none';
      form.querySelector('.new-task-init').style.display = 'block';
    })
  }

  const loadNewTaskForm = (uid) => {
    const new_task_form = render.new_task_form(uid);
    assign_task_form_listeners(new_task_form);
    elements.content.appendChild(new_task_form);
  }

  const open_project_edit_form = (project) => {
    const edit_form = render.edit_project_form(project);

    edit_form.querySelector('.submit-edit').addEventListener('click', (e) => {
      db.update_item(project.uid, {name : edit_form.querySelector('.edit-project-name').value});
      reloadProjects();
      loadProject(project.uid);
    })
    edit_form.querySelector('.cancel-edit').addEventListener('click', (e) => {
      loadProject(project.uid);
    })
    edit_form.querySelector('.delete-project').addEventListener('click', () => {
      const answer = confirm(`Delete ${project.name}? This will delete all sub-tasks as well.`);
      if(answer) {
        db.remove(project.uid);
        initHome();
      }
    })
    elements.content.prepend(edit_form);
  }

  const loadProjectHeading = (project) => {
    const projectHeading = render.projectHeading(project);
    projectHeading.querySelector('.edit-project').addEventListener('click', (e) => {
      e.target.parentElement.remove();
      open_project_edit_form(project);
    })
    elements.content.prepend(projectHeading);
  }

  const loadProject = (uid) => {
    clearContent();
    const project = db.fetch(uid);
    loadProjectHeading(project);
    for(let key in project.children) {
      loadTask(project.children[key]);
    }
    loadNewTaskForm(uid);
  }

  const update_task = () => {
    const oldName = db.fetch(document.querySelector('.modal-content').dataset.uid).name
    let dateValue = document.querySelector('.due-input').valueAsNumber;
    if(isNaN(dateValue)) {
      dateValue = 0;
    } else {
      dateValue = new Date(dateValue).getTime() + 18000000;
    }
    db.update_item(
      document.querySelector('.modal-content').dataset.uid,
      {
        name : document.querySelector('textarea.title').value || oldName,
        info : document.querySelector('textarea.info').value,
        due : dateValue,
      }
    )
  }

  const toggle_modal = (update=true) => {
    const modal = document.querySelector('.modal');
    if(modal.style.display === 'block') {
      if(update) update_task();
      reloadContent();
      modal.style.display = 'none';
    } else {
      modal.style.display = 'block';
    }
  }

  const open_task_modal = (task) => {
    elements.modal.innerHTML = '';
    elements.modal.appendChild(render.task_modal(task));
    
    elements.modal.querySelector('button.delete').addEventListener('click', () => {
      const answer = confirm(`Delete ${task.name}?`);
      if(answer) {
        db.remove(task.uid);
        toggle_modal(false);
      }
    })

    elements.modal.querySelector('.project-link').addEventListener('click', (e) => {
      toggle_modal();
      clearActive();
      elements.project_links_container.querySelector(`[data-uid='${e.target.dataset.uid}']`).classList.add('active');
      loadProject(e.target.dataset.uid);

    })

    if(time.getDateStyle(task.due)) {
      elements.modal.querySelector('.due-input').classList.add(time.getDateStyle(task.due));
    }
    toggle_modal();
  }

  const loadTask = (task) => {
    const tile = render.task_tile(task);
    tile.addEventListener('click', () => {
      open_task_modal(task);
    })
    if(time.getDateStyle(task.due)) {
      tile.querySelector('.due-date').classList.add(time.getDateStyle(task.due));
    }
    elements.content.appendChild(tile);
  }
  
  const loadBatch = (arr) => {
    clearContent();
    arr.forEach(item => loadTask(item));
  }

  // determines which selection of items to pool and load into the content window
  const loadHandler = (target) => {
    if(target.classList.contains('time-link')) {
      switch(target.id) {
        case 'today':
          loadBatch(db.dateQuery(time.endOfDay()));
          break
        case 'upcoming':
          loadBatch(db.dateQuery(time.twoWeeks()));
          break
        default:
          loadBatch(db.fetchTasksByDue());
      }
    }
    else {
      loadProject(target.dataset.uid);
    }
  }

  const activate = (e) => {
    if(e.target.classList.contains('active')) return;
    clearActive();
    e.target.classList.add('active');
    loadHandler(e.target);
  }

  // add event listeners to static items

  elements.static_links.forEach(link => {
    link.addEventListener("click", activate);
  })

  elements.new_project_button.addEventListener('click', (e) => {
    open_project_form();
    e.target.disabled = true;
  })

  window.onclick = (e) => {
    if (e.target == elements.modal) {
      toggle_modal();
    }
  } 

  return {
    initHome,
  }
})()

export { controller as default };