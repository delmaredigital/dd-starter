import * as migration_20260123_034843_initial from './20260123_034843_initial';

export const migrations = [
  {
    up: migration_20260123_034843_initial.up,
    down: migration_20260123_034843_initial.down,
    name: '20260123_034843_initial'
  },
];
