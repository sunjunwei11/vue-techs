const weakMap = new WeakMap();

function reactive(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (obj.proxyObj) {
         return obj.proxyObj;
    }
    const proxyObj = new Proxy(obj, {
        get(target, key) {
            console.log('get ' + key);
            track(target, key);
            const val = Reflect.get(target, key);
            return reactive(val);
        },
        set(target, key, val) {
            console.log('set ' + key + ' ' + val);
            Reflect.set(target, key, val);
            trigger(target, key);
        }
    });
    obj.proxyObj = proxyObj;
    return proxyObj;
}

function track(target, key) {
    let objMap = weakMap.get(target);
    if (!objMap) {
        weakMap.set(target, objMap = new Map());
    }
    let keyEffects = objMap.get(key);
    if (!keyEffects) {
        objMap.set(key, keyEffects = new Set());
    }
    effectStack.length && keyEffects.add(effectStack[effectStack.length - 1]);
}

function trigger(target, key) {
    let objMap = weakMap.get(target);
    const keyEffects = objMap.get(key);
    for (let effectFn of keyEffects) {
        console.log(effectFn);
        effectFn();
    }
}

const effectStack = [];
function effect(fn) {
    effectStack.push(fn);
    fn();
    effectStack.pop();
}

const obj = {
    name: 111,
    foo: {
        bar: 'ok'
    }
}

const proxyObj = reactive(obj);

proxyObj.name;
proxyObj.name = 'ok';
proxyObj.name;

effect(() => {
    console.log('effect1 name ' + proxyObj.name);
});

effect(() => {
    console.log('effect2 foo.bar ' + proxyObj.foo.bar);
});

proxyObj.name = '666';

setTimeout(() => {
    proxyObj.foo.bar = 'hello';
}, 1000);

