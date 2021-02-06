function Project(name) {
  return {
    uid : null,
    type : 'project',
    name,
    children : {},
  }
}

function Task(name, info='', due=0) {
  return {
    uid : null,
    type : 'task',
    children : {},
    complete : false,
    name,
    info,
    due,
  }
}

function Check(name) {
  return {
    uid : null,
    type : 'checkItem',
    complete : false,
    name,
  }
}

function childCount(object) {
  if(!object || !object.children) return 0;
  const children = object.children;

  return Object.values(children).length;
}

function childCompleteRatio(object) {
  if(!object || !object.children) return [0, 0];
  const children = Object.values(object.children);
  const completed = children.filter(child => child.complete ).length;
  const total = children.length;
  return [completed, total];
}


export { Project, Task, Check, childCount, childCompleteRatio};