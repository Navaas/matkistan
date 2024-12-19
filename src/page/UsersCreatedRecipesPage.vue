<script setup>
import { onMounted, ref } from "vue";
import DeleteButton from "../components/DeleteButton.vue";
import Header from "../components/Header.vue";
import LikeButton from "../components/LikeButton.vue";
import { fetchUserData, isLoggedIn, user } from "../utils/checkLoginHandler";

const createdRecipes = ref([]);
const loading = ref(true);
const userId = ref(null);

const fetchCreatedRecipes = () => {
  if (user.value && user.value.recipesCreated) {
    createdRecipes.value = [...user.value.recipesCreated].reverse();
  } else {
    createdRecipes.value = [];
  }
  loading.value = false;
};

const removeRecipeFromList = (recipeId) => {
  if (!isLoggedIn.value) {
    alert("Du måste vara inloggad för att ta bort recept.");
    return;
  }
  createdRecipes.value = createdRecipes.value.filter(
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
      fetchCreatedRecipes();
    }
  });
});
</script>

<template>
  <Header />

  <div class="p-4 pb-16 md:pt-24">
    <div class="flex justify-center py-4 md:pb-12">
      <h1 class="text-3xl mb-2">Dina recept</h1>
    </div>
    <div v-if="loading" class="flex justify-center h-64">
      <div
        class="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full"
      ></div>
    </div>
    <div v-else-if="createdRecipes.length > 0">
      <div
        class="flex flex-col gap-4 w-full md:flex-row md:items-center md:justify-center md:flex-wrap"
      >
        <div
          v-for="recipe in createdRecipes"
          :key="recipe._id"
          class="bg-white hover:bg-stone-100 border border-solid border-gray-300 rounded-md w-full px-4 pt-4 pb-2 hover:scale-105 transition-transform duration-300 ease-in-out md:w-80"
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
          <span>{{ userId }}</span>
          <span>{{ recipe.createdBy }}</span>
          <div class="flex justify-between pt-4">
            <LikeButton :recipeId="recipe._id" />

            <DeleteButton
              v-if="recipe.createdBy === userId"
              :recipeId="recipe._id"
              @recipeDeleted="removeRecipeFromList"
            />
          </div>
        </div>
      </div>
    </div>

    <p v-else="!createdRecipes" class="flex justify-center">
      Du har inte skapat några recept ännu.
    </p>
  </div>
</template>

<style scoped></style>
