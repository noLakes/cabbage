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

  const initFields = () => {
    const fields = _data__WEBPACK_IMPORTED_MODULE_0__.default.fetchFields();
    for(let key in fields) {
      const fieldEl = _dom__WEBPACK_IMPORTED_MODULE_2__.render.fieldNav(fields[key]);
      // add event listener here allocation here?
      const listItem = _dom__WEBPACK_IMPORTED_MODULE_2__.elements.basic('li');
      listItem.appendChild(fieldEl);
      _dom__WEBPACK_IMPORTED_MODULE_2__.elements.field_links.appendChild(listItem);
    }
  }

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
    static_links : document.querySelector('.static-links'),
    field_links : document.querySelector('.field-links'),
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

const testHead = _data__WEBPACK_IMPORTED_MODULE_0__.default.fetch('1-3');
_dom__WEBPACK_IMPORTED_MODULE_2__.elements.content.appendChild(_dom__WEBPACK_IMPORTED_MODULE_2__.render.head(testHead));








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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9kYXRhLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9vYmplY3RzLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUF3QjtBQUNtQztBQUNsQjtBQUNQOztBQUVsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsc0RBQWM7QUFDakM7QUFDQSxzQkFBc0IsaURBQWU7QUFDckM7QUFDQSx1QkFBdUIsZ0RBQWM7QUFDckM7QUFDQSxNQUFNLGtFQUFnQztBQUN0QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3hCMEQ7QUFDekI7O0FBRWxDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FB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Li9kYXRhJztcbmltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5pbXBvcnQgeyBlbGVtZW50cywgcmVuZGVyLH0gZnJvbSAnLi9kb20nO1xuaW1wb3J0IHsgZm9ybWF0LCB9IGZyb20gJ2RhdGUtZm5zJ1xuXG4vLyBhIGxvZ2ljIGNvbnRyb2xsZXIgZm9yIHRoZSBkaWZmZXJlbnQgd2F5cyB5b3UgbWlnaHQgd2FudCB0byByZW5kZXIvc2hvdyB0aGUgY29udGVudFxuLy8gY29udGFpbnMgZXZlbnQgbGlzdGVuZXJzIGZvciBpbnRlcmFjdGluZyB3aXRoIERPTSBlbGVtZW50c1xuY29uc3QgY29udHJvbGxlciA9IChmdW5jdGlvbigpIHtcblxuICBjb25zdCBpbml0RmllbGRzID0gKCkgPT4ge1xuICAgIGNvbnN0IGZpZWxkcyA9IGRiLmZldGNoRmllbGRzKCk7XG4gICAgZm9yKGxldCBrZXkgaW4gZmllbGRzKSB7XG4gICAgICBjb25zdCBmaWVsZEVsID0gcmVuZGVyLmZpZWxkTmF2KGZpZWxkc1trZXldKTtcbiAgICAgIC8vIGFkZCBldmVudCBsaXN0ZW5lciBoZXJlIGFsbG9jYXRpb24gaGVyZT9cbiAgICAgIGNvbnN0IGxpc3RJdGVtID0gZWxlbWVudHMuYmFzaWMoJ2xpJyk7XG4gICAgICBsaXN0SXRlbS5hcHBlbmRDaGlsZChmaWVsZEVsKTtcbiAgICAgIGVsZW1lbnRzLmZpZWxkX2xpbmtzLmFwcGVuZENoaWxkKGxpc3RJdGVtKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXRGaWVsZHMsXG5cbiAgfVxufSkoKVxuXG5leHBvcnQgeyBjb250cm9sbGVyIGFzIGRlZmF1bHQgfTsiLCJpbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiwgaGFzQ2hpbGRyZW4gfSBmcm9tICcuL29iamVjdHMnO1xuaW1wb3J0IHsgZm9ybWF0LCB9IGZyb20gJ2RhdGUtZm5zJ1xuXG4vLyBtb2R1bGUgZm9yIHNldHRpbmcgdXAgYW5kIGludGVyYWN0aW5nIHdpdGggZGF0YWJhc2Vcbi8vIHRvIGFkZDogZmlyZWJhc2UgLyBjaGVjayBsb2NhbCBzdG9yYWdlIHZpYWJsZSAvIHNldHVwIGZ1bmN0aW9uIGZvciBwYWdlIGxvYWRcbmNvbnN0IGRiID0gKGZ1bmN0aW9uKCkge1xuICBsZXQgY2FiYmFnZV9kYiA9IG51bGw7XG4gIFxuICBjb25zdCBuZXdEYiA9ICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgZmllbGRzIDoge30sXG4gICAgICB1aWRzIDoge1xuICAgICAgICBmaWVsZCA6IC0xLFxuICAgICAgICBoZWFkIDogLTEsXG4gICAgICAgIGxlYWYgOiAtMSxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBzYXZlID0gKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYWJiYWdlX2RiJywgSlNPTi5zdHJpbmdpZnkoY2FiYmFnZV9kYikpO1xuICB9XG5cbiAgY29uc3QgbG9hZCA9ICgpID0+IHtcbiAgICBpZihsb2NhbFN0b3JhZ2VbJ2NhYmJhZ2VfZGInXSkge1xuICAgICAgY2FiYmFnZV9kYiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pO1xuICAgICAgY29uc29sZS5sb2coJ2RiIGxvYWRlZCcpO1xuICAgICAgY29uc29sZS5sb2coY2FiYmFnZV9kYik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGluaXRpYWxpemUgPSAoKSA9PiB7XG4gICAgaWYoIWxvYWQoKSkge1xuICAgICAgY2FiYmFnZV9kYiA9IG5ld0RiKCk7XG4gICAgICBzYXZlKCk7XG4gICAgICBjb25zb2xlLmxvZygnbmV3IGRiIGluaXRpYWxpemVkJyk7XG4gICAgICBjb25zb2xlLmxvZyhjYWJiYWdlX2RiKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBwYXJzZV91aWQgPSAodWlkKSA9PiB7XG4gICAgcmV0dXJuIHVpZC5zcGxpdCgnLScpLm1hcChpID0+IE51bWJlcihpKSk7XG4gIH1cblxuICBjb25zdCB1aWRfdG9fcyA9ICh1aWQpID0+IHtcbiAgICByZXR1cm4gdWlkLmpvaW4oJy0nKTtcbiAgfVxuXG4gIGNvbnN0IHJlcXVlc3RfdWlkID0gKHR5cGUpID0+IHtcbiAgICBjYWJiYWdlX2RiWyd1aWRzJ11bdHlwZV0gKz0gMTtcbiAgICByZXR1cm4gU3RyaW5nKGNhYmJhZ2VfZGJbJ3VpZHMnXVt0eXBlXSk7XG4gIH1cblxuICBjb25zdCBtZXJnZV91aWQgPSAocGFyZW50X3VpZCwgY2hpbGRfdWlkKSA9PiB7XG4gICAgcmV0dXJuIHBhcmVudF91aWQuY29uY2F0KGAtJHtjaGlsZF91aWR9YCk7XG4gIH1cblxuICBjb25zdCBmZXRjaCA9ICh1aWQpID0+IHtcbiAgICBpZih0eXBlb2YodWlkKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdWlkID0gcGFyc2VfdWlkKHVpZCk7XG4gICAgfVxuICAgIGlmICh1aWQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgbGV0IHJlc3VsdCA9IGNhYmJhZ2VfZGIuZmllbGRzW3VpZC5zaGlmdCgpXTtcbiAgICB3aGlsZSh1aWQubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0LmNoaWxkcmVuW3VpZC5zaGlmdCgpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGNvbnN0IGZldGNoRmllbGRzID0gKCkgPT4ge1xuICAgIHJldHVybiBjYWJiYWdlX2RiLmZpZWxkcztcbiAgfVxuXG4gIGNvbnN0IGluc2VydCA9IChwYXJlbnQsIGNoaWxkKSA9PiB7XG4gICAgY29uc3QgY2hpbGRfa2V5ID0gcGFyc2VfdWlkKGNoaWxkLnVpZCkucG9wKCk7XG4gICAgcGFyZW50LmNoaWxkcmVuW2NoaWxkX2tleV0gPSBjaGlsZDtcbiAgICBzYXZlKCk7XG4gIH1cblxuICBjb25zdCBhZGRfZmllbGQgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IGZpZWxkID0gRmllbGQobmFtZSk7XG4gICAgZmllbGQudWlkID0gcmVxdWVzdF91aWQoJ2ZpZWxkJyk7XG4gICAgY2FiYmFnZV9kYi5maWVsZHNbcGFyc2VfdWlkKGZpZWxkLnVpZClbMF1dID0gZmllbGQ7XG4gICAgc2F2ZSgpO1xuICB9XG5cbiAgY29uc3QgYWRkX2hlYWQgPSAocGFyZW50X3VpZCwgbmFtZSwgaW5mbywgZHVlKSA9PiB7XG4gICAgY29uc3QgaGVhZCA9IEhlYWQobmFtZSwgaW5mbywgZHVlKTtcbiAgICBjb25zdCBwYXJlbnQgPSBmZXRjaChwYXJlbnRfdWlkKTtcbiAgICBoZWFkLnVpZCA9IG1lcmdlX3VpZChwYXJlbnQudWlkLCByZXF1ZXN0X3VpZCgnaGVhZCcpKTtcbiAgICBpbnNlcnQocGFyZW50LCBoZWFkKTtcbiAgfVxuXG4gIGNvbnN0IGFkZF9sZWFmID0gKHBhcmVudF91aWQsIG5hbWUsIGR1ZSkgPT4ge1xuICAgIGNvbnN0IGxlYWYgPSBMZWFmKG5hbWUsIGR1ZSk7XG4gICAgY29uc3QgcGFyZW50ID0gZmV0Y2gocGFyZW50X3VpZCk7XG4gICAgbGVhZi51aWQgPSBtZXJnZV91aWQocGFyZW50LnVpZCwgcmVxdWVzdF91aWQoJ2xlYWYnKSk7XG4gICAgaW5zZXJ0KHBhcmVudCwgbGVhZik7XG4gIH1cblxuICAvLyBuZWVkcyB0byBiZSB0ZXN0ZWQgZnVydGhlciBvbmNlIERPTSBldmVudCBsaXN0ZW5lcnMgYmVnaW4gY2FsbGluZyBpdFxuICBjb25zdCB1cGRhdGVfaXRlbSA9ICh1aWQsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSBmZXRjaCh1aWQpO1xuICAgIGZvcihjb25zdCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICBpdGVtW2tleV0gPSBwYXJhbXNba2V5XTtcbiAgICB9XG4gICAgc2F2ZSgpO1xuICB9XG5cblxuICAvL2ZvciB0ZXN0aW5nXG4gIGNvbnN0IGZldGNoX3JhdyA9ICgpID0+IHtcbiAgICByZXR1cm4gY2FiYmFnZV9kYjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGFyc2VfdWlkLFxuICAgIHVpZF90b19zLFxuICAgIHJlcXVlc3RfdWlkLFxuICAgIG1lcmdlX3VpZCxcbiAgICBmZXRjaCxcbiAgICBmZXRjaEZpZWxkcyxcbiAgICBpbnNlcnQsXG4gICAgYWRkX2ZpZWxkLFxuICAgIGFkZF9oZWFkLFxuICAgIGFkZF9sZWFmLFxuICAgIHVwZGF0ZV9pdGVtLFxuICAgIHNhdmUsXG4gICAgbG9hZCxcbiAgICBmZXRjaF9yYXcsXG4gICAgaW5pdGlhbGl6ZSxcbiAgfVxufSkoKVxuXG5leHBvcnQgeyBkYiBhcyBkZWZhdWx0IH07IiwiaW1wb3J0IHsgRmllbGQsIEhlYWQsIExlYWYsIGhhc0NoaWxkcmVuIH0gZnJvbSAnLi9vYmplY3RzJztcbmltcG9ydCB7IGZvcm1hdCwgfSBmcm9tICdkYXRlLWZucydcblxuLy8gYSBiYXNpYyBsaWJyYXJ5IGZvciBnbG9iYWwgZWxlbWVudHMgYW5kIHJldXNhYmxlIGZ1bmN0aW9uc1xuY29uc3QgZWxlbWVudHMgPSAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgbWFpbiA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWNvbnRhaW5lcicpLFxuICAgIG5hdiA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtY29udGFpbmVyJyksXG4gICAgc3RhdGljX2xpbmtzIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXRpYy1saW5rcycpLFxuICAgIGZpZWxkX2xpbmtzIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpZWxkLWxpbmtzJyksXG4gICAgY29udGVudCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50LWNvbnRhaW5lcicpLFxuICAgIGZvb3RlciA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXItY29udGFpbmVyJyksXG5cbiAgICBiYXNpYyh0eXBlLCBjbGFzc05hbWU9dW5kZWZpbmVkLCBpZD11bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG4gICAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGNsYXNzTmFtZS5zcGxpdCgnLCcpLmZvckVhY2goY05hbWUgPT4ge1xuICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKGNOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9IFxuICAgICAgaWYgKGlkKSBkaXYuaWQgPSBpZDtcbiAgICAgIHJldHVybiBkaXY7XG4gICAgfSxcblxuICB9XG59KSgpXG5cbi8vIGEgd2F5IHRvIHJlbmRlciBvYmplY3RzIGludG8gYXBwcm9wcmlhdGUgZG9tIGVsZW1lbnRzXG5jb25zdCByZW5kZXIgPSAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG5cbiAgICBsZWFmKGxlYWYpIHtcbiAgICAgIGNvbnN0IGxlYWZDb250YWluZXIgPSBlbGVtZW50cy5iYXNpYygnZGl2JywgJ2xlYWYnKTtcbiAgICAgIGxlYWZDb250YWluZXIuZGF0YXNldC51aWQgPSBsZWFmLnVpZDtcblxuICAgICAgY29uc3QgbmFtZSA9IGVsZW1lbnRzLmJhc2ljKCdwJywgJ25hbWUnKTtcbiAgICAgIG5hbWUuaW5uZXJIVE1MID0gbGVhZi5uYW1lO1xuICAgICAgbGVhZkNvbnRhaW5lci5hcHBlbmRDaGlsZChuYW1lKTtcblxuICAgICAgLy8gYWRkIGNoZWNrYm94IGFuZCBkdWUgZGF0ZS9lZGl0IGhlcmVcblxuICAgICAgcmV0dXJuIGxlYWZDb250YWluZXI7XG4gICAgfSxcblxuICAgIGhlYWQoaGVhZCwgcmVuZGVyQ2hpbGRyZW49dHJ1ZSkge1xuICAgICAgY29uc3QgaGVhZENvbnRhaW5lciA9IGVsZW1lbnRzLmJhc2ljKCdkaXYnLCAnaGVhZCcpO1xuICAgICAgaGVhZENvbnRhaW5lci5kYXRhc2V0LnVpZCA9IGhlYWQudWlkO1xuXG4gICAgICBjb25zdCB0b3BDb250YWluZXIgPSBlbGVtZW50cy5iYXNpYygnZGl2JywgJ3RvcC1jb250YWluZXInKTtcbiAgICAgIGNvbnN0IGhlYWRpbmcgPSBlbGVtZW50cy5iYXNpYygnaDMnLCAndGl0bGUnKTtcbiAgICAgIGhlYWRpbmcuaW5uZXJIVE1MID0gaGVhZC5uYW1lO1xuICAgICAgdG9wQ29udGFpbmVyLmFwcGVuZENoaWxkKGhlYWRpbmcpO1xuICAgICAgaGVhZENvbnRhaW5lci5hcHBlbmRDaGlsZCh0b3BDb250YWluZXIpO1xuXG4gICAgICBjb25zdCBjb250ZW50Q29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdjb250ZW50Jyk7XG5cbiAgICAgIGNvbnN0IGluZm8gPSBlbGVtZW50cy5iYXNpYygncCcsICdpbmZvJyk7XG4gICAgICBpbmZvLmlubmVySFRNTCA9IGhlYWQuaW5mbztcbiAgICAgIGNvbnRlbnRDb250YWluZXIuYXBwZW5kQ2hpbGQoaW5mbyk7XG5cbiAgICAgIGlmKHJlbmRlckNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdjaGlsZC1jb250YWluZXInKTtcbiAgICAgICAgaWYoaGFzQ2hpbGRyZW4oaGVhZCkpIHtcbiAgICAgICAgICBmb3IobGV0IGNoaWxkIGluIGhlYWQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkTGVhZiA9IHRoaXMubGVhZihoZWFkLmNoaWxkcmVuW2NoaWxkXSk7XG4gICAgICAgICAgICBjaGlsZENvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZExlYWYpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb250ZW50Q29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkQ29udGFpbmVyKTtcbiAgICAgIH1cblxuICAgICAgaGVhZENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250ZW50Q29udGFpbmVyKTtcblxuXG4gICAgICBjb25zdCBhY3Rpb25Db250YWluZXIgPSBlbGVtZW50cy5iYXNpYygnZGl2JywgJ2FjdGlvbi1jb250YWluZXInKTtcbiAgICAgIC8vIGFkZCBkYXRlIGVsZW1lbnQsIGNoZWNrIGJveCwgYW5kIGVkaXQgb3B0aW9ucyBoZXJlXG5cbiAgICAgIGhlYWRDb250YWluZXIuYXBwZW5kQ2hpbGQoYWN0aW9uQ29udGFpbmVyKVxuICAgICAgcmV0dXJuIGhlYWRDb250YWluZXI7XG4gICAgfSxcblxuICAgIGZpZWxkSGVhZGluZyhmaWVsZCwgc2l6ZT0naDInKSB7XG4gICAgICBjb25zdCBoZWFkaW5nID0gZWxlbWVudHMuYmFzaWMoc2l6ZSwgJ2ZpZWxkLWhlYWRpbmcnKTtcbiAgICAgIGhlYWRpbmcuaW5uZXJIVE1MID0gZmllbGQubmFtZTtcbiAgICAgIHJldHVybiBoZWFkaW5nO1xuICAgIH0sXG5cbiAgICBmaWVsZE5hdihmaWVsZCkge1xuICAgICAgY29uc3QgbGluayA9IGVsZW1lbnRzLmJhc2ljKCdhJywgJ2ZpZWxkLWxpbmsnKTtcbiAgICAgIGxpbmsuaW5uZXJIVE1MID0gZmllbGQubmFtZTtcbiAgICAgIHJldHVybiBsaW5rO1xuICAgIH0sXG5cbiAgfVxufSkoKVxuXG5leHBvcnQgeyBlbGVtZW50cywgcmVuZGVyLCB9OyIsImltcG9ydCBkYiBmcm9tICcuL2RhdGEnO1xuaW1wb3J0IHsgRmllbGQsIEhlYWQsIExlYWYsIGhhc0NoaWxkcmVuIH0gZnJvbSAnLi9vYmplY3RzJztcbmltcG9ydCB7IGVsZW1lbnRzLCByZW5kZXIsfSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgY29udHJvbGxlciBmcm9tICcuL2NvbnRyb2xsZXInO1xuXG5cbmRiLmluaXRpYWxpemUoKTtcblxuaWYoIWRiLmZldGNoX3JhdygpLmZpZWxkc1swXSkge1xuICBkYi5hZGRfZmllbGQoJ0dlbmVyYWwnKTtcbiAgZGIuYWRkX2hlYWQoJzAnLCAnVGVzdCBoZWFkMCcsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQxJywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9oZWFkKCcwJywgJ1Rlc3QgaGVhZDInLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2ZpZWxkKCdmaWVsZCAxJyk7XG4gIGRiLmFkZF9oZWFkKCcxJywgJ1Rlc3QgaGVhZDMnLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2ZpZWxkKCdmaWVsZCAyJyk7XG4gIGRiLmFkZF9oZWFkKCcyJywgJ1Rlc3QgaGVhZDQnLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2xlYWYoJzEtMycsICdsZWFmIDAnLCBmYWxzZSk7XG59XG5cbmNvbnRyb2xsZXIuaW5pdEZpZWxkcygpO1xuXG5jb25zdCB0ZXN0SGVhZCA9IGRiLmZldGNoKCcxLTMnKTtcbmVsZW1lbnRzLmNvbnRlbnQuYXBwZW5kQ2hpbGQocmVuZGVyLmhlYWQodGVzdEhlYWQpKTtcblxuXG5cblxuXG5cbiIsImZ1bmN0aW9uIEZpZWxkKG5hbWUpIHtcbiAgcmV0dXJuIHtcbiAgICB1aWQgOiBudWxsLFxuICAgIHR5cGUgOiAnZmllbGQnLFxuICAgIG5hbWUsXG4gICAgY2hpbGRyZW4gOiB7fSxcbiAgfVxufVxuXG5mdW5jdGlvbiBIZWFkKG5hbWUsIGluZm8sIGR1ZT1mYWxzZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdoZWFkJyxcbiAgICBjaGlsZHJlbiA6IHt9LFxuICAgIGNvbXBsZXRlIDogZmFsc2UsXG4gICAgbmFtZSxcbiAgICBpbmZvLFxuICAgIGR1ZSxcbiAgfVxufVxuXG5mdW5jdGlvbiBMZWFmKG5hbWUsIGR1ZT1mYWxzZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdsZWFmJyxcbiAgICBjb21wbGV0ZSA6IGZhbHNlLFxuICAgIG5hbWUsXG4gICAgZHVlLFxuICB9XG59XG5cbmZ1bmN0aW9uIGhhc0NoaWxkcmVuKG9iamVjdCkge1xuICBpZighb2JqZWN0IHx8ICFvYmplY3QuY2hpbGRyZW4pIHJldHVybiBmYWxzZTtcbiAgY29uc3QgY2hpbGRyZW4gPSBvYmplY3QuY2hpbGRyZW47XG5cbiAgZm9yKGxldCBrZXkgaW4gY2hpbGRyZW4pIHtcbiAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==