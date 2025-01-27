<script setup>
import { onMounted, ref } from "vue";
import DeleteButton from "../components/DeleteButton.vue";
import Header from "../components/Header.vue";
import LikeButton from "../components/LikeButton.vue";
import { fetchUserData, isLoggedIn, user } from "../utils/checkLoginHandler";

const loading = ref(true);
const userId = ref(null);
const userRecipes = ref([]);

const fetchUserRecipes = async () => {
  try {
    loading.value = true;

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Ingen token hittades. Användaren är inte inloggad.");
      userRecipes.value = [];
      return;
    }

    const response = await fetch("https://matkistan.onrender.com/my-recipes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Fel vid hämtning av recept: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Backend Response - Hämtade recept:", data);
    userRecipes.value = data.reverse();
    console.log("Hämtade recept:", userRecipes.value);
  } catch (error) {
    console.error(
      "Ett fel inträffade vid hämtning av användarens recept:",
      error
    );
  } finally {
    loading.value = false;
  }
};
onMounted(fetchUserRecipes);

const removeRecipeFromList = (recipeId) => {
  if (!isLoggedIn.value) {
    alert("Du måste vara inloggad för att ta bort recept.");
    return;
  }
  userRecipes.value = userRecipes.value.filter(
    (recipe) => recipe._id !== recipeId
  );
  console.log("Recipe createdBy:", recipeId.createdBy);
  console.log("User ID:", userId.value);
};

onMounted(() => {
  fetchUserData().then(() => {
    if (user.value) {
      userId.value = user.value._id;
      console.log("User ID:", userId.value);
    }
  });
});
</script>

<template>
  <Header />

  <div class="pb-24 md:pt-14">
    <div class="bg-black py-24 relative">
      <div class="absolute inset-0 bg-black/50 z-10"></div>
      <div class="absolute inset-0 z-20 flex items-center justify-center">
        <h1 class="text-3xl md:text-4xl text-white">Dina recept</h1>
      </div>

      <img
        src="https://plus.unsplash.com/premium_photo-1695297515362-b51affc09b40?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Detta är en bild med en tapas tallrik och en skål med dip."
        class="absolute inset-0 w-full h-full object-cover z-0"
      />
    </div>
    <div v-if="loading" class="flex justify-center pt-6 h-full">
      <div
        class="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full"
      ></div>
    </div>
    <div v-else-if="userRecipes.length > 0">
      <div
        class="grid grid-flow-row px-2 pt-6 md:px-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        <div
          v-for="recipe in userRecipes"
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
              <h2 class="font-bold text-xs md:text-base">{{ recipe.title }}</h2>
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
          <div class="flex justify-between pt-4">
            <LikeButton
              :recipeId="recipe._id"
              :aria-label="'Gilla recept: ' + recipe.title"
            />

            <DeleteButton
              :canDelete="recipe.createdBy === userId"
              :recipeId="recipe._id"
              :aria-label="'Ta bort recept: ' + recipe.title"
              @recipeDeleted="removeRecipeFromList"
            />
          </div>
        </div>
      </div>
    </div>

    <p v-else="!userRecipes" class="flex justify-center">
      Du har inte skapat några recept ännu.
    </p>
  </div>
</template>

<style scoped></style>
