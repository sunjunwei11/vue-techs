const obj = { foo: 1, bar: { ok: 'this is ok' } };

class Dep {
    constructor() {
        this.deps = [];
    }
    add(watcher) {
        if (this.deps.indexOf(watcher) === -1) {
            this.deps.push(watcher);
        }
    }
    notify() {
        this.deps.forEach(w => {
            w.run();
        })
    }
}

const defineReactive = function(obj, key, val) {
    let v = val;
    const dep = new Dep();
    if (typeof val === 'object' && val !== null) {
        Object.defineProperty(val, 'dep', {
            value: dep,
            enumerable: false
        })
        observe(val);
    }
    Object.defineProperty(obj, key, {
        get() {
            console.log(`get ${key}: ${v}`);
            if (Dep.target) {
                dep.add(Dep.target);
            }
            return v;
        },
        set(newVal) {
            observe(newVal);
            console.log(`set ${key}: ${newVal}`);
            v = newVal;
            dep.notify();
        }
    })
}

// 重写数组上的方法
const originalProto = Array.prototype;

const newProto = Object.create(originalProto);

['push', 'pop', 'shift', 'unshift'].forEach(m => {
    newProto[m] = function(...args) {
        originalProto[m].apply(this, args);
        if (this.dep && this.dep.notify) {
            this.dep.notify();
        }
    }
});



const observe = function(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        obj.__proto__ = newProto;
        // const push = obj.push;
        // obj.push = (...args) => {
        //     push.apply(obj, args);
        //     obj.dep && obj.dep.notify();
        // }
    } else {
        Object.entries(obj).forEach(([key, val]) => {
            defineReactive(obj, key, val);
        });
    }

}

observe(obj);

const set = function(obj, key, val) {
    defineReactive(obj, key, val);
}

set(obj, 'dong', 123);

obj.dong = 111;

function proxy(from, to) {
    Object.keys(from).forEach(key => {
        Object.defineProperty(to, key, {
            get() {
                return from[key];
            },
            set(val) {
                from[key] = val;
            }
        })
    });
}

class Vue {
    constructor(options) {
        this.options = options;
        const data = options.data();
        const methods = options.methods;
        observe(data);
        proxy(data, this);
        proxy(methods, this);
        const el = document.querySelector(this.options.el);
        this.compile(el);
    }
    compile(el) {
        const childNodes = el.childNodes;
        childNodes.forEach(node => {
            // 元素
            if (node.nodeType === 1) {
                const attrs = [...node.attributes];
                if (attrs.length) {
                    attrs.forEach(({ nodeName, nodeValue }) => {
                        if (nodeName.startsWith('v-')) {
                            const dir = nodeName.slice(2);
                            new Watcher(node, dir, nodeValue, this);
                        }
                        if (nodeName.startsWith('@')) {
                            const dir = nodeName.slice(1);
                            this.addEvent(node, dir, nodeValue, this);
                        }
                    })
                }
                console.log(attrs);
                this.compile(node);
            } else if (node.nodeType === 3) { // 文本
                const matchInfo = node.textContent.match(/\{\{(.*)\}\}/);
                if (matchInfo) {
                    new Watcher(node, 'text', matchInfo[1], this);
                }
            }
        })
    }
    textUpdater(node, exp) {
        node.textContent = this[exp];
    }
    htmlUpdater(node, exp) {
        node.innerHTML = this[exp];
    }
    modelUpdater(node, exp) {
        node.value = this[exp];
        node.addEventListener('blur', newValue => {
            this[exp] = newValue.currentTarget.value;
        });
    }
    addEvent(node, dir, exp, vue) {
        node.addEventListener(dir, () => {
            vue[exp] && vue[exp]()
        })
    }
}

class Watcher {
    /**
     * 
     * v-text="foo"
     * @param {*} node 要处理的节点
     * @param {*} dir 指令，比如text
     * @param {*} exp 表达式，比如foo
     * @param {*} vue vue根实例
     */
    constructor(node, dir, exp, vue) {
        this.node = node;
        this.dir = dir;
        this.exp = exp;
        this.vue = vue;
        this.run();
        Dep.target = this;
        vue[exp];
        Dep.target = null;
    }
    run() {
        const { node, dir, exp, vue } = this;
        if (vue[dir + 'Updater']) {
            vue[dir + 'Updater'](node, exp);
        }
    }
}

(() => {
    setTimeout(() => {
        vueInstance.count++;
        vueInstance.foo+='1';
        console.log(vueInstance.count);
        vueInstance.arr.push(6);
    }, 1000);
})();

const vueInstance = new Vue({
    el: '#app',
    data() {
        return {
            count: 1,
            foo: 'fooooo',
            foo2: 'fooooo2',
            bar: '<div style="color: green">ok</div>',
            arr: [1 ,2, 3]
        };
    },
    methods: {
        addCount() {
            this.count++
        },
        pushArr() {
            this.arr.push(Math.random());
        },
        popArr() {
            this.arr.pop();
        }
    }
});

