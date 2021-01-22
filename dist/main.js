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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9kYXRhLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9vYmplY3RzLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUF3QjtBQUNtQztBQUNsQjtBQUNQOztBQUVsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1YwRDtBQUN6Qjs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBaUMsVUFBVTtBQUMzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0IsK0NBQUs7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsOENBQUk7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsOENBQUk7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsSTBEO0FBQ3pCOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcscURBQVc7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4RnVCO0FBQ21DO0FBQ2xCO0FBQ0g7OztBQUd0QyxxREFBYTs7QUFFYixJQUFJLG9EQUFZO0FBQ2hCLEVBQUUsb0RBQVk7QUFDZCxFQUFFLG1EQUFXO0FBQ2IsRUFBRSxtREFBVztBQUNiLEVBQUUsbURBQVc7QUFDYixFQUFFLG9EQUFZO0FBQ2QsRUFBRSxtREFBVztBQUNiLEVBQUUsb0RBQVk7QUFDZCxFQUFFLG1EQUFXO0FBQ2IsRUFBRSxtREFBVztBQUNiOztBQUVBLGlCQUFpQixnREFBUTtBQUN6Qiw4REFBNEIsQ0FBQyw2Q0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDckJ4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztVQ3hDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkYiBmcm9tICcuL2RhdGEnO1xuaW1wb3J0IHsgRmllbGQsIEhlYWQsIExlYWYsIGhhc0NoaWxkcmVuIH0gZnJvbSAnLi9vYmplY3RzJztcbmltcG9ydCB7IGVsZW1lbnRzLCByZW5kZXIsfSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgeyBmb3JtYXQsIH0gZnJvbSAnZGF0ZS1mbnMnXG5cbi8vIGEgbG9naWMgY29udHJvbGxlciBmb3IgdGhlIGRpZmZlcmVudCB3YXlzIHlvdSBtaWdodCB3YW50IHRvIHJlbmRlci9zaG93IHRoZSBjb250ZW50XG5jb25zdCBjb250cm9sbGVyID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuXG4gIH1cbn0pKClcblxuZXhwb3J0IHsgY29udHJvbGxlciBhcyBkZWZhdWx0IH07IiwiaW1wb3J0IHsgRmllbGQsIEhlYWQsIExlYWYsIGhhc0NoaWxkcmVuIH0gZnJvbSAnLi9vYmplY3RzJztcbmltcG9ydCB7IGZvcm1hdCwgfSBmcm9tICdkYXRlLWZucydcblxuLy8gbW9kdWxlIGZvciBzZXR0aW5nIHVwIGFuZCBpbnRlcmFjdGluZyB3aXRoIGRhdGFiYXNlXG4vLyB0byBhZGQ6IGZpcmViYXNlIC8gY2hlY2sgbG9jYWwgc3RvcmFnZSB2aWFibGUgLyBzZXR1cCBmdW5jdGlvbiBmb3IgcGFnZSBsb2FkXG5jb25zdCBkYiA9IChmdW5jdGlvbigpIHtcbiAgbGV0IGNhYmJhZ2VfZGIgPSBudWxsO1xuICBcbiAgY29uc3QgbmV3RGIgPSAoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpZWxkcyA6IHt9LFxuICAgICAgdWlkcyA6IHtcbiAgICAgICAgZmllbGQgOiAtMSxcbiAgICAgICAgaGVhZCA6IC0xLFxuICAgICAgICBsZWFmIDogLTEsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc2F2ZSA9ICgpID0+IHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2FiYmFnZV9kYicsIEpTT04uc3RyaW5naWZ5KGNhYmJhZ2VfZGIpKTtcbiAgfVxuXG4gIGNvbnN0IGxvYWQgPSAoKSA9PiB7XG4gICAgaWYobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pIHtcbiAgICAgIGNhYmJhZ2VfZGIgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZVsnY2FiYmFnZV9kYiddKTtcbiAgICAgIGNvbnNvbGUubG9nKCdkYiBsb2FkZWQnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNhYmJhZ2VfZGIpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBpbml0aWFsaXplID0gKCkgPT4ge1xuICAgIGlmKCFsb2FkKCkpIHtcbiAgICAgIGNhYmJhZ2VfZGIgPSBuZXdEYigpO1xuICAgICAgc2F2ZSgpO1xuICAgICAgY29uc29sZS5sb2coJ25ldyBkYiBpbml0aWFsaXplZCcpO1xuICAgICAgY29uc29sZS5sb2coY2FiYmFnZV9kYik7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgcGFyc2VfdWlkID0gKHVpZCkgPT4ge1xuICAgIHJldHVybiB1aWQuc3BsaXQoJy0nKS5tYXAoaSA9PiBOdW1iZXIoaSkpO1xuICB9XG5cbiAgY29uc3QgdWlkX3RvX3MgPSAodWlkKSA9PiB7XG4gICAgcmV0dXJuIHVpZC5qb2luKCctJyk7XG4gIH1cblxuICBjb25zdCByZXF1ZXN0X3VpZCA9ICh0eXBlKSA9PiB7XG4gICAgY2FiYmFnZV9kYlsndWlkcyddW3R5cGVdICs9IDE7XG4gICAgcmV0dXJuIFN0cmluZyhjYWJiYWdlX2RiWyd1aWRzJ11bdHlwZV0pO1xuICB9XG5cbiAgY29uc3QgbWVyZ2VfdWlkID0gKHBhcmVudF91aWQsIGNoaWxkX3VpZCkgPT4ge1xuICAgIHJldHVybiBwYXJlbnRfdWlkLmNvbmNhdChgLSR7Y2hpbGRfdWlkfWApO1xuICB9XG5cbiAgY29uc3QgZmV0Y2ggPSAodWlkKSA9PiB7XG4gICAgaWYodHlwZW9mKHVpZCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHVpZCA9IHBhcnNlX3VpZCh1aWQpO1xuICAgIH1cbiAgICBpZiAodWlkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgIGxldCByZXN1bHQgPSBjYWJiYWdlX2RiLmZpZWxkc1t1aWQuc2hpZnQoKV07XG4gICAgd2hpbGUodWlkLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5jaGlsZHJlblt1aWQuc2hpZnQoKV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBjb25zdCBpbnNlcnQgPSAocGFyZW50LCBjaGlsZCkgPT4ge1xuICAgIGNvbnN0IGNoaWxkX2tleSA9IHBhcnNlX3VpZChjaGlsZC51aWQpLnBvcCgpO1xuICAgIHBhcmVudC5jaGlsZHJlbltjaGlsZF9rZXldID0gY2hpbGQ7XG4gICAgc2F2ZSgpO1xuICB9XG5cbiAgY29uc3QgYWRkX2ZpZWxkID0gKG5hbWUpID0+IHtcbiAgICBjb25zdCBmaWVsZCA9IEZpZWxkKG5hbWUpO1xuICAgIGZpZWxkLnVpZCA9IHJlcXVlc3RfdWlkKCdmaWVsZCcpO1xuICAgIGNhYmJhZ2VfZGIuZmllbGRzW3BhcnNlX3VpZChmaWVsZC51aWQpWzBdXSA9IGZpZWxkO1xuICAgIHNhdmUoKTtcbiAgfVxuXG4gIGNvbnN0IGFkZF9oZWFkID0gKHBhcmVudF91aWQsIG5hbWUsIGluZm8sIGR1ZSkgPT4ge1xuICAgIGNvbnN0IGhlYWQgPSBIZWFkKG5hbWUsIGluZm8sIGR1ZSk7XG4gICAgY29uc3QgcGFyZW50ID0gZmV0Y2gocGFyZW50X3VpZCk7XG4gICAgaGVhZC51aWQgPSBtZXJnZV91aWQocGFyZW50LnVpZCwgcmVxdWVzdF91aWQoJ2hlYWQnKSk7XG4gICAgaW5zZXJ0KHBhcmVudCwgaGVhZCk7XG4gIH1cblxuICBjb25zdCBhZGRfbGVhZiA9IChwYXJlbnRfdWlkLCBuYW1lLCBkdWUpID0+IHtcbiAgICBjb25zdCBsZWFmID0gTGVhZihuYW1lLCBkdWUpO1xuICAgIGNvbnN0IHBhcmVudCA9IGZldGNoKHBhcmVudF91aWQpO1xuICAgIGxlYWYudWlkID0gbWVyZ2VfdWlkKHBhcmVudC51aWQsIHJlcXVlc3RfdWlkKCdsZWFmJykpO1xuICAgIGluc2VydChwYXJlbnQsIGxlYWYpO1xuICB9XG5cbiAgLy8gbmVlZHMgdG8gYmUgdGVzdGVkIGZ1cnRoZXIgb25jZSBET00gZXZlbnQgbGlzdGVuZXJzIGJlZ2luIGNhbGxpbmcgaXRcbiAgY29uc3QgdXBkYXRlX2l0ZW0gPSAodWlkLCBwYXJhbXMpID0+IHtcbiAgICBjb25zdCBpdGVtID0gZmV0Y2godWlkKTtcbiAgICBmb3IoY29uc3Qga2V5IGluIHBhcmFtcykge1xuICAgICAgaXRlbVtrZXldID0gcGFyYW1zW2tleV07XG4gICAgfVxuICAgIHNhdmUoKTtcbiAgfVxuXG5cbiAgLy9mb3IgdGVzdGluZ1xuICBjb25zdCBmZXRjaF9yYXcgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGNhYmJhZ2VfZGI7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHBhcnNlX3VpZCxcbiAgICB1aWRfdG9fcyxcbiAgICByZXF1ZXN0X3VpZCxcbiAgICBtZXJnZV91aWQsXG4gICAgZmV0Y2gsXG4gICAgaW5zZXJ0LFxuICAgIGFkZF9maWVsZCxcbiAgICBhZGRfaGVhZCxcbiAgICBhZGRfbGVhZixcbiAgICB1cGRhdGVfaXRlbSxcbiAgICBzYXZlLFxuICAgIGxvYWQsXG4gICAgZmV0Y2hfcmF3LFxuICAgIGluaXRpYWxpemUsXG4gIH1cbn0pKClcblxuZXhwb3J0IHsgZGIgYXMgZGVmYXVsdCB9OyIsImltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5pbXBvcnQgeyBmb3JtYXQsIH0gZnJvbSAnZGF0ZS1mbnMnXG5cbi8vIGEgYmFzaWMgbGlicmFyeSBmb3IgZ2xvYmFsIGVsZW1lbnRzIGFuZCByZXVzYWJsZSBmdW5jdGlvbnNcbmNvbnN0IGVsZW1lbnRzID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIG1haW4gOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1jb250YWluZXInKSxcbiAgICBuYXYgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2LWNvbnRhaW5lcicpLFxuICAgIHN0YXRpY19saW5rcyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGF0aWMtbGlua3MnKSxcbiAgICBmaWVsZF9saW5rcyA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWVsZC1saW5rcycpLFxuICAgIGNvbnRlbnQgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGVudC1jb250YWluZXInKSxcbiAgICBmb290ZXIgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyLWNvbnRhaW5lcicpLFxuXG4gICAgYmFzaWModHlwZSwgY2xhc3NOYW1lPXVuZGVmaW5lZCwgaWQ9dW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICAgICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICBjbGFzc05hbWUuc3BsaXQoJywnKS5mb3JFYWNoKGNOYW1lID0+IHtcbiAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChjTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSBcbiAgICAgIGlmIChpZCkgZGl2LmlkID0gaWQ7XG4gICAgICByZXR1cm4gZGl2O1xuICAgIH0sXG5cbiAgfVxufSkoKVxuXG4vLyBhIHdheSB0byByZW5kZXIgb2JqZWN0cyBpbnRvIGFwcHJvcHJpYXRlIGRvbSBlbGVtZW50c1xuY29uc3QgcmVuZGVyID0gKGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuXG4gICAgbGVhZihsZWFmKSB7XG4gICAgICBjb25zdCBsZWFmQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdsZWFmJyk7XG4gICAgICBsZWFmQ29udGFpbmVyLmRhdGFzZXQudWlkID0gbGVhZi51aWQ7XG5cbiAgICAgIGNvbnN0IG5hbWUgPSBlbGVtZW50cy5iYXNpYygncCcsICduYW1lJyk7XG4gICAgICBuYW1lLmlubmVySFRNTCA9IGxlYWYubmFtZTtcbiAgICAgIGxlYWZDb250YWluZXIuYXBwZW5kQ2hpbGQobmFtZSk7XG5cbiAgICAgIC8vIGFkZCBjaGVja2JveCBhbmQgZHVlIGRhdGUvZWRpdCBoZXJlXG5cbiAgICAgIHJldHVybiBsZWFmQ29udGFpbmVyO1xuICAgIH0sXG5cbiAgICBoZWFkKGhlYWQsIHJlbmRlckNoaWxkcmVuPXRydWUpIHtcbiAgICAgIGNvbnN0IGhlYWRDb250YWluZXIgPSBlbGVtZW50cy5iYXNpYygnZGl2JywgJ2hlYWQnKTtcbiAgICAgIGhlYWRDb250YWluZXIuZGF0YXNldC51aWQgPSBoZWFkLnVpZDtcblxuICAgICAgY29uc3QgdG9wQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICd0b3AtY29udGFpbmVyJyk7XG4gICAgICBjb25zdCBoZWFkaW5nID0gZWxlbWVudHMuYmFzaWMoJ2gzJywgJ3RpdGxlJyk7XG4gICAgICBoZWFkaW5nLmlubmVySFRNTCA9IGhlYWQubmFtZTtcbiAgICAgIHRvcENvbnRhaW5lci5hcHBlbmRDaGlsZChoZWFkaW5nKTtcbiAgICAgIGhlYWRDb250YWluZXIuYXBwZW5kQ2hpbGQodG9wQ29udGFpbmVyKTtcblxuICAgICAgY29uc3QgY29udGVudENvbnRhaW5lciA9IGVsZW1lbnRzLmJhc2ljKCdkaXYnLCAnY29udGVudCcpO1xuXG4gICAgICBjb25zdCBpbmZvID0gZWxlbWVudHMuYmFzaWMoJ3AnLCAnaW5mbycpO1xuICAgICAgaW5mby5pbm5lckhUTUwgPSBoZWFkLmluZm87XG4gICAgICBjb250ZW50Q29udGFpbmVyLmFwcGVuZENoaWxkKGluZm8pO1xuXG4gICAgICBpZihyZW5kZXJDaGlsZHJlbikge1xuICAgICAgICBjb25zdCBjaGlsZENvbnRhaW5lciA9IGVsZW1lbnRzLmJhc2ljKCdkaXYnLCAnY2hpbGQtY29udGFpbmVyJyk7XG4gICAgICAgIGlmKGhhc0NoaWxkcmVuKGhlYWQpKSB7XG4gICAgICAgICAgZm9yKGxldCBjaGlsZCBpbiBoZWFkLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZExlYWYgPSB0aGlzLmxlYWYoaGVhZC5jaGlsZHJlbltjaGlsZF0pO1xuICAgICAgICAgICAgY2hpbGRDb250YWluZXIuYXBwZW5kQ2hpbGQoY2hpbGRMZWFmKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29udGVudENvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZENvbnRhaW5lcik7XG4gICAgICB9XG5cbiAgICAgIGhlYWRDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGVudENvbnRhaW5lcik7XG5cblxuICAgICAgY29uc3QgYWN0aW9uQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdhY3Rpb24tY29udGFpbmVyJyk7XG4gICAgICAvLyBhZGQgZGF0ZSBlbGVtZW50LCBjaGVjayBib3gsIGFuZCBlZGl0IG9wdGlvbnMgaGVyZVxuXG4gICAgICBoZWFkQ29udGFpbmVyLmFwcGVuZENoaWxkKGFjdGlvbkNvbnRhaW5lcilcbiAgICAgIHJldHVybiBoZWFkQ29udGFpbmVyO1xuICAgIH0sXG5cbiAgICBmaWVsZEhlYWRpbmcoZmllbGQsIHNpemU9J2gyJykge1xuICAgICAgY29uc3QgaGVhZGluZyA9IGVsZW1lbnRzLmJhc2ljKHNpemUsICdmaWVsZC1oZWFkaW5nJyk7XG4gICAgICBoZWFkaW5nLmlubmVySFRNTCA9IGZpZWxkLm5hbWU7XG4gICAgICByZXR1cm4gaGVhZGluZztcbiAgICB9LFxuXG4gIH1cbn0pKClcblxuZXhwb3J0IHsgZWxlbWVudHMsIHJlbmRlciwgfTsiLCJpbXBvcnQgZGIgZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5pbXBvcnQgeyBlbGVtZW50cywgcmVuZGVyLH0gZnJvbSAnLi9kb20nO1xuaW1wb3J0IGNvbnRyb2xsZXIgZnJvbSAnLi9jb250cm9sbGVyJztcblxuXG5kYi5pbml0aWFsaXplKCk7XG5cbmlmKCFkYi5mZXRjaF9yYXcoKS5maWVsZHNbMF0pIHtcbiAgZGIuYWRkX2ZpZWxkKCdHZW5lcmFsJyk7XG4gIGRiLmFkZF9oZWFkKCcwJywgJ1Rlc3QgaGVhZDAnLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2hlYWQoJzAnLCAnVGVzdCBoZWFkMScsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQyJywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9maWVsZCgnZmllbGQgMScpO1xuICBkYi5hZGRfaGVhZCgnMScsICdUZXN0IGhlYWQzJywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9maWVsZCgnZmllbGQgMicpO1xuICBkYi5hZGRfaGVhZCgnMicsICdUZXN0IGhlYWQ0JywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9sZWFmKCcxLTMnLCAnbGVhZiAwJywgZmFsc2UpO1xufVxuXG5jb25zdCB0ZXN0SGVhZCA9IGRiLmZldGNoKCcxLTMnKTtcbmVsZW1lbnRzLmNvbnRlbnQuYXBwZW5kQ2hpbGQocmVuZGVyLmhlYWQodGVzdEhlYWQpKTtcblxuXG5cblxuXG5cbiIsImZ1bmN0aW9uIEZpZWxkKG5hbWUpIHtcbiAgcmV0dXJuIHtcbiAgICB1aWQgOiBudWxsLFxuICAgIHR5cGUgOiAnZmllbGQnLFxuICAgIG5hbWUsXG4gICAgY2hpbGRyZW4gOiB7fSxcbiAgfVxufVxuXG5mdW5jdGlvbiBIZWFkKG5hbWUsIGluZm8sIGR1ZT1mYWxzZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdoZWFkJyxcbiAgICBjaGlsZHJlbiA6IHt9LFxuICAgIGNvbXBsZXRlIDogZmFsc2UsXG4gICAgbmFtZSxcbiAgICBpbmZvLFxuICAgIGR1ZSxcbiAgfVxufVxuXG5mdW5jdGlvbiBMZWFmKG5hbWUsIGR1ZT1mYWxzZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdsZWFmJyxcbiAgICBjb21wbGV0ZSA6IGZhbHNlLFxuICAgIG5hbWUsXG4gICAgZHVlLFxuICB9XG59XG5cbmZ1bmN0aW9uIGhhc0NoaWxkcmVuKG9iamVjdCkge1xuICBpZighb2JqZWN0IHx8ICFvYmplY3QuY2hpbGRyZW4pIHJldHVybiBmYWxzZTtcbiAgY29uc3QgY2hpbGRyZW4gPSBvYmplY3QuY2hpbGRyZW47XG5cbiAgZm9yKGxldCBrZXkgaW4gY2hpbGRyZW4pIHtcbiAgICBpZihjaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LmpzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnZXhwb3J0cycgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuIl0sInNvdXJjZVJvb3QiOiIifQ==