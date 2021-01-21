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
const controller = (function() {
  return {

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

    },

    head(head) {
      const container = elements.basic('div', 'head');
      container.dataset.uid = head.uid;

      const topContainer = elements.basic('div', 'top-container');
      const heading = elements.basic('h3', 'title');
      heading.innerHTML = head.name;
      topContainer.appendChild(heading);

      const contentContainer = elements.basic('div', 'content');

      const childContainer = elements.basic('div', 'child-container,empty');

    },

    field() {

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9kYXRhLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9vYmplY3RzLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUF3QjtBQUNtQztBQUNsQjs7QUFFekM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUMEQ7O0FBRTNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDLFVBQVU7QUFDM0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLCtDQUFLO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDhDQUFJO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDhDQUFJO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakkwRDs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsTztBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDs7QUFFQSxLQUFLOztBQUVMO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0RHVCO0FBQ21DO0FBQ2xCO0FBQ0g7OztBQUd0QyxxREFBYTs7QUFFYixJQUFJLG9EQUFZO0FBQ2hCLEVBQUUsb0RBQVk7QUFDZCxFQUFFLG1EQUFXO0FBQ2IsRUFBRSxtREFBVztBQUNiLEVBQUUsbURBQVc7QUFDYixFQUFFLG9EQUFZO0FBQ2QsRUFBRSxtREFBVztBQUNiLEVBQUUsb0RBQVk7QUFDZCxFQUFFLG1EQUFXO0FBQ2IsRUFBRSxtREFBVztBQUNiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7VUN4Q0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGIgZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5pbXBvcnQgeyBlbGVtZW50cywgcmVuZGVyLH0gZnJvbSAnLi9kb20nO1xuXG4vLyBhIGxvZ2ljIGNvbnRyb2xsZXIgZm9yIHRoZSBkaWZmZXJlbnQgd2F5cyB5b3UgbWlnaHQgd2FudCB0byByZW5kZXIvc2hvdyB0aGUgY29udGVudFxuY29uc3QgY29udHJvbGxlciA9IChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcblxuICB9XG59KSgpXG5cbmV4cG9ydCB7IGNvbnRyb2xsZXIgYXMgZGVmYXVsdCB9OyIsImltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5cbi8vIG1vZHVsZSBmb3Igc2V0dGluZyB1cCBhbmQgaW50ZXJhY3Rpbmcgd2l0aCBkYXRhYmFzZVxuLy8gdG8gYWRkOiBmaXJlYmFzZSAvIGNoZWNrIGxvY2FsIHN0b3JhZ2UgdmlhYmxlIC8gc2V0dXAgZnVuY3Rpb24gZm9yIHBhZ2UgbG9hZFxuY29uc3QgZGIgPSAoZnVuY3Rpb24oKSB7XG4gIGxldCBjYWJiYWdlX2RiID0gbnVsbDtcbiAgXG4gIGNvbnN0IG5ld0RiID0gKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBmaWVsZHMgOiB7fSxcbiAgICAgIHVpZHMgOiB7XG4gICAgICAgIGZpZWxkIDogLTEsXG4gICAgICAgIGhlYWQgOiAtMSxcbiAgICAgICAgbGVhZiA6IC0xLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHNhdmUgPSAoKSA9PiB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhYmJhZ2VfZGInLCBKU09OLnN0cmluZ2lmeShjYWJiYWdlX2RiKSk7XG4gIH1cblxuICBjb25zdCBsb2FkID0gKCkgPT4ge1xuICAgIGlmKGxvY2FsU3RvcmFnZVsnY2FiYmFnZV9kYiddKSB7XG4gICAgICBjYWJiYWdlX2RiID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbJ2NhYmJhZ2VfZGInXSk7XG4gICAgICBjb25zb2xlLmxvZygnZGIgbG9hZGVkJyk7XG4gICAgICBjb25zb2xlLmxvZyhjYWJiYWdlX2RiKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaW5pdGlhbGl6ZSA9ICgpID0+IHtcbiAgICBpZighbG9hZCgpKSB7XG4gICAgICBjYWJiYWdlX2RiID0gbmV3RGIoKTtcbiAgICAgIHNhdmUoKTtcbiAgICAgIGNvbnNvbGUubG9nKCduZXcgZGIgaW5pdGlhbGl6ZWQnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNhYmJhZ2VfZGIpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHBhcnNlX3VpZCA9ICh1aWQpID0+IHtcbiAgICByZXR1cm4gdWlkLnNwbGl0KCctJykubWFwKGkgPT4gTnVtYmVyKGkpKTtcbiAgfVxuXG4gIGNvbnN0IHVpZF90b19zID0gKHVpZCkgPT4ge1xuICAgIHJldHVybiB1aWQuam9pbignLScpO1xuICB9XG5cbiAgY29uc3QgcmVxdWVzdF91aWQgPSAodHlwZSkgPT4ge1xuICAgIGNhYmJhZ2VfZGJbJ3VpZHMnXVt0eXBlXSArPSAxO1xuICAgIHJldHVybiBTdHJpbmcoY2FiYmFnZV9kYlsndWlkcyddW3R5cGVdKTtcbiAgfVxuXG4gIGNvbnN0IG1lcmdlX3VpZCA9IChwYXJlbnRfdWlkLCBjaGlsZF91aWQpID0+IHtcbiAgICByZXR1cm4gcGFyZW50X3VpZC5jb25jYXQoYC0ke2NoaWxkX3VpZH1gKTtcbiAgfVxuXG4gIGNvbnN0IGZldGNoID0gKHVpZCkgPT4ge1xuICAgIGlmKHR5cGVvZih1aWQpID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB1aWQgPSBwYXJzZV91aWQodWlkKTtcbiAgICB9XG4gICAgaWYgKHVpZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBsZXQgcmVzdWx0ID0gY2FiYmFnZV9kYi5maWVsZHNbdWlkLnNoaWZ0KCldO1xuICAgIHdoaWxlKHVpZC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQuY2hpbGRyZW5bdWlkLnNoaWZ0KCldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgY29uc3QgaW5zZXJ0ID0gKHBhcmVudCwgY2hpbGQpID0+IHtcbiAgICBjb25zdCBjaGlsZF9rZXkgPSBwYXJzZV91aWQoY2hpbGQudWlkKS5wb3AoKTtcbiAgICBwYXJlbnQuY2hpbGRyZW5bY2hpbGRfa2V5XSA9IGNoaWxkO1xuICAgIHNhdmUoKTtcbiAgfVxuXG4gIGNvbnN0IGFkZF9maWVsZCA9IChuYW1lKSA9PiB7XG4gICAgY29uc3QgZmllbGQgPSBGaWVsZChuYW1lKTtcbiAgICBmaWVsZC51aWQgPSByZXF1ZXN0X3VpZCgnZmllbGQnKTtcbiAgICBjYWJiYWdlX2RiLmZpZWxkc1twYXJzZV91aWQoZmllbGQudWlkKVswXV0gPSBmaWVsZDtcbiAgICBzYXZlKCk7XG4gIH1cblxuICBjb25zdCBhZGRfaGVhZCA9IChwYXJlbnRfdWlkLCBuYW1lLCBpbmZvLCBkdWUpID0+IHtcbiAgICBjb25zdCBoZWFkID0gSGVhZChuYW1lLCBpbmZvLCBkdWUpO1xuICAgIGNvbnN0IHBhcmVudCA9IGZldGNoKHBhcmVudF91aWQpO1xuICAgIGhlYWQudWlkID0gbWVyZ2VfdWlkKHBhcmVudC51aWQsIHJlcXVlc3RfdWlkKCdoZWFkJykpO1xuICAgIGluc2VydChwYXJlbnQsIGhlYWQpO1xuICB9XG5cbiAgY29uc3QgYWRkX2xlYWYgPSAocGFyZW50X3VpZCwgbmFtZSwgZHVlKSA9PiB7XG4gICAgY29uc3QgbGVhZiA9IExlYWYobmFtZSwgZHVlKTtcbiAgICBjb25zdCBwYXJlbnQgPSBmZXRjaChwYXJlbnRfdWlkKTtcbiAgICBsZWFmLnVpZCA9IG1lcmdlX3VpZChwYXJlbnQudWlkLCByZXF1ZXN0X3VpZCgnbGVhZicpKTtcbiAgICBpbnNlcnQocGFyZW50LCBsZWFmKTtcbiAgfVxuXG4gIC8vIG5lZWRzIHRvIGJlIHRlc3RlZCBmdXJ0aGVyIG9uY2UgRE9NIGV2ZW50IGxpc3RlbmVycyBiZWdpbiBjYWxsaW5nIGl0XG4gIGNvbnN0IHVwZGF0ZV9pdGVtID0gKHVpZCwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IGZldGNoKHVpZCk7XG4gICAgZm9yKGNvbnN0IGtleSBpbiBwYXJhbXMpIHtcbiAgICAgIGl0ZW1ba2V5XSA9IHBhcmFtc1trZXldO1xuICAgIH1cbiAgICBzYXZlKCk7XG4gIH1cblxuXG4gIC8vZm9yIHRlc3RpbmdcbiAgY29uc3QgZmV0Y2hfcmF3ID0gKCkgPT4ge1xuICAgIHJldHVybiBjYWJiYWdlX2RiO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwYXJzZV91aWQsXG4gICAgdWlkX3RvX3MsXG4gICAgcmVxdWVzdF91aWQsXG4gICAgbWVyZ2VfdWlkLFxuICAgIGZldGNoLFxuICAgIGluc2VydCxcbiAgICBhZGRfZmllbGQsXG4gICAgYWRkX2hlYWQsXG4gICAgYWRkX2xlYWYsXG4gICAgdXBkYXRlX2l0ZW0sXG4gICAgc2F2ZSxcbiAgICBsb2FkLFxuICAgIGZldGNoX3JhdyxcbiAgICBpbml0aWFsaXplLFxuICB9XG59KSgpXG5cbmV4cG9ydCB7IGRiIGFzIGRlZmF1bHQgfTsiLCJpbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiwgaGFzQ2hpbGRyZW4gfSBmcm9tICcuL29iamVjdHMnO1xuXG4vLyBhIGJhc2ljIGxpYnJhcnkgZm9yIGdsb2JhbCBlbGVtZW50cyBhbmQgcmV1c2FibGUgZnVuY3Rpb25zXG5jb25zdCBlbGVtZW50cyA9IChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICBtYWluIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tY29udGFpbmVyJyksXG4gICAgbmF2IDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdi1jb250YWluZXInKSxcbiAgICBzdGF0aWNfbGlua3MgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc3RhdGljLWxpbmtzJyksXG4gICAgZmllbGRfbGlua3MgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmllbGQtbGlua3MnKSxcbiAgICBjb250ZW50IDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRlbnQtY29udGFpbmVyJyksXG4gICAgZm9vdGVyIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3Rlci1jb250YWluZXInKSxcblxuICAgIGJhc2ljKHR5cGUsIGNsYXNzTmFtZT11bmRlZmluZWQsIGlkPXVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcbiAgICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgY2xhc3NOYW1lLnNwbGl0KCcsJykuZm9yRWFjaChjTmFtZSA9PiB7XG4gICAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoY05hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0gXG4gICAgICBpZiAoaWQpIGRpdi5pZCA9IGlkO1xuICAgICAgcmV0dXJuIGRpdjtcbiAgICB9LFxuXG4gIH1cbn0pKClcblxuLy8gYSB3YXkgdG8gcmVuZGVyIG9iamVjdHMgaW50byBhcHByb3ByaWF0ZSBkb20gZWxlbWVudHNcbmNvbnN0IHJlbmRlciA9IChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcblxuICAgIGxlYWYobGVhZikge1xuXG4gICAgfSxcblxuICAgIGhlYWQoaGVhZCkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdoZWFkJyk7XG4gICAgICBjb250YWluZXIuZGF0YXNldC51aWQgPSBoZWFkLnVpZDtcblxuICAgICAgY29uc3QgdG9wQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICd0b3AtY29udGFpbmVyJyk7XG4gICAgICBjb25zdCBoZWFkaW5nID0gZWxlbWVudHMuYmFzaWMoJ2gzJywgJ3RpdGxlJyk7XG4gICAgICBoZWFkaW5nLmlubmVySFRNTCA9IGhlYWQubmFtZTtcbiAgICAgIHRvcENvbnRhaW5lci5hcHBlbmRDaGlsZChoZWFkaW5nKTtcblxuICAgICAgY29uc3QgY29udGVudENvbnRhaW5lciA9IGVsZW1lbnRzLmJhc2ljKCdkaXYnLCAnY29udGVudCcpO1xuXG4gICAgICBjb25zdCBjaGlsZENvbnRhaW5lciA9IGVsZW1lbnRzLmJhc2ljKCdkaXYnLCAnY2hpbGQtY29udGFpbmVyLGVtcHR5Jyk7XG5cbiAgICB9LFxuXG4gICAgZmllbGQoKSB7XG5cbiAgICB9LFxuXG4gIH1cbn0pKClcblxuZXhwb3J0IHsgZWxlbWVudHMsIHJlbmRlciwgfTsiLCJpbXBvcnQgZGIgZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5pbXBvcnQgeyBlbGVtZW50cywgcmVuZGVyLH0gZnJvbSAnLi9kb20nO1xuaW1wb3J0IGNvbnRyb2xsZXIgZnJvbSAnLi9jb250cm9sbGVyJztcblxuXG5kYi5pbml0aWFsaXplKCk7XG5cbmlmKCFkYi5mZXRjaF9yYXcoKS5maWVsZHNbMF0pIHtcbiAgZGIuYWRkX2ZpZWxkKCdHZW5lcmFsJyk7XG4gIGRiLmFkZF9oZWFkKCcwJywgJ1Rlc3QgaGVhZDAnLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2hlYWQoJzAnLCAnVGVzdCBoZWFkMScsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQyJywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9maWVsZCgnZmllbGQgMScpO1xuICBkYi5hZGRfaGVhZCgnMScsICdUZXN0IGhlYWQzJywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9maWVsZCgnZmllbGQgMicpO1xuICBkYi5hZGRfaGVhZCgnMicsICdUZXN0IGhlYWQ0JywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9sZWFmKCcxLTMnLCAnbGVhZiAwJywgZmFsc2UpO1xufVxuXG5cblxuXG5cblxuIiwiZnVuY3Rpb24gRmllbGQobmFtZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdmaWVsZCcsXG4gICAgbmFtZSxcbiAgICBjaGlsZHJlbiA6IHt9LFxuICB9XG59XG5cbmZ1bmN0aW9uIEhlYWQobmFtZSwgaW5mbywgZHVlPWZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2hlYWQnLFxuICAgIGNoaWxkcmVuIDoge30sXG4gICAgY29tcGxldGUgOiBmYWxzZSxcbiAgICBuYW1lLFxuICAgIGluZm8sXG4gICAgZHVlLFxuICB9XG59XG5cbmZ1bmN0aW9uIExlYWYobmFtZSwgZHVlPWZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2xlYWYnLFxuICAgIGNvbXBsZXRlIDogZmFsc2UsXG4gICAgbmFtZSxcbiAgICBkdWUsXG4gIH1cbn1cblxuZnVuY3Rpb24gaGFzQ2hpbGRyZW4ob2JqZWN0KSB7XG4gIGlmKCFvYmplY3QgfHwgIW9iamVjdC5jaGlsZHJlbikgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBjaGlsZHJlbiA9IG9iamVjdC5jaGlsZHJlbjtcblxuICBmb3IobGV0IGtleSBpbiBjaGlsZHJlbikge1xuICAgIGlmKGNoaWxkcmVuLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IHsgRmllbGQsIEhlYWQsIExlYWYsIGhhc0NoaWxkcmVuIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9