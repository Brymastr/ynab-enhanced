<template>
  <div class="flex items-stretch justify-end divide-x-2 divide-blue-400">
    <!-- left side -->
    <div class="flex flex-col items-end pr-5 mt-1">
      <div class="text-6xl uppercase leading-none">Settings</div>
      <p>Settings currently only persist until logout</p>
      <ArrowRightCircleIcon class="text-3xl -mr-2" label="Done" :action="done" size="large" />
    </div>

    <!-- right side -->
    <div class="pl-1">
      <div>
        <span class="block text-3xl ml-3 border-b border-blue-400">Misc.</span>
        <div
          class="cursor-pointer transition ml-3 duration-100 ease-out hover:bg-gray-900 px-3 py-2 text-lg flex justify-between"
          @click="setBrynab()"
        >
          <p class="mr-5">brynab</p>
          <p>
            {{ getBrynab ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
        <div
          class="cursor-pointer transition ml-3 duration-100 ease-out hover:bg-gray-900 px-3 py-2 text-lg flex justify-between"
          @click="setDummy()"
        >
          <p class="mr-5">dummy data</p>
          <p>
            {{ isDummy ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ArrowRightCircleIcon from '@/components/Icons/ArrowRightCircleIcon.vue';
import { defineComponent } from 'vue';
import useSettings from '@/composables/settings';

export default defineComponent({
  name: 'Settings',
  components: { ArrowRightCircleIcon },
  setup(_, { emit }) {
    const { getBrynab, setBrynab, isDummy, setDummy } = useSettings();

    function done() {
      emit('done');
    }

    return { done, getBrynab, setBrynab, isDummy, setDummy };
  },
});
</script>
