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
/* harmony export */   "Leaf": () => /* binding */ Leaf
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2RhdGEuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL29iamVjdHMuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUE4Qzs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBaUMsVUFBVTtBQUMzQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQkFBa0IsK0NBQUs7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsOENBQUk7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsOENBQUk7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNqSXVCO0FBQ3NCOztBQUU5QyxxREFBYTs7QUFFYixJQUFJLG9EQUFZO0FBQ2hCLEVBQUUsb0RBQVk7QUFDZCxFQUFFLG1EQUFXO0FBQ2IsRUFBRSxtREFBVztBQUNiLEVBQUUsbURBQVc7QUFDYixFQUFFLG9EQUFZO0FBQ2QsRUFBRSxtREFBVztBQUNiLEVBQUUsb0RBQVk7QUFDZCxFQUFFLG1EQUFXO0FBQ2IsRUFBRSxtREFBVztBQUNiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O1VDN0JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmllbGQsIEhlYWQsIExlYWYgfSBmcm9tICcuL29iamVjdHMnO1xuXG4vLyBtb2R1bGUgZm9yIHNldHRpbmcgdXAgYW5kIGludGVyYWN0aW5nIHdpdGggZGF0YWJhc2Vcbi8vIHRvIGFkZDogZmlyZWJhc2UgLyBjaGVjayBsb2NhbCBzdG9yYWdlIHZpYWJsZSAvIHNldHVwIGZ1bmN0aW9uIGZvciBwYWdlIGxvYWRcbmNvbnN0IGRiID0gKGZ1bmN0aW9uKCkge1xuICBsZXQgY2FiYmFnZV9kYiA9IG51bGw7XG4gIFxuICBjb25zdCBuZXdEYiA9ICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgZmllbGRzIDoge30sXG4gICAgICB1aWRzIDoge1xuICAgICAgICBmaWVsZCA6IC0xLFxuICAgICAgICBoZWFkIDogLTEsXG4gICAgICAgIGxlYWYgOiAtMSxcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdCBzYXZlID0gKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYWJiYWdlX2RiJywgSlNPTi5zdHJpbmdpZnkoY2FiYmFnZV9kYikpO1xuICB9XG5cbiAgY29uc3QgbG9hZCA9ICgpID0+IHtcbiAgICBpZihsb2NhbFN0b3JhZ2VbJ2NhYmJhZ2VfZGInXSkge1xuICAgICAgY2FiYmFnZV9kYiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pO1xuICAgICAgY29uc29sZS5sb2coJ2RiIGxvYWRlZCcpO1xuICAgICAgY29uc29sZS5sb2coY2FiYmFnZV9kYik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGluaXRpYWxpemUgPSAoKSA9PiB7XG4gICAgaWYoIWxvYWQoKSkge1xuICAgICAgY2FiYmFnZV9kYiA9IG5ld0RiKCk7XG4gICAgICBzYXZlKCk7XG4gICAgICBjb25zb2xlLmxvZygnbmV3IGRiIGluaXRpYWxpemVkJyk7XG4gICAgICBjb25zb2xlLmxvZyhjYWJiYWdlX2RiKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBwYXJzZV91aWQgPSAodWlkKSA9PiB7XG4gICAgcmV0dXJuIHVpZC5zcGxpdCgnLScpLm1hcChpID0+IE51bWJlcihpKSk7XG4gIH1cblxuICBjb25zdCB1aWRfdG9fcyA9ICh1aWQpID0+IHtcbiAgICByZXR1cm4gdWlkLmpvaW4oJy0nKTtcbiAgfVxuXG4gIGNvbnN0IHJlcXVlc3RfdWlkID0gKHR5cGUpID0+IHtcbiAgICBjYWJiYWdlX2RiWyd1aWRzJ11bdHlwZV0gKz0gMTtcbiAgICByZXR1cm4gU3RyaW5nKGNhYmJhZ2VfZGJbJ3VpZHMnXVt0eXBlXSk7XG4gIH1cblxuICBjb25zdCBtZXJnZV91aWQgPSAocGFyZW50X3VpZCwgY2hpbGRfdWlkKSA9PiB7XG4gICAgcmV0dXJuIHBhcmVudF91aWQuY29uY2F0KGAtJHtjaGlsZF91aWR9YCk7XG4gIH1cblxuICBjb25zdCBmZXRjaCA9ICh1aWQpID0+IHtcbiAgICBpZih0eXBlb2YodWlkKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgdWlkID0gcGFyc2VfdWlkKHVpZCk7XG4gICAgfVxuICAgIGlmICh1aWQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgbGV0IHJlc3VsdCA9IGNhYmJhZ2VfZGIuZmllbGRzW3VpZC5zaGlmdCgpXTtcbiAgICB3aGlsZSh1aWQubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0LmNoaWxkcmVuW3VpZC5zaGlmdCgpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGNvbnN0IGluc2VydCA9IChwYXJlbnQsIGNoaWxkKSA9PiB7XG4gICAgY29uc3QgY2hpbGRfa2V5ID0gcGFyc2VfdWlkKGNoaWxkLnVpZCkucG9wKCk7XG4gICAgcGFyZW50LmNoaWxkcmVuW2NoaWxkX2tleV0gPSBjaGlsZDtcbiAgICBzYXZlKCk7XG4gIH1cblxuICBjb25zdCBhZGRfZmllbGQgPSAobmFtZSkgPT4ge1xuICAgIGNvbnN0IGZpZWxkID0gRmllbGQobmFtZSk7XG4gICAgZmllbGQudWlkID0gcmVxdWVzdF91aWQoJ2ZpZWxkJyk7XG4gICAgY2FiYmFnZV9kYi5maWVsZHNbcGFyc2VfdWlkKGZpZWxkLnVpZClbMF1dID0gZmllbGQ7XG4gICAgc2F2ZSgpO1xuICB9XG5cbiAgY29uc3QgYWRkX2hlYWQgPSAocGFyZW50X3VpZCwgbmFtZSwgaW5mbywgZHVlKSA9PiB7XG4gICAgY29uc3QgaGVhZCA9IEhlYWQobmFtZSwgaW5mbywgZHVlKTtcbiAgICBjb25zdCBwYXJlbnQgPSBmZXRjaChwYXJlbnRfdWlkKTtcbiAgICBoZWFkLnVpZCA9IG1lcmdlX3VpZChwYXJlbnQudWlkLCByZXF1ZXN0X3VpZCgnaGVhZCcpKTtcbiAgICBpbnNlcnQocGFyZW50LCBoZWFkKTtcbiAgfVxuXG4gIGNvbnN0IGFkZF9sZWFmID0gKHBhcmVudF91aWQsIG5hbWUsIGR1ZSkgPT4ge1xuICAgIGNvbnN0IGxlYWYgPSBMZWFmKG5hbWUsIGR1ZSk7XG4gICAgY29uc3QgcGFyZW50ID0gZmV0Y2gocGFyZW50X3VpZCk7XG4gICAgbGVhZi51aWQgPSBtZXJnZV91aWQocGFyZW50LnVpZCwgcmVxdWVzdF91aWQoJ2xlYWYnKSk7XG4gICAgaW5zZXJ0KHBhcmVudCwgbGVhZik7XG4gIH1cblxuICAvLyBuZWVkcyB0byBiZSB0ZXN0ZWQgZnVydGhlciBvbmNlIERPTSBldmVudCBsaXN0ZW5lcnMgYmVnaW4gY2FsbGluZyBpdFxuICBjb25zdCB1cGRhdGVfaXRlbSA9ICh1aWQsIHBhcmFtcykgPT4ge1xuICAgIGNvbnN0IGl0ZW0gPSBmZXRjaCh1aWQpO1xuICAgIGZvcihjb25zdCBrZXkgaW4gcGFyYW1zKSB7XG4gICAgICBpdGVtW2tleV0gPSBwYXJhbXNba2V5XTtcbiAgICB9XG4gICAgc2F2ZSgpO1xuICB9XG5cblxuICAvL2ZvciB0ZXN0aW5nXG4gIGNvbnN0IGZldGNoX3JhdyA9ICgpID0+IHtcbiAgICByZXR1cm4gY2FiYmFnZV9kYjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGFyc2VfdWlkLFxuICAgIHVpZF90b19zLFxuICAgIHJlcXVlc3RfdWlkLFxuICAgIG1lcmdlX3VpZCxcbiAgICBmZXRjaCxcbiAgICBpbnNlcnQsXG4gICAgYWRkX2ZpZWxkLFxuICAgIGFkZF9oZWFkLFxuICAgIGFkZF9sZWFmLFxuICAgIHVwZGF0ZV9pdGVtLFxuICAgIHNhdmUsXG4gICAgbG9hZCxcbiAgICBmZXRjaF9yYXcsXG4gICAgaW5pdGlhbGl6ZSxcbiAgfVxufSkoKVxuXG5leHBvcnQgeyBkYiBhcyBkZWZhdWx0IH07IiwiaW1wb3J0IGRiIGZyb20gJy4vZGF0YSc7XG5pbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiB9IGZyb20gJy4vb2JqZWN0cyc7XG5cbmRiLmluaXRpYWxpemUoKTtcblxuaWYoIWRiLmZldGNoX3JhdygpLmZpZWxkc1swXSkge1xuICBkYi5hZGRfZmllbGQoJ0dlbmVyYWwnKTtcbiAgZGIuYWRkX2hlYWQoJzAnLCAnVGVzdCBoZWFkMCcsICdpbmZvJywgZmFsc2UpO1xuICBkYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQxJywgJ2luZm8nLCBmYWxzZSk7XG4gIGRiLmFkZF9oZWFkKCcwJywgJ1Rlc3QgaGVhZDInLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2ZpZWxkKCdmaWVsZCAxJyk7XG4gIGRiLmFkZF9oZWFkKCcxJywgJ1Rlc3QgaGVhZDMnLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2ZpZWxkKCdmaWVsZCAyJyk7XG4gIGRiLmFkZF9oZWFkKCcyJywgJ1Rlc3QgaGVhZDQnLCAnaW5mbycsIGZhbHNlKTtcbiAgZGIuYWRkX2xlYWYoJzEtMycsICdsZWFmIDAnLCBmYWxzZSk7XG59XG5cblxuXG5cblxuIiwiZnVuY3Rpb24gRmllbGQobmFtZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdmaWVsZCcsXG4gICAgbmFtZSxcbiAgICBjaGlsZHJlbiA6IHt9LFxuICB9XG59XG5cbmZ1bmN0aW9uIEhlYWQobmFtZSwgaW5mbywgZHVlPWZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2hlYWQnLFxuICAgIGNoaWxkcmVuIDoge30sXG4gICAgY29tcGxldGUgOiBmYWxzZSxcbiAgICBuYW1lLFxuICAgIGluZm8sXG4gICAgZHVlLFxuICB9XG59XG5cbmZ1bmN0aW9uIExlYWYobmFtZSwgZHVlPWZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2xlYWYnLFxuICAgIGNvbXBsZXRlIDogZmFsc2UsXG4gICAgbmFtZSxcbiAgICBkdWUsXG4gIH1cbn1cblxuZXhwb3J0IHsgRmllbGQsIEhlYWQsIExlYWYgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=