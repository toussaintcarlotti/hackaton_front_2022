<template>
  <div>
    <q-dialog v-model="alert" persistent>
      <q-card>
        <q-card-section class="row items-center ">
          <q-avatar icon="error" color="grey" text-color="white" />
          <span class="q-ml-sm">Veuillez selectionner au moins une catégorie</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Retour" color="warning" v-close-popup />
          <q-btn flat label="Ok" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div v-if="!endSelectionType">
      <div v-if="state.getTypeSuccess" class="h-[75vh] w-full shadow-lg rounded-2xl border p-4 flex flex-wrap justify-evenly gap-4 overflow-scroll" >
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

      <div class="mt-8">
        <div class="relative">
          <SearchActors label="Acteurs"
                         @item-selected="addActor"
                         @item-deleted="removeActor"
                         @change-value="searchActor"
                         :actorsList="actorsList"
                         :items="form.actors" />
        </div>

        <div>
          <SearchMovies class="pt-4 md:pt-0" @movie-selected="addMovie" :movies="form.movies" />
        </div>
        <q-btn class="mx-auto mt-2" label="Test" @click="logData" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import SearchMovies from "components/SearchMovies.vue";
import { api } from "boot/axios";
import SearchActors from "components/SearchActors";

export default defineComponent({
  name: "IndexPage",
  components: { SearchActors, SearchMovies },
  data() {
    return {
      form: {
        movies: [],
        types: [],
        actors: []
      },
      typesList: [],
      actorsList: [],
      endSelectionType: false,
      state:{
        getTypeSuccess: false,
        getActorSuccess: false
      }
    };
  },
  setup(){
    return{
      alert: ref(false),
    }
  },
  mounted() {
    this.getTypes();
    this.getActors();
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
      this.form.movies.push({
        'id': movie[0].id,
        'title': movie[0].title
      });
    },
    addActor(item) {
      this.form.actors.push(item);
    },
    removeActor(item) {
      const index = this.form.actors.indexOf(item);
      this.form.actors.splice(index, 1);
    },
    async logData() {
      const types = {'genres': this.form.types}
      const actors = {'acteurs': this.form.actors.map((actor) => { return actor.id})}
      const movies = {'films': this.form.movies.map((movie) => { return movie.id})}
      console.log(types);

      await api.post("genres", types).then((res) => {
        console.log(res.data);
      });
      await api.post("acteurs", actors).then((res) => {
        console.log(res.data);
      });
      await api.post("films", movies).then((res) => {
        console.log(res.data);
      });

      await api.get("recommandation").then((res) => {
        console.log(res.data);
      });

    },
    validateTypeSelection() {
      if (this.form.types.length > 0){
        this.endSelectionType = true;
      }else {
        this.alert = true
      }
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
        this.typesList = res.data;
        this.state.getTypeSuccess = true
        console.log(res.data);
      });
    },
    async getActors(){
      await api.get("acteurs/list").then((res) => {
        this.actorsList = res.data;
        this.state.getActorSuccess = true
        console.log(res.data);
      });
    },

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
