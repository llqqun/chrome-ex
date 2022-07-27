var utils = {};
function debounce(func, wait = 600, options) {
    let time = null
   return function (...arg) {
       if (time) return false;
       time = setTimeout(() => {
           func(...arg)
           clearTimeout(time)
           time = null
       }, wait)
   }
}

utils['debounce'] = debounce
