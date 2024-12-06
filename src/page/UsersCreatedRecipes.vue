<script setup>
import { onMounted, ref } from "vue";
import Header from "../components/Header.vue";
import { fetchUserData, user } from "../utils/checkLoginHandler";

const createdRecipes = ref([]);

const fetchCreatedRecipes = () => {
  if (user.value && user.value.recipesCreated) {
    createdRecipes.value = user.value.recipesCreated;
  } else {
    createdRecipes.value = [];
  }
};

onMounted(() => {
  fetchUserData().then(() => {
    fetchCreatedRecipes();
  });
});
</script>

<template>
  <Header />
  <div class="p-4">
    <h1>Skapade Recept</h1>
    <div v-if="createdRecipes.length > 0">
      <ul class="list-disc pl-6">
        <li v-for="recipe in createdRecipes" :key="recipe._id">
          <span>{{ recipe.title }}</span>
        </li>
      </ul>
    </div>
    <p v-else>Du har inte skapat några recept ännu.</p>
  </div>
</template>

<style scoped></style>
