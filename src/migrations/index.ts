import * as migration_20260123_034843_initial from './20260123_034843_initial';
import * as migration_20260128_143017_catch_up from './20260128_143017_catch_up';
import * as migration_20260302_025847 from './20260302_025847';
import * as migration_20260424_202032 from './20260424_202032';
import * as migration_20260703_002252 from './20260703_002252';

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
    up: migration_20260424_202032.up,
    down: migration_20260424_202032.down,
    name: '20260424_202032',
  },
  {
    up: migration_20260703_002252.up,
    down: migration_20260703_002252.down,
    name: '20260703_002252'
  },
];
