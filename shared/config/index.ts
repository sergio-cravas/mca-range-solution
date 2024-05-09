import { createProductionConfig } from './envs/production';
import { createDevelopmentConfig } from './envs/development';

function getConfig() {
  switch (process.env.NODE_ENV) {
    case 'production':
      return createProductionConfig();
    default:
      return createDevelopmentConfig();
  }
}

const config = getConfig();
export default config;
