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

  <main class="pb-24 md:pt-14">
    <div class="bg-black py-24 relative">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/50 z-10"></div>
      <div class="absolute inset-0 z-20 flex items-center justify-center">
        <h1 class="text-3xl md:text-4xl text-white">Dina favoriter</h1>
      </div>
      <!-- Bild -->
      <img
        src="https://images.unsplash.com/photo-1501747188-61c00b3d8ba0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Detta är en bild på färgglada macarons på en rosa prickig tallrik och en rösa blomma till höger."
        class="absolute inset-0 w-full h-full object-cover z-0"
      />
    </div>
    <div v-if="loadingLikedRecipes" class="flex pt-6 justify-center h-64">
      <div
        class="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full"
      ></div>
    </div>
    <div v-else-if="likedRecipes.length > 0">
      <div
        class="grid grid-flow-row pt-6 px-2 md:px-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="recipe in likedRecipes"
          :key="recipe._id"
          class="bg-white hover:bg-slate-50 hover:scale-105 transition-transform duration-200 p-4 rounded-md border border-solid border-gray-200 shadow-md"
        >
          <router-link
            :to="{ name: 'singelRecipe', params: { id: recipe._id } }"
            class="block"
            aria-label="Läs mer om receptet: {{ recipe.title }}"
          >
            <div v-for="image in recipe.imageUrl" class="pb-4">
              <img
                :src="image"
                :alt="`Bild på ${recipe.title}`"
                class="w-full md:w-[500px] lg:w-[700px] h-auto rounded-sm"
              />
            </div>

            <div>
              <h2 class="font-bold text-xs md:text-base">{{ recipe.title }}</h2>
            </div>
            <hr class="pb-2 border-t border-gray-300" />
            <div class="flex gap-1">
              <h3 class="font-bold text-xs md:text-base">Svårighetsgrad:</h3>
              <span class="text-xs truncate sm:truncate md:text-base">{{
                recipe.difficulty
              }}</span>
            </div>
            <div class="flex gap-1">
              <h3 class="font-bold text-xs md:text-base">Tillagningstid:</h3>
              <span class="text-xs truncate sm:truncate md:text-base">
                {{ recipe.cookingTime }}</span
              >
            </div>
          </router-link>
          <LikeButton
            :recipeId="recipe._id"
            aria-label="Gilla receptet {{ recipe.title }}"
          />
        </div>
      </div>
    </div>
    <p v-else="!likedRecipes" class="flex justify-center">
      Det gick inte att hämta dina gillade recept. Kontrollera din inloggning
      eller försök igen senare.
    </p>
  </main>
</template>
