Function.prototype.call2 = function (obj, ...args) {
  obj.fn = this;
  const result = obj.fn(...args);
  delete obj.fn;
  return result;
};

Function.prototype.bind2 = function (obj, ...args) {
  const fn = this;
  return function (...args2) {
    const result = fn.call(obj, [...args, ...args2]);
    return result;
  };
};

// new
function constructFun(Construct, ...args) {
  const obj = {};
  obj.__proto__ = Construct.prototype;
  const restlt = Construct.apply(obj, args);
  return typeof restlt === "object" ? restlt : obj;
}

// 防抖
function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

// 节流
function throttle(fn, wait) {
  let previous = 0;
  return function (...args) {
    const time = +new Date();
    if (time - previous > wait) {
      const result = fn.apply(this, args);
      previous = time;
      return result;
    }
  };
}

function shallowCopy(obj) {
  if (typeof obj !== "object") return obj;
  const newObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

function deepCopy(obj) {
  if (typeof obj !== "object") return obj;
  const newObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] === "object" ? deepCopy[obj[key]] : obj[key];
    }
  }
  return newObj;
}
