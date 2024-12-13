<script setup>
import { onMounted, ref } from "vue";

const recipes = ref([]);
const visibleRecipes = ref([]);
const loading = ref(false);
const error = ref("");
const searchQuery = ref("");
const recipesPerPage = 6;
const categories = ref([]);
const selectedCategory = ref("");
const isDropdownOpen = ref(false);
const selectedCategoryName = ref("");

const searchRecipes = async () => {
  if (!searchQuery.value) {
    recipes.value = [];
    visibleRecipes.value = [];
    return;
  }

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
    visibleRecipes.value = newRecipes.slice(0, recipesPerPage);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const loadMoreRecipes = () => {
  const nextRecipes = recipes.value.slice(
    visibleRecipes.value.length,
    visibleRecipes.value.length + recipesPerPage
  );
  visibleRecipes.value = [...visibleRecipes.value, ...nextRecipes];
};

const clearAll = () => {
  recipes.value = [];
  visibleRecipes.value = [];
  error.value = "";
  loading.value = false;
};

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
    visibleRecipes.value = recipes.value.slice(0, recipesPerPage);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleDropdownClick = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    recipes.value = [];
    visibleRecipes.value = [];
  }
};

const selectCategory = (category) => {
  selectedCategoryName.value = category.name;
  selectedCategory.value = category._id;
  isDropdownOpen.value = false;
  fetchRecipes();
};

onMounted(fetchCategories);
</script>

<template>
  <div class="flex justify-center items-center bg-gray-50 space-x-4 p-4">
    <div class="w-full max-w-md flex">
      <label id="search-label" for="search" class="visually-hidden"
        >Sök recept:</label
      >
      <input
        type="text"
        v-model="searchQuery"
        id="search"
        placeholder="Sök recept..."
        @input="searchRecipes"
        @focus="clearAll"
        aria-labelledby="search-label"
        class="w-full p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
    </div>

    <div class="relative flex w-full max-w-md">
      <button
        @click="handleDropdownClick"
        class="flex justify-between bg-white border border-gray-300 text-black w-full md:w-1/2 rounded-lg px-4 py-2 text-left"
      >
        {{ selectedCategoryName || "Välj kategori" }}
        <span
          class="material-icons transform transition-transform"
          :class="{ 'rotate-180': isDropdownOpen }"
        >
          expand_more
        </span>
      </button>
      <ul
        v-if="isDropdownOpen"
        class="absolute bg-white border border-gray-300 rounded-lg w-full md:w-1/2 mt-2 shadow-lg z-10"
      >
        <li
          v-for="category in categories"
          :key="category._id"
          @click="selectCategory(category)"
          class="px-4 py-2 hover:bg-pink-500 hover:text-white cursor-pointer"
        >
          {{ category.name }}
        </li>
      </ul>
    </div>
  </div>

  <div v-if="recipes.length" class="w-full bg-gray-50 px-4">
    <h2 class="text-xl text-center pb-6">
      Din sökning gav {{ recipes.length }} träffar
    </h2>
    <div
      class="grid grid-flow-row grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
    >
      <div
        v-for="recipe in visibleRecipes"
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
              class="w-full h-auto rounded-md"
            />
          </div>
          <p
            class="text-sm font-semibold text-gray-700 truncate overflow-hidden"
          >
            {{ recipe.title }}
          </p>
        </router-link>
      </div>
    </div>
    <div class="flex justify-center pb-4">
      <button
        v-if="
          recipes.length > recipesPerPage &&
          visibleRecipes.length < recipes.length
        "
        @click="loadMoreRecipes"
        class="mt-8 px-6 py-3 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 focus:outline-none"
      >
        Ladda fler
      </button>
    </div>
  </div>

  <div v-else-if="loading" class="text-center text-lg text-gray-500">
    Söker...
  </div>
  <div v-else-if="error" class="text-center text-lg text-red-500">
    {{ error }}
  </div>
</template>
