<template>
  <!-- page -->
  <div class="flex flex-col text-blue-400 min-h-screen">
    <!-- header and content -->
    <div class="container mx-auto">
      <header class="flex flex-wrap justify-between my-12">
        <!-- logo -->
        <div class="grid grid-cols-2 grid-rows-2">
          <svg
            class="row-span-2 self-center mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            enable-background="new 0 0 20 20"
            xml:space="preserve"
          >
            <path
              fill="#63b3ed"
              d="M0.69,11.331l1.363,0.338l1.026-1.611l-1.95-0.482c-0.488-0.121-0.981,0.174-1.102,0.66 C-0.094,10.719,0.202,11.209,0.69,11.331z M18.481,11.592l-4.463,4.016l-5.247-4.061c-0.1-0.076-0.215-0.133-0.338-0.162 l-0.698-0.174l-1.027,1.611l1.1,0.273l5.697,4.408c0.166,0.127,0.362,0.189,0.559,0.189c0.219,0,0.438-0.078,0.609-0.232 l5.028-4.527c0.372-0.334,0.401-0.906,0.064-1.277C19.428,11.286,18.854,11.256,18.481,11.592z M8.684,7.18l4.887,3.129 c0.413,0.264,0.961,0.154,1.24-0.246l5.027-7.242c0.286-0.412,0.183-0.977-0.231-1.26c-0.414-0.285-0.979-0.182-1.265,0.23 l-4.528,6.521L8.898,5.165C8.694,5.034,8.447,4.991,8.21,5.042c-0.236,0.053-0.442,0.197-0.571,0.4L0.142,17.209 c-0.27,0.422-0.144,0.983,0.28,1.25c0.15,0.096,0.319,0.141,0.486,0.141c0.301,0,0.596-0.149,0.768-0.42L8.684,7.18z"
            />
          </svg>
          <span class="font-semibold uppercase text-4xl tracking-tight -mb-5">Wealth</span>
          <span class="text-l text-right tracking-tight align-text-top">
            <span class="top-0">for</span>
            <span class="text-4xl uppercase">ynab</span>
          </span>
        </div>

        <!-- nav buttons -->
        <div class="content-end flex items-center w-auto">
          <div class="text-m">
            <a
              class="inline-block mt-0 hover:text-gray-800"
              href="https://ynab.com/referral/?ref=IIutIbt-D7md0_0d&utm_source=customer_referral"
            >Sign up for YNAB</a>
            <a
              class="inline-block text-m px-2 py-2 leading-none border rounded border-blue-400 hover:border-gray-800 hover:text-gray-800 lg:mt-0 ml-5"
              href="#"
            >Login</a>
          </div>
        </div>
      </header>

      <!-- content -->
      <main class="grid grid-cols-2">
        <!-- first info block -->
        <div>
          <h2 class="text-3xl">Discover your wealth</h2>
          <span>Net Worth for YNAB is a free utility for analyzing your changing net worth. Discover trends, make correlations, and even glimpse into the future.</span>
        </div>
        <LineGraph
          class="mb-12 -mr-5"
          :counter="counter"
          :chartData="chartData"
          :options="options"
        />

        <!-- second info block -->
        <div>another graph</div>
        <div class="mb-12">
          <h2 class="text-3xl">Plan for your goals</h2>
          <span>Net Worth for YNAB is for people who have reached level 4 and above and are looking to plan beyond 30 days age of money.</span>
        </div>
      </main>
    </div>

    <!-- footer -->
    <footer class="mt-auto bg-blue-200 text-black min-w-full py-6">
      <!-- main footer content -->
      <div class="mx-auto">
        <div class="container mx-auto py-3">
          <a href="https://ynab.com/referral/?ref=IIutIbt-D7md0_0d&utm_source=customer_referral">
            <img src="../assets/works_with_ynab.svg" alt="you need a budget" />
          </a>
        </div>

        <!-- disclaimer -->
        <div class="text-xs text-gray-100 bg-gray-800">
          <span class="block container mx-auto py-3">
            <span class="font-bold">You Need a Budget</span> and
            <span class="font-bold">YNAB</span> are registered trademarks of
            <span class="font-bold">You Need a Budget LLC</span>.
            Wealth for YNAB is an unofficial extension and not affiliated with
            <span
              class="font-bold"
            >You Need a Budget LLC</span>.
          </span>
        </div>

        <!-- masthead -->
        <span class="block text-center text-gray-500 mt-3">
          Made by
          <a
            class="text-gray-800 hover:text-blue-800"
            href="https://github.com/brymastr"
          >Brycen</a>
        </span>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import LineGraph from '@/components/Graphs/LineGraph.vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ChartDataSets, ChartData, ChartOptions } from 'chart.js';
import { getOptions, getData } from '../services/dummyGraph';

@Component({
  components: { LineGraph },
})
export default class Landing extends Vue {
  private options: ChartOptions | null = null;
  private chartData: ChartData | null = null;
  private counter = 0;

  rebuild() {
    this.options = getOptions(this.rebuild.bind(this));
    this.chartData = getData();
    this.counter++;
  }

  created() {
    this.rebuild();
    setInterval(this.rebuild, 30000);
  }
}
</script>

