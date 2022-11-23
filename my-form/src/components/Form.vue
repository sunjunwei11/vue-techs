<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'MyForm',
  provide() {
    return {
        form: this
    }
  },
  props: {
    model: {
        type: Object,
        required: true
    },
    rules: {
        type: Object,
        required: true
    }
  },
  data() {
    return {
        formItems: []
    }
  },
  methods: {
    addField(field) {
        this.formItems.push(field);
    },
    validate() {
        const results = this.formItems
            .filter(item => item.prop)
            .map(item => item.validate());
        Promise.all(results)
            .then(res => {
                console.log('全部校验成功', res);
            })
            .catch(err => {
                console.log('全部校验失败', err);
            })
    }
  }
}
</script>
