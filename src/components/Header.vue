<script setup>
import { onMounted } from "vue";
import { checkUserAuth, isLoggedIn } from "../utils/checkLoginHandler";

onMounted(() => {
  checkUserAuth();
});
</script>

<template>
  <header>
    <div
      aria-live="polite"
      v-if="isLoggedIn"
      class="flex px-2 py-2 bg-[#385F4E] text-white cursor-pointer fixed bottom-0 left-0 w-full md:top-0 md:bottom-auto z-50"
    >
      <span
        tabindex="0"
        class="focus:outline-none focus:ring focus:ring-black hidden md:block"
        aria-label="Gå till startsidan"
        >Icon</span
      >

      <nav class="flex w-full justify-around md:justify-end gap-4 md:gap-6">
        <router-link
          to="/"
          class="focus:outline-none focus:ring focus:ring-black"
        >
          <span class="material-icons" aria-label="Gå till startsidan"
            >home</span
          >
        </router-link>
        <router-link
          to="/userCreatedRecipes"
          class="focus:outline-none focus:ring focus:ring-black"
        >
          <span class="material-icons" aria-label="Gå till dina recept"
            >menu_book</span
          >
        </router-link>
        <router-link
          to="/createRecipe"
          class="focus:outline-none focus:ring focus:ring-black"
        >
          <span class="material-icons" aria-label="Gå till skapa nytt recept"
            >add</span
          >
        </router-link>
        <router-link
          to="/likedRecipes"
          class="focus:outline-none focus:ring focus:ring-black"
        >
          <span class="material-icons" aria-label="Gå till dina favoriter"
            >favorite</span
          >
        </router-link>
        <router-link
          to="/profil"
          class="focus:outline-none focus:ring focus:ring-black"
        >
          <span class="material-icons" aria-label="Gå till din profilsida"
            >person</span
          >
        </router-link>
      </nav>
    </div>
    <div
      v-else
      class="flex justify-between px-2 py-2 bg-[#385F4E] text-white cursor-pointer fixed w-full md:top-0 md:bottom-auto z-50"
    >
      <div>
        <p
          aria-label="Gå till startsidan"
          tabindex="0"
          class="focus:outline-none focus:ring focus:ring-black"
        >
          icon
        </p>
      </div>
      <div>
        <router-link
          to="/login"
          aria-label="Gå till logga in"
          class="focus:outline-none focus:ring focus:ring-black"
          ><button>Logga in</button></router-link
        >
      </div>
    </div>
  </header>
</template>

<style scoped></style>
