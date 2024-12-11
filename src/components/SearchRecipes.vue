<script setup>
import { onMounted, ref } from "vue";

const categories = ref([]);
const selectedCategory = ref("");
const recipes = ref([]);
const loading = ref(false);
const error = ref("");
const searchQuery = ref("");

const fetchCategories = async () => {
  try {
    loading.value = true;
    const response = await fetch("http://localhost:3000/categories");
    if (!response.ok) throw new Error("Kunde inte hämta kategorier");
    categories.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const fetchRecipes = async () => {
  if (!selectedCategory.value) return;

  try {
    loading.value = true;
    const response = await fetch(
      `http://localhost:3000/categories/${selectedCategory.value}/recipes`
    );
    if (!response.ok) throw new Error("Kunde inte hämta recept");
    recipes.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

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

onMounted(fetchCategories);
</script>

<template>
  <div>
    <h1>Recept Sökning</h1>

    <div>
      <h2>Välj en kategori:</h2>
      <select v-model="selectedCategory" @change="fetchRecipes">
        <option value="" disabled>Välj kategori</option>
        <option
          v-for="category in categories"
          :key="category._id"
          :value="category._id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <div v-if="recipes.length">
      <h2>Recept för vald kategori:</h2>
      <ul>
        <li v-for="recipe in recipes" :key="recipe._id">
          {{ recipe.title }}
        </li>
      </ul>
    </div>

    <div v-else-if="loading">Laddar...</div>

    <div v-else-if="error">{{ error }}</div>
  </div>

  <div>
    <h1 class="text-3xl">Sök Recept</h1>

    <!-- Sökfält -->
    <div>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Sök recept..."
        @input="searchRecipes"
        @focus="clearAll"
      />
    </div>

    <!-- Visa sökresultat -->
    <div v-if="recipes.length">
      <ul>
        <li v-for="recipe in recipes" :key="recipe._id">
          {{ recipe.title }}
        </li>
      </ul>
    </div>

    <!-- Visa laddar-status -->
    <div v-else-if="loading">Söker...</div>

    <!-- Visa felmeddelande -->
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
