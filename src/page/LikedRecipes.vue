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
  fetchUserData().then(() => {
    fetchLikedRecipes();
  });
});
</script>

<template>
  <Header />
  <div class="p-4">
    <h1>Dina favoriter</h1>
    <div v-if="likedRecipes.length > 0">
      <div
        class="flex flex-col gap-4 w-full md:flex-row md:items-center md:justify-center md:flex-wrap"
      >
        <div
          v-for="recipe in likedRecipes"
          :key="recipe._id"
          class="bg-green-100 w-full p-4 md:w-80"
        >
          <router-link
            :to="{ name: 'singelRecipe', params: { id: recipe._id } }"
            class="block"
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
          </router-link>
        </div>
      </div>
    </div>
    <p v-else>Du har inte skapat några recept ännu.</p>
  </div>
</template>
