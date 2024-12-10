<script setup>
import { onMounted, ref } from "vue";
import Header from "../components/Header.vue";

const props = defineProps({
  id: String,
});

const loading = ref(true);
const recipe = ref(null);
const error = ref(null);

const fetchRecipe = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/getSingelRecipe/${props.id}`
    );
    if (!response.ok) throw new Error("Kunde inte hämta recept");
    const data = await response.json();
    recipe.value = data;
    console.log(data);
  } catch (error) {
    console.error(error);
    error.value = error.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchRecipe);
</script>

<template>
  <Header />
  <div class="p-4 pb-16 md:p-24 flex justify-center">
    <div
      v-if="recipe"
      class="p-4 px-4 w-full bg-white shadow-lg border border-solid border-gray-300 rounded-md text-black xl:w-4/5"
    >
      <div v-for="image in recipe.imageUrl" class="pb-4 flex justify-center">
        <img
          :src="image"
          :alt="`Bild på ${recipe.title}`"
          class="w-full md:w-3/4 lg:w-1/2 h-auto rounded-md mx-auto"
        />
      </div>

      <h1 class="flex justify-center pt-12 text-3xl">{{ recipe.title }}</h1>
      <div class="pt-12">
        <div class="flex gap-1">
          <p class="font-bold">Svårighetsgrad:</p>
          <span>{{ recipe.difficulty }}</span>
        </div>
        <div class="flex gap-1">
          <p class="font-bold">Tillagningstid:</p>
          <span>{{ recipe.cookingTime }}</span>
        </div>
        <div class="flex gap-1">
          <p class="font-bold">Kategori:</p>
          <p v-for="category in recipe.categories" :key="category">
            {{ category.name }}
          </p>
        </div>
      </div>

      <div class="pt-4">
        <h3 class="font-bold">Ingredienser</h3>
        <li v-for="ingredient in recipe.ingredients" :key="ingredient">
          {{ ingredient }}
        </li>
      </div>
      <div>
        <div class="pt-4">
          <h3 class="font-bold">Steg</h3>
          <ol class="list-decimal pl-5 space-y-2 text-gray-700">
            <li v-for="(step, index) in recipe.steps" :key="index">
              {{ step }}
            </li>
          </ol>
        </div>
      </div>
    </div>
    <div v-else-if="error">
      <p>Error: {{ error }}</p>
    </div>
  </div>
</template>
