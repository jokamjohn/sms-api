require('dotenv').config();

const config = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres'
  },
  test: {
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres'
  },
  staging: {
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres'
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres'
  }
};

module.exports = config;