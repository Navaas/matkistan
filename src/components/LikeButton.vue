<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  recipeId: String,
});

const isLiked = ref(false);

const fetchLikeStatus = async () => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    const response = await fetch("https://matkistan.onrender.com/like/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipeId: props.recipeId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    isLiked.value = data.isLiked;
  } catch (error) {
    console.error("Failed to fetch like status", error);
  }
};

const toggleLike = async () => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    const response = await fetch("https://matkistan.onrender.com/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipeId: props.recipeId }),
    });

    const result = await response.json();
    console.log("Response from server during toggleLike:", result);

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
    <span
      class="material-icons text-2xl md:text-3xl"
      :class="isLiked ? 'text-red-600' : 'text-gray-500'"
    >
      favorite
    </span>
  </div>
</template>
