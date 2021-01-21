/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/data.js");
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./objects */ "./src/objects.js");



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

const test1 = _data__WEBPACK_IMPORTED_MODULE_0__.default.fetch('1-3');
console.log(test1);
console.log((0,_objects__WEBPACK_IMPORTED_MODULE_1__.hasChildren)(test1));

const test2 = _data__WEBPACK_IMPORTED_MODULE_0__.default.fetch('0-2');
console.log(test2);
console.log((0,_objects__WEBPACK_IMPORTED_MODULE_1__.hasChildren)(test2));

const test3 = _data__WEBPACK_IMPORTED_MODULE_0__.default.fetch('1-3-0');
console.log(test3);
console.log((0,_objects__WEBPACK_IMPORTED_MODULE_1__.hasChildren)(test3));







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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2RhdGEuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL29iamVjdHMuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUEyRDs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBaUMsVUFBVTtBQUMzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0IsK0NBQUs7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsOENBQUk7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsOENBQUk7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNqSXVCO0FBQ21DOztBQUUzRCxxREFBYTs7QUFFYixJQUFJLG9EQUFZO0FBQ2hCLEVBQUUsb0RBQVk7QUFDZCxFQUFFLG1EQUFXO0FBQ2IsRUFBRSxtREFBVztBQUNiLEVBQUUsbURBQVc7QUFDYixFQUFFLG9EQUFZO0FBQ2QsRUFBRSxtREFBVztBQUNiLEVBQUUsb0RBQVk7QUFDZCxFQUFFLG1EQUFXO0FBQ2IsRUFBRSxtREFBVztBQUNiOztBQUVBLGNBQWMsZ0RBQVE7QUFDdEI7QUFDQSxZQUFZLHFEQUFXOztBQUV2QixjQUFjLGdEQUFRO0FBQ3RCO0FBQ0EsWUFBWSxxREFBVzs7QUFFdkIsY0FBYyxnREFBUTtBQUN0QjtBQUNBLFlBQVkscURBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0J2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztVQ3hDQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5cbi8vIG1vZHVsZSBmb3Igc2V0dGluZyB1cCBhbmQgaW50ZXJhY3Rpbmcgd2l0aCBkYXRhYmFzZVxuLy8gdG8gYWRkOiBmaXJlYmFzZSAvIGNoZWNrIGxvY2FsIHN0b3JhZ2UgdmlhYmxlIC8gc2V0dXAgZnVuY3Rpb24gZm9yIHBhZ2UgbG9hZFxuY29uc3QgZGIgPSAoZnVuY3Rpb24oKSB7XG4gIGxldCBjYWJiYWdlX2RiID0gbnVsbDtcbiAgXG4gIGNvbnN0IG5ld0RiID0gKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBmaWVsZHMgOiB7fSxcbiAgICAgIHVpZHMgOiB7XG4gICAgICAgIGZpZWxkIDogLTEsXG4gICAgICAgIGhlYWQgOiAtMSxcbiAgICAgICAgbGVhZiA6IC0xLFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHNhdmUgPSAoKSA9PiB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhYmJhZ2VfZGInLCBKU09OLnN0cmluZ2lmeShjYWJiYWdlX2RiKSk7XG4gIH1cblxuICBjb25zdCBsb2FkID0gKCkgPT4ge1xuICAgIGlmKGxvY2FsU3RvcmFnZVsnY2FiYmFnZV9kYiddKSB7XG4gICAgICBjYWJiYWdlX2RiID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2VbJ2NhYmJhZ2VfZGInXSk7XG4gICAgICBjb25zb2xlLmxvZygnZGIgbG9hZGVkJyk7XG4gICAgICBjb25zb2xlLmxvZyhjYWJiYWdlX2RiKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgaW5pdGlhbGl6ZSA9ICgpID0+IHtcbiAgICBpZighbG9hZCgpKSB7XG4gICAgICBjYWJiYWdlX2RiID0gbmV3RGIoKTtcbiAgICAgIHNhdmUoKTtcbiAgICAgIGNvbnNvbGUubG9nKCduZXcgZGIgaW5pdGlhbGl6ZWQnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNhYmJhZ2VfZGIpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHBhcnNlX3VpZCA9ICh1aWQpID0+IHtcbiAgICByZXR1cm4gdWlkLnNwbGl0KCctJykubWFwKGkgPT4gTnVtYmVyKGkpKTtcbiAgfVxuXG4gIGNvbnN0IHVpZF90b19zID0gKHVpZCkgPT4ge1xuICAgIHJldHVybiB1aWQuam9pbignLScpO1xuICB9XG5cbiAgY29uc3QgcmVxdWVzdF91aWQgPSAodHlwZSkgPT4ge1xuICAgIGNhYmJhZ2VfZGJbJ3VpZHMnXVt0eXBlXSArPSAxO1xuICAgIHJldHVybiBTdHJpbmcoY2FiYmFnZV9kYlsndWlkcyddW3R5cGVdKTtcbiAgfVxuXG4gIGNvbnN0IG1lcmdlX3VpZCA9IChwYXJlbnRfdWlkLCBjaGlsZF91aWQpID0+IHtcbiAgICByZXR1cm4gcGFyZW50X3VpZC5jb25jYXQoYC0ke2NoaWxkX3VpZH1gKTtcbiAgfVxuXG4gIGNvbnN0IGZldGNoID0gKHVpZCkgPT4ge1xuICAgIGlmKHR5cGVvZih1aWQpID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB1aWQgPSBwYXJzZV91aWQodWlkKTtcbiAgICB9XG4gICAgaWYgKHVpZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBsZXQgcmVzdWx0ID0gY2FiYmFnZV9kYi5maWVsZHNbdWlkLnNoaWZ0KCldO1xuICAgIHdoaWxlKHVpZC5sZW5ndGggPiAwKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQuY2hpbGRyZW5bdWlkLnNoaWZ0KCldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgY29uc3QgaW5zZXJ0ID0gKHBhcmVudCwgY2hpbGQpID0+IHtcbiAgICBjb25zdCBjaGlsZF9rZXkgPSBwYXJzZV91aWQoY2hpbGQudWlkKS5wb3AoKTtcbiAgICBwYXJlbnQuY2hpbGRyZW5bY2hpbGRfa2V5XSA9IGNoaWxkO1xuICAgIHNhdmUoKTtcbiAgfVxuXG4gIGNvbnN0IGFkZF9maWVsZCA9IChuYW1lKSA9PiB7XG4gICAgY29uc3QgZmllbGQgPSBGaWVsZChuYW1lKTtcbiAgICBmaWVsZC51aWQgPSByZXF1ZXN0X3VpZCgnZmllbGQnKTtcbiAgICBjYWJiYWdlX2RiLmZpZWxkc1twYXJzZV91aWQoZmllbGQudWlkKVswXV0gPSBmaWVsZDtcbiAgICBzYXZlKCk7XG4gIH1cblxuICBjb25zdCBhZGRfaGVhZCA9IChwYXJlbnRfdWlkLCBuYW1lLCBpbmZvLCBkdWUpID0+IHtcbiAgICBjb25zdCBoZWFkID0gSGVhZChuYW1lLCBpbmZvLCBkdWUpO1xuICAgIGNvbnN0IHBhcmVudCA9IGZldGNoKHBhcmVudF91aWQpO1xuICAgIGhlYWQudWlkID0gbWVyZ2VfdWlkKHBhcmVudC51aWQsIHJlcXVlc3RfdWlkKCdoZWFkJykpO1xuICAgIGluc2VydChwYXJlbnQsIGhlYWQpO1xuICB9XG5cbiAgY29uc3QgYWRkX2xlYWYgPSAocGFyZW50X3VpZCwgbmFtZSwgZHVlKSA9PiB7XG4gICAgY29uc3QgbGVhZiA9IExlYWYobmFtZSwgZHVlKTtcbiAgICBjb25zdCBwYXJlbnQgPSBmZXRjaChwYXJlbnRfdWlkKTtcbiAgICBsZWFmLnVpZCA9IG1lcmdlX3VpZChwYXJlbnQudWlkLCByZXF1ZXN0X3VpZCgnbGVhZicpKTtcbiAgICBpbnNlcnQocGFyZW50LCBsZWFmKTtcbiAgfVxuXG4gIC8vIG5lZWRzIHRvIGJlIHRlc3RlZCBmdXJ0aGVyIG9uY2UgRE9NIGV2ZW50IGxpc3RlbmVycyBiZWdpbiBjYWxsaW5nIGl0XG4gIGNvbnN0IHVwZGF0ZV9pdGVtID0gKHVpZCwgcGFyYW1zKSA9PiB7XG4gICAgY29uc3QgaXRlbSA9IGZldGNoKHVpZCk7XG4gICAgZm9yKGNvbnN0IGtleSBpbiBwYXJhbXMpIHtcbiAgICAgIGl0ZW1ba2V5XSA9IHBhcmFtc1trZXldO1xuICAgIH1cbiAgICBzYXZlKCk7XG4gIH1cblxuXG4gIC8vZm9yIHRlc3RpbmdcbiAgY29uc3QgZmV0Y2hfcmF3ID0gKCkgPT4ge1xuICAgIHJldHVybiBjYWJiYWdlX2RiO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwYXJzZV91aWQsXG4gICAgdWlkX3RvX3MsXG4gICAgcmVxdWVzdF91aWQsXG4gICAgbWVyZ2VfdWlkLFxuICAgIGZldGNoLFxuICAgIGluc2VydCxcbiAgICBhZGRfZmllbGQsXG4gICAgYWRkX2hlYWQsXG4gICAgYWRkX2xlYWYsXG4gICAgdXBkYXRlX2l0ZW0sXG4gICAgc2F2ZSxcbiAgICBsb2FkLFxuICAgIGZldGNoX3JhdyxcbiAgICBpbml0aWFsaXplLFxuICB9XG59KSgpXG5cbmV4cG9ydCB7IGRiIGFzIGRlZmF1bHQgfTsiLCJpbXBvcnQgZGIgZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmLCBoYXNDaGlsZHJlbiB9IGZyb20gJy4vb2JqZWN0cyc7XG5cbmRiLmluaXRpYWxpemUoKTtcblxuaWYoIWRiLmZldGNoX3JhdygpLmZpZWxkc1swXSkge1xuICBkYi5hZGRfZmllbGQoJ0dlbmVyYWwnKTtcbiAgZGIuYWRkX2hlYWQoJzAnLCAnVGVzdCBoZWFkMCcsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQxJywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9oZWFkKCcwJywgJ1Rlc3QgaGVhZDInLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2ZpZWxkKCdmaWVsZCAxJyk7XG4gIGRiLmFkZF9oZWFkKCcxJywgJ1Rlc3QgaGVhZDMnLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2ZpZWxkKCdmaWVsZCAyJyk7XG4gIGRiLmFkZF9oZWFkKCcyJywgJ1Rlc3QgaGVhZDQnLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2xlYWYoJzEtMycsICdsZWFmIDAnLCBmYWxzZSk7XG59XG5cbmNvbnN0IHRlc3QxID0gZGIuZmV0Y2goJzEtMycpO1xuY29uc29sZS5sb2codGVzdDEpO1xuY29uc29sZS5sb2coaGFzQ2hpbGRyZW4odGVzdDEpKTtcblxuY29uc3QgdGVzdDIgPSBkYi5mZXRjaCgnMC0yJyk7XG5jb25zb2xlLmxvZyh0ZXN0Mik7XG5jb25zb2xlLmxvZyhoYXNDaGlsZHJlbih0ZXN0MikpO1xuXG5jb25zdCB0ZXN0MyA9IGRiLmZldGNoKCcxLTMtMCcpO1xuY29uc29sZS5sb2codGVzdDMpO1xuY29uc29sZS5sb2coaGFzQ2hpbGRyZW4odGVzdDMpKTtcblxuXG5cblxuXG4iLCJmdW5jdGlvbiBGaWVsZChuYW1lKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2ZpZWxkJyxcbiAgICBuYW1lLFxuICAgIGNoaWxkcmVuIDoge30sXG4gIH1cbn1cblxuZnVuY3Rpb24gSGVhZChuYW1lLCBpbmZvLCBkdWU9ZmFsc2UpIHtcbiAgcmV0dXJuIHtcbiAgICB1aWQgOiBudWxsLFxuICAgIHR5cGUgOiAnaGVhZCcsXG4gICAgY2hpbGRyZW4gOiB7fSxcbiAgICBjb21wbGV0ZSA6IGZhbHNlLFxuICAgIG5hbWUsXG4gICAgaW5mbyxcbiAgICBkdWUsXG4gIH1cbn1cblxuZnVuY3Rpb24gTGVhZihuYW1lLCBkdWU9ZmFsc2UpIHtcbiAgcmV0dXJuIHtcbiAgICB1aWQgOiBudWxsLFxuICAgIHR5cGUgOiAnbGVhZicsXG4gICAgY29tcGxldGUgOiBmYWxzZSxcbiAgICBuYW1lLFxuICAgIGR1ZSxcbiAgfVxufVxuXG5mdW5jdGlvbiBoYXNDaGlsZHJlbihvYmplY3QpIHtcbiAgaWYoIW9iamVjdCB8fCAhb2JqZWN0LmNoaWxkcmVuKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IGNoaWxkcmVuID0gb2JqZWN0LmNoaWxkcmVuO1xuXG4gIGZvcihsZXQga2V5IGluIGNoaWxkcmVuKSB7XG4gICAgaWYoY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiwgaGFzQ2hpbGRyZW4gfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=