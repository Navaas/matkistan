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
      <div
        class="flex flex-col gap-4 w-full md:flex-row md:items-center md:justify-center md:flex-wrap"
      >
        <div
          v-for="recipe in createdRecipes"
          :key="recipe._id"
          class="bg-green-100 w-full p-4 md:w-80"
        >
          <div v-for="image in recipe.imageUrl" class="pb-4">
            <img
              :src="image"
              alt="Bild på recept"
              class="w-full md:w-[500px] lg:w-[700px] h-auto rounded-sm"
            />
          </div>
          <span>{{ recipe.title }}</span>
          <p>Svårighetsgrad: {{ recipe.difficulty }}</p>
          <p>Tillagningstid: {{ recipe.cookingTime }} min</p>
        </div>
      </div>
    </div>
    <p v-else>Du har inte skapat några recept ännu.</p>
  </div>
</template>

<style scoped></style>
