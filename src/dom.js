import { Field, Head, Leaf, hasChildren } from './objects';

// a basic library for global elements and reusable functions
const elements = (function() {
  return {
    main : document.querySelector('.main-container'),
    nav : document.querySelector('.nav-container'),
    static_links : document.querySelector('.static-links'),
    field_links : document.querySelector('.field-links'),
    content : document.querySelector('.content-container'),
    footer : document.querySelector('.footer-container'),

    basic(type, className=undefined, id=undefined) {
      const div = document.createElement(type);
      if (className) div.classList.add(className);
      if (id) div.id = id;
      return div;
    },

  }
})()

// a way to render objects into appropriate dom elements
const render = (function() {
  return {

    leaf(leaf) {

    },

    head(head) {
      const container = elements.basic('div', 'head');
    },

    field() {

    },

  }
})()

// a logic controller for the different ways you might want to render/show the content
const controller = (function() {
  return {

  }
})()

export { elements, render, controller };