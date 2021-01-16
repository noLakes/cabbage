/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./objects */ "./src/objects.js");


// module for setting up and interacting with database
// to add: firebase / check local storage viable / setup function for page load
const db = (function() {
  let cabbage_db = {
    fields : {},
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

    merge_id(parent_uid, child_uid) {
      return parent_uid.concat(`-${child_uid}`);
    },

    fetch(uid) {
      if(typeof(uid) === "string") {
        uid = this.parse_uid(uid);
      }
      if (uid.length === 0) return;
      let result = cabbage_db.fields[uid.shift()];
      while(uid.length > 0) {
        result = result['children'][uid.shift()];
      }
      return result;
    },

    insert(parent, child) {
      const child_key = this.parse_uid(child.uid).pop();
      parent.children[child_key] = child;
    },

    add_field(name) {
      const field = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Field)(name);
      field.uid = this.request_uid('field');
      cabbage_db['fields'][this.parse_uid(field.uid)[0]] = field;
    },

    add_head(parent_uid, name, info, due) {
      const head = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Head)(name, info, due);
      const parent = this.fetch(parent_uid);
      head.uid = this.merge_id(parent.uid, this.request_uid('head'));
      this.insert(parent, head);
    },

    add_leaf(parent_uid, name, due) {
      const leaf = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Leaf)(name, due);
      const parent = this.fetch(parent_uid);
      leaf.uid = this.merge_id(parent.uid, this.request_uid('leaf'));
      this.insert(parent, leaf);
    },

    save() {
      localStorage.setItem('cabbage_db', JSON.stringify(cabbage_db));
    },

    load() {
      if(localStorage['cabbage_db']) {
        cabbage_db = JSON.parse(localStorage['cabbage_db']);
      } else {
        this.save();
      }
    },

    //for testing
    fetch_raw() {
      return cabbage_db;
    },

  }
})()

db.add_field('field 0');
db.add_head('0', 'Test head0', 'info', false);
db.add_head('0', 'Test head1', 'info', false);
db.add_head('0', 'Test head2', 'info', false);
db.add_field('field 1');
db.add_head('1', 'Test head3', 'info', false);
db.add_field('field 2');
db.add_head('2', 'Test head4', 'info', false);
db.add_leaf('1-3', 'leaf 0', false);



console.table(db.fetch_raw().fields);






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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvb2JqZWN0cy5qcyIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQThDOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLG1DQUFtQyxVQUFVO0FBQzdDLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxvQkFBb0IsK0NBQUs7QUFDekI7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxtQkFBbUIsOENBQUk7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLG1CQUFtQiw4Q0FBSTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztVQzdCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmIH0gZnJvbSAnLi9vYmplY3RzJztcblxuLy8gbW9kdWxlIGZvciBzZXR0aW5nIHVwIGFuZCBpbnRlcmFjdGluZyB3aXRoIGRhdGFiYXNlXG4vLyB0byBhZGQ6IGZpcmViYXNlIC8gY2hlY2sgbG9jYWwgc3RvcmFnZSB2aWFibGUgLyBzZXR1cCBmdW5jdGlvbiBmb3IgcGFnZSBsb2FkXG5jb25zdCBkYiA9IChmdW5jdGlvbigpIHtcbiAgbGV0IGNhYmJhZ2VfZGIgPSB7XG4gICAgZmllbGRzIDoge30sXG4gICAgdWlkcyA6IHtcbiAgICAgIGZpZWxkIDogLTEsXG4gICAgICBoZWFkIDogLTEsXG4gICAgICBsZWFmIDogLTEsXG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG5cbiAgICBwYXJzZV91aWQodWlkKSB7XG4gICAgICByZXR1cm4gdWlkLnNwbGl0KCctJykubWFwKGkgPT4gTnVtYmVyKGkpKTtcbiAgICB9LFxuXG4gICAgdWlkX3RvX3ModWlkKSB7XG4gICAgICByZXR1cm4gdWlkLmpvaW4oJy0nKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdF91aWQodHlwZSkge1xuICAgICAgY2FiYmFnZV9kYlsndWlkcyddW3R5cGVdICs9IDE7XG4gICAgICByZXR1cm4gU3RyaW5nKGNhYmJhZ2VfZGJbJ3VpZHMnXVt0eXBlXSk7XG4gICAgfSxcblxuICAgIG1lcmdlX2lkKHBhcmVudF91aWQsIGNoaWxkX3VpZCkge1xuICAgICAgcmV0dXJuIHBhcmVudF91aWQuY29uY2F0KGAtJHtjaGlsZF91aWR9YCk7XG4gICAgfSxcblxuICAgIGZldGNoKHVpZCkge1xuICAgICAgaWYodHlwZW9mKHVpZCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdWlkID0gdGhpcy5wYXJzZV91aWQodWlkKTtcbiAgICAgIH1cbiAgICAgIGlmICh1aWQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICBsZXQgcmVzdWx0ID0gY2FiYmFnZV9kYi5maWVsZHNbdWlkLnNoaWZ0KCldO1xuICAgICAgd2hpbGUodWlkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0WydjaGlsZHJlbiddW3VpZC5zaGlmdCgpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcblxuICAgIGluc2VydChwYXJlbnQsIGNoaWxkKSB7XG4gICAgICBjb25zdCBjaGlsZF9rZXkgPSB0aGlzLnBhcnNlX3VpZChjaGlsZC51aWQpLnBvcCgpO1xuICAgICAgcGFyZW50LmNoaWxkcmVuW2NoaWxkX2tleV0gPSBjaGlsZDtcbiAgICB9LFxuXG4gICAgYWRkX2ZpZWxkKG5hbWUpIHtcbiAgICAgIGNvbnN0IGZpZWxkID0gRmllbGQobmFtZSk7XG4gICAgICBmaWVsZC51aWQgPSB0aGlzLnJlcXVlc3RfdWlkKCdmaWVsZCcpO1xuICAgICAgY2FiYmFnZV9kYlsnZmllbGRzJ11bdGhpcy5wYXJzZV91aWQoZmllbGQudWlkKVswXV0gPSBmaWVsZDtcbiAgICB9LFxuXG4gICAgYWRkX2hlYWQocGFyZW50X3VpZCwgbmFtZSwgaW5mbywgZHVlKSB7XG4gICAgICBjb25zdCBoZWFkID0gSGVhZChuYW1lLCBpbmZvLCBkdWUpO1xuICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5mZXRjaChwYXJlbnRfdWlkKTtcbiAgICAgIGhlYWQudWlkID0gdGhpcy5tZXJnZV9pZChwYXJlbnQudWlkLCB0aGlzLnJlcXVlc3RfdWlkKCdoZWFkJykpO1xuICAgICAgdGhpcy5pbnNlcnQocGFyZW50LCBoZWFkKTtcbiAgICB9LFxuXG4gICAgYWRkX2xlYWYocGFyZW50X3VpZCwgbmFtZSwgZHVlKSB7XG4gICAgICBjb25zdCBsZWFmID0gTGVhZihuYW1lLCBkdWUpO1xuICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5mZXRjaChwYXJlbnRfdWlkKTtcbiAgICAgIGxlYWYudWlkID0gdGhpcy5tZXJnZV9pZChwYXJlbnQudWlkLCB0aGlzLnJlcXVlc3RfdWlkKCdsZWFmJykpO1xuICAgICAgdGhpcy5pbnNlcnQocGFyZW50LCBsZWFmKTtcbiAgICB9LFxuXG4gICAgc2F2ZSgpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYWJiYWdlX2RiJywgSlNPTi5zdHJpbmdpZnkoY2FiYmFnZV9kYikpO1xuICAgIH0sXG5cbiAgICBsb2FkKCkge1xuICAgICAgaWYobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pIHtcbiAgICAgICAgY2FiYmFnZV9kYiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vZm9yIHRlc3RpbmdcbiAgICBmZXRjaF9yYXcoKSB7XG4gICAgICByZXR1cm4gY2FiYmFnZV9kYjtcbiAgICB9LFxuXG4gIH1cbn0pKClcblxuZGIuYWRkX2ZpZWxkKCdmaWVsZCAwJyk7XG5kYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQwJywgJ2luZm8nLCBmYWxzZSk7XG5kYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQxJywgJ2luZm8nLCBmYWxzZSk7XG5kYi5hZGRfaGVhZCgnMCcsICdUZXN0IGhlYWQyJywgJ2luZm8nLCBmYWxzZSk7XG5kYi5hZGRfZmllbGQoJ2ZpZWxkIDEnKTtcbmRiLmFkZF9oZWFkKCcxJywgJ1Rlc3QgaGVhZDMnLCAnaW5mbycsIGZhbHNlKTtcbmRiLmFkZF9maWVsZCgnZmllbGQgMicpO1xuZGIuYWRkX2hlYWQoJzInLCAnVGVzdCBoZWFkNCcsICdpbmZvJywgZmFsc2UpO1xuZGIuYWRkX2xlYWYoJzEtMycsICdsZWFmIDAnLCBmYWxzZSk7XG5cblxuXG5jb25zb2xlLnRhYmxlKGRiLmZldGNoX3JhdygpLmZpZWxkcyk7XG5cblxuXG5cbiIsImZ1bmN0aW9uIEZpZWxkKG5hbWUpIHtcbiAgcmV0dXJuIHtcbiAgICB1aWQgOiBudWxsLFxuICAgIHR5cGUgOiAnZmllbGQnLFxuICAgIG5hbWUsXG4gICAgY2hpbGRyZW4gOiB7fSxcbiAgfVxufVxuXG5mdW5jdGlvbiBIZWFkKG5hbWUsIGluZm8sIGR1ZT1mYWxzZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdoZWFkJyxcbiAgICBjaGlsZHJlbiA6IHt9LFxuICAgIGNvbXBsZXRlIDogZmFsc2UsXG4gICAgbmFtZSxcbiAgICBpbmZvLFxuICAgIGR1ZSxcbiAgfVxufVxuXG5mdW5jdGlvbiBMZWFmKG5hbWUsIGR1ZT1mYWxzZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdsZWFmJyxcbiAgICBjb21wbGV0ZSA6IGZhbHNlLFxuICAgIG5hbWUsXG4gICAgZHVlLFxuICB9XG59XG5cbmV4cG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9