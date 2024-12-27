import { createRouter, createWebHistory } from "vue-router";

import CreateRecipe from "../page/CreateRecipePage.vue";
import LikedRecipes from "../page/LikedRecipes.vue";
import LoginPage from "../page/LoginPage.vue";
import SingelRecipePage from "../page/SingelRecipePage.vue";
import StartPage from "../page/StartPage.vue";
import UserPage from "../page/UserPage.vue";
import UsersCreatedRecipes from "../page/UsersCreatedRecipesPage.vue";

const routes = [
  {
    path: "/",
    name: "start",
    component: StartPage,
    meta: { title: "Recept – Matkistan" },
  },
  {
    path: "/login",
    component: LoginPage,
    meta: { title: "Matkistan - Logga in" },
  },
  // {
  //   path: "/protected",
  //   component: UserPage,
  //   beforeEnter: (to, from, next) => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       alert("Du måste vara inloggad för att komma åt denna sida!");
  //       next("/login");
  //     } else {
  //       next();
  //     }
  //   },
  // },
  {
    path: "/profil",
    name: "profil",
    component: UserPage,
    meta: { title: "Matkistan - Profil" },
  },
  {
    path: "/createRecipe",
    name: "createRecipe",
    component: CreateRecipe,
    meta: { title: "Matkistan - Skapa nytt recept" },
  },
  {
    path: "/likedRecipes",
    name: "likedRecipes",
    component: LikedRecipes,
    meta: { title: "Matkistan - Mina favoriter" },
  },
  {
    path: "/singelRecipe/:id",
    name: "singelRecipe",
    component: SingelRecipePage,
    props: true,
    meta: { title: "Matkistan - Receptdetaljer" },
  },
  {
    path: "/userCreatedRecipes",
    name: "userCreatedRecipes",
    component: UsersCreatedRecipes,
    meta: { title: "Matkistan - Dina recept" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Matkistan";
  next();
});

export default router;
