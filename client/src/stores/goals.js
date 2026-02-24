import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../utils/api';

export const useGoalStore = defineStore('goals', () => {
  const goals = ref([]);
  const loading = ref(false);

  async function fetchGoals() {
    loading.value = true;
    try {
      const { data } = await api.get('/goals');
      goals.value = data;
    } finally {
      loading.value = false;
    }
  }

  async function createGoal(goalData) {
    const { data } = await api.post('/goals', goalData);
    goals.value.unshift(data);
    return data;
  }

  async function deleteGoal(id) {
    await api.delete(`/goals/${id}`);
    goals.value = goals.value.filter((g) => g._id !== id);
  }

  return { goals, loading, fetchGoals, createGoal, deleteGoal };
});
