function Project(name, info, due=false) {
  return {
    type : 'project',
    headings : [],
    tasks : [],
    complete : false,
    name,
    info,
    due,
  }
}

function Heading(name, info) {
  return {
    type : 'heading',
    tasks : [],
    name,
    info,
  }
}

function Task(name, due=false) {
  return {
    type : 'task',
    subs : [],
    complete : false,
    name,
    due,
  }
}

function SubTask(name, due=false) {
  return {
    type : 'sub-task',
    complete : false,
    name,
    due,
  }
}

export { Project, Heading, Task, SubTask };