<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const activeTab = ref('exp-calculator');

function logout() {
  auth.logout();
  router.push('/');
}

function navigateTo(tab) {
  activeTab.value = tab;
  if (tab === 'exp-calculator') router.push('/');
  else if (tab === 'farm-goal') router.push('/farm');
  else if (tab === 'party-hunt') router.push('/hunt-session');
}
</script>

<template>
  <nav class="bg-gray-800 border-b border-gray-700">
    <div class="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
      <router-link to="/" class="text-xl font-bold text-emerald-400 hover:text-emerald-300">
        ⚔️ TibiaExp
      </router-link>
      <div class="flex items-center gap-4">
        <div class="flex space-x-4">
          <button
            :class="{
              'text-white border-b-2 border-emerald-400': activeTab === 'exp-calculator',
              'text-gray-300 hover:text-white': activeTab !== 'exp-calculator'
            }"
            class="text-sm px-3 py-2"
            @click="navigateTo('exp-calculator')"
          >
            Exp Calculator
          </button>
          <button
            :class="{
              'text-white border-b-2 border-emerald-400': activeTab === 'farm-goal',
              'text-gray-300 hover:text-white': activeTab !== 'farm-goal'
            }"
            class="text-sm px-3 py-2"
            @click="navigateTo('farm-goal')"
          >
            Farm Goal
          </button>
          <button
            :class="{
              'text-white border-b-2 border-emerald-400': activeTab === 'party-hunt',
              'text-gray-300 hover:text-white': activeTab !== 'party-hunt'
            }"
            class="text-sm px-3 py-2"
            @click="navigateTo('party-hunt')"
          >
            Party Hunt
          </button>
        </div>
        <template v-if="auth.isLoggedIn">
          <router-link to="/dashboard" class="text-gray-300 hover:text-white text-sm">Dashboard</router-link>
          <button @click="logout" class="text-sm text-gray-400 hover:text-white cursor-pointer">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="text-gray-300 hover:text-white text-sm">Login</router-link>
          <router-link to="/register" class="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-3 py-1 rounded">
            Register
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>
