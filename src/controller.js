import db from './data'
import { elements, render } from './dom'
import time from './time'

const controller = (function () {
  const clearActive = () => {
    document.querySelectorAll('.nav-container a').forEach(link => {
      link.classList.remove('active')
    })
    document.querySelectorAll('.nav-container li').forEach(list => {
      list.classList.remove('active')
    })
  }

  const clearContent = () => {
    elements.content.innerHTML = ''
  }

  const initProjects = () => {
    const projects = db.fetchProjects()
    for (const key in projects) {
      const projectEl = render.projectNav(projects[key])
      projectEl.querySelector('a').addEventListener('click', activate)
      elements.project_links_container.appendChild(projectEl)
    }
  }

  const initHome = () => {
    elements.project_links_container.innerHTML = ''
    initProjects()
    clearContent()
    const home = document.querySelector('.time-link#home')
    home.classList.add('active')
    loadHandler(home)
  }

  const reloadProjects = () => {
    const active = document.querySelector('a.active')
    elements.project_links_container.innerHTML = ''
    initProjects()
    if (!active.classList.contains('time-link')) {
      document.querySelector(`[data-uid='${active.dataset.uid}']`).classList.add('active')
    }
  }

  const reloadContent = () => {
    clearContent()
    const active = document.querySelector('a.active')
    loadHandler(active)
  }

  const openProjectForm = () => {
    const form = render.newProjectForm()

    form.querySelector('input.submit-project').addEventListener('click', (e) => {
      const name = form.querySelector('input.project-name').value
      if (name.length > 0) {
        db.addProject(name)
        elements.new_project_button.style.display = 'block'
        e.target.parentElement.remove()
        reloadProjects()
      } else {
        alert('Project name required.')
      }
    })

    form.querySelector('input.cancel-project').addEventListener('click', (e) => {
      elements.new_project_button.style.display = 'block'
      e.target.parentElement.remove()
    })

    elements.project_links_container.appendChild(form)
    document.querySelector('.nav-container .project-name').focus()
  }

  const setTaskFromListeners = (form) => {
    form.querySelector('input.submit-task').addEventListener('click', (e) => {
      if (form.querySelector('.task-name').value.length > 0) {
        db.addTask(
          e.target.dataset.uid,
          form.querySelector('.task-name').value
        )
        reloadContent()
      } else {
        alert('Task name required.')
      }
    })

    form.querySelector('.cancel-task').addEventListener('click', (e) => {
      form.remove()
      if (checkEmpty()) loadEmptyPlaceholder()
      document.querySelector('.new-task-button').disabled = false
    })
  }

  const loadNewTaskForm = (uid) => {
    const newTaskForm = render.newTaskForm(uid)
    setTaskFromListeners(newTaskForm)
    document.querySelector('.tasks-container').prepend(newTaskForm)
    document.querySelector('.new-task-tile .task-name').focus()
  }

  const openProjectEditForm = (project) => {
    document.querySelector('a.edit-project').remove()
    const editForm = render.editProjectForm(project)

    editForm.querySelector('.submit-edit').addEventListener('click', (e) => {
      db.updateItem(project.uid, { name: editForm.querySelector('.edit-project-name').value })
      reloadProjects()
      loadProject(project.uid)
    })
    editForm.querySelector('.cancel-edit').addEventListener('click', (e) => {
      loadProject(project.uid)
    })
    editForm.querySelector('.delete-project').addEventListener('click', () => {
      const answer = confirm(`Delete ${project.name}? This will delete all sub-tasks as well.`)
      if (answer) {
        db.remove(project.uid)
        initHome()
      }
    })
    elements.content.querySelector('.project-heading-container').prepend(editForm)
    document.querySelector('input.edit-project-name').focus()
  }

  const loadProjectHeading = (project) => {
    const projectHeading = render.projectHeading(project)

    projectHeading.querySelector('a.edit-project').addEventListener('click', (e) => {
      document.querySelector('.project-heading').remove()
      openProjectEditForm(project)
    })
    projectHeading.querySelector('.new-task-button').addEventListener('click', (e) => {
      loadNewTaskForm(e.target.dataset.uid)
      if (document.querySelector('.nothing')) document.querySelector('.nothing').remove()
      e.target.disabled = true
    })
    elements.content.prepend(projectHeading)
  }

  const loadTasksContainer = () => {
    elements.content.appendChild(render.tasksContainer())
  }

  const loadProject = (uid) => {
    clearContent()
    const project = db.fetch(uid)
    loadProjectHeading(project)
    loadTasksContainer()
    for (const key in project.children) {
      loadTask(project.children[key])
    }
  }

  const updateTask = () => {
    const oldName = db.fetch(document.querySelector('.modal-content').dataset.uid).name
    let dateValue = document.querySelector('.due-input').valueAsNumber
    if (isNaN(dateValue)) {
      dateValue = 0
    } else {
      dateValue = new Date(dateValue).getTime() + 18100000
    }
    db.updateItem(
      document.querySelector('.modal-content').dataset.uid,
      {
        name: document.querySelector('textarea.title').value || oldName,
        info: document.querySelector('textarea.info').value,
        due: dateValue
      }
    )
  }

  const toggleModal = (update = true) => {
    const modal = document.querySelector('.modal')
    if (modal.style.display === 'block') {
      if (update) updateTask()
      reloadContent()
      modal.style.display = 'none'
    } else {
      modal.style.display = 'block'
    }
  }

  const openTaskModal = (task) => {
    elements.modal.innerHTML = ''
    elements.modal.appendChild(render.taskModal(task))

    elements.modal.querySelector('button.delete').addEventListener('click', () => {
      const answer = confirm(`Delete ${task.name}?`)
      if (answer) {
        db.remove(task.uid)
        toggleModal(false)
      }
    })

    elements.modal.querySelector('.project-link').addEventListener('click', (e) => {
      toggleModal()
      clearActive()
      elements.project_links_container.querySelector(`[data-uid='${e.target.dataset.uid}']`).classList.add('active')
      loadProject(e.target.dataset.uid)
    })

    if (time.getDateStyle(task.due) && !task.complete) {
      elements.modal.querySelector('.due-input').classList.add(time.getDateStyle(task.due))
    }
    toggleModal()
  }

  const loadTask = (task) => {
    const tile = render.taskTile(task)
    tile.addEventListener('click', () => {
      openTaskModal(task)
    })
    if (time.getDateStyle(task.due) && !task.complete) {
      tile.querySelector('.due-date').classList.add(time.getDateStyle(task.due))
    }
    document.querySelector('.tasks-container').appendChild(tile)
  }

  const loadBatch = (arr, loadComplete = true) => {
    clearContent()
    loadTasksContainer()
    arr.forEach(item => {
      if (!loadComplete && item.complete) {
        // eslint-disable-next-line no-useless-return
        return
      } else {
        loadTask(item)
      }
    })
  }

  const loadStaticHeading = (title) => {
    elements.content.prepend(render.staticHeading(title))
  }

  const checkEmpty = () => {
    return document.querySelector('.tasks-container').childElementCount === 0
  }

  const loadEmptyPlaceholder = () => {
    document.querySelector('.tasks-container').appendChild(render.nothingDisplay())
  }

  const loadHandler = (target) => {
    if (target.classList.contains('time-link')) {
      switch (target.id) {
        case 'today':
          loadBatch(db.dateQuery(time.endOfDay()), false)
          loadStaticHeading('Today')
          break
        case 'upcoming':
          loadBatch(db.dateQuery(time.oneWeek()), false)
          loadStaticHeading('Upcoming')
          break
        default:
          loadBatch(db.fetchTasksByDue())
          loadStaticHeading('Home')
      }
    } else {
      loadProject(target.dataset.uid)
    }
    if (checkEmpty()) loadEmptyPlaceholder()
  }

  const activate = (e) => {
    if (e.target.classList.contains('active')) return
    clearActive()
    e.target.classList.add('active')
    if (e.target.classList.contains('project-link')) e.target.parentElement.classList.add('active')
    loadHandler(e.target)
  }

  elements.static_links.forEach(link => {
    link.addEventListener('click', activate)
  })

  elements.new_project_button.addEventListener('click', (e) => {
    openProjectForm()
    e.target.style.display = 'none'
  })

  window.onclick = (e) => {
    if (e.target === elements.modal) {
      toggleModal()
    }
  }

  return {
    initHome
  }
})()

export { controller as default }
