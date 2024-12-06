<script setup>
import { onMounted, ref } from "vue";

// Tar emot id från route-parametern via `defineProps`
const props = defineProps({
  id: String,
});
const loading = ref(true);
const recipe = ref(null); // För att hålla receptet
const error = ref(null); // För att hålla eventuella felmeddelanden

const fetchRecipe = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/getSingelRecipe/${props.id}`
    );
    if (!response.ok) throw new Error("Kunde inte hämta recept");
    const data = await response.json();
    recipe.value = data; // Här sätter du det enstaka receptet
    console.log(data); // Logga resultatet för att kontrollera
  } catch (error) {
    console.error(error); // Logga eventuella fel
    error.value = error.message; // Sätt ett felmeddelande
  } finally {
    loading.value = false; // Stäng av laddning
  }
};

onMounted(fetchRecipe); // Kör när komponenten är mountad
</script>

<template>
  <div v-if="recipe">
    <div v-for="image in recipe.imageUrl" class="pb-4">
      <img
        :src="image"
        alt="Bild på recept"
        class="w-full md:w-[500px] lg:w-[700px] h-auto rounded-sm"
      />
    </div>
    <h1>{{ recipe.title }}</h1>
    <p>{{ recipe.difficulty }}</p>
    <p>{{ recipe.cookingTime }}</p>
    <ul>
      <li v-for="ingredient in recipe.ingredients" :key="ingredient">
        {{ ingredient }}
      </li>
    </ul>
    <div>
      <h3>Steg</h3>
      <p>{{ recipe.step }}</p>
      <li v-for="category in recipe.categories" :key="category">
        {{ category.name }}
      </li>
    </div>
  </div>
  <div v-else-if="error">
    <p>Error: {{ error }}</p>
  </div>
</template>
