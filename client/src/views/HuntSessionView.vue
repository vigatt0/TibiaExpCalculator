<script setup>
import { ref, watch } from 'vue'
import { parsePartyHuntLog, calculatePartySplit, formatGold } from '../utils/farmCalculator'
import { formatNumber } from '../utils/expCalculator'
import BaseButton from '../components/BaseButton.vue'

// Session/Party Calculator State
const partyLog = ref('');
const parsedPlayers = ref([]);
const sessionResult = ref(null);

// Watch for log changes to auto-parse
watch(partyLog, (newVal) => {
    if (newVal) {
        const result = parsePartyHuntLog(newVal);
        if (result && result.length > 0) {
            parsedPlayers.value = result;
        }
    }
});

function addPlayer() {
    parsedPlayers.value.push({ name: `Player ${parsedPlayers.value.length + 1}`, loot: 0, supplies: 0, balance: 0 });
}

function removePlayer(index) {
    parsedPlayers.value.splice(index, 1);
}

function calculateSession() {
    // If no players yet, default to single player manual input
    if (parsedPlayers.value.length === 0) {
         parsedPlayers.value.push({ name: 'Me', loot: 0, supplies: 0, balance: 0 });
    }

    sessionResult.value = calculatePartySplit(parsedPlayers.value);
}

const copiedIndex = ref(null)
const copiedAll = ref(false)

function copyTransfer(text, index) {
    navigator.clipboard.writeText(text);
    copiedIndex.value = index;
    setTimeout(() => { copiedIndex.value = null; }, 1500);
}

function copyAllTransfers() {
    if (!sessionResult.value) return;
    const lines = sessionResult.value.transfers.map(
        t => `${t.from} pays ${t.amount} to ${t.to} (transfer ${t.amount} to ${t.to})`
    ).join('\n');
    navigator.clipboard.writeText(lines);
    copiedAll.value = true;
    setTimeout(() => { copiedAll.value = false; }, 1500);
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-2">⚔️ Army/Party Hunt Session</h1>
    <p class="text-gray-400 text-center mb-8">Analyze your hunt logs and split profit</p>

    <div class="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 class="text-lg font-semibold text-white mb-4">Paste Log</h3>
        <p class="text-sm text-gray-400 mb-2">Paste your "Party Hunt" log from Tibia below:</p>
        
        <textarea 
            v-model="partyLog"
            class="w-full bg-gray-900 border border-gray-600 rounded p-3 text-xs font-mono text-gray-300 focus:border-emerald-500 min-h-[100px]"
            placeholder="Paste log here... (Session: 01:00h ...)"
        ></textarea>

        <div class="mt-6">
            <div class="flex justify-between items-center mb-2">
                <h4 class="text-md font-bold text-gray-300">Players & Values</h4>
                <button @click="addPlayer" class="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">+ Add Player</button>
            </div>
            
            <div v-for="(player, index) in parsedPlayers" :key="index" class="bg-gray-700/50 p-3 rounded mb-2 border border-gray-700">
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                    <div class="sm:col-span-1">
                        <label class="block text-xs text-gray-400 mb-1">Name</label>
                        <input v-model="player.name" type="text" class="w-full bg-gray-600 rounded px-2 py-1 text-sm text-white" />
                    </div>
                        <div>
                        <label class="block text-xs text-gray-400 mb-1">Loot</label>
                        <input v-model.number="player.loot" type="number" class="w-full bg-gray-600 rounded px-2 py-1 text-sm text-emerald-300" />
                    </div>
                        <div>
                        <label class="block text-xs text-gray-400 mb-1">Supplies</label>
                        <input v-model.number="player.supplies" type="number" class="w-full bg-gray-600 rounded px-2 py-1 text-sm text-red-300" />
                    </div>
                    <div>
                            <label class="block text-xs text-gray-400 mb-1">Balance</label>
                            <input 
                            :value="player.loot - player.supplies" 
                            @input="player.balance = $event.target.value" 
                            class="w-full bg-gray-900 rounded px-2 py-1 text-sm text-gray-300" 
                            disabled
                            />
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6">
            <BaseButton @click="calculateSession">Analyze Party Split</BaseButton>
        </div>
        </div>

        <div v-if="sessionResult" class="bg-gray-800 rounded-lg p-6 animate-fade-in">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-xl font-bold text-emerald-400">📊 Party Results</h2>
                <div class="text-right">
                    <p class="text-xs text-gray-400">Total Profit</p>
                    <p class="text-xl font-bold text-emerald-400">{{ formatNumber(sessionResult.totalBalance) }}</p>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div class="bg-gray-700 rounded p-3 text-center">
                    <p class="text-xs text-gray-400">Total Loot</p>
                    <p class="text-lg font-mono font-bold text-emerald-300">{{ formatGold(sessionResult.totalLoot) }}</p>
                </div>
                <div class="bg-gray-700 rounded p-3 text-center">
                    <p class="text-xs text-gray-400">Total Waste</p>
                    <p class="text-lg font-mono font-bold text-red-300">{{ formatGold(sessionResult.totalSupplies) }}</p>
                </div>
                <div class="bg-gray-700 rounded p-3 text-center border border-emerald-500/50">
                    <p class="text-xs text-gray-400 uppercase font-bold">Profit Per Player</p>
                    <p class="text-lg font-mono font-bold text-white">{{ formatNumber(sessionResult.profitPerPlayer) }}</p>
                </div>
            </div>

            <div v-if="sessionResult.transfers.length > 0" class="bg-gray-900 rounded p-4 border border-emerald-900">
                <div class="flex justify-between items-center mb-3">
                    <h4 class="text-sm font-bold text-white">💸 Bank Transfers Required</h4>
                    <button
                        @click="copyAllTransfers"
                        :class="copiedAll
                            ? 'bg-emerald-600 text-white scale-105 shadow-lg shadow-emerald-900'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white hover:scale-105'"
                        class="transition-all duration-200 text-xs px-3 py-1.5 rounded font-semibold cursor-pointer"
                    >{{ copiedAll ? '✅ Copied!' : '📋 Copy All' }}</button>
                </div>
                <ul class="space-y-2">
                    <li v-for="(transfer, i) in sessionResult.transfers" :key="i" class="flex justify-between items-center bg-gray-800 p-2 rounded">
                        <div class="text-sm">
                            <span class="font-bold text-red-400">{{ transfer.from }}</span>
                            <span class="text-gray-400 mx-2">pays</span>
                            <span class="font-bold text-emerald-400">{{ transfer.to }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="font-mono font-bold">{{ formatNumber(transfer.amount) }}</span>
                            <button
                                @click="copyTransfer(`${transfer.from} pays ${transfer.amount} to ${transfer.to} (transfer ${transfer.amount} to ${transfer.to})`, i)"
                                :class="copiedIndex === i
                                    ? 'bg-emerald-600 text-white scale-110 shadow-lg shadow-emerald-900'
                                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white hover:scale-105'"
                                class="transition-all duration-200 text-xs px-2 py-1 rounded cursor-pointer"
                                :title="copiedIndex === i ? 'Copied!' : 'Copy transfer command'"
                            >{{ copiedIndex === i ? '✅' : '📋' }}</button>
                        </div>
                    </li>
                </ul>
                <p class="text-xs text-gray-500 mt-2 text-center">Click 📋 to copy the bank transfer command.</p>
            </div>
            <div v-else class="text-center text-gray-500 py-4">
                No transfers needed. Everyone is balanced!
            </div>
        </div>
  </div>
</template>
