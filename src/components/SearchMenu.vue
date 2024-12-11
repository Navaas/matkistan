<script setup>
import { ref } from "vue";

const recipes = ref([]);
const loading = ref(false);
const error = ref("");
const searchQuery = ref("");

const searchRecipes = async () => {
  if (!searchQuery.value) {
    recipes.value = [];
    return;
  }

  recipes.value = [];

  try {
    loading.value = true;
    const response = await fetch(
      `http://localhost:3000/categories/search?title=${encodeURIComponent(
        searchQuery.value
      )}`
    );
    if (!response.ok) throw new Error("Kunde inte söka recept");

    const newRecipes = await response.json();

    recipes.value = newRecipes;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const clearAll = () => {
  recipes.value = [];
  error.value = "";
  loading.value = false;
};
</script>

<template>
  <div>
    <h1 class="text-3xl">Sök Recept</h1>

    <div>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Sök recept..."
        @input="searchRecipes"
        @focus="clearAll"
      />
    </div>

    <div v-if="recipes.length">
      <ul>
        <li v-for="recipe in recipes" :key="recipe._id">
          <router-link
            :to="{ name: 'singelRecipe', params: { id: recipe._id } }"
            class="block"
          >
            {{ recipe.title }}
          </router-link>
        </li>
      </ul>
    </div>

    <div v-else-if="loading">Söker...</div>

    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
