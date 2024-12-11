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

onMounted(fetchCategories);
</script>

<template>
  <div>
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
          <router-link
            :to="{ name: 'singelRecipe', params: { id: recipe._id } }"
            class="block"
          >
            {{ recipe.title }}
          </router-link>
        </li>
      </ul>
    </div>

    <div v-else-if="loading">Laddar...</div>

    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
