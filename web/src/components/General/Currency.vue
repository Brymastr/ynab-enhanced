<template>
  <div
    :class="[
      { 'text-red-600': number < 0, 'text-blue-600': number >= 0 },
      'flex',
      'items-center',
      'whitespace-no-wrap',
    ]"
  >
    <Arrow
      class="-mx-1"
      :class="{ hidden: arrow === false }"
      :direction="number >= 0 ? 'up' : 'down'"
    />
    <div>{{ value }}</div>
  </div>
</template>

<script lang="ts">
import { formatCurrency } from '../../services/helper';
import Arrow from '@/components/Icons/ArrowUpIcon.vue';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    number: {
      type: Number,
      required: true,
    },
    arrow: Boolean,
    full: Boolean,
  },
  components: { Arrow },
  setup(props) {
    const value = computed(() => formatCurrency(Math.abs(props.number), props.full));

    return { value };
  },
});
</script>
