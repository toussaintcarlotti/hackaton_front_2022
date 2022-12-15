<template>
  <div>
    <div class="relative">
      <label class="block mb-2" for="movies">Films</label>
      <input id="movies" class="border-2 border-gray-300 text-gray-600 rounded-lg p-2 w-full"
             @keyup="searchMovies" v-model="search" type="text">
      <div v-if="result" class="p-1 absolute border w-full bg-white rounded-xl border mt-2">
        <div class="hover:bg-gray-100 cursor-pointer py-1 px-3 rounded-xl" v-if="result.Title" @click="selectMovie">{{ result.Title }}</div>
        <div v-else-if="result.Error">Aucun résultats</div>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 mt-4">
      <div class="border p-4 rounded-xl" v-for="movie in movies" :key="movie">
        <img class="w-28" :src="movie.Poster" alt="">
        <div class="font-bold text-center mt-1">{{ movie.Title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { omdbapi } from "boot/axios";

export default {
  name: "SearchMovies",
  props: {
    movies: Array
  },
  data() {
    return {
      search: "",
      result: null
    };
  },
  methods: {
    searchMovies() {
      if (this.search === "") {
        this.result = null;
      } else {
        omdbapi.get("?t=" + this.search).then((res) => {
          this.result = res.data;
          console.log(res.data);
        });
      }
    },
    selectMovie() {
      this.$emit("movie-selected", this.result);
      this.result = null;
      this.search = "";
    }

  }
};
</script>

<style scoped>

</style>
