<script setup>
import { onMounted, ref } from "vue";

const recipes = ref([]);
const loading = ref(true);
const error = ref(null);

// Hämta recept från backend

const fetchRecipes = async () => {
  try {
    const response = await fetch("http://localhost:3000/getAllRecipes");
    if (!response.ok) throw new Error("Kunde inte hämta recept");
    const data = await response.json();
    recipes.value = data;
    console.log(data);
  } catch (error) {
    console.error(error);
    error.value = error.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRecipes();
});
</script>

<template>
  <div v-if="recipes.length > 0">
    <ul>
      <li v-for="recipe in recipes" :key="recipe._id">
        <span>{{ recipe.title }}</span>
        <p>Svårighetsgrad: {{ recipe.difficulty }}</p>
        <p>Tillagningstid: {{ recipe.cookingTime }} min</p>

        <p>Ingredienser:</p>
        <ul>
          <li v-for="ingredient in recipe.ingredients" :key="ingredient">
            {{ ingredient }}
          </li>
        </ul>

        <p>Step</p>
        <ol>
          <li v-for="step in recipe.steps" :key="step">
            {{ step }}
          </li>
        </ol>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Inga recept hittades</p>
  </div>
</template>

<style scoped></style>
