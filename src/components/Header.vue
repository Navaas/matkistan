<script setup>
import { onMounted, ref } from "vue";

const isLoggedIn = ref(false);

const getLoggedInUser = async () => {
  try {
    const response = await fetch("http://localhost:3000/auth", {
      method: "GET",
      credentials: "include", // Viktigt för att skicka med sessionen via cookies
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        isLoggedIn.value = true; // Om användaren är inloggad, sätt `isLoggedIn` till true
      }
    } else {
      isLoggedIn.value = false; // Om svar från servern inte är OK, sätt `isLoggedIn` till false
    }
  } catch (error) {
    console.error("Fel vid hämtning av användardata:", error);
    isLoggedIn.value = false;
  }
};

// Kör funktionen när komponenten har laddats
onMounted(getLoggedInUser);
</script>

<template>
  <!-- Header för desktop -->
  <div class="hidden md:block">
    <div
      class="flex justify-between px-2 py-2 bg-black text-white cursor-pointer fixed top-0 left-0 w-full"
    >
      <div>
        <span>Icon</span>
      </div>
      <div v-if="!isLoggedIn">
        <router-link to="/login">
          <span class="material-symbols-outlined"> login </span>
        </router-link>
      </div>

      <div v-if="isLoggedIn" class="flex gap-6">
        <router-link to="/">
          <span class="material-icons"> home </span>
        </router-link>
        <span class="material-icons"> menu_book </span>

        <router-link to="/createRecipe">
          <span class="material-icons"> add </span>
        </router-link>
        <span class="material-icons"> favorite </span>
        <router-link to="/profil">
          <span class="material-icons"> person </span>
        </router-link>
      </div>
    </div>
  </div>

  <!-- Header för mobile -->
  <div
    v-if="!isLoggedIn"
    class="flex justify-between fixed bottom-0 left-0 w-full bg-black text-white py-4 px-2 md:hidden"
  >
    <div>
      <span>Icon</span>
    </div>
    <router-link to="/login">
      <span class="material-symbols-outlined"> login </span>
    </router-link>
  </div>

  <!-- Header för mobile inloggad -->
  <div
    v-if="isLoggedIn"
    class="flex justify-around fixed bottom-0 left-0 w-full bg-black text-white py-4 px-2 md:hidden"
  >
    <span class="material-icons"> home </span>
    <span class="material-icons"> menu_book </span>
    <router-link to="/createRecipe">
      <span class="material-icons"> add </span>
    </router-link>
    <span class="material-icons"> favorite </span>
    <router-link to="/profil">
      <span class="material-icons"> person </span>
    </router-link>
  </div>
</template>

<style scoped></style>
