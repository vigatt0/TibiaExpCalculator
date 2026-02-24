<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useGoalStore } from '../stores/goals'
import { formatNumber } from '../utils/expCalculator'

const auth = useAuthStore()
const goalStore = useGoalStore()

onMounted(async () => {
  await auth.fetchUser()
  await goalStore.fetchGoals()
})

async function remove(id) {
  if (confirm('Delete this goal?')) {
    await goalStore.deleteGoal(id)
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-1">Dashboard</h1>
    <p class="text-gray-400 mb-6">Welcome back, <span class="text-emerald-400">{{ auth.user?.username }}</span></p>

    <div v-if="goalStore.loading" class="text-gray-400 text-center py-8">Loading goals...</div>

    <div v-else-if="goalStore.goals.length === 0" class="text-gray-500 text-center py-8">
      <p>No goals yet.</p>
      <router-link to="/" class="text-emerald-400 hover:underline">Create one with the calculator →</router-link>
    </div>

    <div v-else class="space-y-4">
      <div v-for="goal in goalStore.goals" :key="goal._id" class="bg-gray-800 rounded-lg p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-lg">{{ goal.characterName }}</h3>
          <button @click="remove(goal._id)" class="text-gray-500 hover:text-red-400 text-sm cursor-pointer">✕ Delete</button>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p class="text-gray-400">Level</p>
            <p class="font-mono">{{ goal.currentLevel }} → {{ goal.targetLevel }}</p>
          </div>
          <div>
            <p class="text-gray-400">Remaining EXP</p>
            <p class="font-mono text-yellow-400">{{ formatNumber(goal.remainingExp) }}</p>
          </div>
          <div>
            <p class="text-gray-400">EXP/Day</p>
            <p class="font-mono text-blue-400">{{ formatNumber(goal.expPerDay) }}</p>
          </div>
          <div>
            <p class="text-gray-400">EXP/Hour</p>
            <p class="font-mono text-emerald-400">{{ formatNumber(goal.expPerHour) }}</p>
          </div>
          <div>
            <p class="text-gray-400">Timeframe</p>
            <p class="font-mono">{{ goal.days }}d × {{ goal.hoursPerDay }}h</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
