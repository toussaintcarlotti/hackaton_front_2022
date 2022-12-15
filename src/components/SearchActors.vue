<template>
  <div class="relative">
    <label class="text-lg font-bold text-gray-700" for="input">{{ label }}</label>
    <div class="border-2 mt-2 rounded-lg flex flex-wrap gap-2 p-2 border-gray-300 cursor-text "
         @click="this.$refs.input.focus()">
      <div class="rounded bg-blue-50 border border-blue-100 p-2 h-max"
           v-for="item in items" :key="item">
        {{ item.name }}
        <q-btn flat round color="red" icon="close" size="xs" @click="removeItem(item)" />
      </div>
      <input @focusout="reset" ref="input" id="input" class="border-none h-max rounded" @keyup="searchActor(input)" v-model="input" type="text">
    </div>
    <div v-if="actorSearching" class="p-1 absolute border w-full bg-white rounded-xl border mt-2 z-max">
      <div v-if="actorsListSearch.length > 0" >
        <div v-for="actor in actorsListSearch" :key="actor"
             class="hover:bg-gray-100 cursor-pointer py-1 px-3 rounded-xl" @click="pushItem(actor)" >
          {{ actor.name }}
        </div>
      </div>
      <div v-else>Aucun résultats</div>
    </div>
  </div>
</template>

<script>
import { api } from "boot/axios";

export default {
  name: "SearchActors",
  props:{
    items:{
      type: Array,
    },
    label:{
      type: String,
      default: 'Label'
    },
    actorsList:{
      type: Array,
    }
  },
  data(){
    return{
      input: '',
      actorSearching: false,
      actorsListSearch: [],
    }
  },
  methods:{
    pushItem(item){
      this.$emit('item-selected', item)
      this.input = ''
    },
    removeItem(item){
      this.$emit('item-deleted', item)
    },
    changeValue(item){
      this.$emit('change-value', item)
    },
    async searchActor(actor){
      await api.get("acteurs/autocomplete?name=" + actor).then((res) => {
        this.actorsListSearch = res.data.splice(0,15)
        this.actorSearching = true
      });
    },
    reset(){
      setTimeout(()=>{
        this.actorSearching = false
        this.actorsListSearch = []
      },200)
    }
  }

};
</script>

<style scoped>

</style>
