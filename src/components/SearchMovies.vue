<template>
  <div>
    <div class="relative mt-8">
      <label class="block mb-2 text-lg font-bold text-gray-700" for="movies">Films</label>
      <input id="movies" class="border-2 border-gray-300 text-gray-600 rounded-lg p-2 w-full"
             @keyup="searchMovies" v-model="search" type="text">
      <div v-if="state.success" class="p-1 absolute border w-full bg-white z-50 rounded-xl border mt-2">
        <div class="py-1 px-3 rounded-xl space-y-2 " v-if="result.length>0" >
          <div class="hover:bg-gray-100 cursor-pointer" v-for="movie in result" :key="movie" @click="selectMovie(movie)">{{ movie.title }}</div>
        </div>
        <div v-else>Aucun résultats</div>
      </div>
    </div>
    <div class="flex flex-wrap gap-3 mt-4">
      <div class="border p-4 rounded-xl" v-for="movie in movies" :key="movie">
        <div class="font-bold text-center mt-1">{{ movie.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "boot/axios";

export default {
  name: "SearchMovies",
  props: {
    movies: Array
  },
  data() {
    return {
      search: "",
      result: [],
      state:{
        success: false
      }
    };
  },
  methods: {
    searchMovies() {
      if (this.search === "") {
        this.state.success = false
        this.result = [];
      } else {
        api.get("films/autocomplete?title=" + this.search).then((res) => {
          this.result = res.data.splice(0,15);
          this.state.success = true
        });
      }
    },
    selectMovie(movie) {
      this.$emit("movie-selected", movie);
      this.state.success = false
      this.result = [];
      this.search = "";
    }

  }
};
</script>

<style scoped>

</style>
