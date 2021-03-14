
<template>
  <section class="bg-gray-900 mb-20 h-screen min-h-540 md:h-screen-1/2">
    <div class="lg:container mx-auto px-5 h-full flex flex-col">
      <header class="flex flex-col sm:flex-row items-center justify-between py-12">
        <!-- logo -->
        <Logo />

        <!-- nav buttons -->
        <div class="mt-12 flex w-full self-center sm:w-auto">
          <!-- full signup / login -->
          <div class="hidden sm:block text-xl">
            <a class="inline-block mt-0" :href="ynabReferral">
              <Underline color="green">Sign up for YNAB</Underline>
            </a>
            <a
              class="inline-block text-xl px-2 py-2 leading-none border rounded hover:border-green-400 hover:text-green-400 border-blue-400 lg:mt-0 ml-5 transition duration-150"
              href="/login"
              >Login</a
            >
          </div>

          <!-- mobile signup / login -->
          <div class="sm:hidden text-center w-full mx-auto">
            <a
              class="inline-block p-4 mx-5 mb-5 leading-none rounded border border-blue-400 w-11/12"
              :href="ynabReferral"
              >Sign up for YNAB</a
            >
            <a
              class="text-gray-800 inline-block p-4 mx-5 leading-none rounded bg-blue-400 w-11/12"
              href="/login"
              >Login</a
            >
          </div>
        </div>
      </header>

      <!-- headline and graph -->
      <div class="grid grid-cols-3 h-full">
        <div class="self-center col-span-3 md:col-span-1 text-center sm:text-left">
          <h2 class="text-3xl">Discover your wealth</h2>
          <span>
            Wealth for YNAB is a free utility for analyzing your changing net worth. Discover
            trends, make correlations, and even glimpse into the future.
          </span>
        </div>
        <LineGraph
          class="-mr-5 col-span-3 md:col-span-2"
          :counter="counter"
          :data="data"
          :options="options"
          chartId="header-line-graph"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ChartData, ChartOptions } from 'chart.js';
import LineGraph from '@/components/Graphs/LineGraph.vue';
import Logo from '@/components/General/Logo.vue';
import Underline from '@/components/General/Underline.vue';

interface Props {
  data: ChartData;
  options: ChartOptions;
}

export default defineComponent({
  components: { LineGraph, Logo, Underline },
  props: {
    data: {
      type: Object as PropType<ChartData>,
      required: true,
    },
    options: {
      type: Object as PropType<ChartOptions>,
      required: true,
    },
    counter: Number,
  },
  setup(props: Props) {
    const ynabReferral = process.env.VUE_APP_YNAB_REFERRAL;

    return { ynabReferral };
  },
});
</script>
