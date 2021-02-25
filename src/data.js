import { Project, Task, Check } from './objects'
import { format } from 'date-fns'

const db = (function () {
  let cabbageDb = null

  const newDb = () => {
    return {
      projects: {},
      uids: {
        project: -1,
        task: -1,
        check: -1
      }
    }
  }

  const save = () => {
    localStorage.setItem('cabbageDb', JSON.stringify(cabbageDb))
  }

  const load = () => {
    if (localStorage.cabbageDb) {
      cabbageDb = JSON.parse(localStorage.cabbageDb)
      return true
    } else {
      return false
    }
  }

  const initialize = () => {
    if (!load()) {
      cabbageDb = newDb()
      save()
    }
  }

  const parseUid = (uid) => {
    return uid.split('-').map(i => Number(i))
  }

  const uidString = (uid) => {
    return uid.join('-')
  }

  const requestUid = (type) => {
    cabbageDb.uids[type] += 1
    return String(cabbageDb.uids[type])
  }

  const mergeUid = (parentUid, childUid) => {
    return parentUid.concat(`-${childUid}`)
  }

  const fetch = (uid) => {
    if (typeof (uid) === 'string') {
      uid = parseUid(uid)
    }
    if (uid.length === 0) return
    let result = cabbageDb.projects[uid.shift()]
    while (uid.length > 0) {
      result = result.children[uid.shift()]
    }
    return result
  }

  const fetchProjects = () => {
    return cabbageDb.projects
  }

  const fetchAllTasks = () => {
    const results = []
    for (const key in cabbageDb.projects) {
      const tasks = Object.values(cabbageDb.projects[key].children)
      results.push(tasks)
    }
    return results.flat()
  }

  const fetchTasksByDue = () => {
    const tasks = fetchAllTasks()
    const sort1 = tasks.sort((a, b) => {
      if (a.due < b.due) {
        return -1
      } else if (a.due > b.due) {
        return 1
      } else {
        return 0
      }
    })
    return [...sort1.filter(t => t.due), ...sort1.filter(t => !t.due)]
  }

  const insert = (parent, child) => {
    const childKey = parseUid(child.uid).pop()
    parent.children[childKey] = child
    save()
  }

  const remove = (uid) => {
    uid = parseUid(uid)
    const target = uid.pop()

    if (uid.length < 1) {
      delete cabbageDb.projects[target]
    } else {
      delete fetch(uid).children[target]
    }
    save()
  }

  const addProject = (name) => {
    const project = Project(name)
    project.uid = requestUid('project')
    cabbageDb.projects[parseUid(project.uid)[0]] = project
    save()
  }

  const addTask = (parentUid, name, info, due = 0) => {
    const task = Task(name, info, due)
    const parent = fetch(parentUid)
    task.uid = mergeUid(parent.uid, requestUid('task'))
    insert(parent, task)
  }

  const addCheck = (parentUid, name) => {
    const check = Check(name)
    const parent = fetch(parentUid)
    check.uid = mergeUid(parent.uid, requestUid('check'))
    insert(parent, check)
  }

  const updateItem = (uid, params) => {
    const item = fetch(uid)
    for (const key in params) {
      item[key] = params[key]
    }
    save()
  }

  const parseDate = (task) => {
    if (!task.due) return
    return new Date(task.due)
  }

  const formatDateForPicker = (task) => {
    if (!task.due) return ''
    return format(Number(task.due), 'yyyy/MM/dd').replace(/\//g, '-')
  }

  const dateQuery = (date) => {
    const results = fetchAllTasks().filter(task => parseDate(task) < date)
    return results
  }

  const fetchRaw = () => {
    return cabbageDb
  }

  return {
    parseUid,
    uidString,
    requestUid,
    mergeUid,
    fetch,
    fetchProjects,
    insert,
    addProject,
    addTask,
    addCheck,
    updateItem,
    save,
    load,
    fetchRaw,
    initialize,
    parseDate,
    dateQuery,
    fetchAllTasks,
    fetchTasksByDue,
    formatDateForPicker,
    remove
  }
})()

export { db as default }
