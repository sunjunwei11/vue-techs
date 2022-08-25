let Vue;

class MyVueRouter {
    constructor(options) {
        this.options = options;

        Vue.util.defineReactive(this, 'current', window.location.hash.slice(1));

        window.addEventListener('hashchange', () => {
            this.current = window.location.hash.slice(1);
        });
    }
}

MyVueRouter.install = _Vue => {
    Vue = _Vue;

    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router;
            }
        },
    });

    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true
            }
        },
        render(h) {
            return h('a', 
            { attrs: 
                {
                    href: '#' + this.to 
                }
            }, this.$slots.default);
        }
    });

    Vue.component('router-view', {
        render(h) {
            const current = this.$router.current;
            const routes = this.$router.options.routes;

            let com = null;

            routes.find(item => {
                if (item.path === current) {
                    com = item.component;
                }
            });

            return h(com);
        }
    });
}

export default MyVueRouter;
