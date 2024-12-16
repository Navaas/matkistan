<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { checkLoginStatus } from "../utils/checkLoginHandler";

const isLoggedIn = ref(false);
const router = useRouter();

const checkLogin = () => {
  isLoggedIn.value = checkLoginStatus();
};

onMounted(checkLogin);
</script>

<template>
  <header v-if="isLoggedIn">
    <div
      class="flex px-2 py-2 bg-[#4c6663] text-white cursor-pointer fixed bottom-0 left-0 w-full md:top-0 md:bottom-auto z-50"
    >
      <span class="hidden md:block">Icon</span>

      <nav class="flex w-full justify-around md:justify-end gap-4 md:gap-6">
        <router-link to="/">
          <span class="material-icons">home</span>
        </router-link>
        <router-link to="/userCreatedRecipes">
          <span class="material-icons">menu_book</span>
        </router-link>
        <router-link to="/createRecipe">
          <span class="material-icons">add</span>
        </router-link>
        <router-link to="/likedRecipes">
          <span class="material-icons">favorite</span>
        </router-link>
        <router-link to="/profil">
          <span class="material-icons">person</span>
        </router-link>
      </nav>
    </div>
  </header>

  <div
    v-else
    class="flex justify-between px-2 py-2 bg-[#4c6663] text-white cursor-pointer fixed w-full md:top-0 md:bottom-auto z-50"
  >
    <div><span>icon</span></div>
    <div>
      <router-link to="/login"><button>Logga in</button></router-link>
    </div>
  </div>
</template>

<style scoped></style>
