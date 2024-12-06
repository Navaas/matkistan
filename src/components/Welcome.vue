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
    <div>
      <div
        class="flex flex-col gap-4 w-full md:flex-row md:items-center md:justify-center md:flex-wrap"
      >
        <div
          v-for="recipe in recipes"
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
      <!-- <div v-for="recipe in recipes" :key="recipe._id">
        <span>{{ recipe.title }}</span>
        <div v-for="image in recipe.imageUrl">
          <img :src="image" alt="Bild på recept" />
        </div>
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
      </div> -->
    </div>
  </div>
  <div v-else>
    <p>Inga recept hittades</p>
  </div>
</template>

<style scoped></style>
