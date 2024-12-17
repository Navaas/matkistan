<script setup>
import { ref } from "vue";

const props = defineProps({
  recipeId: String,
});

const emit = defineEmits(["recipeDeleted"]);
const isDeleting = ref(false);

const deleteRecipe = async () => {
  isDeleting.value = true;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_FETCH_URL}/recipes/${props.recipeId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (response.ok) {
      emit("recipeDeleted", props.recipeId);
    } else {
      console.error("Error deleting recipe:", result.message);
    }
  } catch (error) {
    console.error("An error occurred while deleting the recipe:", error);
  } finally {
    isDeleting.value = false;
  }
};
</script>

<template>
  <button @click="deleteRecipe" :disabled="isDeleting">
    <span class="material-icons text-slate-800 cursor-pointer text-3xl">
      delete
    </span>
  </button>
</template>
