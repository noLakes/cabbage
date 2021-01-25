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
    //initNavListeners,
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

if(!_data__WEBPACK_IMPORTED_MODULE_0__.default.fetch_raw().fields[0]) {
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_field('General');
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('0', 'Test head0', 'info', false);
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('0', 'Test head1', 'info', false);
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('0', 'Test head2', 'info', false);
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_field('field 1');
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('1', 'Test head3', 'info', false);
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_field('field 2');
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('2', 'Test head4', 'info', false);
  _data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('1-3', 'leaf 0', false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9kYXRhLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9vYmplY3RzLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUF3QjtBQUNtQztBQUNsQjtBQUNQOztBQUVsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsSUFBSSw0REFBMEI7QUFDOUI7O0FBRUE7QUFDQSxtREFBbUQsSUFBSTtBQUN2RDtBQUNBLGtCQUFrQixnREFBUTtBQUMxQjtBQUNBLG1CQUFtQiw2Q0FBVztBQUM5QixNQUFNLDhEQUE0QjtBQUNsQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLG1CQUFtQjtBQUN2RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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eENBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRiIGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiwgaGFzQ2hpbGRyZW4gfSBmcm9tICcuL29iamVjdHMnO1xuaW1wb3J0IHsgZWxlbWVudHMsIHJlbmRlcix9IGZyb20gJy4vZG9tJztcbmltcG9ydCB7IGZvcm1hdCwgfSBmcm9tICdkYXRlLWZucydcblxuLy8gYSBsb2dpYyBjb250cm9sbGVyIGZvciB0aGUgZGlmZmVyZW50IHdheXMgeW91IG1pZ2h0IHdhbnQgdG8gcmVuZGVyL3Nob3cgdGhlIGNvbnRlbnRcbi8vIGNvbnRhaW5zIGV2ZW50IGxpc3RlbmVycyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBET00gZWxlbWVudHNcbmNvbnN0IGNvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKSB7XG5cbiAgY29uc3QgY2xlYXJBY3RpdmUgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5hdi1jb250YWluZXIgYScpLmZvckVhY2gobGluayA9PiB7XG4gICAgICBsaW5rLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH0pXG4gIH1cblxuICBjb25zdCBjbGVhckNvbnRlbnQgPSAoKSA9PiB7XG4gICAgZWxlbWVudHMuY29udGVudC5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIGNvbnN0IGxvYWRGaWVsZCA9ICh1aWQpID0+IHtcbiAgICBjb25zb2xlLmxvZyhgYXNrZWQgdG8gbG9hZCBmaWVsZCB3aXRoIHVpZCAtPiAke3VpZH1gKTtcbiAgICBjbGVhckNvbnRlbnQoKTtcbiAgICBjb25zdCBmaWVsZCA9IGRiLmZldGNoKHVpZCk7XG4gICAgZm9yKGxldCBrZXkgaW4gZmllbGQuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGhlYWQgPSByZW5kZXIuaGVhZChmaWVsZC5jaGlsZHJlbltrZXldKTtcbiAgICAgIGVsZW1lbnRzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoaGVhZCk7XG4gICAgfVxuICB9XG5cbiAgLy8gZGV0ZXJtaW5lcyB3aGljaCBzZWxlY3Rpb24gb2YgaXRlbXMgdG8gcG9vbCBhbmQgbG9hZCBpbnRvIHRoZSBjb250ZW50IHdpbmRvd1xuICBjb25zdCBsb2FkSGFuZGxlciA9ICh0YXJnZXQpID0+IHtcbiAgICBpZih0YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0aW1lLWxpbmsnKSkge1xuICAgICAgc3dpdGNoKHRhcmdldC5pZCkge1xuICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2FkIGRheScpO1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2FkIHdlZWsnKTtcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgY29uc29sZS5sb2coJ2xvYWQgbW9udGgnKTtcbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2FkIGRlZmF1bHQnKTtcbiAgICAgICAgICAvL2xvYWQgaG9tZT9cbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhgbG9hZCBmaWVsZCBmb3IgJHt0YXJnZXQuZGF0YXNldC51aWR9YCk7XG4gICAgICBsb2FkRmllbGQodGFyZ2V0LmRhdGFzZXQudWlkKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBhY3RpdmF0ZSA9IChlKSA9PiB7XG4gICAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkgcmV0dXJuO1xuICAgIGNsZWFyQWN0aXZlKCk7XG4gICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgLy8gbG9hZCBjb250ZW50IGhlcmU/XG4gICAgbG9hZEhhbmRsZXIoZS50YXJnZXQpO1xuICB9XG5cbiAgY29uc3QgaW5pdEZpZWxkcyA9ICgpID0+IHtcbiAgICBjb25zdCBmaWVsZHMgPSBkYi5mZXRjaEZpZWxkcygpO1xuICAgIGZvcihsZXQga2V5IGluIGZpZWxkcykge1xuICAgICAgY29uc3QgZmllbGRFbCA9IHJlbmRlci5maWVsZE5hdihmaWVsZHNba2V5XSk7XG4gICAgICBmaWVsZEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhY3RpdmF0ZSk7XG4gICAgICBlbGVtZW50cy5maWVsZF9saW5rc19jb250YWluZXIuYXBwZW5kQ2hpbGQoZmllbGRFbCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaW5pdGlhbGl6ZSA9ICgpID0+IHtcblxuICB9XG5cbiAgZWxlbWVudHMuc3RhdGljX2xpbmtzLmZvckVhY2gobGluayA9PiB7XG4gICAgbGluay5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYWN0aXZhdGUpO1xuICB9KVxuXG4gIHJldHVybiB7XG4gICAgaW5pdEZpZWxkcyxcbiAgICAvL2luaXROYXZMaXN0ZW5lcnMsXG4gIH1cbn0pKClcblxuZXhwb3J0IHsgY29udHJvbGxlciBhcyBkZWZhdWx0IH07IiwiaW1wb3J0IHsgRmllbGQsIEhlYWQsIExlYWYsIGhhc0NoaWxkcmVuIH0gZnJvbSAnLi9vYmplY3RzJztcbmltcG9ydCB7IGZvcm1hdCwgfSBmcm9tICdkYXRlLWZucydcblxuLy8gbW9kdWxlIGZvciBzZXR0aW5nIHVwIGFuZCBpbnRlcmFjdGluZyB3aXRoIGRhdGFiYXNlXG4vLyB0byBhZGQ6IGZpcmViYXNlIC8gY2hlY2sgbG9jYWwgc3RvcmFnZSB2aWFibGUgLyBzZXR1cCBmdW5jdGlvbiBmb3IgcGFnZSBsb2FkXG5jb25zdCBkYiA9IChmdW5jdGlvbigpIHtcbiAgbGV0IGNhYmJhZ2VfZGIgPSBudWxsO1xuICBcbiAgY29uc3QgbmV3RGIgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpZWxkcyA6IHt9LFxuICAgICAgdWlkcyA6IHtcbiAgICAgICAgZmllbGQgOiAtMSxcbiAgICAgICAgaGVhZCA6IC0xLFxuICAgICAgICBsZWFmIDogLTEsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc2F2ZSA9ICgpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2FiYmFnZV9kYicsIEpTT04uc3RyaW5naWZ5KGNhYmJhZ2VfZGIpKTtcbiAgfVxuXG4gIGNvbnN0IGxvYWQgPSAoKSA9PiB7XG4gICAgaWYobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pIHtcbiAgICAgIGNhYmJhZ2VfZGIgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVsnY2FiYmFnZV9kYiddKTtcbiAgICAgIGNvbnNvbGUubG9nKCdkYiBsb2FkZWQnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNhYmJhZ2VfZGIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBpbml0aWFsaXplID0gKCkgPT4ge1xuICAgIGlmKCFsb2FkKCkpIHtcbiAgICAgIGNhYmJhZ2VfZGIgPSBuZXdEYigpO1xuICAgICAgc2F2ZSgpO1xuICAgICAgY29uc29sZS5sb2coJ25ldyBkYiBpbml0aWFsaXplZCcpO1xuICAgICAgY29uc29sZS5sb2coY2FiYmFnZV9kYik7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcGFyc2VfdWlkID0gKHVpZCkgPT4ge1xuICAgIHJldHVybiB1aWQuc3BsaXQoJy0nKS5tYXAoaSA9PiBOdW1iZXIoaSkpO1xuICB9XG5cbiAgY29uc3QgdWlkX3RvX3MgPSAodWlkKSA9PiB7XG4gICAgcmV0dXJuIHVpZC5qb2luKCctJyk7XG4gIH1cblxuICBjb25zdCByZXF1ZXN0X3VpZCA9ICh0eXBlKSA9PiB7XG4gICAgY2FiYmFnZV9kYlsndWlkcyddW3R5cGVdICs9IDE7XG4gICAgcmV0dXJuIFN0cmluZyhjYWJiYWdlX2RiWyd1aWRzJ11bdHlwZV0pO1xuICB9XG5cbiAgY29uc3QgbWVyZ2VfdWlkID0gKHBhcmVudF91aWQsIGNoaWxkX3VpZCkgPT4ge1xuICAgIHJldHVybiBwYXJlbnRfdWlkLmNvbmNhdChgLSR7Y2hpbGRfdWlkfWApO1xuICB9XG5cbiAgY29uc3QgZmV0Y2ggPSAodWlkKSA9PiB7XG4gICAgaWYodHlwZW9mKHVpZCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHVpZCA9IHBhcnNlX3VpZCh1aWQpO1xuICAgIH1cbiAgICBpZiAodWlkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGxldCByZXN1bHQgPSBjYWJiYWdlX2RiLmZpZWxkc1t1aWQuc2hpZnQoKV07XG4gICAgd2hpbGUodWlkLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5jaGlsZHJlblt1aWQuc2hpZnQoKV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBjb25zdCBmZXRjaEZpZWxkcyA9ICgpID0+IHtcbiAgICByZXR1cm4gY2FiYmFnZV9kYi5maWVsZHM7XG4gIH1cblxuICBjb25zdCBpbnNlcnQgPSAocGFyZW50LCBjaGlsZCkgPT4ge1xuICAgIGNvbnN0IGNoaWxkX2tleSA9IHBhcnNlX3VpZChjaGlsZC51aWQpLnBvcCgpO1xuICAgIHBhcmVudC5jaGlsZHJlbltjaGlsZF9rZXldID0gY2hpbGQ7XG4gICAgc2F2ZSgpO1xuICB9XG5cbiAgY29uc3QgYWRkX2ZpZWxkID0gKG5hbWUpID0+IHtcbiAgICBjb25zdCBmaWVsZCA9IEZpZWxkKG5hbWUpO1xuICAgIGZpZWxkLnVpZCA9IHJlcXVlc3RfdWlkKCdmaWVsZCcpO1xuICAgIGNhYmJhZ2VfZGIuZmllbGRzW3BhcnNlX3VpZChmaWVsZC51aWQpWzBdXSA9IGZpZWxkO1xuICAgIHNhdmUoKTtcbiAgfVxuXG4gIGNvbnN0IGFkZF9oZWFkID0gKHBhcmVudF91aWQsIG5hbWUsIGluZm8sIGR1ZSkgPT4ge1xuICAgIGNvbnN0IGhlYWQgPSBIZWFkKG5hbWUsIGluZm8sIGR1ZSk7XG4gICAgY29uc3QgcGFyZW50ID0gZmV0Y2gocGFyZW50X3VpZCk7XG4gICAgaGVhZC51aWQgPSBtZXJnZV91aWQocGFyZW50LnVpZCwgcmVxdWVzdF91aWQoJ2hlYWQnKSk7XG4gICAgaW5zZXJ0KHBhcmVudCwgaGVhZCk7XG4gIH1cblxuICBjb25zdCBhZGRfbGVhZiA9IChwYXJlbnRfdWlkLCBuYW1lLCBkdWUpID0+IHtcbiAgICBjb25zdCBsZWFmID0gTGVhZihuYW1lLCBkdWUpO1xuICAgIGNvbnN0IHBhcmVudCA9IGZldGNoKHBhcmVudF91aWQpO1xuICAgIGxlYWYudWlkID0gbWVyZ2VfdWlkKHBhcmVudC51aWQsIHJlcXVlc3RfdWlkKCdsZWFmJykpO1xuICAgIGluc2VydChwYXJlbnQsIGxlYWYpO1xuICB9XG5cbiAgLy8gbmVlZHMgdG8gYmUgdGVzdGVkIGZ1cnRoZXIgb25jZSBET00gZXZlbnQgbGlzdGVuZXJzIGJlZ2luIGNhbGxpbmcgaXRcbiAgY29uc3QgdXBkYXRlX2l0ZW0gPSAodWlkLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBpdGVtID0gZmV0Y2godWlkKTtcbiAgICBmb3IoY29uc3Qga2V5IGluIHBhcmFtcykge1xuICAgICAgaXRlbVtrZXldID0gcGFyYW1zW2tleV07XG4gICAgfVxuICAgIHNhdmUoKTtcbiAgfVxuXG5cbiAgLy9mb3IgdGVzdGluZ1xuICBjb25zdCBmZXRjaF9yYXcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGNhYmJhZ2VfZGI7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBhcnNlX3VpZCxcbiAgICB1aWRfdG9fcyxcbiAgICByZXF1ZXN0X3VpZCxcbiAgICBtZXJnZV91aWQsXG4gICAgZmV0Y2gsXG4gICAgZmV0Y2hGaWVsZHMsXG4gICAgaW5zZXJ0LFxuICAgIGFkZF9maWVsZCxcbiAgICBhZGRfaGVhZCxcbiAgICBhZGRfbGVhZixcbiAgICB1cGRhdGVfaXRlbSxcbiAgICBzYXZlLFxuICAgIGxvYWQsXG4gICAgZmV0Y2hfcmF3LFxuICAgIGluaXRpYWxpemUsXG4gIH1cbn0pKClcblxuZXhwb3J0IHsgZGIgYXMgZGVmYXVsdCB9OyIsImltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5pbXBvcnQgeyBmb3JtYXQsIH0gZnJvbSAnZGF0ZS1mbnMnXG5cbi8vIGEgYmFzaWMgbGlicmFyeSBmb3IgZ2xvYmFsIGVsZW1lbnRzIGFuZCByZXVzYWJsZSBmdW5jdGlvbnNcbmNvbnN0IGVsZW1lbnRzID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIG1haW4gOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1jb250YWluZXInKSxcbiAgICBuYXYgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWNvbnRhaW5lcicpLFxuICAgIHN0YXRpY19saW5rcyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGF0aWMtbGlua3MgYScpLFxuICAgIGZpZWxkX2xpbmtzX2NvbnRhaW5lciA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC1saW5rcycpLFxuICAgIGNvbnRlbnQgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudC1jb250YWluZXInKSxcbiAgICBmb290ZXIgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyLWNvbnRhaW5lcicpLFxuXG4gICAgYmFzaWModHlwZSwgY2xhc3NOYW1lPXVuZGVmaW5lZCwgaWQ9dW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICAgICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICBjbGFzc05hbWUuc3BsaXQoJywnKS5mb3JFYWNoKGNOYW1lID0+IHtcbiAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChjTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBcbiAgICAgIGlmIChpZCkgZGl2LmlkID0gaWQ7XG4gICAgICByZXR1cm4gZGl2O1xuICAgIH0sXG5cbiAgfVxufSkoKVxuXG4vLyBhIHdheSB0byByZW5kZXIgb2JqZWN0cyBpbnRvIGFwcHJvcHJpYXRlIGRvbSBlbGVtZW50c1xuY29uc3QgcmVuZGVyID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuXG4gICAgbGVhZihsZWFmKSB7XG4gICAgICBjb25zdCBsZWFmQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdsZWFmJyk7XG4gICAgICBsZWFmQ29udGFpbmVyLmRhdGFzZXQudWlkID0gbGVhZi51aWQ7XG5cbiAgICAgIGNvbnN0IG5hbWUgPSBlbGVtZW50cy5iYXNpYygncCcsICduYW1lJyk7XG4gICAgICBuYW1lLmlubmVySFRNTCA9IGxlYWYubmFtZTtcbiAgICAgIGxlYWZDb250YWluZXIuYXBwZW5kQ2hpbGQobmFtZSk7XG5cbiAgICAgIC8vIGFkZCBjaGVja2JveCBhbmQgZHVlIGRhdGUvZWRpdCBoZXJlXG5cbiAgICAgIHJldHVybiBsZWFmQ29udGFpbmVyO1xuICAgIH0sXG5cbiAgICBoZWFkKGhlYWQsIHJlbmRlckNoaWxkcmVuPXRydWUpIHtcbiAgICAgIGNvbnN0IGhlYWRDb250YWluZXIgPSBlbGVtZW50cy5iYXNpYygnZGl2JywgJ2hlYWQnKTtcbiAgICAgIGhlYWRDb250YWluZXIuZGF0YXNldC51aWQgPSBoZWFkLnVpZDtcblxuICAgICAgY29uc3QgdG9wQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICd0b3AtY29udGFpbmVyJyk7XG4gICAgICBjb25zdCBoZWFkaW5nID0gZWxlbWVudHMuYmFzaWMoJ2gzJywgJ3RpdGxlJyk7XG4gICAgICBoZWFkaW5nLmlubmVySFRNTCA9IGhlYWQubmFtZTtcbiAgICAgIHRvcENvbnRhaW5lci5hcHBlbmRDaGlsZChoZWFkaW5nKTtcbiAgICAgIGhlYWRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9wQ29udGFpbmVyKTtcblxuICAgICAgY29uc3QgY29udGVudENvbnRhaW5lciA9IGVsZW1lbnRzLmJhc2ljKCdkaXYnLCAnY29udGVudCcpO1xuXG4gICAgICBjb25zdCBpbmZvID0gZWxlbWVudHMuYmFzaWMoJ3AnLCAnaW5mbycpO1xuICAgICAgaW5mby5pbm5lckhUTUwgPSBoZWFkLmluZm87XG4gICAgICBjb250ZW50Q29udGFpbmVyLmFwcGVuZENoaWxkKGluZm8pO1xuXG4gICAgICBpZihyZW5kZXJDaGlsZHJlbikge1xuICAgICAgICBjb25zdCBjaGlsZENvbnRhaW5lciA9IGVsZW1lbnRzLmJhc2ljKCdkaXYnLCAnY2hpbGQtY29udGFpbmVyJyk7XG4gICAgICAgIGlmKGhhc0NoaWxkcmVuKGhlYWQpKSB7XG4gICAgICAgICAgZm9yKGxldCBjaGlsZCBpbiBoZWFkLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZExlYWYgPSB0aGlzLmxlYWYoaGVhZC5jaGlsZHJlbltjaGlsZF0pO1xuICAgICAgICAgICAgY2hpbGRDb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRMZWFmKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29udGVudENvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZENvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIGhlYWRDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGVudENvbnRhaW5lcik7XG5cblxuICAgICAgY29uc3QgYWN0aW9uQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdhY3Rpb24tY29udGFpbmVyJyk7XG4gICAgICAvLyBhZGQgZGF0ZSBlbGVtZW50LCBjaGVjayBib3gsIGFuZCBlZGl0IG9wdGlvbnMgaGVyZVxuXG4gICAgICBoZWFkQ29udGFpbmVyLmFwcGVuZENoaWxkKGFjdGlvbkNvbnRhaW5lcilcbiAgICAgIHJldHVybiBoZWFkQ29udGFpbmVyO1xuICAgIH0sXG5cbiAgICBmaWVsZEhlYWRpbmcoZmllbGQsIHNpemU9J2gyJykge1xuICAgICAgY29uc3QgaGVhZGluZyA9IGVsZW1lbnRzLmJhc2ljKHNpemUsICdmaWVsZC1oZWFkaW5nJyk7XG4gICAgICBoZWFkaW5nLmlubmVySFRNTCA9IGZpZWxkLm5hbWU7XG4gICAgICByZXR1cm4gaGVhZGluZztcbiAgICB9LFxuXG4gICAgZmllbGROYXYoZmllbGQpIHtcbiAgICAgIGNvbnN0IGxpbmsgPSBlbGVtZW50cy5iYXNpYygnYScsICdmaWVsZC1saW5rJyk7XG4gICAgICBsaW5rLmRhdGFzZXQudWlkID0gZmllbGQudWlkO1xuICAgICAgbGluay5pbm5lckhUTUwgPSBmaWVsZC5uYW1lO1xuICAgICAgcmV0dXJuIGxpbms7XG4gICAgfSxcblxuICB9XG59KSgpXG5cbmV4cG9ydCB7IGVsZW1lbnRzLCByZW5kZXIsIH07IiwiaW1wb3J0IGRiIGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiwgaGFzQ2hpbGRyZW4gfSBmcm9tICcuL29iamVjdHMnO1xuaW1wb3J0IHsgZWxlbWVudHMsIHJlbmRlcix9IGZyb20gJy4vZG9tJztcbmltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vY29udHJvbGxlcic7XG5cblxuZGIuaW5pdGlhbGl6ZSgpO1xuXG5pZighZGIuZmV0Y2hfcmF3KCkuZmllbGRzWzBdKSB7XG4gIGRiLmFkZF9maWVsZCgnR2VuZXJhbCcpO1xuICBkYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQwJywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9oZWFkKCcwJywgJ1Rlc3QgaGVhZDEnLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2hlYWQoJzAnLCAnVGVzdCBoZWFkMicsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfZmllbGQoJ2ZpZWxkIDEnKTtcbiAgZGIuYWRkX2hlYWQoJzEnLCAnVGVzdCBoZWFkMycsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfZmllbGQoJ2ZpZWxkIDInKTtcbiAgZGIuYWRkX2hlYWQoJzInLCAnVGVzdCBoZWFkNCcsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfbGVhZignMS0zJywgJ2xlYWYgMCcsIGZhbHNlKTtcbn1cblxuY29udHJvbGxlci5pbml0RmllbGRzKCk7XG5cblxuXG5cblxuXG5cblxuIiwiZnVuY3Rpb24gRmllbGQobmFtZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdmaWVsZCcsXG4gICAgbmFtZSxcbiAgICBjaGlsZHJlbiA6IHt9LFxuICB9XG59XG5cbmZ1bmN0aW9uIEhlYWQobmFtZSwgaW5mbywgZHVlPWZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2hlYWQnLFxuICAgIGNoaWxkcmVuIDoge30sXG4gICAgY29tcGxldGUgOiBmYWxzZSxcbiAgICBuYW1lLFxuICAgIGluZm8sXG4gICAgZHVlLFxuICB9XG59XG5cbmZ1bmN0aW9uIExlYWYobmFtZSwgZHVlPWZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2xlYWYnLFxuICAgIGNvbXBsZXRlIDogZmFsc2UsXG4gICAgbmFtZSxcbiAgICBkdWUsXG4gIH1cbn1cblxuZnVuY3Rpb24gaGFzQ2hpbGRyZW4ob2JqZWN0KSB7XG4gIGlmKCFvYmplY3QgfHwgIW9iamVjdC5jaGlsZHJlbikgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBjaGlsZHJlbiA9IG9iamVjdC5jaGlsZHJlbjtcblxuICBmb3IobGV0IGtleSBpbiBjaGlsZHJlbikge1xuICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IHsgRmllbGQsIEhlYWQsIExlYWYsIGhhc0NoaWxkcmVuIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9