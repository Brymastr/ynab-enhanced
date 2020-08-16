<template>
  <div class="container">
    <div class="settings-left">
      <div>Settings</div>
      <p>Settings currently only persist until logout</p>
      <ArrowRightCircleIcon class="done" label="Done" :action="done" />
    </div>
    <div class="vertical-line"></div>
    <div class="settings-right" v-if="localSettings">
      <div
        v-for="[group, value] of Object.entries(localSettings)"
        :key="group"
        class="settings-section"
      >
        <div class="settings-title">{{ value.name }}</div>
        <div
          class="settings-setting"
          v-for="setting of value.settings"
          :key="setting.name"
          @click="setting.value = !setting.value"
        >
          <p class="settings-name">{{ setting.name }}</p>
          <p v-if="typeof setting.value === 'string'" class="settings-value">{{ setting.value }}</p>
          <p v-if="typeof setting.value === 'boolean'" class="settings-value">
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

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.settings-left {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  > div:first-child {
    text-transform: uppercase;
    font-size: 4em;
  }

  > p {
    margin-right: 2px;
  }

  .done {
    font-size: 1em;
  }
}

.vertical-line {
  border-left: 1px solid var(--font-color);
  margin: 0 10px;
}

.settings-right {
  text-align: left;

  .settings-section {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .settings-title {
      font-size: 2em;
    }

    .settings-setting {
      font-size: 1.3em;
      display: flex;
      width: 400px;
      transition: color 100ms ease-out;
      cursor: pointer;
      padding-left: 20px;

      &:hover {
        color: white;
      }

      .settings-name {
        width: 300px;
      }

      .settings-value {
      }
    }
  }
}
</style>
