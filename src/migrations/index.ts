import * as migration_20260808_191236_initial_production_schema from './20260808_191236_initial_production_schema';

export const migrations = [
  {
    up: migration_20260808_191236_initial_production_schema.up,
    down: migration_20260808_191236_initial_production_schema.down,
    name: '20260808_191236_initial_production_schema'
  },
];
