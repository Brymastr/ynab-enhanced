export interface SettingsState {
  settings: {
    [namespace: string]: SettingsGroup;
  };
}

export interface SettingsGroup {
  name: string;
  settings: {
    [setting: string]: Setting<string | boolean>;
  };
}

export interface Setting<T> {
  name: string;
  value: T;
  values?: T[];
}

// general settings
const colorTheme: Setting<string> = {
  name: 'Color Theme',
  value: 'ynab',
  values: ['ynab', 'outrun', 'high-contrast', 'black-crows'],
};

const displayCents: Setting<boolean> = {
  name: 'Display Cents',
  value: false,
};

const swagger: Setting<boolean> = {
  name: 'Swagger',
  value: false,
};

const general: SettingsGroup = {
  name: 'General',
  settings: { colorTheme, displayCents, swagger },
};

// graph settings
const displayNetWorthStaticAverage: Setting<boolean> = {
  name: 'Net Worth Static Average',
  value: false,
};

const displayNetChangeStaticAverage: Setting<boolean> = {
  name: 'Net Change Static Average',
  value: false,
};

const graphs: SettingsGroup = {
  name: 'Graphs',
  settings: { displayNetWorthStaticAverage, displayNetChangeStaticAverage },
};

export const state: SettingsState = {
  settings: {
    general,
    graphs,
  },
};
