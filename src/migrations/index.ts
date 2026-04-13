import * as migration_20260123_034843_initial from './20260123_034843_initial';
import * as migration_20260128_143017_catch_up from './20260128_143017_catch_up';
import * as migration_20260302_025847 from './20260302_025847';
import * as migration_20260413_041646_r2_media_prefix_column from './20260413_041646_r2_media_prefix_column';

export const migrations = [
  {
    up: migration_20260123_034843_initial.up,
    down: migration_20260123_034843_initial.down,
    name: '20260123_034843_initial',
  },
  {
    up: migration_20260128_143017_catch_up.up,
    down: migration_20260128_143017_catch_up.down,
    name: '20260128_143017_catch_up',
  },
  {
    up: migration_20260302_025847.up,
    down: migration_20260302_025847.down,
    name: '20260302_025847',
  },
  {
    up: migration_20260413_041646_r2_media_prefix_column.up,
    down: migration_20260413_041646_r2_media_prefix_column.down,
    name: '20260413_041646_r2_media_prefix_column'
  },
];
