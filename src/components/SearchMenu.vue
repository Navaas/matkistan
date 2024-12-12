<script setup>
import { onMounted, ref } from "vue";

const categories = ref([]);
const selectedCategory = ref("");
const recipes = ref([]);
const visibleRecipes = ref([]);
const loading = ref(false);
const error = ref("");
const isDropdownOpen = ref(false);
const selectedCategoryName = ref("");
const recipesPerPage = 5;
const currentPage = ref(0);

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
    currentPage.value = 0;
    updateVisibleRecipes();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const updateVisibleRecipes = () => {
  const startIndex = currentPage.value * recipesPerPage;
  visibleRecipes.value = recipes.value.slice(0, startIndex + recipesPerPage);
};

const loadMoreRecipes = () => {
  currentPage.value++;
  updateVisibleRecipes();
};

const handleDropdownClick = () => {
  isDropdownOpen.value = !isDropdownOpen.value;

  if (isDropdownOpen.value) {
    recipes.value = [];
    visibleRecipes.value = [];
    currentPage.value = 0;
  }
};

const selectCategory = (category) => {
  selectedCategoryName.value = category.name;
  selectedCategory.value = category._id;
  isDropdownOpen.value = false;
  currentPage.value = 0;
  fetchRecipes();
};

onMounted(fetchCategories);
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <div class="relative flex justify-center w-full">
      <button
        @click="handleDropdownClick"
        class="flex justify-between bg-white border border-gray-300 text-black w-1/2 md:w-1/6 rounded-lg px-4 py-2 text-left"
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
        class="absolute bg-white border border-gray-300 rounded-lg w-1/2 md:w-1/6 mt-2 shadow-lg z-10"
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

  <div class="flex flex-col p-4 flex-wrap">
    <div
      v-if="visibleRecipes.length"
      class="pt-12 flex justify-center flex-col"
    >
      <h2 class="flex justify-center pb-4">
        Din sökning gav {{ recipes.length }} träffar
      </h2>
      <div class="flex gap-4 flex-wrap justify-center">
        <div
          v-for="recipe in visibleRecipes"
          :key="recipe._id"
          class="bg-white hover:bg-slate-50 hover:scale-105 transition-transform duration-200 p-4 rounded-md border border-solid border-gray-200 w-1/3 md:w-1/6"
        >
          <router-link
            :to="{ name: 'singelRecipe', params: { id: recipe._id } }"
            class="block"
          >
            <div v-for="image in recipe.imageUrl" class="pb-4">
              <img
                :src="image"
                :alt="`Bild på ${recipe.title}`"
                class="w-full h-auto rounded-sm"
              />
            </div>
            <p class="text-sm truncate overflow-hidden font-bold">
              {{ recipe.title }}
            </p>
          </router-link>
        </div>
      </div>
      <button
        v-if="
          recipes.length > recipesPerPage &&
          visibleRecipes.length < recipes.length
        "
        @click="loadMoreRecipes"
        class="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg self-center"
      >
        Ladda fler
      </button>
    </div>
  </div>
</template>
