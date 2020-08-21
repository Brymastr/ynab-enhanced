<template>
  <!-- page -->
  <div class="flex flex-col text-blue-400 min-h-screen">
    <!-- header and content -->
    <div class="container mx-auto px-5">
      <header class="flex flex-col sm:flex-row items-center justify-between my-12">
        <!-- logo -->
        <Logo />

        <!-- nav buttons -->
        <div class="content-end mt-12 sm:mt-0 flex items-center w-auto">
          <div class="text-m">
            <a
              class="inline-block mt-0 hover:text-gray-800"
              href="https://ynab.com/referral/?ref=IIutIbt-D7md0_0d&utm_source=customer_referral"
              >Sign up for YNAB</a
            >
            <a
              class="inline-block text-m px-2 py-2 leading-none border rounded border-blue-400 hover:border-gray-800 hover:text-gray-800 lg:mt-0 ml-5"
              href="#"
              >Login</a
            >
          </div>
        </div>
      </header>

      <!-- content -->
      <main class="grid grid-cols-1 sm:grid-cols-6 gap-y-10 text-gray-700">
        <!-- first info block -->
        <div class="self-center sm:col-span-6 md:col-span-2">
          <h2 class="text-3xl">Discover your wealth</h2>
          <span
            >Net Worth for YNAB is a free utility for analyzing your changing net worth. Discover
            trends, make correlations, and even glimpse into the future.</span
          >
        </div>
        <LineGraph
          class="-mr-5 self-center sm:col-span-6 md:col-span-4"
          :counter="counter"
          :chartData="chartData"
          :options="options"
        />

        <!-- second info block -->
        <div
          class="sm:col-span-6 md:col-span-4 sm:pr-8 self-center grid grid-cols-1 md:grid-cols-2 gap-y-3"
        >
          <NetChange :monthlyNetWorth="data" />
          <PositiveNegative :monthlyNetWorth="data" />
          <AverageChange :monthlyNetWorth="data" />
          <BestWorst :monthlyNetWorth="data" />
        </div>
        <div class="sm:col-span-2 sm:col-start-5 self-center">
          <h2 class="text-3xl">Plan for your goals</h2>
          <span
            >Net Worth for YNAB is for people who have reached level 4 and above and are looking to
            plan beyond 30 days age of money.</span
          >
        </div>
      </main>
    </div>

    <!-- footer -->
    <footer class="mt-10 bg-blue-200 text-black min-w-full py-6">
      <!-- main footer content -->
      <div class="mx-auto">
        <div class="container mx-auto p-5">
          <a href="https://ynab.com/referral/?ref=IIutIbt-D7md0_0d&utm_source=customer_referral">
            <img src="../assets/works_with_ynab.svg" alt="you need a budget" />
          </a>
        </div>

        <!-- disclaimer -->
        <div class="text-xs text-gray-100 bg-gray-800 px-5">
          <span class="block container mx-auto py-3">
            <span class="font-bold">You Need a Budget</span> and
            <span class="font-bold">YNAB</span> are registered trademarks of
            <span class="font-bold">You Need a Budget LLC</span>. Wealth for YNAB is an unofficial
            extension and not affiliated with <span class="font-bold">You Need a Budget LLC</span>.
          </span>
        </div>

        <!-- masthead -->
        <span class="block text-center text-gray-500 mt-3">
          Made by
          <a class="text-gray-800 hover:text-blue-800" href="https://github.com/brymastr">Brycen</a>
        </span>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import LineGraph from '@/components/Graphs/LineGraph.vue';
import AverageChange from '@/components/Stats/AverageChange.vue';
import BestWorst from '@/components/Stats/BestWorst.vue';
import NetChange from '@/components/Stats/NetChange.vue';
import PositiveNegative from '@/components/Stats/PositiveNegative.vue';
import Logo from '@/components/General/Logo.vue';
import { Component, Vue } from 'vue-property-decorator';
import { ChartData, ChartOptions } from 'chart.js';
import { getOptions, getData, getChartData } from '../services/dummyGraph';
import { WorthDate } from '../store/modules/ynab/types';

@Component({
  components: { Logo, LineGraph, AverageChange, BestWorst, NetChange, PositiveNegative },
})
export default class Landing extends Vue {
  private data: WorthDate[] = [];
  private options: ChartOptions | null = null;
  private chartData: ChartData | null = null;
  private counter = 0;

  rebuild() {
    this.options = getOptions(this.rebuild.bind(this));
    this.data = getData();
    this.chartData = getChartData(this.data);
    this.counter++;
  }

  created() {
    this.rebuild();
    setInterval(this.rebuild, 30000);
  }
}
</script>
