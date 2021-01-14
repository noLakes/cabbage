function Field(name) {
  return {
    type : 'field',
    name,
    heads : [],
  }
}

function Head(name, info, due=false) {
  return {
    type : 'head',
    leaves : [],
    complete : false,
    name,
    info,
    due,
  }
}

function Leaf(name, due=false) {
  return {
    type : 'leaf',
    complete : false,
    name,
    due,
  }
}

export { Field, Head, Leaf };