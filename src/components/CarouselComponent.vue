<template>
  <swiper
    ref="{swiperRef}"
    :slidesPerView="3"
    :centeredSlides="true"
    :spaceBetween="30"
    :pagination="{
      type: 'fraction',
    }"
    @navigationNext="sequanceAddImage"
    @navigationPrev="this.loadedCount -= 1"
    :navigation="true"
    :modules="modules"
    class="mySwiper"
    :breakpoints="{
      '@0.00': {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      '@0.75': {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      '@1.00': {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      '@1.50': {
        slidesPerView: 4,
        spaceBetween: 50,
      },
    }"
  >
    <swiper-slide class="rounded-xl border block mt-12" v-for="(movie, i) in movies" :key="movie">
      <a target="_blank" :href="movie.url">
        <div class="h-40">
          <img v-if="movie.image" style="object-fit: contain" :src="movie.image" alt="">
          <img v-else style="object-fit: contain" src="../assets/default-movie-img.jpg" alt="">
        </div>
        <div>
          {{ movie.title }}
        </div>
        <div class="flex flex-wrap gap-1 p-2 mt-2">
          <div class="rounded-lg text-sm bg-blue-50 text-blue-400 px-2" v-for="type in movie.types" :key="type">{{ type.name }}</div>
        </div>
      </a>
      <div class="flex justify-center" @click="openDetail(movie, i)">
        <q-btn color="warning" icon="visibility" />
      </div>

      <q-dialog v-model="alert[i]">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ movie.title }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
           <p class="text-justify">{{ movie.description }}</p>
            <div v-if="movie.preview_link" class="flex justify-center mt-4">
              <a download :href="movie.preview_link" >
                <q-btn label="Prévisualisation" />
              </a>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </swiper-slide>
  </swiper>

  <p class="append-buttons"></p>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";


// Import Swiper styles
import "swiper/css";

import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper";
import { api } from "boot/axios";


export default {
  components: {
    Swiper,
    SwiperSlide,

  },
  props:{
    items:{
      type: Array
    }
  },
  data(){
    return{
      movies: [],
      loadedCount: 0,
      maxLoadedCount: 0,
      alert: [],
    }
  },
  mounted() {
    this.movies = this.items;
    for (this.loadedCount = 0; this.loadedCount < 4; this.loadedCount++){
      this.addMovieImage(this.movies[this.loadedCount])
    }
  },
  setup() {
    return {
      modules: [Pagination, Navigation],
    };
  },
  methods:{
    async addMovieImage(mymovie){
      await api.get("films/infos?id="+mymovie.id).then((res) => {
        let movie2 = this.movies.find( movie => movie.id === mymovie.id)
        movie2.image = res.data.thumbnail;
        movie2.url = res.data.url;
        movie2.types = res.data.genres;
        movie2.preview_link = res.data.preview_link
        movie2.description = res.data.description[Object.keys(res.data.description)[0]]
      });
      this.alert.push(false)
    },
    sequanceAddImage(){
      this.loadedCount += 1;
      if (this.loadedCount >= this.maxLoadedCount){
        this.maxLoadedCount = this.loadedCount
        this.addMovieImage(this.movies[this.loadedCount]);
      }
    },
    openDetail(movie, i){
      this.alert[i] = true
    },
  },
};
</script>

<style>
.swiper {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  min-height: 400px;

}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper {
  width: 100%;
  min-height: 500px;
  margin: 20px auto;
}
.append-buttons {
  text-align: center;
  margin-top: 20px;
}

.append-buttons button {
  display: inline-block;
  cursor: pointer;
  border: 1px solid #007aff;
  color: #007aff;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 4px;
  margin: 0 10px;
  font-size: 13px;
}


</style>
