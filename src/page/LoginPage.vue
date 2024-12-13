<script setup>
import Header from "../components/Header.vue";
import LoginForm from "../components/LoginForm.vue";
</script>

<template>
  <Header />
  <main class="flex flex-col-reverse md:flex-row px-2 md:pt-14">
    <section class="w-full max-h-80">
      <img
        src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Bild på färgglad mat på en tallrik"
        class="w-full h-full object-cover"
      />
    </section>
    <section
      class="flex flex-col px-2 pt-2 pb-4 justify-center items-center text-center w-full md:max-h-80 gap-4 md:gap-6 bg-green-100"
    >
      <LoginForm />
    </section>
  </main>
</template>

<style></style>
