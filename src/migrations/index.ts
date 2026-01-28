import * as migration_20260123_034843_initial from './20260123_034843_initial';
import * as migration_20260128_143017_catch_up from './20260128_143017_catch_up';

export const migrations = [
  {
    up: migration_20260123_034843_initial.up,
    down: migration_20260123_034843_initial.down,
    name: '20260123_034843_initial',
  },
  {
    up: migration_20260128_143017_catch_up.up,
    down: migration_20260128_143017_catch_up.down,
    name: '20260128_143017_catch_up'
  },
];
