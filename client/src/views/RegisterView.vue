<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({ username: '', email: '', password: '' })
const error = ref('')

async function submit() {
  error.value = ''
  try {
    await auth.register(form.username, form.email, form.password)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed.'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-center mb-6">Register</h1>
    <form @submit.prevent="submit" class="bg-gray-800 rounded-lg p-6 space-y-4">
      <div>
        <label class="block text-sm text-gray-400 mb-1">Username</label>
        <input v-model="form.username" type="text" required minlength="3" maxlength="30"
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Email</label>
        <input v-model="form.email" type="email" required
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
      </div>
      <div>
        <label class="block text-sm text-gray-400 mb-1">Password</label>
        <input v-model="form.password" type="password" required minlength="6"
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
      </div>
      <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
      <button type="submit"
        class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded cursor-pointer transition">
        Register
      </button>
      <p class="text-gray-400 text-sm text-center">
        Already have an account?
        <router-link to="/login" class="text-emerald-400 hover:underline">Login</router-link>
      </p>
    </form>
  </div>
</template>
