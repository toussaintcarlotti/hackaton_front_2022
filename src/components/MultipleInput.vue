<template>
  <div>
    <label class="text-lg font-bold text-gray-700" for="input">{{ label }}</label>
    <div class="border-2 mt-2 rounded-lg flex flex-wrap gap-2 p-2 border-gray-300 cursor-text "
         @click="this.$refs.input.focus()">
      <div class="rounded bg-blue-50 border border-blue-100 p-2 h-max"
           v-for="item in items" :key="item">
        {{ item }}
        <q-btn flat round color="red" icon="close" size="xs" @click="removeItem(item)" />
      </div>
      <input ref="input" id="input" class="border-none h-max rounded" @keyup="changeValue(input)" v-model="input" type="text">
    </div>
  </div>
</template>

<script>
export default {
  name: "MultipleInput",
  props:{
    items:{
      type: Array,
    },
    label:{
      type: String,
      default: 'Label'
    }
  },
  data(){
    return{
      input: ''
    }
  },
  methods:{
    pushItem(){
      this.$emit('item-selected', this.input)
      this.input = ''
    },
    removeItem(item){
      this.$emit('item-deleted', item)
    },
    changeValue(item){
      this.$emit('change-value', item)
    },

  }

};
</script>

<style scoped>

</style>
