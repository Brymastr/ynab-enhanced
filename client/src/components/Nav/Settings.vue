<template>
  <div class="flex items-stretch justify-end divide-x divide-blue-400">
    <!-- left side -->
    <div class="flex flex-col items-end pr-5 mt-1">
      <div class="text-6xl uppercase leading-none">Settings</div>
      <p>Settings currently only persist until logout</p>
      <ArrowRightCircleIcon class="w-auto" label="Done" :action="done" />
    </div>

    <!-- right side -->
    <div class="pl-1" v-if="localSettings">
      <div v-for="[group, value] of Object.entries(localSettings)" :key="group" class="">
        <span class="block text-3xl ml-3 border-b border-blue-400">{{ value.name }}</span>
        <div
          class="cursor-pointer transition ml-3 duration-100 ease-out hover:bg-gray-900 px-3 py-2 text-lg flex justify-between"
          v-for="setting of value.settings"
          :key="setting.name"
          @click="setting.value = !setting.value"
        >
          <p class="mr-5">{{ setting.name }}</p>
          <p v-if="typeof setting.value === 'string'" class="">
            {{ setting.value }}
          </p>
          <p v-if="typeof setting.value === 'boolean'" class="">
            {{ setting.value ? 'Enabled' : 'Disabled' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Emit } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { SettingsState } from '../../store/modules/settings/types';
import ArrowRightCircleIcon from '@/components/Icons/ArrowRightCircleIcon.vue';
import merge from 'deepmerge';
const namespace = 'settings';

@Component({
  components: { ArrowRightCircleIcon },
})
export default class LoginBudgetSelect extends Vue {
  @State('settings', { namespace }) private settings!: SettingsState;
  @Action('settingsChanged', { namespace }) private settingsChanged!: Function;

  private localSettings: SettingsState | null = null;
  private ready = false;

  mounted() {
    this.localSettings = merge({}, this.settings);
    setTimeout(() => (this.ready = true), 0);
  }

  @Watch('localSettings', { deep: true })
  watchLocalSettings() {
    if (this.ready) {
      this.settingsChanged({ settings: this.localSettings });
    }
  }

  @Emit('done')
  done() {
    return;
  }
}
</script>
