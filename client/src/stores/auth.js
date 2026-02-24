import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../utils/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || '');

  const isLoggedIn = computed(() => !!token.value);

  async function register(username, email, password) {
    const { data } = await api.post('/auth/register', { username, email, password });
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('token', data.token);
  }

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem('token', data.token);
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      const { data } = await api.get('/auth/me');
      user.value = data.user;
    } catch {
      logout();
    }
  }

  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
  }

  return { user, token, isLoggedIn, register, login, fetchUser, logout };
});
