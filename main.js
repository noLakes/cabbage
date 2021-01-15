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
      uid = uid.split('-')
      uid = uid.map(i => Number(i));
      return uid;
    },

    uid_to_s(uid) {
      return uid.join('-');
    },

    request_id(type) {
      cabbage_db['uids'][type] += 1;
      return cabbage_db['uids'][type];
    },

    merge_id(parent_uid, child_id_num) {
      return parent_uid.push(child_id_num);
    },

    fetch(uid) {
      uid = this.parse_uid(uid);
      if (uid.length === 0) return;
      console.table(uid);
      let result = cabbage_db.fields[uid.shift()];
      console.log(`I found ${result}`);
      while(uid.length > 0) {
        result = result['children'][uid.shift];
      }
      return result;
    },

    add_field(name) {
      const field = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Field)(name);
      field.uid = [this.request_id('field')];
      console.log(field);
      cabbage_db['fields'][field.uid[0]] = field;
    },

    add_head(parent_uid, name, info, due) {
      const head = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Head)(name, info, due);
      const parent = this.fetch(this.parse_uid(parent_uid));
      head.uid = this.merge_id(parent.uid, this.request_id('head'));
      parent.children[head.uid[head.uid -1]] = head;
    },

    add_leaf(parent_uid, name, due) {
      const leaf = (0,_objects__WEBPACK_IMPORTED_MODULE_0__.Leaf)(name, due);
      const parent = this.fetch(this.parse_uid(parent_uid));
      leaf.uid = this.merge_id(parent.uid, this.request_id('leaf'));
      parent.children[leaf.uid[leaf.uid -1]] = leaf;
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

function line() {
  console.log('------------------------------------')
}

db.add_field('test');
db.add_head();






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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvb2JqZWN0cy5qcyIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQThDOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixPQUFPO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLG9CQUFvQiwrQ0FBSztBQUN6QjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsbUJBQW1CLDhDQUFJO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxtQkFBbUIsOENBQUk7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7VUM3QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiB9IGZyb20gJy4vb2JqZWN0cyc7XG5cbi8vIG1vZHVsZSBmb3Igc2V0dGluZyB1cCBhbmQgaW50ZXJhY3Rpbmcgd2l0aCBkYXRhYmFzZVxuLy8gdG8gYWRkOiBmaXJlYmFzZSAvIGNoZWNrIGxvY2FsIHN0b3JhZ2UgdmlhYmxlIC8gc2V0dXAgZnVuY3Rpb24gZm9yIHBhZ2UgbG9hZFxuY29uc3QgZGIgPSAoZnVuY3Rpb24oKSB7XG4gIGxldCBjYWJiYWdlX2RiID0ge1xuICAgIGZpZWxkcyA6IHt9LFxuICAgIHVpZHMgOiB7XG4gICAgICBmaWVsZCA6IC0xLFxuICAgICAgaGVhZCA6IC0xLFxuICAgICAgbGVhZiA6IC0xLFxuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuXG4gICAgcGFyc2VfdWlkKHVpZCkge1xuICAgICAgdWlkID0gdWlkLnNwbGl0KCctJylcbiAgICAgIHVpZCA9IHVpZC5tYXAoaSA9PiBOdW1iZXIoaSkpO1xuICAgICAgcmV0dXJuIHVpZDtcbiAgICB9LFxuXG4gICAgdWlkX3RvX3ModWlkKSB7XG4gICAgICByZXR1cm4gdWlkLmpvaW4oJy0nKTtcbiAgICB9LFxuXG4gICAgcmVxdWVzdF9pZCh0eXBlKSB7XG4gICAgICBjYWJiYWdlX2RiWyd1aWRzJ11bdHlwZV0gKz0gMTtcbiAgICAgIHJldHVybiBjYWJiYWdlX2RiWyd1aWRzJ11bdHlwZV07XG4gICAgfSxcblxuICAgIG1lcmdlX2lkKHBhcmVudF91aWQsIGNoaWxkX2lkX251bSkge1xuICAgICAgcmV0dXJuIHBhcmVudF91aWQucHVzaChjaGlsZF9pZF9udW0pO1xuICAgIH0sXG5cbiAgICBmZXRjaCh1aWQpIHtcbiAgICAgIHVpZCA9IHRoaXMucGFyc2VfdWlkKHVpZCk7XG4gICAgICBpZiAodWlkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuICAgICAgY29uc29sZS50YWJsZSh1aWQpO1xuICAgICAgbGV0IHJlc3VsdCA9IGNhYmJhZ2VfZGIuZmllbGRzW3VpZC5zaGlmdCgpXTtcbiAgICAgIGNvbnNvbGUubG9nKGBJIGZvdW5kICR7cmVzdWx0fWApO1xuICAgICAgd2hpbGUodWlkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0WydjaGlsZHJlbiddW3VpZC5zaGlmdF07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBhZGRfZmllbGQobmFtZSkge1xuICAgICAgY29uc3QgZmllbGQgPSBGaWVsZChuYW1lKTtcbiAgICAgIGZpZWxkLnVpZCA9IFt0aGlzLnJlcXVlc3RfaWQoJ2ZpZWxkJyldO1xuICAgICAgY29uc29sZS5sb2coZmllbGQpO1xuICAgICAgY2FiYmFnZV9kYlsnZmllbGRzJ11bZmllbGQudWlkWzBdXSA9IGZpZWxkO1xuICAgIH0sXG5cbiAgICBhZGRfaGVhZChwYXJlbnRfdWlkLCBuYW1lLCBpbmZvLCBkdWUpIHtcbiAgICAgIGNvbnN0IGhlYWQgPSBIZWFkKG5hbWUsIGluZm8sIGR1ZSk7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmZldGNoKHRoaXMucGFyc2VfdWlkKHBhcmVudF91aWQpKTtcbiAgICAgIGhlYWQudWlkID0gdGhpcy5tZXJnZV9pZChwYXJlbnQudWlkLCB0aGlzLnJlcXVlc3RfaWQoJ2hlYWQnKSk7XG4gICAgICBwYXJlbnQuY2hpbGRyZW5baGVhZC51aWRbaGVhZC51aWQgLTFdXSA9IGhlYWQ7XG4gICAgfSxcblxuICAgIGFkZF9sZWFmKHBhcmVudF91aWQsIG5hbWUsIGR1ZSkge1xuICAgICAgY29uc3QgbGVhZiA9IExlYWYobmFtZSwgZHVlKTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZmV0Y2godGhpcy5wYXJzZV91aWQocGFyZW50X3VpZCkpO1xuICAgICAgbGVhZi51aWQgPSB0aGlzLm1lcmdlX2lkKHBhcmVudC51aWQsIHRoaXMucmVxdWVzdF9pZCgnbGVhZicpKTtcbiAgICAgIHBhcmVudC5jaGlsZHJlbltsZWFmLnVpZFtsZWFmLnVpZCAtMV1dID0gbGVhZjtcbiAgICB9LFxuXG4gICAgc2F2ZSgpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYWJiYWdlX2RiJywgSlNPTi5zdHJpbmdpZnkoY2FiYmFnZV9kYikpO1xuICAgIH0sXG5cbiAgICBsb2FkKCkge1xuICAgICAgaWYobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pIHtcbiAgICAgICAgY2FiYmFnZV9kYiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zYXZlKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vZm9yIHRlc3RpbmdcbiAgICBmZXRjaF9yYXcoKSB7XG4gICAgICByZXR1cm4gY2FiYmFnZV9kYjtcbiAgICB9LFxuXG4gIH1cbn0pKClcblxuZnVuY3Rpb24gbGluZSgpIHtcbiAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG59XG5cbmRiLmFkZF9maWVsZCgndGVzdCcpO1xuZGIuYWRkX2hlYWQoKTtcblxuXG5cblxuIiwiZnVuY3Rpb24gRmllbGQobmFtZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdmaWVsZCcsXG4gICAgbmFtZSxcbiAgICBjaGlsZHJlbiA6IHt9LFxuICB9XG59XG5cbmZ1bmN0aW9uIEhlYWQobmFtZSwgaW5mbywgZHVlPWZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2hlYWQnLFxuICAgIGNoaWxkcmVuIDoge30sXG4gICAgY29tcGxldGUgOiBmYWxzZSxcbiAgICBuYW1lLFxuICAgIGluZm8sXG4gICAgZHVlLFxuICB9XG59XG5cbmZ1bmN0aW9uIExlYWYobmFtZSwgZHVlPWZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2xlYWYnLFxuICAgIGNvbXBsZXRlIDogZmFsc2UsXG4gICAgbmFtZSxcbiAgICBkdWUsXG4gIH1cbn1cblxuZXhwb3J0IHsgRmllbGQsIEhlYWQsIExlYWYgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC5qc1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=