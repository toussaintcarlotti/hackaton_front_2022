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
      <div v-if="state.getTypeSuccess"
           class="h-[70vh] w-full shadow-lg rounded-2xl p-4 flex flex-wrap justify-evenly gap-4 overflow-y-scroll">
        <div v-for="type in typesList" :key="type" @click="toggleSelectType(type.id)"
             class="type-item" :class="{'type-selected' :form.types.includes(type.id)}">
          <q-icon v-if="form.types.includes(type.id)" class="absolute ml-8 mt-4" name="check" />
          <div class="grid justify-items-center items-center h-full">
            {{ type.name }}
          </div>
        </div>
      </div>
      <div v-else class="h-[70vh] w-full shadow-lg rounded-2xl p-4 flex flex-wrap justify-evenly gap-4 overflow-y-scroll">
        <div v-for="n in 10" :key="n"
             class="type-item">
          <div class="grid justify-items-center items-center h-full p-4 animate-pulse">
            <div class="h-6 rounded w-full bg-gray-100 "></div>
            <div class="h-6 rounded w-3/4 bg-gray-100"></div>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-12">
        <q-btn class="text-lg px-10 py-5 " label="Valider mes choix" @click="validateTypeSelection" rounded />
      </div>
    </div>
    <div v-else-if="state.recommand.success === false">
      <div class="flex justify-between">
        <q-btn icon="arrow_back" class="text-md px-6 py-3" label="Modifier les genres"
               @click="this.endSelectionType = false" />
      </div>

      <div class="mt-8">
        <div class="relative">
          <SearchActors label="Acteurs"
                        @item-selected="addActor"
                        @item-deleted="removeActor"
                        :actorsList="actorsList"
                        :items="form.actors" />
        </div>
        <div>
          <SearchMovies class="pt-4 md:pt-0"
                        @item-deleted="removeMovie"
                        @movie-selected="addMovie" :movies="form.movies" />
        </div>
        <div class="flex justify-center my-8">
          <q-btn class="mx-auto mt-2 py-5 px-10 text-lg" rounded label="Trouver des films" @click="getRecommand" />
        </div>
      </div>
    </div>
    <div v-else-if="state.recommand.success">
      <div class="flex flex-wrap justify-center md:justify-between">
        <q-btn icon="arrow_back" class="text-md px-6 py-3 my-4" label="Modifier les critères"
               @click="this.state.recommand.success = false" />
        <q-btn-dropdown icon="filter_alt" class="text-md px-6 py-3 my-4" label="Filtrer">
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <div class="text-h6 q-mb-md">Settings</div>
            </div>
          </div>
        </q-btn-dropdown>
      </div>
      <CarouselComponent :items="this.recommandationList" />
    </div>
  </div>
</template>

<script>
import { defineComponent, onBeforeUnmount, ref } from "vue";
import SearchMovies from "components/SearchMovies.vue";
import { api } from "boot/axios";
import SearchActors from "components/SearchActors";
import CarouselComponent from "components/CarouselComponent";
import { useQuasar } from 'quasar'

export default defineComponent({
  name: "IndexPage",
  components: { CarouselComponent, SearchActors, SearchMovies },
  data() {
    return {
      form: {
        movies: [],
        types: [],
        actors: []
      },
      typesList: [],
      actorsList: [],
      recommandationList: [],
      recommandationTypeList: [],
      endSelectionType: false,
      state: {
        getTypeSuccess: false,
        getActorSuccess: false,
        recommand:{
          success: false,
          loading: false
        }
      }
    };
  },
  setup() {

    const $q = useQuasar()

    return {
      $q,
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
      if (!this.form.movies.map((mymovie) => {
        return mymovie.title;
      }).includes(movie.title)) {
        this.form.movies.push({
          "id": movie.id,
          "title": movie.title
        });
      }
    },
    removeMovie(movie) {
      const index = this.form.movies.indexOf(movie);
      this.form.movies.splice(index, 1);
    },
    addActor(item) {
      if (!this.form.actors.map((actor) => {
        return actor.name;
      }).includes(item.name)) {
        this.form.actors.push(item);
      }
    },
    removeActor(item) {
      const index = this.form.actors.indexOf(item);
      this.form.actors.splice(index, 1);
    },
    async getRecommand() {
      this.$q.loading.show()
      this.state.recommand.success = false;
      this.state.recommand.loading = true;
      this.recommandationList = [];

      const types = { "genres": this.form.types };
      const actors = {
        "acteurs": this.form.actors.map((actor) => {
          return actor.id;
        })
      };
      const movies = {
        "films": this.form.movies.map((movie) => {
          return movie.id;
        })
      };

      await api.post("genres", types).then(() => {
      });
      await api.post("acteurs", actors).then(() => {
      });
      await api.post("films", movies).then(() => {
      });

      await api.get("recommandation").then((res) => {
        this.recommandationList = res.data;
        this.state.recommand.loading = false;
        this.state.recommand.success = true;
        this.$q.loading.hide()
      });

    },

    validateTypeSelection() {
      this.endSelectionType = true;
    },
    toggleSelectType(type) {
      if (!this.form.types.includes(type)) {
        this.form.types.push(type);
      } else {
        const index = this.form.types.indexOf(type);
        this.form.types.splice(index, 1);
      }
    },
    async getTypes() {
      await api.get("genres/list").then((res) => {
        this.typesList = res.data;
        this.state.getTypeSuccess = true;
      });
    },
    async getActors() {
      await api.get("acteurs/list").then((res) => {
        this.actorsList = res.data;
        this.state.getActorSuccess = true;
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

.type-selected {
  @apply opacity-40 border-green-700 border-2;
}
</style>
