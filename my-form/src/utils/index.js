import Vue from 'vue';

function create(Com, props) {
    const Constructor = Vue.extend(Com);

    const com = new Constructor({
        propsData: props
    });

    com.$mount();

    return com;
}

export default create;
