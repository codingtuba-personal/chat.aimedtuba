import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Recipe from '../views/Recipe.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },{
    path: '/login',
    name: 'Login',
    component: Login
  },{
    path: '/register',
    name: 'Register',
    component: Register
  },{
    path: '/:userid/user',
    name: 'User',
    component: User
  },{
    path: '/:userid/:recipeid/recipe',
    name: 'Recipe',
    component: Recipe
  },{
    path: '/:userid/dashboard',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
