<template>
  <div>
    <div v-if="!endSelectionType">
      <div v-if="state.success" class="h-[75vh] w-full shadow-lg rounded-2xl border p-4 flex flex-wrap justify-evenly gap-4 overflow-scroll" >
        <div v-for="type in typesList" :key="type" @click="toggleSelectType(type.id)"
             class="type-item" :class="{'type-selected' :form.types.includes(type.id)}">
          <q-icon v-if="form.types.includes(type.id)" class="absolute ml-8 mt-4" name="check" />
          <div class="grid justify-items-center items-center h-full">
            {{ type.name}}
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-12 ">
        <q-btn class="text-lg px-10 py-5 " label="Valider mes choix" @click="validateTypeSelection" rounded />
      </div>
    </div>
    <div v-else>
      <div class="flex justify-center my-8">
        <q-btn class="text-lg px-10 py-5" label="Modifier les genres" @click="this.endSelectionType = false" rounded />
      </div>
      <div class="grid md:grid-cols-2 mt-8 md:justify-center md:divide-x">
        <div class="md:pr-3">
          <MultipleInput label="Acteurs"
                         @item-selected="addActor"
                         @item-deleted="removeActor"
                         :items="form.actors" />
        </div>

        <div class="md:pl-3">
          <SearchMovies class="pt-4 md:pt-0" @movie-selected="addMovie" :movies="form.movies" />
        </div>
        <q-btn class="mx-auto mt-2" label="Test" @click="logData" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SearchMovies from "components/SearchMovies.vue";
import MultipleInput from "components/MultipleInput";
import { api } from "boot/axios";


export default defineComponent({
  name: "IndexPage",
  components: { MultipleInput, SearchMovies },
  data() {
    return {
      form: {
        movies: [],
        types: [],
        actors: []
      },
      typesList: [],
      endSelectionType: false,
      state:{
        success: false
      }
    };
  },
  mounted() {
    this.getTypes()
  },
  methods: {
    addGenre(item) {
      this.form.types.push(item);
    },
    removeGenre(item) {
      const index = this.form.types.indexOf(item);
      this.form.types.splice(index, 1);
    },
    addMovie(movie) {
      this.form.movies.push(movie);
    },
    addActor(item) {
      this.form.actors.push(item);
    },
    removeActor(item) {
      const index = this.form.actors.indexOf(item);
      this.form.actors.splice(index, 1);
    },
    logData() {
      console.log(this.form);
    },
    validateTypeSelection() {
      this.endSelectionType = true;
    },
    toggleSelectType(type){
      if (!this.form.types.includes(type)){
        this.form.types.push(type)
      }else{
        const index = this.form.types.indexOf(type);
        this.form.types.splice(index, 1);
      }
    },
    async getTypes(){
      await api.get("genres/list").then((res) => {
        this.typesList = res.data.genres;
        this.state.success = true
      });
    }
  }
});
</script>

<style>
.type-item {
  @apply h-60 w-80 rounded-lg shadow font-bold text-lg hover:scale-105 duration-200 border hover:shadow-xl
  cursor-pointer relative;
}

.type-selected{
  @apply opacity-40 border-green-700 border-2;
}
</style>
