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
        this.options.render = this.options.render.bind(this);
        observe(data);
        proxy(data, this);
        proxy(methods, this);
        const el = document.querySelector(this.options.el);
        this.$mount(el);
    }
    $mount(el) {
        this.el = el;
        new Watcher(this, () => {
            const vnode = this.render();
            this._update(vnode);
        });
    }
    render() {
        const vnode = this.options.render(this.createElement);
        return vnode;
    }
    createElement(tag, props, children) {
        return {
            tag,
            props,
            children
        }
    }
    _update(vnode) {
        const preVnode = this.preVnode;
        if (!preVnode) {
            // init
            this._patch(this.el, vnode);
        } else {
            // diff
            this._patch(preVnode, vnode);
        }
        this.preVnode = vnode;
    }
    _patch(preVnode, vnode) {
        if (preVnode.parentNode) {
            // init
            const nextEl = this.el.nextSibling;
            const newEl = this.createEl(vnode);
            this.el.parentNode.insertBefore(newEl, nextEl);
            this.el.parentNode.removeChild(this.el);
            this.el = newEl;
        } else {
            // diff
            if (preVnode.tag === vnode.tag) {
                if (typeof preVnode.children === 'string' && typeof vnode.children === 'string') {
                    preVnode.el.textContent = vnode.children;
                } else if (typeof preVnode.children === 'string' && typeof vnode.children === 'object') {
                    preVnode.el.textContent = vnode.children;
                    vnode.children.forEach(n => {
                        const el = this.createEl(n);
                        preVnode.el.appendChild(el);
                    });
                } else if (typeof preVnode.children === 'object' && typeof vnode.children === 'string') {
                    preVnode.el.textContent = vnode.children;
                } else if (typeof preVnode.children === 'object' && typeof vnode.children === 'object') {
                    this.updateChildren(preVnode.children, vnode.children);
                }
                vnode.el = preVnode.el;
            } else {
                const preEl = preVnode.el;
                const el = this.createEl(vnode);
                preEl.parentNode.insertBefore(el, preEl);
                preEl.parentNode.removeChild(preEl);
            }
        }

    }

    updateChildren(oldVnode, vnode) {
        const minLen = Math.min(oldVnode.length, vnode.length);

        for (let i = 0; i < minLen; i++) {
            this._patch(oldVnode[i], vnode[i]);
        }

        // todo batch add & batch delete

    }


    createEl(vnode) {
        // init
        const { tag, props, children } = vnode;
        const el = document.createElement(tag);
        if (props.attrs) {
            Object.entries(props.attrs).forEach(([attr, value]) => {
                el.setAttribute(attr, value);
            });
        }

        if (typeof children === 'string') {
            // text
            el.textContent = children;
        } else {
            // array
            children.forEach(childVnode => {
                const childEl = this.createEl(childVnode);
                el.appendChild(childEl);
            });
        }
        vnode.el = el;
        return el;
    }
}

class Watcher {
    constructor(vue, fn) {
        this.fn = fn.bind(vue);
        Dep.target = this;
        this.run();
        Dep.target = null;
    }
    run() {
        this.fn();
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
    render(h) {
        return h('div', {}, [
            h('p', { attrs: {name: 'p1', style: 'color: green' }}, this.count + ''),
            h('p', { attrs: {name: 'p2', style: 'color: pink' }}, this.foo),
            h('p', { attrs: {name: 'p3', style: 'color: purple' }}, this.foo2),
        ]);
    },
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

