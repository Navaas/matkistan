<script setup>
import { onMounted, ref } from "vue";
import Header from "../components/Header.vue";
import LikeButton from "../components/LikeButton.vue";

const likedRecipes = ref([]);
const loadingLikedRecipes = ref(false);

const fetchLikedRecipes = async () => {
  try {
    loadingLikedRecipes.value = true;

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Ingen token hittades. Användaren är inte inloggad.");
      likedRecipes.value = [];
      return;
    }

    const response = await fetch(
      "https://matkistan.onrender.com/my-favourite",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Fel vid hämtning av recept: ${response.statusText}`);
    }

    const data = await response.json();
    likedRecipes.value = data.reverse();
  } catch (error) {
    console.error("Ett fel inträffade vid hämtning av gillade recept:", error);
  } finally {
    loadingLikedRecipes.value = false;
  }
};

onMounted(() => {
  fetchLikedRecipes();
});
</script>

<template>
  <Header />
  <div class="p-4 md:pt-24">
    <div class="flex justify-center py-4 md:pb-12">
      <h1 class="text-3xl mb-2">Dina recept</h1>
    </div>
    <div v-if="loading" class="flex justify-center h-64">
      <div
        class="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full"
      ></div>
    </div>
    <div v-else-if="likedRecipes.length > 0">
      <div
        class="flex flex-col gap-4 w-full md:flex-row md:items-center md:justify-center md:flex-wrap"
      >
        <div
          v-for="recipe in likedRecipes"
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
          <LikeButton :recipeId="recipe._id" />
        </div>
      </div>
    </div>
    <p v-else="!likedRecipes" class="flex justify-center">
      Du har inte gillat några recept ännu.
    </p>
  </div>
</template>
