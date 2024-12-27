<script setup>
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import LoginForm from "../components/LoginForm.vue";
</script>

<template>
  <Header />
  <main class="flex flex-col-reverse pt-12 md:flex-row md:pt-10">
    <section class="relative w-full">
      <img
        src="https://images.unsplash.com/photo-1505935428862-770b6f24f629?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Detta är en bild på ett bord med en paj, äpplen och lite gröna växter"
        class="w-full h-1/2 md:h-[800px] object-cover"
      />

      <section
        class="absolute px-6 inset-0 flex flex-col justify-center items-center text-center w-full md:h-full bg-black/50 gap-4 md:gap-6"
      >
        <h1 class="text-2xl md:text-5xl text-white">Välkommen in till oss..</h1>
        <LoginForm
          aria-label="Fyll i användarnamn och lösenord för att logga in"
        />
      </section>
    </section>
  </main>
  <Footer />
</template>

<style></style>
