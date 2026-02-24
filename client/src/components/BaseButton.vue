<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-emerald-600 hover:bg-emerald-500 text-white'
    case 'secondary':
      return 'bg-blue-600 hover:bg-blue-500 text-white'
    case 'danger':
      return 'bg-red-600 hover:bg-red-500 text-white'
    default:
      return 'bg-emerald-600 hover:bg-emerald-500 text-white'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="w-full font-semibold py-2 px-4 rounded cursor-pointer transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
    :class="[variantClasses, disabled ? 'opacity-50 cursor-not-allowed' : '']"
  >
    <slot></slot>
  </button>
</template>
