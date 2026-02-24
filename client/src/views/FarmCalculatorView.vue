<script setup>
import { reactive, ref } from 'vue'
import { calculateGoldGoal, formatGold } from '../utils/farmCalculator'
import { formatNumber } from '../utils/expCalculator'
import BaseButton from '../components/BaseButton.vue'

// Goal Calculator State
const goalForm = reactive({
  targetGold: null,
  currentGold: null,
  days: null,
  hoursPerDay: null,
  tibiaCoinPriceGold: null,
  tibiaCoinPriceReal: null
})
const goalResult = ref(null)

function calculateGoal() {
    const { targetGold, currentGold, days, hoursPerDay, tibiaCoinPriceGold, tibiaCoinPriceReal } = goalForm;
    
    if (!targetGold || !days || !hoursPerDay) return;

    const result = calculateGoldGoal(targetGold, currentGold || 0, days, hoursPerDay);
    
    // Additional Tibia Coin Calculations
    let totalTC = 0;
    let totalReal = 0;
    
    if (tibiaCoinPriceGold) {
        totalTC = Math.ceil(result.remainingGold / tibiaCoinPriceGold);
    }
    
    if (totalTC > 0 && tibiaCoinPriceReal) {
        const pricePerTC = tibiaCoinPriceReal / 250;
        totalReal = (totalTC * pricePerTC).toFixed(2);
    }

    goalResult.value = { 
        ...result, 
        totalTC, 
        totalReal 
    };
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-2">💰 Farm Goal Calculator</h1>
    <p class="text-gray-400 text-center mb-8">Optimize your gold farming strategy</p>

    <div class="bg-gray-800 rounded-lg p-6 mb-6">
    <h3 class="text-lg font-semibold text-white mb-4">Calculate Goal Routine</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
        <label class="block text-sm text-gray-400 mb-1">Target Gold Amount</label>
        <input v-model.number="goalForm.targetGold" type="number" min="0" placeholder="10000000"
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        <p class="text-xs text-gray-500 mt-1">Example: 100kk = 100000000</p>
        </div>
        <div>
        <label class="block text-sm text-gray-400 mb-1">Current Gold (Optional)</label>
        <input v-model.number="goalForm.currentGold" type="number" min="0" placeholder="0"
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
        <label class="block text-sm text-gray-400 mb-1">Days to Reach Goal</label>
        <input v-model.number="goalForm.days" type="number" min="1" placeholder="30"
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
        <label class="block text-sm text-gray-400 mb-1">Hours per Day</label>
        <input v-model.number="goalForm.hoursPerDay" type="number" min="0.5" max="24" step="0.5" placeholder="3"
            class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
        </div>
    </div>

    <!-- Optional: Tibia Coin Conversion Params -->
    <div class="border-t border-gray-700 pt-4 mt-4">
        <h4 class="text-sm font-semibold text-gray-300 mb-2">Currency Conversion (Optional)</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label class="block text-sm text-gray-400 mb-1">Tibia Coin Price (in Gold)</label>
                <input v-model.number="goalForm.tibiaCoinPriceGold" type="number" min="1" placeholder="40000"
                    class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
                <p class="text-xs text-gray-500 mt-1">Price of 1 TC</p>
            </div>
            <div>
                <label class="block text-sm text-gray-400 mb-1">Tibia Coin Price (in Real - R$)</label>
                <input v-model.number="goalForm.tibiaCoinPriceReal" type="number" min="1" step="0.01" placeholder="45.00"
                    class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500" />
                <p class="text-xs text-gray-500 mt-1">Price of 250 TC Pack</p>
            </div>
        </div>
    </div>

    <div class="mt-6">
            <BaseButton @click="calculateGoal">Calculate Goal</BaseButton>
    </div>
    </div>

    <!-- GOAL RESULTS -->
    <div v-if="goalResult" class="bg-gray-800 rounded-lg p-6 animate-fade-in">
    <h2 class="text-xl font-bold mb-4 text-emerald-400">📊 Farm Plan</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div class="bg-gray-700 rounded p-3">
            <p class="text-xs text-gray-400">Total Gold Needed</p>
            <p class="text-lg font-mono font-bold text-yellow-400">{{ formatGold(goalResult.remainingGold) }}</p>
            <p class="text-xs text-gray-500">{{ formatNumber(goalResult.remainingGold) }}</p>
        </div>
            <div class="bg-gray-700 rounded p-3">
            <p class="text-xs text-gray-400">Profit Needed / Day</p>
            <p class="text-lg font-mono font-bold">{{ formatGold(goalResult.goldPerDay) }}</p>
        </div>
            <div class="bg-gray-700 rounded p-3 col-span-1 sm:col-span-2 lg:col-span-2 border border-emerald-500/30">
            <p class="text-xs text-emerald-400 font-bold uppercase">Target Profit / Hour</p>
            <p class="text-2xl font-mono font-bold text-white">{{ formatGold(goalResult.goldPerHour) }}/h</p>
            <p class="text-xs text-gray-400">maintain this profit for {{ goalForm.hoursPerDay }}h daily</p>
        </div>
    </div>

    <div v-if="goalResult.totalTC > 0" class="bg-gray-700/50 rounded p-4 mt-4 border border-gray-600">
            <h4 class="text-sm font-bold text-white mb-2">💰 Value Estimate</h4>
            <div class="flex flex-col sm:flex-row gap-6">
                <div>
                    <p class="text-xs text-gray-400">In Tibia Coins</p>
                    <p class="text-xl font-bold text-blue-400">{{ formatNumber(goalResult.totalTC) }} TC</p>
                </div>
                <div v-if="goalResult.totalReal > 0">
                    <p class="text-xs text-gray-400">In Real (BRL)</p>
                    <p class="text-xl font-bold text-green-400">R$ {{ goalResult.totalReal }}</p>
                </div>
            </div>
    </div>
    </div>
  </div>
</template>
