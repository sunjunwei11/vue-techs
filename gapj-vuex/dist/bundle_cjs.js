'use strict';

let Vue;

class Store {
    constructor(options) {
        this.commit = this.commit.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.options = options;

        const computed = {};
        const state = options.state;
        Object.entries(options.getters).forEach(([key, fun]) => {
            computed[key] = function() {
                return fun(state);
            };
        });
        this._vm = new Vue({
            data() {
                return options.state;
            },
            computed
        });
    }
    get state() {
        return this._vm;
    }
    commit(method, payload) {
        const { mutations } = this.options;
        if (mutations[method]) {
            mutations[method](this.state, payload);
        }
    }
    dispatch(method, payload) {
        const { actions } = this.options;
        if (actions[method]) {
            actions[method](this, payload);
        }
    }
}

function install(_Vue) {
    Vue = _Vue;
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store;
            }
        },
    });
}

var main = {
    Store,
    install
};

module.exports = main;
