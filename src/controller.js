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
    document.querySelectorAll('.nav-container li').forEach(list => {
      list.classList.remove('active');
    })
  }

  const clearContent = () => {
    elements.content.innerHTML = '';
  }

  const initProjects = () => {
    const projects = db.fetchProjects();
    for(let key in projects) {
      const projectEl = render.projectNav(projects[key]);
      projectEl.querySelector('a').addEventListener("click", activate);
      elements.project_links_container.appendChild(projectEl);
    }
  }

  const initHome = () => {
    elements.project_links_container.innerHTML = '';
    initProjects();
    clearContent();
    const home = document.querySelector('.time-link#home');
    home.classList.add('active');
    loadHandler(home);
  }

  const reloadProjects = () => {
    const active = document.querySelector('a.active');
    elements.project_links_container.innerHTML = '';
    initProjects();
    if(!active.classList.contains('time-link')) {
      document.querySelector(`[data-uid='${active.dataset.uid}']`).classList.add('active');
    }
  }

  const reloadContent = () => {
    clearContent();
    const active = document.querySelector('a.active');
    loadHandler(active);
  }

  const open_project_form = () => {
    const form = render.new_project_form();
    
    form.querySelector('input.submit-project').addEventListener('click', (e) => {
      const name = form.querySelector('input.project-name').value;
      if(name.length > 0) {
        db.add_project(name)
        elements.new_project_button.style.display = 'block';
        e.target.parentElement.remove();
        reloadProjects();
      } else {
        alert('Project name required.');
      }
    })
    
    form.querySelector('input.cancel-project').addEventListener('click', (e) => {
      elements.new_project_button.style.display = 'block';
      e.target.parentElement.remove();
    })
    
    elements.project_links_container.appendChild(form);
    document.querySelector('.nav-container .project-name').focus();
  }

  const assign_task_form_listeners = (form) => {
    form.querySelector('input.submit-task').addEventListener('click', (e) => {
      if(form.querySelector('.task-name').value.length > 0) {
        db.add_task(
          e.target.dataset.uid,
          form.querySelector('.task-name').value,
        )
        reloadContent();
        } else {
          alert('Task name required.');
        }
    })

    form.querySelector('.cancel-task').addEventListener('click', (e) => {
      form.remove();
      document.querySelector('.new-task-button').disabled = false;
    })
  }

  const loadNewTaskForm = (uid) => {
    const new_task_form = render.new_task_form(uid);
    assign_task_form_listeners(new_task_form);
    document.querySelector('.tasks-container').prepend(new_task_form);
    document.querySelector('.new-task-tile .task-name').focus();
  }

  const open_project_edit_form = (project) => {
    document.querySelector('a.edit-project').remove();
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
    elements.content.querySelector('.project-heading-container').prepend(edit_form);
    document.querySelector('input.edit-project-name').focus();
  }

  const loadProjectHeading = (project) => {
    const projectHeading = render.projectHeading(project);
    
    projectHeading.querySelector('a.edit-project').addEventListener('click', (e) => {
      document.querySelector('.project-heading').remove();
      open_project_edit_form(project);
    })
    projectHeading.querySelector('.new-task-button').addEventListener('click', (e) => {
      loadNewTaskForm(e.target.dataset.uid);
      e.target.disabled = true;
    })
    elements.content.prepend(projectHeading);
  }

  const loadTasksContainer = () => {
    elements.content.appendChild(render.tasks_container());
  }

  const loadProject = (uid) => {
    clearContent();
    const project = db.fetch(uid);
    loadProjectHeading(project);
    loadTasksContainer();
    for(let key in project.children) {
      loadTask(project.children[key]);
    }
  }

  const update_task = () => {
    const oldName = db.fetch(document.querySelector('.modal-content').dataset.uid).name
    let dateValue = document.querySelector('.due-input').valueAsNumber;
    if(isNaN(dateValue)) {
      dateValue = 0;
    } else {
      dateValue = new Date(dateValue).getTime() + 18100000;
      console.log(new Date(dateValue));
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

    if(time.getDateStyle(task.due) && !task.complete) {
      elements.modal.querySelector('.due-input').classList.add(time.getDateStyle(task.due));
    }
    toggle_modal();
  }

  const loadTask = (task) => {
    const tile = render.task_tile(task);
    tile.addEventListener('click', () => {
      open_task_modal(task);
    })
    if(time.getDateStyle(task.due) && !task.complete) {
      tile.querySelector('.due-date').classList.add(time.getDateStyle(task.due));
    }
    document.querySelector('.tasks-container').appendChild(tile);
  }
  
  const loadBatch = (arr, loadComplete=true) => {
    clearContent();
    loadTasksContainer();
    arr.forEach(item => {
      if(!loadComplete && item.complete) {
        return;
      } else {
        loadTask(item);
      }
    });
  }

  const loadStaticHeading = (title) => {
    elements.content.prepend(render.staticHeading(title));
  }

  // determines which selection of items to pool and load into the content window
  const loadHandler = (target) => {
    if(target.classList.contains('time-link')) {
      switch(target.id) {
        case 'today':
          loadBatch(db.dateQuery(time.endOfDay()), false);
          loadStaticHeading('Today');
          break
        case 'upcoming':
          loadBatch(db.dateQuery(time.oneWeek()), false);
          loadStaticHeading('Upcoming');
          break
        default:
          loadBatch(db.fetchTasksByDue());
          loadStaticHeading('Home');
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
    if(e.target.classList.contains('project-link')) e.target.parentElement.classList.add('active');
    loadHandler(e.target);
  }

  // add event listeners to static items

  elements.static_links.forEach(link => {
    link.addEventListener("click", activate);
  })

  elements.new_project_button.addEventListener('click', (e) => {
    open_project_form();
    e.target.style.display = 'none';
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