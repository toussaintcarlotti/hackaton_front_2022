<template>
  <div>
    <nav class="myNav bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900 border-b">
      <div class="container flex flex-wrap items-center justify-between mx-auto">
        <router-link to="/" class="flex items-center text-black">
          <img class="w-40" src="../public/logo.png" alt="logo">
        </router-link>
        <button data-collapse-toggle="navbar-default" @click="toggleNav" type="button" class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        </button>
        <div class="contain-nav hidden w-full md:w-auto" id="navbar-default">
          <ul class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <router-link to="/" class="link">Menu</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div id="view-container" class="p-3 md:px-20 md:py-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Platform } from "quasar";

export default defineComponent({
  name: 'App',
  mounted() {
    if (Platform.is.ios && Platform.is.name === 'webkit'){
      document.querySelector('.myNav').style.paddingTop = '60px'
      document.querySelector('#view-container').style.paddingTop = '60px'
    }

  },
  methods:{
    toggleNav(){

    }
  }
})
</script>

<style>
.link{
  @apply block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0
  md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent;
}
.router-link-exact-active{
  @apply text-blue-700
}

@media (min-width: 768px) {
  .contain-nav {
    display: block !important;
  }
}


</style>
