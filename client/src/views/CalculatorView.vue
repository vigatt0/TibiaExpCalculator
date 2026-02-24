<script setup>
import { ref, reactive, computed } from 'vue'
import { calculateExpGoal, formatNumber } from '../utils/expCalculator'
import { useAuthStore } from '../stores/auth'
import { useGoalStore } from '../stores/goals'

const auth = useAuthStore()
const goalStore = useGoalStore()

const form = reactive({
  currentLevel: null,
  targetLevel: null,
  days: null,
  hoursPerDay: null,
  characterName: '',
})

const result = ref(null)
const error = ref('')
const saveMsg = ref('')

function calculate() {
  error.value = ''
  result.value = null
  saveMsg.value = ''

  if (!form.currentLevel || !form.targetLevel || !form.days || !form.hoursPerDay) {
    error.value = 'Please fill in all fields.'
    return
  }
  if (form.currentLevel >= form.targetLevel) {
    error.value = 'Target level must be greater than current level.'
    return
  }
  if (form.days <= 0 || form.hoursPerDay <= 0 || form.hoursPerDay > 24) {
    error.value = 'Please enter valid days and hours.'
    return
  }

  result.value = calculateExpGoal(
    Number(form.currentLevel),
    Number(form.targetLevel),
    Number(form.days),
    Number(form.hoursPerDay)
  )
}

async function saveGoal() {
  if (!result.value) return
  saveMsg.value = ''
  try {
    await goalStore.createGoal({
      characterName: form.characterName || 'My Character',
      currentLevel: Number(form.currentLevel),
      targetLevel: Number(form.targetLevel),
      days: Number(form.days),
      hoursPerDay: Number(form.hoursPerDay),
    })
    saveMsg.value = 'Goal saved to your dashboard!'
  } catch (err) {
    saveMsg.value = 'Failed to save goal.'
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-center mb-2">⚔️ EXP Goal Calculator</h1>
    <p class="text-gray-400 text-center mb-8">Plan your Tibia leveling journey</p>

    <div class="bg-gray-800 rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm text-gray-400 mb-1">Current Level</label>
          <input v-model.number="form.currentLevel" type="number" min="1" placeholder="e.g. 500"
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Target Level</label>
          <input v-model.number="form.targetLevel" type="number" min="2" placeholder="e.g. 700"
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Days to Reach Goal</label>
          <input v-model.number="form.days" type="number" min="1" placeholder="e.g. 15"
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-1">Hours per Day</label>
          <input v-model.number="form.hoursPerDay" type="number" min="0.1" max="24" step="0.5" placeholder="e.g. 3"
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div v-if="auth.isLoggedIn" class="mb-4">
        <label class="block text-sm text-gray-400 mb-1">Character Name (optional)</label>
        <input v-model="form.characterName" type="text" placeholder="e.g. My Knight"
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
      </div>

      <p v-if="error" class="text-red-400 text-sm mb-3">{{ error }}</p>

      <button @click="calculate"
        class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded cursor-pointer transition">
        Calculate
      </button>
    </div>

    <div v-if="result" class="bg-gray-800 rounded-lg p-6">
      <h2 class="text-xl font-bold mb-4 text-emerald-400">📊 Results</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="bg-gray-700 rounded p-3">
          <p class="text-xs text-gray-400">Current EXP (Level {{ form.currentLevel }})</p>
          <p class="text-lg font-mono font-bold">{{ formatNumber(result.currentExp) }}</p>
        </div>
        <div class="bg-gray-700 rounded p-3">
          <p class="text-xs text-gray-400">Target EXP (Level {{ form.targetLevel }})</p>
          <p class="text-lg font-mono font-bold">{{ formatNumber(result.targetExp) }}</p>
        </div>
        <div class="bg-gray-700 rounded p-3">
          <p class="text-xs text-gray-400">Remaining EXP</p>
          <p class="text-lg font-mono font-bold text-yellow-400">{{ formatNumber(result.remainingExp) }}</p>
        </div>
        <div class="bg-gray-700 rounded p-3">
          <p class="text-xs text-gray-400">EXP per Day</p>
          <p class="text-lg font-mono font-bold text-blue-400">{{ formatNumber(result.expPerDay) }}</p>
        </div>
        <div class="bg-gray-700 rounded p-3 sm:col-span-2">
          <p class="text-xs text-gray-400">EXP per Hour ({{ form.hoursPerDay }}h/day)</p>
          <p class="text-lg font-mono font-bold text-emerald-400">{{ formatNumber(result.expPerHour) }}</p>
        </div>
      </div>

      <div v-if="auth.isLoggedIn" class="mt-4">
        <button @click="saveGoal"
          class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded cursor-pointer transition">
          💾 Save Goal to Dashboard
        </button>
        <p v-if="saveMsg" class="text-sm mt-2 text-center" :class="saveMsg.includes('saved') ? 'text-emerald-400' : 'text-red-400'">
          {{ saveMsg }}
        </p>
      </div>
      <p v-else class="text-gray-500 text-sm text-center mt-4">
        <router-link to="/login" class="text-emerald-400 hover:underline">Log in</router-link> to save this goal.
      </p>
    </div>
  </div>
</template>
