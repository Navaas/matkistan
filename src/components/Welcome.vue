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
  <main class="pt-4 pb-14 md:pt-12">
    <div v-if="loading" class="flex justify-center h-64">
      <div
        class="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full"
      ></div>
    </div>
    <div v-else-if="recipes.length > 0">
      <div
        class="grid grid-flow-row px-2 md:px-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="recipe in recipes"
          :key="recipe._id"
          class="bg-white hover:bg-slate-50 hover:scale-105 transition-transform duration-200 p-4 rounded-md border border-solid border-gray-200 shadow-md"
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
              <h3 class="font-bold text-xs md:text-base">{{ recipe.title }}</h3>
            </div>
            <hr class="pb-2 border-t border-gray-300" />
            <div class="flex gap-1">
              <h3 class="font-bold text-xs md:text-base">Svårighetsgrad:</h3>
              <p class="text-xs md:text-base truncate sm:truncate">
                {{ recipe.difficulty }}
              </p>
            </div>
            <div class="flex gap-1">
              <h3 class="font-bold text-xs md:text-base">Tillagningstid:</h3>
              <p class="text-xs md:text-base truncate sm:truncate">
                {{ recipe.cookingTime }}
              </p>
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
  </main>
</template>

<style scoped></style>
