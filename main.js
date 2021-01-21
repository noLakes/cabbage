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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9kYXRhLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9vYmplY3RzLmpzIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUF3QjtBQUNtQztBQUNsQjs7QUFFekM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUMEQ7O0FBRTNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDLFVBQVU7QUFDM0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLCtDQUFLO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDhDQUFJO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLDhDQUFJO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakkwRDs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsTztBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLHFEQUFXO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBLEtBQUs7O0FBRUw7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3JGdUI7QUFDbUM7QUFDbEI7QUFDSDs7O0FBR3RDLHFEQUFhOztBQUViLElBQUksb0RBQVk7QUFDaEIsRUFBRSxvREFBWTtBQUNkLEVBQUUsbURBQVc7QUFDYixFQUFFLG1EQUFXO0FBQ2IsRUFBRSxtREFBVztBQUNiLEVBQUUsb0RBQVk7QUFDZCxFQUFFLG1EQUFXO0FBQ2IsRUFBRSxvREFBWTtBQUNkLEVBQUUsbURBQVc7QUFDYixFQUFFLG1EQUFXO0FBQ2I7O0FBRUEsaUJBQWlCLGdEQUFRO0FBQ3pCLDhEQUE0QixDQUFDLDZDQUFXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQnhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O1VDeENBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRiIGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiwgaGFzQ2hpbGRyZW4gfSBmcm9tICcuL29iamVjdHMnO1xuaW1wb3J0IHsgZWxlbWVudHMsIHJlbmRlcix9IGZyb20gJy4vZG9tJztcblxuLy8gYSBsb2dpYyBjb250cm9sbGVyIGZvciB0aGUgZGlmZmVyZW50IHdheXMgeW91IG1pZ2h0IHdhbnQgdG8gcmVuZGVyL3Nob3cgdGhlIGNvbnRlbnRcbmNvbnN0IGNvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG5cbiAgfVxufSkoKVxuXG5leHBvcnQgeyBjb250cm9sbGVyIGFzIGRlZmF1bHQgfTsiLCJpbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiwgaGFzQ2hpbGRyZW4gfSBmcm9tICcuL29iamVjdHMnO1xuXG4vLyBtb2R1bGUgZm9yIHNldHRpbmcgdXAgYW5kIGludGVyYWN0aW5nIHdpdGggZGF0YWJhc2Vcbi8vIHRvIGFkZDogZmlyZWJhc2UgLyBjaGVjayBsb2NhbCBzdG9yYWdlIHZpYWJsZSAvIHNldHVwIGZ1bmN0aW9uIGZvciBwYWdlIGxvYWRcbmNvbnN0IGRiID0gKGZ1bmN0aW9uKCkge1xuICBsZXQgY2FiYmFnZV9kYiA9IG51bGw7XG4gIFxuICBjb25zdCBuZXdEYiA9ICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgZmllbGRzIDoge30sXG4gICAgICB1aWRzIDoge1xuICAgICAgICBmaWVsZCA6IC0xLFxuICAgICAgICBoZWFkIDogLTEsXG4gICAgICAgIGxlYWYgOiAtMSxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBzYXZlID0gKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYWJiYWdlX2RiJywgSlNPTi5zdHJpbmdpZnkoY2FiYmFnZV9kYikpO1xuICB9XG5cbiAgY29uc3QgbG9hZCA9ICgpID0+IHtcbiAgICBpZihsb2NhbFN0b3JhZ2VbJ2NhYmJhZ2VfZGInXSkge1xuICAgICAgY2FiYmFnZV9kYiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pO1xuICAgICAgY29uc29sZS5sb2coJ2RiIGxvYWRlZCcpO1xuICAgICAgY29uc29sZS5sb2coY2FiYmFnZV9kYik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGluaXRpYWxpemUgPSAoKSA9PiB7XG4gICAgaWYoIWxvYWQoKSkge1xuICAgICAgY2FiYmFnZV9kYiA9IG5ld0RiKCk7XG4gICAgICBzYXZlKCk7XG4gICAgICBjb25zb2xlLmxvZygnbmV3IGRiIGluaXRpYWxpemVkJyk7XG4gICAgICBjb25zb2xlLmxvZyhjYWJiYWdlX2RiKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBwYXJzZV91aWQgPSAodWlkKSA9PiB7XG4gICAgcmV0dXJuIHVpZC5zcGxpdCgnLScpLm1hcChpID0+IE51bWJlcihpKSk7XG4gIH1cblxuICBjb25zdCB1aWRfdG9fcyA9ICh1aWQpID0+IHtcbiAgICByZXR1cm4gdWlkLmpvaW4oJy0nKTtcbiAgfVxuXG4gIGNvbnN0IHJlcXVlc3RfdWlkID0gKHR5cGUpID0+IHtcbiAgICBjYWJiYWdlX2RiWyd1aWRzJ11bdHlwZV0gKz0gMTtcbiAgICByZXR1cm4gU3RyaW5nKGNhYmJhZ2VfZGJbJ3VpZHMnXVt0eXBlXSk7XG4gIH1cblxuICBjb25zdCBtZXJnZV91aWQgPSAocGFyZW50X3VpZCwgY2hpbGRfdWlkKSA9PiB7XG4gICAgcmV0dXJuIHBhcmVudF91aWQuY29uY2F0KGAtJHtjaGlsZF91aWR9YCk7XG4gIH1cblxuICBjb25zdCBmZXRjaCA9ICh1aWQpID0+IHtcbiAgICBpZih0eXBlb2YodWlkKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdWlkID0gcGFyc2VfdWlkKHVpZCk7XG4gICAgfVxuICAgIGlmICh1aWQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgbGV0IHJlc3VsdCA9IGNhYmJhZ2VfZGIuZmllbGRzW3VpZC5zaGlmdCgpXTtcbiAgICB3aGlsZSh1aWQubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0LmNoaWxkcmVuW3VpZC5zaGlmdCgpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGNvbnN0IGluc2VydCA9IChwYXJlbnQsIGNoaWxkKSA9PiB7XG4gICAgY29uc3QgY2hpbGRfa2V5ID0gcGFyc2VfdWlkKGNoaWxkLnVpZCkucG9wKCk7XG4gICAgcGFyZW50LmNoaWxkcmVuW2NoaWxkX2tleV0gPSBjaGlsZDtcbiAgICBzYXZlKCk7XG4gIH1cblxuICBjb25zdCBhZGRfZmllbGQgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IGZpZWxkID0gRmllbGQobmFtZSk7XG4gICAgZmllbGQudWlkID0gcmVxdWVzdF91aWQoJ2ZpZWxkJyk7XG4gICAgY2FiYmFnZV9kYi5maWVsZHNbcGFyc2VfdWlkKGZpZWxkLnVpZClbMF1dID0gZmllbGQ7XG4gICAgc2F2ZSgpO1xuICB9XG5cbiAgY29uc3QgYWRkX2hlYWQgPSAocGFyZW50X3VpZCwgbmFtZSwgaW5mbywgZHVlKSA9PiB7XG4gICAgY29uc3QgaGVhZCA9IEhlYWQobmFtZSwgaW5mbywgZHVlKTtcbiAgICBjb25zdCBwYXJlbnQgPSBmZXRjaChwYXJlbnRfdWlkKTtcbiAgICBoZWFkLnVpZCA9IG1lcmdlX3VpZChwYXJlbnQudWlkLCByZXF1ZXN0X3VpZCgnaGVhZCcpKTtcbiAgICBpbnNlcnQocGFyZW50LCBoZWFkKTtcbiAgfVxuXG4gIGNvbnN0IGFkZF9sZWFmID0gKHBhcmVudF91aWQsIG5hbWUsIGR1ZSkgPT4ge1xuICAgIGNvbnN0IGxlYWYgPSBMZWFmKG5hbWUsIGR1ZSk7XG4gICAgY29uc3QgcGFyZW50ID0gZmV0Y2gocGFyZW50X3VpZCk7XG4gICAgbGVhZi51aWQgPSBtZXJnZV91aWQocGFyZW50LnVpZCwgcmVxdWVzdF91aWQoJ2xlYWYnKSk7XG4gICAgaW5zZXJ0KHBhcmVudCwgbGVhZik7XG4gIH1cblxuICAvLyBuZWVkcyB0byBiZSB0ZXN0ZWQgZnVydGhlciBvbmNlIERPTSBldmVudCBsaXN0ZW5lcnMgYmVnaW4gY2FsbGluZyBpdFxuICBjb25zdCB1cGRhdGVfaXRlbSA9ICh1aWQsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSBmZXRjaCh1aWQpO1xuICAgIGZvcihjb25zdCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICBpdGVtW2tleV0gPSBwYXJhbXNba2V5XTtcbiAgICB9XG4gICAgc2F2ZSgpO1xuICB9XG5cblxuICAvL2ZvciB0ZXN0aW5nXG4gIGNvbnN0IGZldGNoX3JhdyA9ICgpID0+IHtcbiAgICByZXR1cm4gY2FiYmFnZV9kYjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGFyc2VfdWlkLFxuICAgIHVpZF90b19zLFxuICAgIHJlcXVlc3RfdWlkLFxuICAgIG1lcmdlX3VpZCxcbiAgICBmZXRjaCxcbiAgICBpbnNlcnQsXG4gICAgYWRkX2ZpZWxkLFxuICAgIGFkZF9oZWFkLFxuICAgIGFkZF9sZWFmLFxuICAgIHVwZGF0ZV9pdGVtLFxuICAgIHNhdmUsXG4gICAgbG9hZCxcbiAgICBmZXRjaF9yYXcsXG4gICAgaW5pdGlhbGl6ZSxcbiAgfVxufSkoKVxuXG5leHBvcnQgeyBkYiBhcyBkZWZhdWx0IH07IiwiaW1wb3J0IHsgRmllbGQsIEhlYWQsIExlYWYsIGhhc0NoaWxkcmVuIH0gZnJvbSAnLi9vYmplY3RzJztcblxuLy8gYSBiYXNpYyBsaWJyYXJ5IGZvciBnbG9iYWwgZWxlbWVudHMgYW5kIHJldXNhYmxlIGZ1bmN0aW9uc1xuY29uc3QgZWxlbWVudHMgPSAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgbWFpbiA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWNvbnRhaW5lcicpLFxuICAgIG5hdiA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXYtY29udGFpbmVyJyksXG4gICAgc3RhdGljX2xpbmtzIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXRpYy1saW5rcycpLFxuICAgIGZpZWxkX2xpbmtzIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZpZWxkLWxpbmtzJyksXG4gICAgY29udGVudCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50LWNvbnRhaW5lcicpLFxuICAgIGZvb3RlciA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXItY29udGFpbmVyJyksXG5cbiAgICBiYXNpYyh0eXBlLCBjbGFzc05hbWU9dW5kZWZpbmVkLCBpZD11bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG4gICAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGNsYXNzTmFtZS5zcGxpdCgnLCcpLmZvckVhY2goY05hbWUgPT4ge1xuICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKGNOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9IFxuICAgICAgaWYgKGlkKSBkaXYuaWQgPSBpZDtcbiAgICAgIHJldHVybiBkaXY7XG4gICAgfSxcblxuICB9XG59KSgpXG5cbi8vIGEgd2F5IHRvIHJlbmRlciBvYmplY3RzIGludG8gYXBwcm9wcmlhdGUgZG9tIGVsZW1lbnRzXG5jb25zdCByZW5kZXIgPSAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG5cbiAgICBsZWFmKGxlYWYpIHtcbiAgICAgIGNvbnN0IGxlYWZDb250YWluZXIgPSBlbGVtZW50cy5iYXNpYygnZGl2JywgJ2xlYWYnKTtcbiAgICAgIGxlYWZDb250YWluZXIuZGF0YXNldC51aWQgPSBsZWFmLnVpZDtcblxuICAgICAgY29uc3QgbmFtZSA9IGVsZW1lbnRzLmJhc2ljKCdwJywgJ25hbWUnKTtcbiAgICAgIG5hbWUuaW5uZXJIVE1MID0gbGVhZi5uYW1lO1xuICAgICAgbGVhZkNvbnRhaW5lci5hcHBlbmRDaGlsZChuYW1lKTtcblxuICAgICAgLy8gYWRkIGNoZWNrYm94IGFuZCBkdWUgZGF0ZS9lZGl0IGhlcmVcblxuICAgICAgcmV0dXJuIGxlYWZDb250YWluZXI7XG4gICAgfSxcblxuICAgIGhlYWQoaGVhZCwgcmVuZGVyQ2hpbGRyZW49dHJ1ZSkge1xuICAgICAgY29uc3QgaGVhZENvbnRhaW5lciA9IGVsZW1lbnRzLmJhc2ljKCdkaXYnLCAnaGVhZCcpO1xuICAgICAgaGVhZENvbnRhaW5lci5kYXRhc2V0LnVpZCA9IGhlYWQudWlkO1xuXG4gICAgICBjb25zdCB0b3BDb250YWluZXIgPSBlbGVtZW50cy5iYXNpYygnZGl2JywgJ3RvcC1jb250YWluZXInKTtcbiAgICAgIGNvbnN0IGhlYWRpbmcgPSBlbGVtZW50cy5iYXNpYygnaDMnLCAndGl0bGUnKTtcbiAgICAgIGhlYWRpbmcuaW5uZXJIVE1MID0gaGVhZC5uYW1lO1xuICAgICAgdG9wQ29udGFpbmVyLmFwcGVuZENoaWxkKGhlYWRpbmcpO1xuICAgICAgaGVhZENvbnRhaW5lci5hcHBlbmRDaGlsZCh0b3BDb250YWluZXIpO1xuXG4gICAgICBjb25zdCBjb250ZW50Q29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdjb250ZW50Jyk7XG5cbiAgICAgIGNvbnN0IGluZm8gPSBlbGVtZW50cy5iYXNpYygncCcsICdpbmZvJyk7XG4gICAgICBpbmZvLmlubmVySFRNTCA9IGhlYWQuaW5mbztcbiAgICAgIGNvbnRlbnRDb250YWluZXIuYXBwZW5kQ2hpbGQoaW5mbyk7XG5cbiAgICAgIGlmKHJlbmRlckNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkQ29udGFpbmVyID0gZWxlbWVudHMuYmFzaWMoJ2RpdicsICdjaGlsZC1jb250YWluZXInKTtcbiAgICAgICAgaWYoaGFzQ2hpbGRyZW4oaGVhZCkpIHtcbiAgICAgICAgICBmb3IobGV0IGNoaWxkIGluIGhlYWQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkTGVhZiA9IHRoaXMubGVhZihoZWFkLmNoaWxkcmVuW2NoaWxkXSk7XG4gICAgICAgICAgICBjaGlsZENvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZExlYWYpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb250ZW50Q29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkQ29udGFpbmVyKTtcbiAgICAgIH1cblxuICAgICAgaGVhZENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250ZW50Q29udGFpbmVyKTtcblxuXG4gICAgICBjb25zdCBhY3Rpb25Db250YWluZXIgPSBlbGVtZW50cy5iYXNpYygnZGl2JywgJ2FjdGlvbi1jb250YWluZXInKTtcbiAgICAgIC8vIGFkZCBkYXRlIGVsZW1lbnQsIGNoZWNrIGJveCwgYW5kIGVkaXQgb3B0aW9ucyBoZXJlXG5cbiAgICAgIGhlYWRDb250YWluZXIuYXBwZW5kQ2hpbGQoYWN0aW9uQ29udGFpbmVyKVxuICAgICAgcmV0dXJuIGhlYWRDb250YWluZXI7XG4gICAgfSxcblxuICAgIGZpZWxkKCkge1xuXG4gICAgfSxcblxuICB9XG59KSgpXG5cbmV4cG9ydCB7IGVsZW1lbnRzLCByZW5kZXIsIH07IiwiaW1wb3J0IGRiIGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiwgaGFzQ2hpbGRyZW4gfSBmcm9tICcuL29iamVjdHMnO1xuaW1wb3J0IHsgZWxlbWVudHMsIHJlbmRlcix9IGZyb20gJy4vZG9tJztcbmltcG9ydCBjb250cm9sbGVyIGZyb20gJy4vY29udHJvbGxlcic7XG5cblxuZGIuaW5pdGlhbGl6ZSgpO1xuXG5pZighZGIuZmV0Y2hfcmF3KCkuZmllbGRzWzBdKSB7XG4gIGRiLmFkZF9maWVsZCgnR2VuZXJhbCcpO1xuICBkYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQwJywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9oZWFkKCcwJywgJ1Rlc3QgaGVhZDEnLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2hlYWQoJzAnLCAnVGVzdCBoZWFkMicsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfZmllbGQoJ2ZpZWxkIDEnKTtcbiAgZGIuYWRkX2hlYWQoJzEnLCAnVGVzdCBoZWFkMycsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfZmllbGQoJ2ZpZWxkIDInKTtcbiAgZGIuYWRkX2hlYWQoJzInLCAnVGVzdCBoZWFkNCcsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfbGVhZignMS0zJywgJ2xlYWYgMCcsIGZhbHNlKTtcbn1cblxuY29uc3QgdGVzdEhlYWQgPSBkYi5mZXRjaCgnMS0zJyk7XG5lbGVtZW50cy5jb250ZW50LmFwcGVuZENoaWxkKHJlbmRlci5oZWFkKHRlc3RIZWFkKSk7XG5cblxuXG5cblxuXG4iLCJmdW5jdGlvbiBGaWVsZChuYW1lKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2ZpZWxkJyxcbiAgICBuYW1lLFxuICAgIGNoaWxkcmVuIDoge30sXG4gIH1cbn1cblxuZnVuY3Rpb24gSGVhZChuYW1lLCBpbmZvLCBkdWU9ZmFsc2UpIHtcbiAgcmV0dXJuIHtcbiAgICB1aWQgOiBudWxsLFxuICAgIHR5cGUgOiAnaGVhZCcsXG4gICAgY2hpbGRyZW4gOiB7fSxcbiAgICBjb21wbGV0ZSA6IGZhbHNlLFxuICAgIG5hbWUsXG4gICAgaW5mbyxcbiAgICBkdWUsXG4gIH1cbn1cblxuZnVuY3Rpb24gTGVhZihuYW1lLCBkdWU9ZmFsc2UpIHtcbiAgcmV0dXJuIHtcbiAgICB1aWQgOiBudWxsLFxuICAgIHR5cGUgOiAnbGVhZicsXG4gICAgY29tcGxldGUgOiBmYWxzZSxcbiAgICBuYW1lLFxuICAgIGR1ZSxcbiAgfVxufVxuXG5mdW5jdGlvbiBoYXNDaGlsZHJlbihvYmplY3QpIHtcbiAgaWYoIW9iamVjdCB8fCAhb2JqZWN0LmNoaWxkcmVuKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IGNoaWxkcmVuID0gb2JqZWN0LmNoaWxkcmVuO1xuXG4gIGZvcihsZXQga2V5IGluIGNoaWxkcmVuKSB7XG4gICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiwgaGFzQ2hpbGRyZW4gfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=