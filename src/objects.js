function Field(name) {
  return {
    uid : null,
    type : 'field',
    name,
    children : new Map(),
  }
}

function Head(name, info, due=false) {
  return {
    uid : null,
    type : 'head',
    children : new Map(),
    complete : false,
    name,
    info,
    due,
  }
}

function Leaf(name, due=false) {
  return {
    uid : null,
    type : 'leaf',
    complete : false,
    name,
    due,
  }
}

export { Field, Head, Leaf };