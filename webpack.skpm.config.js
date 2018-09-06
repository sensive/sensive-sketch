const webpack = require('webpack')

module.exports = () => {
  return { 
    plugins: [
      new webpack.EnvironmentPlugin(['SENSIVE_API_URL'])
    ]
  }
};
