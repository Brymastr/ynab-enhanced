<template>
  <!-- page -->
  <div class="flex flex-col text-blue-400 min-h-screen">
    <!-- header and content -->
    <div class="container mx-auto px-5">
      <header class="flex flex-col sm:flex-row items-center justify-between my-12">
        <!-- logo -->
        <Logo />

        <!-- nav buttons -->
        <div class="content-end mt-12 sm:mt-0 flex items-center w-full sm:w-auto">
          <!-- full signup / login -->
          <div class="hidden sm:block text-xl">
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

          <!-- mobile signup / login -->
          <div class="sm:hidden text-gray-800 text-center w-full mx-auto">
            <a
              class="inline-block p-4 mx-5 mb-5 leading-none rounded border border-blue-400 w-11/12"
              href="https://ynab.com/referral/?ref=IIutIbt-D7md0_0d&utm_source=customer_referral"
              >Sign up for YNAB</a
            >
            <a class="inline-block p-4 mx-5 leading-none rounded bg-blue-400 w-11/12" href="#"
              >Login</a
            >
          </div>
        </div>
      </header>

      <!-- content -->
      <main
        class="grid grid-rows-6 sm:grid-rows-3 grid-cols-1 sm:grid-cols-6 gap-y-20 md:gap-y-0 text-gray-700"
      >
        <!-- info block 1 -->
        <div class="self-center sm:col-span-6 md:col-span-2">
          <h2 class="text-3xl text-center sm:text-left">Discover your wealth</h2>
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

        <!-- info block 2 -->
        <div
          class="sm:col-span-6 md:col-span-4 self-center flex flex-col md:flex-row justify-between"
        >
          <div class="flex flex-col">
            <NetChange :monthlyNetWorth="data" />
            <PositiveNegative :monthlyNetWorth="data" />
          </div>
          <div class="flex flex-col md:pr-5 lg:pr-20">
            <AverageChange :monthlyNetWorth="data" />
            <BestWorst :monthlyNetWorth="data" />
          </div>
        </div>
        <div class="sm:col-span-6 md:col-span-2 self-center">
          <h2 class="text-3xl text-center sm:text-left">Plan for your goals</h2>
          <span
            >Net Worth for YNAB is for people who have reached level 4 and above and are looking to
            plan beyond 30 days age of money.</span
          >
        </div>

        <!-- info block 3 -->
        <div class="sm:col-span-2 self-center">
          <h2 class="text-3xl text-center sm:text-left">Facebook OSS</h2>
          <span>Utilizing Facebook Prophet for time series forecasting.</span>
        </div>
        <div class="sm:col-span-4 self-center flex justify-evenly text-blue-700">
          <a href="https://opensource.facebook.com"
            ><img
              class="h-40 w-auto"
              src="../assets/facebook_og_image-cutout.png"
              alt="facebook open source"
          /></a>

          <a href="https://facebook.github.io/prophet" alt="facebook prophet">
            <svg
              class="h-40 w-auto fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 72.6 72"
              xml:space="preserve"
            >
              <path
                class="st0"
                d="M10.2,49.1v-0.1c0-7.6,5.4-13.8,13.3-13.8c1.2,0,2.3,0.2,3.4,0.4l6.2-7.6c-2.8-1.2-6-1.8-9.5-1.8
	C9.9,26.1,0,36.5,0,49.1v0.1c0,5.2,1.7,10.1,4.7,13.9l6.7-8.3C10.6,53.1,10.2,51.1,10.2,49.1z"
              />
              <path
                class="st0"
                d="M36.6,46.1c0.2,1,0.3,2,0.3,3v0.1c0,7.6-5.4,13.8-13.3,13.8c-2.3,0-4.3-0.5-6.1-1.5l-7.8,6.3
	c3.8,2.6,8.5,4.2,13.8,4.2c13.7,0,23.6-10.3,23.6-22.9v-0.1c0-3.5-0.8-6.7-2.1-9.6L36.6,46.1z"
              />
              <circle class="st0" cx="52.4" cy="20.2" r="6.9" />
              <circle class="st0" cx="68.7" cy="3.9" r="3.9" />
            </svg>
          </a>
        </div>
      </main>
    </div>

    <!-- footer -->
    <footer class="mt-20 bg-blue-200 text-black min-w-full py-6">
      <!-- main footer content -->
      <div class="mx-auto">
        <div class="container mx-auto p-5">
          <a href="https://ynab.com/referral/?ref=IIutIbt-D7md0_0d&utm_source=customer_referral">
            <img src="../assets/works_with_ynab.svg" alt="you need a budget" />
          </a>
        </div>

        <!-- disclaimer -->
        <div class="text-xs text-gray-100 bg-gray-800 px-5">
          <span class="block container mx-auto text-center py-3">
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
