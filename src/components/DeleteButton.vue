<script setup>
import { ref } from "vue";
import { isLoggedIn } from "../utils/checkLoginHandler";

const props = defineProps({
  recipeId: String,
});

const emit = defineEmits(["recipeDeleted"]);
const isDeleting = ref(false);

const deleteRecipe = async () => {
  if (!isLoggedIn.value) {
    console.error("Användaren måste vara inloggad för att ta bort ett recept");
    return;
  }

  if (!confirm("Är du säker på att du vill ta bort detta recept?")) {
    return;
  }

  isDeleting.value = true;
  try {
    const response = await fetch(
      `https://matkistan.onrender.com/recipes/${props.recipeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    const result = await response.json();
    if (response.ok) {
      emit("recipeDeleted", props.recipeId);
    } else {
      console.error("Fel vid borttagning av recept:", result.message);
    }
  } catch (error) {
    console.error("Fel vid borttagning av recept:", error);
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <button
    v-if="isLoggedIn"
    @click="deleteRecipe"
    :disabled="isDeleting"
    aria-label="Ta bort ett recept"
  >
    <h3
      class="material-icons text-[#16282E] cursor-pointer text-2xl md:text-3xl"
    >
      delete
    </h3>
  </button>
</template>

<style scoped>
button:focus {
  outline: 2px solid #000;
  outline-offset: 2px;
}
</style>
