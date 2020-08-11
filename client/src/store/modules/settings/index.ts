import { Module } from 'vuex';
import { SettingsState, Setting, SettingsGroup } from './types';
import { RootState } from '@/store/types';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';
import { state } from './types';

// general settings
// const colorTheme: Setting<string> = {
//   name: 'Color Theme',
//   value: 'ynab',
//   values: ['ynab', 'outrun', 'high-contrast', 'black-crows'],
// };

// const includeCents: Setting<boolean> = {
//   name: 'Display Cents',
//   value: false,
// };

// const swagger: Setting<boolean> = {
//   name: 'Swagger',
//   value: false,
// };

// const general: SettingsGroup = {
//   name: 'General',
//   settings: { colorTheme, includeCents, swagger },
// };

// // graph settings
// const displayNetWorthStaticAverage: Setting<boolean> = {
//   name: 'Net Worth Static Average',
//   value: false,
// };

// const displayNetChangeStaticAverage: Setting<boolean> = {
//   name: 'Net Change Static Average',
//   value: false,
// };

// const graphs: SettingsGroup = {
//   name: 'Graphs',
//   settings: { displayNetWorthStaticAverage, displayNetChangeStaticAverage },
// };

// const state: SettingsState = {
//   settings: {
//     general,
//     graphs,
//   },
// };

const settings: Module<SettingsState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default settings;
