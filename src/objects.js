function Field(name) {
  return {
    uid : null,
    type : 'field',
    name,
    children : {},
  }
}

function Head(name, info, due=undefined) {
  return {
    uid : null,
    type : 'head',
    children : {},
    complete : false,
    name,
    info,
    due,
  }
}

function Leaf(name) {
  return {
    uid : null,
    type : 'leaf',
    complete : false,
    name,
  }
}

function hasChildren(object) {
  if(!object || !object.children) return false;
  const children = object.children;

  for(let key in children) {
    if(children.hasOwnProperty(key))
        return true;
  }
  return false;
}

export { Field, Head, Leaf, hasChildren };