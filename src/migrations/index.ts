import * as migration_20260808_191236_initial_production_schema from './20260808_191236_initial_production_schema';
import * as migration_20260809_093818 from './20260809_093818';

export const migrations = [
  {
    up: migration_20260808_191236_initial_production_schema.up,
    down: migration_20260808_191236_initial_production_schema.down,
    name: '20260808_191236_initial_production_schema',
  },
  {
    up: migration_20260809_093818.up,
    down: migration_20260809_093818.down,
    name: '20260809_093818'
  },
];
