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
  <div
    v-if="isLoggedIn"
    class="flex px-2 py-2 bg-black text-white cursor-pointer justify-between fixed bottom-0 left-0 w-full md:top-0 md:bottom-auto z-50"
  >
    <div><span class="hidden md:block">Icon</span></div>
    <div class="flex gap-4">
      <router-link to="/">
        <span class="material-icons"> home </span>
      </router-link>
      <router-link to="/userCreatedRecipes">
        <span class="material-icons">menu_book</span>
      </router-link>
      <router-link to="/createRecipe">
        <span class="material-icons"> add </span>
      </router-link>
      <router-link to="/likedRecipes">
        <span class="material-icons"> favorite </span>
      </router-link>
      <router-link to="/profil">
        <span class="material-icons"> person </span>
      </router-link>
    </div>
  </div>

  <div
    v-else="!isLoggedIn"
    class="flex justify-between px-2 py-2 bg-black text-white cursor-pointer fixed top-0 left-0 w-full"
  >
    <button @click="router.push('/login')">Logga in</button>
  </div>

  <div
    v-if="isLoggedIn"
    class="flex px-2 py-2 bg-black text-white cursor-pointer justify-between fixed bottom-0 left-0 w-full md:top-0 md:bottom-auto z-50"
  >
    <!-- Icon placeholder for larger screens (hidden on mobile) -->
    <div><span class="hidden md:block">Icon</span></div>

    <!-- Flex container for icons -->
    <div class="flex w-full justify-around md:justify-end gap-4 md:pr-4">
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
    </div>
  </div>
  <div
    v-else
    class="flex justify-between px-2 py-2 bg-black text-white cursor-pointer fixed top-0 left-0 w-full"
  >
    <button @click="router.push('/login')">Logga in</button>
  </div>
</template>

<style scoped></style>
