<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  recipeId: String,
});

const isLiked = ref(false);

const fetchLikeStatus = async () => {
  try {
    const response = await fetch("http://localhost:3000/like/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: props.recipeId }),
      credentials: "include",
    });

    const data = await response.json();

    isLiked.value = data.isLiked;
  } catch (error) {
    console.error("Failed to fetch like status", error);
  }
};

const toggleLike = async () => {
  try {
    const response = await fetch("http://localhost:3000/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: props.recipeId }),
      credentials: "include",
    });

    const result = await response.json();
    console.log("Respons från server vid toggleLike:", result); // Lägg till denna logg

    if (result.message === "Recipe liked") {
      isLiked.value = true;
    } else if (result.message === "Like removed") {
      isLiked.value = false;
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};

onMounted(() => {
  fetchLikeStatus();
});
</script>

<template>
  <div
    @click="toggleLike"
    class="cursor-pointer inline-block transition-transform transform hover:scale-110"
  >
    <svg
      :class="isLiked ? 'text-red-500' : 'text-gray-400'"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1 4.5 2.09C13.09 4.5 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  </div>
</template>
