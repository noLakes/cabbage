/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/controller.js":
/*!***************************!*\
  !*** ./src/controller.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ controller
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/data.js");
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects */ "./src/objects.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom */ "./src/dom.js");





// a logic controller for the different ways you might want to render/show the content
// contains event listeners for interacting with DOM elements
const controller = (function() {

  const clearActive = () => {
    document.querySelectorAll('.nav-container a').forEach(link => {
      link.classList.remove('active');
    })
  }

  const clearContent = () => {
    _dom__WEBPACK_IMPORTED_MODULE_2__.elements.content.innerHTML = '';
  }

  const loadField = (uid) => {
    console.log(`asked to load field with uid -> ${uid}`);
    clearContent();
    const field = _data__WEBPACK_IMPORTED_MODULE_0__.default.fetch(uid);
    for(let key in field.children) {
      const head = _dom__WEBPACK_IMPORTED_MODULE_2__.render.head(field.children[key]);
      _dom__WEBPACK_IMPORTED_MODULE_2__.elements.content.appendChild(head);
    }
  }

  // determines which selection of items to pool and load into the content window
  const loadHandler = (target) => {
    if(target.classList.contains('time-link')) {
      switch(target.id) {
        case 'day':
          console.log('load day');
          break
        case 'week':
          console.log('load week');
          break
        case 'month':
          console.log('load month');
          break
        default:
          console.log('load default');
          //load home?
      }
    }
    else {
      console.log(`load field for ${target.dataset.uid}`);
      loadField(target.dataset.uid);
    }
  }

  const activate = (e) => {
    if(e.target.classList.contains('active')) return;
    clearActive();
    e.target.classList.add('active');
    // load content here?
    loadHandler(e.target);
  }

  const initFields = () => {
    const fields = _data__WEBPACK_IMPORTED_MODULE_0__.default.fetchFields();
    for(let key in fields) {
      const fieldEl = _dom__WEBPACK_IMPORTED_MODULE_2__.render.fieldNav(fields[key]);
      fieldEl.addEventListener("click", activate);
      _dom__WEBPACK_IMPORTED_MODULE_2__.elements.field_links_container.appendChild(fieldEl);
    }
  }

  const initialize = () => {

  }

  _dom__WEBPACK_IMPORTED_MODULE_2__.elements.static_links.forEach(link => {
    link.addEventListener("click", activate);
  })

  return {
    initFields,
  }
})()



/***/ }),

/***/ "./src/data.js":
/*!*********************!*\
  !*** ./src/data.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ db
/* harmony export */ });
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects */ "./src/objects.js");



// module for setting up and interacting with database
// to add: firebase / check local storage viable / setup function for page load
const db = (function() {
  let cabbage_db = null;
  
  const newDb = () => {
    return {
      fields : {},
      uids : {
        field : -1,
        head : -1,
        leaf : -1,
      }
    }
  }

  const save = () => {
    localStorage.setItem('cabbage_db', JSON.stringify(cabbage_db));
  }

  const load = () => {
    if(localStorage['cabbage_db']) {
      cabbage_db = JSON.parse(localStorage['cabbage_db']);
      console.log('db loaded');
      console.log(cabbage_db);
      return true;
    } else {
      return false;
    }
  }

  const initialize = () => {
    if(!load()) {
      cabbage_db = newDb();
      save();
      console.log('new db initialized');
      console.log(cabbage_db);
    }
  }

  const parse_uid = (uid) => {
    return uid.split('-').map(i => Number(i));
  }

  const uid_to_s = (uid) => {
    return uid.join('-');
  }

  const request_uid = (type) => {
    cabbage_db['uids'][type] += 1;
    return String(cabbage_db['uids'][type]);
  }

  const merge_uid = (parent_uid, child_uid) => {
    return parent_uid.concat(`-${child_uid}`);
  }

  const fetch = (uid) => {
    if(typeof(uid) === "string") {
      uid = parse_uid(uid);
    }
    if (uid.length === 0) return;
    let result = cabbage_db.fields[uid.shift()];
    while(uid.length > 0) {
      result = result.children[uid.shift()];
    }
    return result;
  }

  const fetchFields = () => {
    return cabbage_db.fields;
  }

  const insert = (parent, child) => {
    const child_key = parse_uid(child.uid).pop();
    parent.children[child_key] = child;
    save();
  }

  const add_field = (name) => {
    const field = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Field)(name);
    field.uid = request_uid('field');
    cabbage_db.fields[parse_uid(field.uid)[0]] = field;
    save();
  }

  const add_head = (parent_uid, name, info, due) => {
    const head = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Head)(name, info, due);
    const parent = fetch(parent_uid);
    head.uid = merge_uid(parent.uid, request_uid('head'));
    insert(parent, head);
  }

  const add_leaf = (parent_uid, name, due) => {
    const leaf = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Leaf)(name, due);
    const parent = fetch(parent_uid);
    leaf.uid = merge_uid(parent.uid, request_uid('leaf'));
    insert(parent, leaf);
  }

  // needs to be tested further once DOM event listeners begin calling it
  const update_item = (uid, params) => {
    const item = fetch(uid);
    for(const key in params) {
      item[key] = params[key];
    }
    save();
  }

  const dateCollect = (date) => {
    const results = [];
    //traverse fields, heads and leafs and collect each that match date query
  }


  //for testing
  const fetch_raw = () => {
    return cabbage_db;
  }

  return {
    parse_uid,
    uid_to_s,
    request_uid,
    merge_uid,
    fetch,
    fetchFields,
    insert,
    add_field,
    add_head,
    add_leaf,
    update_item,
    save,
    load,
    fetch_raw,
    initialize,
  }
})()



/***/ }),

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "elements": () => /* binding */ elements,
/* harmony export */   "render": () => /* binding */ render
/* harmony export */ });
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects */ "./src/objects.js");



// a basic library for global elements and reusable functions
const elements = (function() {
  return {
    main : document.querySelector('.main-container'),
    nav : document.querySelector('.nav-container'),
    static_links : document.querySelectorAll('.static-links a'),
    field_links_container : document.querySelector('.field-links'),
    content : document.querySelector('.content-container'),
    footer : document.querySelector('.footer-container'),

    basic(type, className=undefined, id=undefined) {
      const div = document.createElement(type);
      if (className) {
        className.split(',').forEach(cName => {
          div.classList.add(cName);
        });
      } 
      if (id) div.id = id;
      return div;
    },

  }
})()

// a way to render objects into appropriate dom elements
const render = (function() {
  return {

    leaf(leaf) {
      const leafContainer = elements.basic('div', 'leaf');
      leafContainer.dataset.uid = leaf.uid;

      const name = elements.basic('p', 'name');
      name.innerHTML = leaf.name;
      leafContainer.appendChild(name);

      // add checkbox and due date/edit here

      return leafContainer;
    },

    head(head, renderChildren=true) {
      const headContainer = elements.basic('div', 'head');
      headContainer.dataset.uid = head.uid;

      const topContainer = elements.basic('div', 'top-container');
      const heading = elements.basic('h3', 'title');
      heading.innerHTML = head.name;
      topContainer.appendChild(heading);
      headContainer.appendChild(topContainer);

      const contentContainer = elements.basic('div', 'content');

      const info = elements.basic('p', 'info');
      info.innerHTML = head.info;
      contentContainer.appendChild(info);

      if(renderChildren) {
        const childContainer = elements.basic('div', 'child-container');
        if((0,_objects__WEBPACK_IMPORTED_MODULE_0__.hasChildren)(head)) {
          for(let child in head.children) {
            const childLeaf = this.leaf(head.children[child]);
            childContainer.appendChild(childLeaf);
          }
        }
        contentContainer.appendChild(childContainer);
      }

      headContainer.appendChild(contentContainer);


      const actionContainer = elements.basic('div', 'action-container');
      // add date element, check box, and edit options here

      headContainer.appendChild(actionContainer)
      return headContainer;
    },

    fieldHeading(field, size='h2') {
      const heading = elements.basic(size, 'field-heading');
      heading.innerHTML = field.name;
      return heading;
    },

    fieldNav(field) {
      const link = elements.basic('a', 'field-link');
      link.dataset.uid = field.uid;
      link.innerHTML = field.name;
      return link;
    },

  }
})()



/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/data.js");
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects */ "./src/objects.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom */ "./src/dom.js");
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./controller */ "./src/controller.js");






_data__WEBPACK_IMPORTED_MODULE_0__.default.initialize();

// test data
if(!_data__WEBPACK_IMPORTED_MODULE_0__.default.fetch_raw().fields[0]) {
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_field('General');
    _data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('0', 'Get groceries', 'info', false);
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'milk');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'eggs');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'bread');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'cheese');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'diced tomatoes');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'onions');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'zuccini');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'carrots');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'garlic');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'red peppers');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'spinach');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'mushrooms');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'paper towel');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-0', 'batteries');
    _data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('0', 'Clean Shower', 'info', false);
    _data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('0', 'Sell Bike', 'info', false);
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-2', 'take pics');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('0-2', 'post add on kijiji');

  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_field('Work');
    _data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('1', 'Look for a job', 'info', false);
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('1-3', 'setup indeed search prefs');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('1-3', 'edit cover letter template');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('1-3', 'make skills resume');
    
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_field('Code');
    _data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('2', 'Finish Cabbage', 'info', false);
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('2-4', 'add date/time functionality');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('2-4', 'add forms');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('2-4', 'add modals');
      _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('2-4', 'style');
}

_controller__WEBPACK_IMPORTED_MODULE_3__.default.initFields();










/***/ }),

/***/ "./src/objects.js":
/*!************************!*\
  !*** ./src/objects.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Field": () => /* binding */ Field,
/* harmony export */   "Head": () => /* binding */ Head,
/* harmony export */   "Leaf": () => /* binding */ Leaf,
/* harmony export */   "hasChildren": () => /* binding */ hasChildren
/* harmony export */ });
function Field(name) {
  return {
    uid : null,
    type : 'field',
    name,
    children : {},
  }
}

function Head(name, info, due=false) {
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

function Leaf(name, due=false) {
  return {
    uid : null,
    type : 'leaf',
    complete : false,
    name,
    due,
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



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9kYXRhLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9vYmplY3RzLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUF3QjtBQUNtQztBQUNsQjtBQUNQOztBQUVsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsSUFBSSw0REFBMEI7QUFDOUI7O0FBRUE7QUFDQSxtREFBbUQsSUFBSTtBQUN2RDtBQUNBLGtCQUFrQixnREFBUTtBQUMxQjtBQUNBLG1CQUFtQiw2Q0FBVztBQUM5QixNQUFNLDhEQUE0QjtBQUNsQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLG1CQUFtQjtBQUN2RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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QVc7QUFDakIsTUFBTSxtREFBVztBQUNqQixNQUFNLG1EQUFXOztBQUVqQixFQUFFLG9EQUFZO0FBQ2QsSUFBSSxtREFBVztBQUNmLE1BQU0sbURBQVc7QUFDakIsTUFBTSxtREFBVztBQUNqQixNQUFNLG1EQUFXO0FBQ2pCLE1BQU0sbURBQVc7QUFDakI7O0FBRUEsMkRBQXFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7VUN4Q0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGIgZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5pbXBvcnQgeyBlbGVtZW50cywgcmVuZGVyLH0gZnJvbSAnLi9kb20nO1xuaW1wb3J0IHsgZm9ybWF0LCB9IGZyb20gJ2RhdGUtZm5zJ1xuXG4vLyBhIGxvZ2ljIGNvbnRyb2xsZXIgZm9yIHRoZSBkaWZmZXJlbnQgd2F5cyB5b3UgbWlnaHQgd2FudCB0byByZW5kZXIvc2hvdyB0aGUgY29udGVudFxuLy8gY29udGFpbnMgZXZlbnQgbGlzdGVuZXJzIGZvciBpbnRlcmFjdGluZyB3aXRoIERPTSBlbGVtZW50c1xuY29uc3QgY29udHJvbGxlciA9IChmdW5jdGlvbigpIHtcblxuICBjb25zdCBjbGVhckFjdGl2ZSA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmF2LWNvbnRhaW5lciBhJykuZm9yRWFjaChsaW5rID0+IHtcbiAgICAgIGxpbmsuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IGNsZWFyQ29udGVudCA9ICgpID0+IHtcbiAgICBlbGVtZW50cy5jb250ZW50LmlubmVySFRNTCA9ICcnO1xuICB9XG5cbiAgY29uc3QgbG9hZEZpZWxkID0gKHVpZCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGBhc2tlZCB0byBsb2FkIGZpZWxkIHdpdGggdWlkIC0+ICR7dWlkfWApO1xuICAgIGNsZWFyQ29udGVudCgpO1xuICAgIGNvbnN0IGZpZWxkID0gZGIuZmV0Y2godWlkKTtcbiAgICBmb3IobGV0IGtleSBpbiBmaWVsZC5jaGlsZHJlbikge1xuICAgICAgY29uc3QgaGVhZCA9IHJlbmRlci5oZWFkKGZpZWxkLmNoaWxkcmVuW2tleV0pO1xuICAgICAgZWxlbWVudHMuY29udGVudC5hcHBlbmRDaGlsZChoZWFkKTtcbiAgICB9XG4gIH1cblxuICAvLyBkZXRlcm1pbmVzIHdoaWNoIHNlbGVjdGlvbiBvZiBpdGVtcyB0byBwb29sIGFuZCBsb2FkIGludG8gdGhlIGNvbnRlbnQgd2luZG93XG4gIGNvbnN0IGxvYWRIYW5kbGVyID0gKHRhcmdldCkgPT4ge1xuICAgIGlmKHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ3RpbWUtbGluaycpKSB7XG4gICAgICBzd2l0Y2godGFyZ2V0LmlkKSB7XG4gICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgY29uc29sZS5sb2coJ2xvYWQgZGF5Jyk7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgICAgY29uc29sZS5sb2coJ2xvYWQgd2VlaycpO1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICBjb25zb2xlLmxvZygnbG9hZCBtb250aCcpO1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29uc29sZS5sb2coJ2xvYWQgZGVmYXVsdCcpO1xuICAgICAgICAgIC8vbG9hZCBob21lP1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKGBsb2FkIGZpZWxkIGZvciAke3RhcmdldC5kYXRhc2V0LnVpZH1gKTtcbiAgICAgIGxvYWRGaWVsZCh0YXJnZXQuZGF0YXNldC51aWQpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFjdGl2YXRlID0gKGUpID0+IHtcbiAgICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKSByZXR1cm47XG4gICAgY2xlYXJBY3RpdmUoKTtcbiAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAvLyBsb2FkIGNvbnRlbnQgaGVyZT9cbiAgICBsb2FkSGFuZGxlcihlLnRhcmdldCk7XG4gIH1cblxuICBjb25zdCBpbml0RmllbGRzID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpZWxkcyA9IGRiLmZldGNoRmllbGRzKCk7XG4gICAgZm9yKGxldCBrZXkgaW4gZmllbGRzKSB7XG4gICAgICBjb25zdCBmaWVsZEVsID0gcmVuZGVyLmZpZWxkTmF2KGZpZWxkc1trZXldKTtcbiAgICAgIGZpZWxkRWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFjdGl2YXRlKTtcbiAgICAgIGVsZW1lbnRzLmZpZWxkX2xpbmtzX2NvbnRhaW5lci5hcHBlbmRDaGlsZChmaWVsZEVsKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBpbml0aWFsaXplID0gKCkgPT4ge1xuXG4gIH1cblxuICBlbGVtZW50cy5zdGF0aWNfbGlua3MuZm9yRWFjaChsaW5rID0+IHtcbiAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhY3RpdmF0ZSk7XG4gIH0pXG5cbiAgcmV0dXJuIHtcbiAgICBpbml0RmllbGRzLFxuICB9XG59KSgpXG5cbmV4cG9ydCB7IGNvbnRyb2xsZXIgYXMgZGVmYXVsdCB9OyIsImltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5pbXBvcnQgeyBmb3JtYXQsIH0gZnJvbSAnZGF0ZS1mbnMnXG5cbi8vIG1vZHVsZSBmb3Igc2V0dGluZyB1cCBhbmQgaW50ZXJhY3Rpbmcgd2l0aCBkYXRhYmFzZVxuLy8gdG8gYWRkOiBmaXJlYmFzZSAvIGNoZWNrIGxvY2FsIHN0b3JhZ2UgdmlhYmxlIC8gc2V0dXAgZnVuY3Rpb24gZm9yIHBhZ2UgbG9hZFxuY29uc3QgZGIgPSAoZnVuY3Rpb24oKSB7XG4gIGxldCBjYWJiYWdlX2RiID0gbnVsbDtcbiAgXG4gIGNvbnN0IG5ld0RiID0gKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBmaWVsZHMgOiB7fSxcbiAgICAgIHVpZHMgOiB7XG4gICAgICAgIGZpZWxkIDogLTEsXG4gICAgICAgIGhlYWQgOiAtMSxcbiAgICAgICAgbGVhZiA6IC0xLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHNhdmUgPSAoKSA9PiB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhYmJhZ2VfZGInLCBKU09OLnN0cmluZ2lmeShjYWJiYWdlX2RiKSk7XG4gIH1cblxuICBjb25zdCBsb2FkID0gKCkgPT4ge1xuICAgIGlmKGxvY2FsU3RvcmFnZVsnY2FiYmFnZV9kYiddKSB7XG4gICAgICBjYWJiYWdlX2RiID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbJ2NhYmJhZ2VfZGInXSk7XG4gICAgICBjb25zb2xlLmxvZygnZGIgbG9hZGVkJyk7XG4gICAgICBjb25zb2xlLmxvZyhjYWJiYWdlX2RiKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaW5pdGlhbGl6ZSA9ICgpID0+IHtcbiAgICBpZighbG9hZCgpKSB7XG4gICAgICBjYWJiYWdlX2RiID0gbmV3RGIoKTtcbiAgICAgIHNhdmUoKTtcbiAgICAgIGNvbnNvbGUubG9nKCduZXcgZGIgaW5pdGlhbGl6ZWQnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNhYmJhZ2VfZGIpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHBhcnNlX3VpZCA9ICh1aWQpID0+IHtcbiAgICByZXR1cm4gdWlkLnNwbGl0KCctJykubWFwKGkgPT4gTnVtYmVyKGkpKTtcbiAgfVxuXG4gIGNvbnN0IHVpZF90b19zID0gKHVpZCkgPT4ge1xuICAgIHJldHVybiB1aWQuam9pbignLScpO1xuICB9XG5cbiAgY29uc3QgcmVxdWVzdF91aWQgPSAodHlwZSkgPT4ge1xuICAgIGNhYmJhZ2VfZGJbJ3VpZHMnXVt0eXBlXSArPSAxO1xuICAgIHJldHVybiBTdHJpbmcoY2FiYmFnZV9kYlsndWlkcyddW3R5cGVdKTtcbiAgfVxuXG4gIGNvbnN0IG1lcmdlX3VpZCA9IChwYXJlbnRfdWlkLCBjaGlsZF91aWQpID0+IHtcbiAgICByZXR1cm4gcGFyZW50X3VpZC5jb25jYXQoYC0ke2NoaWxkX3VpZH1gKTtcbiAgfVxuXG4gIGNvbnN0IGZldGNoID0gKHVpZCkgPT4ge1xuICAgIGlmKHR5cGVvZih1aWQpID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB1aWQgPSBwYXJzZV91aWQodWlkKTtcbiAgICB9XG4gICAgaWYgKHVpZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBsZXQgcmVzdWx0ID0gY2FiYmFnZV9kYi5maWVsZHNbdWlkLnNoaWZ0KCldO1xuICAgIHdoaWxlKHVpZC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQuY2hpbGRyZW5bdWlkLnNoaWZ0KCldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgY29uc3QgZmV0Y2hGaWVsZHMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGNhYmJhZ2VfZGIuZmllbGRzO1xuICB9XG5cbiAgY29uc3QgaW5zZXJ0ID0gKHBhcmVudCwgY2hpbGQpID0+IHtcbiAgICBjb25zdCBjaGlsZF9rZXkgPSBwYXJzZV91aWQoY2hpbGQudWlkKS5wb3AoKTtcbiAgICBwYXJlbnQuY2hpbGRyZW5bY2hpbGRfa2V5XSA9IGNoaWxkO1xuICAgIHNhdmUoKTtcbiAgfVxuXG4gIGNvbnN0IGFkZF9maWVsZCA9IChuYW1lKSA9PiB7XG4gICAgY29uc3QgZmllbGQgPSBGaWVsZChuYW1lKTtcbiAgICBmaWVsZC51aWQgPSByZXF1ZXN0X3VpZCgnZmllbGQnKTtcbiAgICBjYWJiYWdlX2RiLmZpZWxkc1twYXJzZV91aWQoZmllbGQudWlkKVswXV0gPSBmaWVsZDtcbiAgICBzYXZlKCk7XG4gIH1cblxuICBjb25zdCBhZGRfaGVhZCA9IChwYXJlbnRfdWlkLCBuYW1lLCBpbmZvLCBkdWUpID0+IHtcbiAgICBjb25zdCBoZWFkID0gSGVhZChuYW1lLCBpbmZvLCBkdWUpO1xuICAgIGNvbnN0IHBhcmVudCA9IGZldGNoKHBhcmVudF91aWQpO1xuICAgIGhlYWQudWlkID0gbWVyZ2VfdWlkKHBhcmVudC51aWQsIHJlcXVlc3RfdWlkKCdoZWFkJykpO1xuICAgIGluc2VydChwYXJlbnQsIGhlYWQpO1xuICB9XG5cbiAgY29uc3QgYWRkX2xlYWYgPSAocGFyZW50X3VpZCwgbmFtZSwgZHVlKSA9PiB7XG4gICAgY29uc3QgbGVhZiA9IExlYWYobmFtZSwgZHVlKTtcbiAgICBjb25zdCBwYXJlbnQgPSBmZXRjaChwYXJlbnRfdWlkKTtcbiAgICBsZWFmLnVpZCA9IG1lcmdlX3VpZChwYXJlbnQudWlkLCByZXF1ZXN0X3VpZCgnbGVhZicpKTtcbiAgICBpbnNlcnQocGFyZW50LCBsZWFmKTtcbiAgfVxuXG4gIC8vIG5lZWRzIHRvIGJlIHRlc3RlZCBmdXJ0aGVyIG9uY2UgRE9NIGV2ZW50IGxpc3RlbmVycyBiZWdpbiBjYWxsaW5nIGl0XG4gIGNvbnN0IHVwZGF0ZV9pdGVtID0gKHVpZCwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IGZldGNoKHVpZCk7XG4gICAgZm9yKGNvbnN0IGtleSBpbiBwYXJhbXMpIHtcbiAgICAgIGl0ZW1ba2V5XSA9IHBhcmFtc1trZXldO1xuICAgIH1cbiAgICBzYXZlKCk7XG4gIH1cblxuICBjb25zdCBkYXRlQ29sbGVjdCA9IChkYXRlKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuICAgIC8vdHJhdmVyc2UgZmllbGRzLCBoZWFkcyBhbmQgbGVhZnMgYW5kIGNvbGxlY3QgZWFjaCB0aGF0IG1hdGNoIGRhdGUgcXVlcnlcbiAgfVxuXG5cbiAgLy9mb3IgdGVzdGluZ1xuICBjb25zdCBmZXRjaF9yYXcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGNhYmJhZ2VfZGI7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBhcnNlX3VpZCxcbiAgICB1aWRfdG9fcyxcbiAgICByZXF1ZXN0X3VpZCxcbiAgICBtZXJnZV91aWQsXG4gICAgZmV0Y2gsXG4gICAgZmV0Y2hGaWVsZHMsXG4gICAgaW5zZXJ0LFxuICAgIGFkZF9maWVsZCxcbiAgICBhZGRfaGVhZCxcbiAgICBhZGRfbGVhZixcbiAgICB1cGRhdGVfaXRlbSxcbiAgICBzYXZlLFxuICAgIGxvYWQsXG4gICAgZmV0Y2hfcmF3LFxuICAgIGluaXRpYWxpemUsXG4gIH1cbn0pKClcblxuZXhwb3J0IHsgZGIgYXMgZGVmYXVsdCB9OyIsImltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5pbXBvcnQgeyBmb3JtYXQsIH0gZnJvbSAnZGF0ZS1mbnMnXG5cbi8vIGEgYmFzaWMgbGlicmFyeSBmb3IgZ2xvYmFsIGVsZW1lbnRzIGFuZCByZXVzYWJsZSBmdW5jdGlvbnNcbmNvbnN0IGVsZW1lbnRzID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIG1haW4gOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1jb250YWluZXInKSxcbiAgICBuYXYgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWNvbnRhaW5lcicpLFxuICAgIHN0YXRpY19saW5rcyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGF0aWMtbGlua3MgYScpLFxuICAgIGZpZWxkX2xpbmtzX2NvbnRhaW5lciA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC1saW5rcycpLFxuICAgIGNvbnRlbnQgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudC1jb250YWluZXInKSxcbiAgICBmb290ZXIgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyLWNvbnRhaW5lcicpLFxuXG4gICAgYmFzaWModHlwZSwgY2xhc3NOYW1lPXVuZGVmaW5lZCwgaWQ9dW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICAgICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICBjbGFzc05hbWUuc3BsaXQoJywnKS5mb3JFYWNoKGNOYW1lID0+IHtcbiAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChjTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBcbiAgICAgIGlmIChpZCkgZGl2LmlkID0gaWQ7XG4gICAgICByZXR1cm4gZGl2O1xuICAgIH0sXG5cbiAgfVxufSkoKVxuXG4vLyBhIHdheSB0byByZW5kZXIgb2JqZWN0cyBpbnRvIGFwcHJvcHJpYXRlIGRvbSBlbGVtZW50c1xuY29uc3QgcmVuZGVyID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuXG4gICAgbGVhZihsZWFmKSB7XG4gICAgICBjb25zdCBsZWFmQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdsZWFmJyk7XG4gICAgICBsZWFmQ29udGFpbmVyLmRhdGFzZXQudWlkID0gbGVhZi51aWQ7XG5cbiAgICAgIGNvbnN0IG5hbWUgPSBlbGVtZW50cy5iYXNpYygncCcsICduYW1lJyk7XG4gICAgICBuYW1lLmlubmVySFRNTCA9IGxlYWYubmFtZTtcbiAgICAgIGxlYWZDb250YWluZXIuYXBwZW5kQ2hpbGQobmFtZSk7XG5cbiAgICAgIC8vIGFkZCBjaGVja2JveCBhbmQgZHVlIGRhdGUvZWRpdCBoZXJlXG5cbiAgICAgIHJldHVybiBsZWFmQ29udGFpbmVyO1xuICAgIH0sXG5cbiAgICBoZWFkKGhlYWQsIHJlbmRlckNoaWxkcmVuPXRydWUpIHtcbiAgICAgIGNvbnN0IGhlYWRDb250YWluZXIgPSBlbGVtZW50cy5iYXNpYygnZGl2JywgJ2hlYWQnKTtcbiAgICAgIGhlYWRDb250YWluZXIuZGF0YXNldC51aWQgPSBoZWFkLnVpZDtcblxuICAgICAgY29uc3QgdG9wQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICd0b3AtY29udGFpbmVyJyk7XG4gICAgICBjb25zdCBoZWFkaW5nID0gZWxlbWVudHMuYmFzaWMoJ2gzJywgJ3RpdGxlJyk7XG4gICAgICBoZWFkaW5nLmlubmVySFRNTCA9IGhlYWQubmFtZTtcbiAgICAgIHRvcENvbnRhaW5lci5hcHBlbmRDaGlsZChoZWFkaW5nKTtcbiAgICAgIGhlYWRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9wQ29udGFpbmVyKTtcblxuICAgICAgY29uc3QgY29udGVudENvbnRhaW5lciA9IGVsZW1lbnRzLmJhc2ljKCdkaXYnLCAnY29udGVudCcpO1xuXG4gICAgICBjb25zdCBpbmZvID0gZWxlbWVudHMuYmFzaWMoJ3AnLCAnaW5mbycpO1xuICAgICAgaW5mby5pbm5lckhUTUwgPSBoZWFkLmluZm87XG4gICAgICBjb250ZW50Q29udGFpbmVyLmFwcGVuZENoaWxkKGluZm8pO1xuXG4gICAgICBpZihyZW5kZXJDaGlsZHJlbikge1xuICAgICAgICBjb25zdCBjaGlsZENvbnRhaW5lciA9IGVsZW1lbnRzLmJhc2ljKCdkaXYnLCAnY2hpbGQtY29udGFpbmVyJyk7XG4gICAgICAgIGlmKGhhc0NoaWxkcmVuKGhlYWQpKSB7XG4gICAgICAgICAgZm9yKGxldCBjaGlsZCBpbiBoZWFkLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZExlYWYgPSB0aGlzLmxlYWYoaGVhZC5jaGlsZHJlbltjaGlsZF0pO1xuICAgICAgICAgICAgY2hpbGRDb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRMZWFmKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29udGVudENvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZENvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIGhlYWRDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGVudENvbnRhaW5lcik7XG5cblxuICAgICAgY29uc3QgYWN0aW9uQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdhY3Rpb24tY29udGFpbmVyJyk7XG4gICAgICAvLyBhZGQgZGF0ZSBlbGVtZW50LCBjaGVjayBib3gsIGFuZCBlZGl0IG9wdGlvbnMgaGVyZVxuXG4gICAgICBoZWFkQ29udGFpbmVyLmFwcGVuZENoaWxkKGFjdGlvbkNvbnRhaW5lcilcbiAgICAgIHJldHVybiBoZWFkQ29udGFpbmVyO1xuICAgIH0sXG5cbiAgICBmaWVsZEhlYWRpbmcoZmllbGQsIHNpemU9J2gyJykge1xuICAgICAgY29uc3QgaGVhZGluZyA9IGVsZW1lbnRzLmJhc2ljKHNpemUsICdmaWVsZC1oZWFkaW5nJyk7XG4gICAgICBoZWFkaW5nLmlubmVySFRNTCA9IGZpZWxkLm5hbWU7XG4gICAgICByZXR1cm4gaGVhZGluZztcbiAgICB9LFxuXG4gICAgZmllbGROYXYoZmllbGQpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSBlbGVtZW50cy5iYXNpYygnYScsICdmaWVsZC1saW5rJyk7XG4gICAgICBsaW5rLmRhdGFzZXQudWlkID0gZmllbGQudWlkO1xuICAgICAgbGluay5pbm5lckhUTUwgPSBmaWVsZC5uYW1lO1xuICAgICAgcmV0dXJuIGxpbms7XG4gICAgfSxcblxuICB9XG59KSgpXG5cbmV4cG9ydCB7IGVsZW1lbnRzLCByZW5kZXIsIH07IiwiaW1wb3J0IGRiIGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiwgaGFzQ2hpbGRyZW4gfSBmcm9tICcuL29iamVjdHMnO1xuaW1wb3J0IHsgZWxlbWVudHMsIHJlbmRlcix9IGZyb20gJy4vZG9tJztcbmltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vY29udHJvbGxlcic7XG5cblxuZGIuaW5pdGlhbGl6ZSgpO1xuXG4vLyB0ZXN0IGRhdGFcbmlmKCFkYi5mZXRjaF9yYXcoKS5maWVsZHNbMF0pIHtcbiAgZGIuYWRkX2ZpZWxkKCdHZW5lcmFsJyk7XG4gICAgZGIuYWRkX2hlYWQoJzAnLCAnR2V0IGdyb2NlcmllcycsICdpbmZvJywgZmFsc2UpO1xuICAgICAgZGIuYWRkX2xlYWYoJzAtMCcsICdtaWxrJyk7XG4gICAgICBkYi5hZGRfbGVhZignMC0wJywgJ2VnZ3MnKTtcbiAgICAgIGRiLmFkZF9sZWFmKCcwLTAnLCAnYnJlYWQnKTtcbiAgICAgIGRiLmFkZF9sZWFmKCcwLTAnLCAnY2hlZXNlJyk7XG4gICAgICBkYi5hZGRfbGVhZignMC0wJywgJ2RpY2VkIHRvbWF0b2VzJyk7XG4gICAgICBkYi5hZGRfbGVhZignMC0wJywgJ29uaW9ucycpO1xuICAgICAgZGIuYWRkX2xlYWYoJzAtMCcsICd6dWNjaW5pJyk7XG4gICAgICBkYi5hZGRfbGVhZignMC0wJywgJ2NhcnJvdHMnKTtcbiAgICAgIGRiLmFkZF9sZWFmKCcwLTAnLCAnZ2FybGljJyk7XG4gICAgICBkYi5hZGRfbGVhZignMC0wJywgJ3JlZCBwZXBwZXJzJyk7XG4gICAgICBkYi5hZGRfbGVhZignMC0wJywgJ3NwaW5hY2gnKTtcbiAgICAgIGRiLmFkZF9sZWFmKCcwLTAnLCAnbXVzaHJvb21zJyk7XG4gICAgICBkYi5hZGRfbGVhZignMC0wJywgJ3BhcGVyIHRvd2VsJyk7XG4gICAgICBkYi5hZGRfbGVhZignMC0wJywgJ2JhdHRlcmllcycpO1xuICAgIGRiLmFkZF9oZWFkKCcwJywgJ0NsZWFuIFNob3dlcicsICdpbmZvJywgZmFsc2UpO1xuICAgIGRiLmFkZF9oZWFkKCcwJywgJ1NlbGwgQmlrZScsICdpbmZvJywgZmFsc2UpO1xuICAgICAgZGIuYWRkX2xlYWYoJzAtMicsICd0YWtlIHBpY3MnKTtcbiAgICAgIGRiLmFkZF9sZWFmKCcwLTInLCAncG9zdCBhZGQgb24ga2lqaWppJyk7XG5cbiAgZGIuYWRkX2ZpZWxkKCdXb3JrJyk7XG4gICAgZGIuYWRkX2hlYWQoJzEnLCAnTG9vayBmb3IgYSBqb2InLCAnaW5mbycsIGZhbHNlKTtcbiAgICAgIGRiLmFkZF9sZWFmKCcxLTMnLCAnc2V0dXAgaW5kZWVkIHNlYXJjaCBwcmVmcycpO1xuICAgICAgZGIuYWRkX2xlYWYoJzEtMycsICdlZGl0IGNvdmVyIGxldHRlciB0ZW1wbGF0ZScpO1xuICAgICAgZGIuYWRkX2xlYWYoJzEtMycsICdtYWtlIHNraWxscyByZXN1bWUnKTtcbiAgICBcbiAgZGIuYWRkX2ZpZWxkKCdDb2RlJyk7XG4gICAgZGIuYWRkX2hlYWQoJzInLCAnRmluaXNoIENhYmJhZ2UnLCAnaW5mbycsIGZhbHNlKTtcbiAgICAgIGRiLmFkZF9sZWFmKCcyLTQnLCAnYWRkIGRhdGUvdGltZSBmdW5jdGlvbmFsaXR5Jyk7XG4gICAgICBkYi5hZGRfbGVhZignMi00JywgJ2FkZCBmb3JtcycpO1xuICAgICAgZGIuYWRkX2xlYWYoJzItNCcsICdhZGQgbW9kYWxzJyk7XG4gICAgICBkYi5hZGRfbGVhZignMi00JywgJ3N0eWxlJyk7XG59XG5cbmNvbnRyb2xsZXIuaW5pdEZpZWxkcygpO1xuXG5cblxuXG5cblxuXG5cbiIsImZ1bmN0aW9uIEZpZWxkKG5hbWUpIHtcbiAgcmV0dXJuIHtcbiAgICB1aWQgOiBudWxsLFxuICAgIHR5cGUgOiAnZmllbGQnLFxuICAgIG5hbWUsXG4gICAgY2hpbGRyZW4gOiB7fSxcbiAgfVxufVxuXG5mdW5jdGlvbiBIZWFkKG5hbWUsIGluZm8sIGR1ZT1mYWxzZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdoZWFkJyxcbiAgICBjaGlsZHJlbiA6IHt9LFxuICAgIGNvbXBsZXRlIDogZmFsc2UsXG4gICAgbmFtZSxcbiAgICBpbmZvLFxuICAgIGR1ZSxcbiAgfVxufVxuXG5mdW5jdGlvbiBMZWFmKG5hbWUsIGR1ZT1mYWxzZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdsZWFmJyxcbiAgICBjb21wbGV0ZSA6IGZhbHNlLFxuICAgIG5hbWUsXG4gICAgZHVlLFxuICB9XG59XG5cbmZ1bmN0aW9uIGhhc0NoaWxkcmVuKG9iamVjdCkge1xuICBpZighb2JqZWN0IHx8ICFvYmplY3QuY2hpbGRyZW4pIHJldHVybiBmYWxzZTtcbiAgY29uc3QgY2hpbGRyZW4gPSBvYmplY3QuY2hpbGRyZW47XG5cbiAgZm9yKGxldCBrZXkgaW4gY2hpbGRyZW4pIHtcbiAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==