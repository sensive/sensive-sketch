const webpack = require('webpack')

module.exports = () => {
  return {
    plugins: [
      new webpack.EnvironmentPlugin(['SKPM_ENV'])
    ]
  }
};
