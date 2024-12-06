<script setup>
import { onMounted, ref } from "vue";
import Header from "../components/Header.vue";
import { fetchUserData, user } from "../utils/checkLoginHandler";

const likedRecipes = ref([]);

const fetchLikedRecipes = () => {
  if (user.value && user.value.likedRecipes) {
    likedRecipes.value = user.value.likedRecipes;
  } else {
    likedRecipes.value = [];
  }
};

onMounted(() => {
  // Hämta användardata när sidan laddas
  fetchUserData().then(() => {
    fetchLikedRecipes(); // Hämta gillade recept efter användardata
  });
});
</script>

<template>
  <Header />
  <div class="p-4">
    <h1>Gillade Recept</h1>
    <div v-if="likedRecipes.length > 0">
      <ul class="list-disc pl-6">
        <li v-for="recipe in likedRecipes" :key="recipe._id">
          <span>{{ recipe.title }}</span>
        </li>
      </ul>
    </div>
    <p v-else>Du har inte gillat några recept ännu.</p>
  </div>
</template>

<style scoped></style>
