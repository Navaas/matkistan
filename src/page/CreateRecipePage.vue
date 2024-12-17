<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Header from "../components/Header.vue";

const isLoggedIn = ref(false);
// const successMessage = ref("Receptet skapades framgångsrikt!");
const router = useRouter();

const getLoggedInUser = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_FETCH_URL}/auth`, {
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

  router.push("/userCreatedRecipes");
};

const fetchCategories = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_FETCH_URL}/categories`
    );
    if (response.ok) {
      categories.value = await response.json();
    } else {
      console.error("Kunde inte hämta kategorier");
    }
  } catch (error) {
    console.error("Nätverksfel vid hämtning av kategorier:", error);
  }
};

fetchCategories();

const onFileChange = (event) => {
  recipeForm.value.imageFile = event.target.files[0];
};

const addIngredient = () => {
  recipeForm.value.ingredients = recipeForm.value.ingredients.filter(
    (ingredient) => ingredient.trim() !== ""
  );

  recipeForm.value.ingredients.push("");
};

const addStep = () => {
  recipeForm.value.steps = recipeForm.value.steps.filter(
    (step) => step.trim() !== ""
  );

  recipeForm.value.steps.push("");
};

const submitRecipe = async () => {
  if (!isLoggedIn.value) {
    alert("Du måste vara inloggad för att skapa ett recept");
    return;
  }

  console.log("Inkommande data:", recipeForm.value);

  recipeForm.value.ingredients = recipeForm.value.ingredients.filter(
    (ingredient) => ingredient.trim() !== ""
  );
  recipeForm.value.steps = recipeForm.value.steps.filter(
    (step) => step.trim() !== ""
  );

  let pictureURL = "";
  if (recipeForm.value.imageFile) {
    try {
      const formData = new FormData();
      formData.append("image", recipeForm.value.imageFile);
      const res = await fetch(`${import.meta.env.VITE_FETCH_URL}/images`, {
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
    const response = await fetch(
      `${import.meta.env.VITE_FETCH_URL}/createRecipe`,
      {
        method: "POST",
        body: JSON.stringify(formData),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response:", formData);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Okänt fel vid skapande av recept");
    }

    const data = await response.json();
    console.log("Recept skapat:", data);
    // successMessage.value = "Receptet skapades framgångsrikt!";
    resetForm();
  } catch (error) {
    console.error("Fel vid skapande av recept:", error.message);
  }
};
</script>

<template>
  <!-- <div v-if="successMessage" class="mt-4 text-green-500">
    <p>{{ successMessage }}</p>
  </div> -->
  <Header />
  <div class="flex justify-center p-4 pb-16 md:py-24">
    <form
      v-if="isLoggedIn"
      @submit.prevent="submitRecipe"
      enctype="multipart/form-data"
      class="p-4 px-4 w-full bg-white shadow-lg border border-solid border-gray-300 rounded-md text-black xl:w-4/5"
    >
      <div class="flex flex-col pb-4">
        <label for="title" class="font-bold">Titel</label>
        <input
          id="title"
          v-model="recipeForm.title"
          required
          placeholder="Titel på recept"
          class="border border-solid border-gray-300 rounded-md p-1"
        />
      </div>

      <div class="flex flex-col pb-4">
        <label for="difficulty" class="font-bold">Svårighetsgrad</label>
        <select
          id="difficulty"
          v-model="recipeForm.difficulty"
          required
          class="border border-solid border-gray-300 rounded-md p-1"
        >
          <option value="Lätt">Lätt</option>
          <option value="Medel">Medel</option>
          <option value="Svår">Svår</option>
        </select>
      </div>

      <div class="flex flex-col pb-4">
        <label for="cookingTime" class="font-bold">Tillagningstid</label>
        <input
          id="cookingTime"
          v-model="recipeForm.cookingTime"
          required
          placeholder="Fyll i en tid"
          class="border border-solid border-gray-300 rounded-md p-1"
        />
      </div>

      <div class="flex flex-col pb-4">
        <label for="categories" class="font-bold">Kategorier</label>
        <select
          id="categories"
          v-model="recipeForm.categories"
          multiple
          required
          class="border border-solid border-gray-300"
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
      <div class="flex flex-col gap-2 pb-4">
        <label for="ingredient" class="font-bold">Ingredienser</label>
        <div v-for="(ingredient, index) in recipeForm.ingredients" :key="index">
          <input
            id="ingredient"
            v-model="recipeForm.ingredients[index]"
            placeholder="Ingrediens"
            class="border border-solid border-gray-300 rounded-md p-1"
          />
        </div>
        <div>
          <button
            type="button"
            @click="addIngredient"
            class="py-1 px-4 rounded-md bg-black text-white"
          >
            Lägg till
          </button>
        </div>
      </div>

      <div class="flex gap-2 flex-col pb-4">
        <label for="step" class="font-bold">Steg</label>
        <div v-for="(step, index) in recipeForm.steps" :key="index">
          <input
            id="step"
            v-model="recipeForm.steps[index]"
            placeholder="Steg 1"
            class="border border-solid border-gray-300 rounded-md p-1"
          />
        </div>
        <div>
          <button
            type="button"
            @click="addStep"
            class="py-1 px-4 rounded-md bg-black text-white"
          >
            Lägg till
          </button>
        </div>
      </div>

      <div class="flex flex-col pb-12">
        <label for="image" class="font-bold">Lägg till bild</label>
        <input type="file" id="image" @change="onFileChange" />
      </div>

      <button type="submit" class="py-2 px-4 rounded-md bg-black text-white">
        Skapa recept
      </button>
    </form>
    <div v-else>
      <p>Du måste vara inloggad för att skapa ett recept.</p>
    </div>
  </div>
</template>
