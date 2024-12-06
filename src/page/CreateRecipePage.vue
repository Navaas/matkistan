<script setup>
import { onMounted, ref } from "vue";
import Header from "../components/Header.vue";

const isLoggedIn = ref(false);
const successMessage = ref("");

const getLoggedInUser = async () => {
  try {
    const response = await fetch("http://localhost:3000/auth", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        isLoggedIn.value = true;
      }
    } else {
      isLoggedIn.value = false;
    }
  } catch (error) {
    console.error("Fel vid hämtning av användardata:", error);
    isLoggedIn.value = false;
  }
};

// Kör funktionen när komponenten har laddats
onMounted(getLoggedInUser);

const recipeForm = ref({
  title: "",
  ingredients: [""],
  steps: [""],
  difficulty: "",
  cookingTime: "",
  categories: [],
  imageFile: null,
});

const categories = ref([]);

const resetForm = () => {
  recipeForm.value = {
    title: "",
    ingredients: [""],
    steps: [""],
    difficulty: "",
    cookingTime: "",
    categories: [],
    imageFile: null,
  };
};

const fetchCategories = async () => {
  try {
    const response = await fetch("http://localhost:3000/categories");
    if (response.ok) {
      categories.value = await response.json();
    } else {
      console.error("Kunde inte hämta kategorier");
    }
  } catch (error) {
    console.error("Nätverksfel vid hämtning av kategorier:", error);
  }
};

// Kör vid komponentens montering
fetchCategories();

const onFileChange = (event) => {
  recipeForm.value.imageFile = event.target.files[0];
};

const addIngredient = () => {
  recipeForm.value.ingredients.push("");
};

const addStep = () => {
  recipeForm.value.steps.push("");
};

const submitRecipe = async () => {
  if (!isLoggedIn.value) {
    alert("Du måste vara inloggad för att skapa ett recept");
    return;
  }

  console.log("Inkommande data:", recipeForm.value);

  let pictureURL = "";
  if (recipeForm.value.imageFile) {
    try {
      const formData = new FormData();
      formData.append("image", recipeForm.value.imageFile);
      const res = await fetch("http://localhost:3000/images", {
        method: "post",
        body: formData,
      });
      pictureURL = await res.json();
    } catch (error) {
      console.error("Error uploading image", error);
    }
  }
  console.log("PictureURL:", pictureURL);
  const formData = {
    title: recipeForm.value.title,
    ingredients: recipeForm.value.ingredients,
    steps: recipeForm.value.steps,
    difficulty: recipeForm.value.difficulty,
    cookingTime: recipeForm.value.cookingTime,
    categories: recipeForm.value.categories,
    imageUrl: [pictureURL.url],
  };
  try {
    const response = await fetch("http://localhost:3000/createRecipe", {
      method: "POST",
      body: JSON.stringify(formData),
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log("Response:", formData);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Okänt fel vid skapande av recept");
    }

    const data = await response.json();
    console.log("Recept skapat:", data);
    successMessage.value = "Receptet skapades framgångsrikt!";
    resetForm();
  } catch (error) {
    console.error("Fel vid skapande av recept:", error.message);
  }
};
</script>

<template>
  <div v-if="successMessage" class="mt-4 text-green-500">
    <p>{{ successMessage }}</p>
  </div>
  <Header />
  <form
    v-if="isLoggedIn"
    @submit.prevent="submitRecipe"
    enctype="multipart/form-data"
    class="pt-12 px-4"
  >
    <div class="flex flex-col">
      <label for="title" class="font-bold">Titel</label>
      <input
        id="title"
        v-model="recipeForm.title"
        required
        class="border border-black"
      />
    </div>

    <div class="flex flex-col">
      <label for="difficulty" class="font-bold">Svårighetsgrad</label>
      <select
        id="difficulty"
        v-model="recipeForm.difficulty"
        required
        class="border borer-black"
      >
        <option value="Lätt">Lätt</option>
        <option value="Medel">Medel</option>
        <option value="Svår">Svår</option>
      </select>
    </div>

    <div class="flex flex-col">
      <label for="cookingTime" class="font-bold">Tillagningstid</label>
      <input
        id="cookingTime"
        v-model="recipeForm.cookingTime"
        required
        class="border border-black"
      />
    </div>

    <div class="flex flex-col">
      <label for="categories" class="font-bold">Kategorier</label>
      <select
        id="categories"
        v-model="recipeForm.categories"
        multiple
        required
        class="border border-black"
      >
        <option
          v-for="category in categories"
          :key="category._id"
          :value="category.name"
        >
          {{ category.name }}
        </option>
      </select>
    </div>
    <div>
      <label class="font-bold">Ingredienser</label>
      <div v-for="(ingredient, index) in recipeForm.ingredients" :key="index">
        <input
          v-model="recipeForm.ingredients[index]"
          class="border border-black"
        />
      </div>
      <button
        type="button"
        @click="addIngredient"
        class="py-2 px-2 bg-black text-white"
      >
        Lägg till ingrediens
      </button>
    </div>

    <div>
      <label class="font-bold">Steg</label>
      <div v-for="(step, index) in recipeForm.steps" :key="index">
        <input v-model="recipeForm.steps[index]" class="border border-black" />
      </div>
      <button
        type="button"
        @click="addStep"
        class="py-2 px-2 bg-black text-white"
      >
        Lägg till steg
      </button>
    </div>

    <div class="flex flex-col">
      <label for="image" class="font-bold">Lägg till bild</label>
      <input type="file" id="image" @change="onFileChange" />
    </div>

    <button type="submit" class="py-2 px-2 bg-black text-white">
      Skapa recept
    </button>
  </form>

  <div v-else>
    <p>Du måste vara inloggad för att skapa ett recept.</p>
  </div>
</template>
