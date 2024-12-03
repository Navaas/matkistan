<script setup>
import { onMounted, ref } from "vue";
import { getLoggedInUser } from "./utils/checkLoginHandler";
const isLoggedIn = ref(false);

onMounted(async () => {
  isLoggedIn.value = await getLoggedInUser();
});
</script>

<template>
  <router-view />
</template>
