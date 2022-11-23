<template>
    <div>
        <input :value="value" @change="inputChange"/>
    </div>
</template>

<script>
export default {
  name: 'MyInput',
  props: {
    value: {
        type: [String, Number],
    },
  },
  methods: {
    inputChange(event) {
        this.$emit('input', event.target.value);
        
        this.$parent.validate();
    }
  }
}
</script>
