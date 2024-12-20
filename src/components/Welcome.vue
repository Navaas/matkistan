<script setup>
import { onMounted, ref } from "vue";
import { checkUserAuth, isLoggedIn } from "../utils/checkLoginHandler";
import LikeButton from "./LikeButton.vue";

const recipes = ref([]);
const loading = ref(true);

const fetchRecipes = async () => {
  try {
    const response = await fetch(
      "https://matkistan.onrender.com/getAllRecipes"
    );
    if (!response.ok) throw new Error("Kunde inte hämta recept");
    const data = await response.json();

    recipes.value = data.reverse();
    console.log(data);
  } catch (error) {
    console.error(error);
    error.value = error.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRecipes();
  checkUserAuth();
});
</script>

<template>
  <div class="p-4 pb-16 md:pt-24">
    <div v-if="loading" class="flex justify-center h-64">
      <div
        class="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full"
      ></div>
    </div>
    <div v-else-if="recipes.length > 0">
      <div
        class="flex flex-col gap-4 w-full md:flex-row md:items-center md:justify-center md:flex-wrap"
      >
        <div
          v-for="recipe in recipes"
          :key="recipe._id"
          class="bg-white hover:bg-stone-100 border border-solid border-gray-300 rounded-md w-full p-4 hover:scale-105 transition-transform duration-300 ease-in-out md:w-80"
        >
          <router-link
            :to="{ name: 'singelRecipe', params: { id: recipe._id } }"
            class="block"
          >
            <div v-for="image in recipe.imageUrl" class="pb-4">
              <img
                :src="image"
                :alt="`Bild på ${recipe.title}`"
                class="w-full md:w-[500px] lg:w-[700px] h-auto rounded-sm"
              />
            </div>

            <div>
              <p class="font-bold">{{ recipe.title }}</p>
            </div>
            <hr class="pb-2 border-t border-gray-300" />
            <div class="flex gap-1">
              <p class="font-bold">Svårighetsgrad:</p>
              <span>{{ recipe.difficulty }}</span>
            </div>
            <div class="flex gap-1">
              <p class="font-bold">Tillagningstid:</p>
              <span> {{ recipe.cookingTime }}</span>
            </div>
          </router-link>
          <template v-if="isLoggedIn">
            <div class="flex justify-between pt-4">
              <LikeButton :recipeId="recipe._id" />
            </div>
          </template>
        </div>
      </div>
    </div>
    <p v-else="!recipes" class="flex justify-center">
      Det finns inga recept än.
    </p>
  </div>
</template>

<style scoped></style>
