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
  let cabbage_db = {
    fields : new Map(),
    uids : {
      field : -1,
      head : -1,
      leaf : -1,
    }
  };

  return {

    parse_uid(uid) {
      return uid.split('-').map(i => Number(i));
    },

    uid_to_s(uid) {
      return uid.join('-');
    },

    request_uid(type) {
      cabbage_db['uids'][type] += 1;
      return String(cabbage_db['uids'][type]);
    },

    merge_uid(parent_uid, child_uid) {
      return parent_uid.concat(`-${child_uid}`);
    },

    fetch(uid) {
      if(typeof(uid) === "string") {
        uid = this.parse_uid(uid);
      }
      if (uid.length === 0) return;
      let result = cabbage_db.fields.get(uid.shift());
      //let result = cabbage_db.fields[uid.shift()];
      while(uid.length > 0) {
        result = result.children.get(uid.shift());
        //result = result['children'][uid.shift()];
      }
      return result;
    },

    insert(parent, child) {
      const child_key = this.parse_uid(child.uid).pop();
      parent.children.set(child_key, child);
      //parent.children[child_key] = child;
    },

    add_field(name) {
      const field = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Field)(name);
      field.uid = this.request_uid('field');
      cabbage_db.fields.set(this.parse_uid(field.uid)[0], field);
      //cabbage_db['fields'][this.parse_uid(field.uid)[0]] = field;
    },

    add_head(parent_uid, name, info, due) {
      const head = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Head)(name, info, due);
      const parent = this.fetch(parent_uid);
      head.uid = this.merge_uid(parent.uid, this.request_uid('head'));
      this.insert(parent, head);
    },

    add_leaf(parent_uid, name, due) {
      const leaf = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Leaf)(name, due);
      const parent = this.fetch(parent_uid);
      leaf.uid = this.merge_uid(parent.uid, this.request_uid('leaf'));
      this.insert(parent, leaf);
    },

    // this needs to be tested further once DOM event listeners begin calling it
    update_item(uid, params) {
      const item = this.fetch(uid);
      for(const key in params) {
        item[key] = params[key];
      }
    },

    save() {
      localStorage.setItem('cabbage_db', JSON.stringify(cabbage_db));
    },

    load() {
      if(localStorage['cabbage_db']) {
        cabbage_db = JSON.parse(localStorage['cabbage_db']);
      } else {
        console.warn('could nont load cabbage db');
      }
    },

    //for testing
    fetch_raw() {
      return cabbage_db;
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



_data__WEBPACK_IMPORTED_MODULE_0__.default.add_field('field 0');
_data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('0', 'Test head0', 'info', false);
_data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('0', 'Test head1', 'info', false);
_data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('0', 'Test head2', 'info', false);
_data__WEBPACK_IMPORTED_MODULE_0__.default.add_field('field 1');
_data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('1', 'Test head3', 'info', false);
_data__WEBPACK_IMPORTED_MODULE_0__.default.add_field('field 2');
_data__WEBPACK_IMPORTED_MODULE_0__.default.add_head('2', 'Test head4', 'info', false);
_data__WEBPACK_IMPORTED_MODULE_0__.default.add_leaf('1-3', 'leaf 0', false);


_data__WEBPACK_IMPORTED_MODULE_0__.default.update_item('1-3-0', {name:'UPDATED LEAF, DESTROYER OF WORLDS'});
console.table(_data__WEBPACK_IMPORTED_MODULE_0__.default.fetch_raw().fields);


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
    children : new Map(),
  }
}

function Head(name, info, due=false) {
  return {
    uid : null,
    type : 'head',
    children : new Map(),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2RhdGEuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC8uL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL29iamVjdHMuanMiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUE4Qzs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsbUNBQW1DLFVBQVU7QUFDN0MsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLG9CQUFvQiwrQ0FBSztBQUN6QjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsbUJBQW1CLDhDQUFJO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxtQkFBbUIsOENBQUk7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDcEd1QjtBQUNzQjs7QUFFOUMsb0RBQVk7QUFDWixtREFBVztBQUNYLG1EQUFXO0FBQ1gsbURBQVc7QUFDWCxvREFBWTtBQUNaLG1EQUFXO0FBQ1gsb0RBQVk7QUFDWixtREFBVztBQUNYLG1EQUFXOzs7QUFHWCxzREFBYyxXQUFXLHlDQUF5QztBQUNsRSxjQUFjLG9EQUFZOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2YxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztVQzdCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmIH0gZnJvbSAnLi9vYmplY3RzJztcblxuLy8gbW9kdWxlIGZvciBzZXR0aW5nIHVwIGFuZCBpbnRlcmFjdGluZyB3aXRoIGRhdGFiYXNlXG4vLyB0byBhZGQ6IGZpcmViYXNlIC8gY2hlY2sgbG9jYWwgc3RvcmFnZSB2aWFibGUgLyBzZXR1cCBmdW5jdGlvbiBmb3IgcGFnZSBsb2FkXG5jb25zdCBkYiA9IChmdW5jdGlvbigpIHtcbiAgbGV0IGNhYmJhZ2VfZGIgPSB7XG4gICAgZmllbGRzIDogbmV3IE1hcCgpLFxuICAgIHVpZHMgOiB7XG4gICAgICBmaWVsZCA6IC0xLFxuICAgICAgaGVhZCA6IC0xLFxuICAgICAgbGVhZiA6IC0xLFxuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuXG4gICAgcGFyc2VfdWlkKHVpZCkge1xuICAgICAgcmV0dXJuIHVpZC5zcGxpdCgnLScpLm1hcChpID0+IE51bWJlcihpKSk7XG4gICAgfSxcblxuICAgIHVpZF90b19zKHVpZCkge1xuICAgICAgcmV0dXJuIHVpZC5qb2luKCctJyk7XG4gICAgfSxcblxuICAgIHJlcXVlc3RfdWlkKHR5cGUpIHtcbiAgICAgIGNhYmJhZ2VfZGJbJ3VpZHMnXVt0eXBlXSArPSAxO1xuICAgICAgcmV0dXJuIFN0cmluZyhjYWJiYWdlX2RiWyd1aWRzJ11bdHlwZV0pO1xuICAgIH0sXG5cbiAgICBtZXJnZV91aWQocGFyZW50X3VpZCwgY2hpbGRfdWlkKSB7XG4gICAgICByZXR1cm4gcGFyZW50X3VpZC5jb25jYXQoYC0ke2NoaWxkX3VpZH1gKTtcbiAgICB9LFxuXG4gICAgZmV0Y2godWlkKSB7XG4gICAgICBpZih0eXBlb2YodWlkKSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB1aWQgPSB0aGlzLnBhcnNlX3VpZCh1aWQpO1xuICAgICAgfVxuICAgICAgaWYgKHVpZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAgIGxldCByZXN1bHQgPSBjYWJiYWdlX2RiLmZpZWxkcy5nZXQodWlkLnNoaWZ0KCkpO1xuICAgICAgLy9sZXQgcmVzdWx0ID0gY2FiYmFnZV9kYi5maWVsZHNbdWlkLnNoaWZ0KCldO1xuICAgICAgd2hpbGUodWlkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LmNoaWxkcmVuLmdldCh1aWQuc2hpZnQoKSk7XG4gICAgICAgIC8vcmVzdWx0ID0gcmVzdWx0WydjaGlsZHJlbiddW3VpZC5zaGlmdCgpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGluc2VydChwYXJlbnQsIGNoaWxkKSB7XG4gICAgICBjb25zdCBjaGlsZF9rZXkgPSB0aGlzLnBhcnNlX3VpZChjaGlsZC51aWQpLnBvcCgpO1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnNldChjaGlsZF9rZXksIGNoaWxkKTtcbiAgICAgIC8vcGFyZW50LmNoaWxkcmVuW2NoaWxkX2tleV0gPSBjaGlsZDtcbiAgICB9LFxuXG4gICAgYWRkX2ZpZWxkKG5hbWUpIHtcbiAgICAgIGNvbnN0IGZpZWxkID0gRmllbGQobmFtZSk7XG4gICAgICBmaWVsZC51aWQgPSB0aGlzLnJlcXVlc3RfdWlkKCdmaWVsZCcpO1xuICAgICAgY2FiYmFnZV9kYi5maWVsZHMuc2V0KHRoaXMucGFyc2VfdWlkKGZpZWxkLnVpZClbMF0sIGZpZWxkKTtcbiAgICAgIC8vY2FiYmFnZV9kYlsnZmllbGRzJ11bdGhpcy5wYXJzZV91aWQoZmllbGQudWlkKVswXV0gPSBmaWVsZDtcbiAgICB9LFxuXG4gICAgYWRkX2hlYWQocGFyZW50X3VpZCwgbmFtZSwgaW5mbywgZHVlKSB7XG4gICAgICBjb25zdCBoZWFkID0gSGVhZChuYW1lLCBpbmZvLCBkdWUpO1xuICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5mZXRjaChwYXJlbnRfdWlkKTtcbiAgICAgIGhlYWQudWlkID0gdGhpcy5tZXJnZV91aWQocGFyZW50LnVpZCwgdGhpcy5yZXF1ZXN0X3VpZCgnaGVhZCcpKTtcbiAgICAgIHRoaXMuaW5zZXJ0KHBhcmVudCwgaGVhZCk7XG4gICAgfSxcblxuICAgIGFkZF9sZWFmKHBhcmVudF91aWQsIG5hbWUsIGR1ZSkge1xuICAgICAgY29uc3QgbGVhZiA9IExlYWYobmFtZSwgZHVlKTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZmV0Y2gocGFyZW50X3VpZCk7XG4gICAgICBsZWFmLnVpZCA9IHRoaXMubWVyZ2VfdWlkKHBhcmVudC51aWQsIHRoaXMucmVxdWVzdF91aWQoJ2xlYWYnKSk7XG4gICAgICB0aGlzLmluc2VydChwYXJlbnQsIGxlYWYpO1xuICAgIH0sXG5cbiAgICAvLyB0aGlzIG5lZWRzIHRvIGJlIHRlc3RlZCBmdXJ0aGVyIG9uY2UgRE9NIGV2ZW50IGxpc3RlbmVycyBiZWdpbiBjYWxsaW5nIGl0XG4gICAgdXBkYXRlX2l0ZW0odWlkLCBwYXJhbXMpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmZldGNoKHVpZCk7XG4gICAgICBmb3IoY29uc3Qga2V5IGluIHBhcmFtcykge1xuICAgICAgICBpdGVtW2tleV0gPSBwYXJhbXNba2V5XTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2F2ZSgpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYWJiYWdlX2RiJywgSlNPTi5zdHJpbmdpZnkoY2FiYmFnZV9kYikpO1xuICAgIH0sXG5cbiAgICBsb2FkKCkge1xuICAgICAgaWYobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pIHtcbiAgICAgICAgY2FiYmFnZV9kYiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdjb3VsZCBub250IGxvYWQgY2FiYmFnZSBkYicpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvL2ZvciB0ZXN0aW5nXG4gICAgZmV0Y2hfcmF3KCkge1xuICAgICAgcmV0dXJuIGNhYmJhZ2VfZGI7XG4gICAgfSxcblxuICB9XG59KSgpXG5cbmV4cG9ydCB7IGRiIGFzIGRlZmF1bHQgfTsiLCJpbXBvcnQgZGIgZnJvbSAnLi9kYXRhJztcbmltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmIH0gZnJvbSAnLi9vYmplY3RzJztcblxuZGIuYWRkX2ZpZWxkKCdmaWVsZCAwJyk7XG5kYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQwJywgJ2luZm8nLCBmYWxzZSk7XG5kYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQxJywgJ2luZm8nLCBmYWxzZSk7XG5kYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQyJywgJ2luZm8nLCBmYWxzZSk7XG5kYi5hZGRfZmllbGQoJ2ZpZWxkIDEnKTtcbmRiLmFkZF9oZWFkKCcxJywgJ1Rlc3QgaGVhZDMnLCAnaW5mbycsIGZhbHNlKTtcbmRiLmFkZF9maWVsZCgnZmllbGQgMicpO1xuZGIuYWRkX2hlYWQoJzInLCAnVGVzdCBoZWFkNCcsICdpbmZvJywgZmFsc2UpO1xuZGIuYWRkX2xlYWYoJzEtMycsICdsZWFmIDAnLCBmYWxzZSk7XG5cblxuZGIudXBkYXRlX2l0ZW0oJzEtMy0wJywge25hbWU6J1VQREFURUQgTEVBRiwgREVTVFJPWUVSIE9GIFdPUkxEUyd9KTtcbmNvbnNvbGUudGFibGUoZGIuZmV0Y2hfcmF3KCkuZmllbGRzKTtcbiIsImZ1bmN0aW9uIEZpZWxkKG5hbWUpIHtcbiAgcmV0dXJuIHtcbiAgICB1aWQgOiBudWxsLFxuICAgIHR5cGUgOiAnZmllbGQnLFxuICAgIG5hbWUsXG4gICAgY2hpbGRyZW4gOiBuZXcgTWFwKCksXG4gIH1cbn1cblxuZnVuY3Rpb24gSGVhZChuYW1lLCBpbmZvLCBkdWU9ZmFsc2UpIHtcbiAgcmV0dXJuIHtcbiAgICB1aWQgOiBudWxsLFxuICAgIHR5cGUgOiAnaGVhZCcsXG4gICAgY2hpbGRyZW4gOiBuZXcgTWFwKCksXG4gICAgY29tcGxldGUgOiBmYWxzZSxcbiAgICBuYW1lLFxuICAgIGluZm8sXG4gICAgZHVlLFxuICB9XG59XG5cbmZ1bmN0aW9uIExlYWYobmFtZSwgZHVlPWZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2xlYWYnLFxuICAgIGNvbXBsZXRlIDogZmFsc2UsXG4gICAgbmFtZSxcbiAgICBkdWUsXG4gIH1cbn1cblxuZXhwb3J0IHsgRmllbGQsIEhlYWQsIExlYWYgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=