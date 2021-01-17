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
console.log(db.fetch_raw().fields.size);






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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b19kb19saXN0Ly4vc3JjL2luZGV4LmpzIiwid2VicGFjazovL3RvX2RvX2xpc3QvLi9zcmMvb2JqZWN0cy5qcyIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvX2RvX2xpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b19kb19saXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdG9fZG9fbGlzdC93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQThDOztBQUU5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxtQ0FBbUMsVUFBVTtBQUM3QyxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0Esb0JBQW9CLCtDQUFLO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxtQkFBbUIsOENBQUk7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLG1CQUFtQiw4Q0FBSTtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7VUM3QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGaWVsZCwgSGVhZCwgTGVhZiB9IGZyb20gJy4vb2JqZWN0cyc7XG5cbi8vIG1vZHVsZSBmb3Igc2V0dGluZyB1cCBhbmQgaW50ZXJhY3Rpbmcgd2l0aCBkYXRhYmFzZVxuLy8gdG8gYWRkOiBmaXJlYmFzZSAvIGNoZWNrIGxvY2FsIHN0b3JhZ2UgdmlhYmxlIC8gc2V0dXAgZnVuY3Rpb24gZm9yIHBhZ2UgbG9hZFxuY29uc3QgZGIgPSAoZnVuY3Rpb24oKSB7XG4gIGxldCBjYWJiYWdlX2RiID0ge1xuICAgIGZpZWxkcyA6IG5ldyBNYXAoKSxcbiAgICB1aWRzIDoge1xuICAgICAgZmllbGQgOiAtMSxcbiAgICAgIGhlYWQgOiAtMSxcbiAgICAgIGxlYWYgOiAtMSxcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcblxuICAgIHBhcnNlX3VpZCh1aWQpIHtcbiAgICAgIHJldHVybiB1aWQuc3BsaXQoJy0nKS5tYXAoaSA9PiBOdW1iZXIoaSkpO1xuICAgIH0sXG5cbiAgICB1aWRfdG9fcyh1aWQpIHtcbiAgICAgIHJldHVybiB1aWQuam9pbignLScpO1xuICAgIH0sXG5cbiAgICByZXF1ZXN0X3VpZCh0eXBlKSB7XG4gICAgICBjYWJiYWdlX2RiWyd1aWRzJ11bdHlwZV0gKz0gMTtcbiAgICAgIHJldHVybiBTdHJpbmcoY2FiYmFnZV9kYlsndWlkcyddW3R5cGVdKTtcbiAgICB9LFxuXG4gICAgbWVyZ2VfdWlkKHBhcmVudF91aWQsIGNoaWxkX3VpZCkge1xuICAgICAgcmV0dXJuIHBhcmVudF91aWQuY29uY2F0KGAtJHtjaGlsZF91aWR9YCk7XG4gICAgfSxcblxuICAgIGZldGNoKHVpZCkge1xuICAgICAgaWYodHlwZW9mKHVpZCkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdWlkID0gdGhpcy5wYXJzZV91aWQodWlkKTtcbiAgICAgIH1cbiAgICAgIGlmICh1aWQubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgICBsZXQgcmVzdWx0ID0gY2FiYmFnZV9kYi5maWVsZHMuZ2V0KHVpZC5zaGlmdCgpKTtcbiAgICAgIC8vbGV0IHJlc3VsdCA9IGNhYmJhZ2VfZGIuZmllbGRzW3VpZC5zaGlmdCgpXTtcbiAgICAgIHdoaWxlKHVpZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5jaGlsZHJlbi5nZXQodWlkLnNoaWZ0KCkpO1xuICAgICAgICAvL3Jlc3VsdCA9IHJlc3VsdFsnY2hpbGRyZW4nXVt1aWQuc2hpZnQoKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBpbnNlcnQocGFyZW50LCBjaGlsZCkge1xuICAgICAgY29uc3QgY2hpbGRfa2V5ID0gdGhpcy5wYXJzZV91aWQoY2hpbGQudWlkKS5wb3AoKTtcbiAgICAgIHBhcmVudC5jaGlsZHJlbi5zZXQoY2hpbGRfa2V5LCBjaGlsZCk7XG4gICAgICAvL3BhcmVudC5jaGlsZHJlbltjaGlsZF9rZXldID0gY2hpbGQ7XG4gICAgfSxcblxuICAgIGFkZF9maWVsZChuYW1lKSB7XG4gICAgICBjb25zdCBmaWVsZCA9IEZpZWxkKG5hbWUpO1xuICAgICAgZmllbGQudWlkID0gdGhpcy5yZXF1ZXN0X3VpZCgnZmllbGQnKTtcbiAgICAgIGNhYmJhZ2VfZGIuZmllbGRzLnNldCh0aGlzLnBhcnNlX3VpZChmaWVsZC51aWQpWzBdLCBmaWVsZCk7XG4gICAgICAvL2NhYmJhZ2VfZGJbJ2ZpZWxkcyddW3RoaXMucGFyc2VfdWlkKGZpZWxkLnVpZClbMF1dID0gZmllbGQ7XG4gICAgfSxcblxuICAgIGFkZF9oZWFkKHBhcmVudF91aWQsIG5hbWUsIGluZm8sIGR1ZSkge1xuICAgICAgY29uc3QgaGVhZCA9IEhlYWQobmFtZSwgaW5mbywgZHVlKTtcbiAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuZmV0Y2gocGFyZW50X3VpZCk7XG4gICAgICBoZWFkLnVpZCA9IHRoaXMubWVyZ2VfdWlkKHBhcmVudC51aWQsIHRoaXMucmVxdWVzdF91aWQoJ2hlYWQnKSk7XG4gICAgICB0aGlzLmluc2VydChwYXJlbnQsIGhlYWQpO1xuICAgIH0sXG5cbiAgICBhZGRfbGVhZihwYXJlbnRfdWlkLCBuYW1lLCBkdWUpIHtcbiAgICAgIGNvbnN0IGxlYWYgPSBMZWFmKG5hbWUsIGR1ZSk7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmZldGNoKHBhcmVudF91aWQpO1xuICAgICAgbGVhZi51aWQgPSB0aGlzLm1lcmdlX3VpZChwYXJlbnQudWlkLCB0aGlzLnJlcXVlc3RfdWlkKCdsZWFmJykpO1xuICAgICAgdGhpcy5pbnNlcnQocGFyZW50LCBsZWFmKTtcbiAgICB9LFxuXG4gICAgc2F2ZSgpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdjYWJiYWdlX2RiJywgSlNPTi5zdHJpbmdpZnkoY2FiYmFnZV9kYikpO1xuICAgIH0sXG5cbiAgICBsb2FkKCkge1xuICAgICAgaWYobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pIHtcbiAgICAgICAgY2FiYmFnZV9kYiA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlWydjYWJiYWdlX2RiJ10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdjb3VsZCBub250IGxvYWQgY2FiYmFnZSBkYicpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvL2ZvciB0ZXN0aW5nXG4gICAgZmV0Y2hfcmF3KCkge1xuICAgICAgcmV0dXJuIGNhYmJhZ2VfZGI7XG4gICAgfSxcblxuICB9XG59KSgpXG5cbmRiLmFkZF9maWVsZCgnZmllbGQgMCcpO1xuZGIuYWRkX2hlYWQoJzAnLCAnVGVzdCBoZWFkMCcsICdpbmZvJywgZmFsc2UpO1xuZGIuYWRkX2hlYWQoJzAnLCAnVGVzdCBoZWFkMScsICdpbmZvJywgZmFsc2UpO1xuZGIuYWRkX2hlYWQoJzAnLCAnVGVzdCBoZWFkMicsICdpbmZvJywgZmFsc2UpO1xuZGIuYWRkX2ZpZWxkKCdmaWVsZCAxJyk7XG5kYi5hZGRfaGVhZCgnMScsICdUZXN0IGhlYWQzJywgJ2luZm8nLCBmYWxzZSk7XG5kYi5hZGRfZmllbGQoJ2ZpZWxkIDInKTtcbmRiLmFkZF9oZWFkKCcyJywgJ1Rlc3QgaGVhZDQnLCAnaW5mbycsIGZhbHNlKTtcbmRiLmFkZF9sZWFmKCcxLTMnLCAnbGVhZiAwJywgZmFsc2UpO1xuXG5cblxuY29uc29sZS50YWJsZShkYi5mZXRjaF9yYXcoKS5maWVsZHMpO1xuY29uc29sZS5sb2coZGIuZmV0Y2hfcmF3KCkuZmllbGRzLnNpemUpO1xuXG5cblxuXG4iLCJmdW5jdGlvbiBGaWVsZChuYW1lKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2ZpZWxkJyxcbiAgICBuYW1lLFxuICAgIGNoaWxkcmVuIDogbmV3IE1hcCgpLFxuICB9XG59XG5cbmZ1bmN0aW9uIEhlYWQobmFtZSwgaW5mbywgZHVlPWZhbHNlKSB7XG4gIHJldHVybiB7XG4gICAgdWlkIDogbnVsbCxcbiAgICB0eXBlIDogJ2hlYWQnLFxuICAgIGNoaWxkcmVuIDogbmV3IE1hcCgpLFxuICAgIGNvbXBsZXRlIDogZmFsc2UsXG4gICAgbmFtZSxcbiAgICBpbmZvLFxuICAgIGR1ZSxcbiAgfVxufVxuXG5mdW5jdGlvbiBMZWFmKG5hbWUsIGR1ZT1mYWxzZSkge1xuICByZXR1cm4ge1xuICAgIHVpZCA6IG51bGwsXG4gICAgdHlwZSA6ICdsZWFmJyxcbiAgICBjb21wbGV0ZSA6IGZhbHNlLFxuICAgIG5hbWUsXG4gICAgZHVlLFxuICB9XG59XG5cbmV4cG9ydCB7IEZpZWxkLCBIZWFkLCBMZWFmIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXguanNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdleHBvcnRzJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG4iXSwic291cmNlUm9vdCI6IiJ9