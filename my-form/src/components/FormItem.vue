<template>
    <div>
        <label v-if="label">{{label}}</label>
        <slot></slot>
        <div v-if="errorMsg">{{errorMsg}}</div>
    </div>
</template>

<script>
import Schema from 'async-validator';

export default {
  name: 'MyFormItem',
  inject: ['form'],
  props: {
    prop: {
        type: String,
        required: false
    },
    label: {
        type: String,
        required: false
    }
  },
  data() {
    return {
        errorMsg: ''
    }
  },
  methods: {
    validate() {
        if (!this.prop) {
            return Promise.resolve();
        }

        const value = this.form.model[this.prop];
        const rule = this.form.rules[this.prop];

        const validator = new Schema({
            [this.prop]: rule
        });
        return validator.validate({
            [this.prop]: value
        }).then(() => {
            // console.log('校验成功');
            this.$message({
                title: 'This is ok',
                time: 3000
            });
            this.errorMsg = '';
        }).catch(({ errors }) => {
            this.errorMsg = errors[0].message;
            return Promise.reject(errors);
        })
    }
  },
    created() {
        this.$parent.addField(this);
    },
}
</script>
