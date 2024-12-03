const webpack = require("webpack");
module.exports = function override(config, env) {
  config.resolve.fallback = {
    assert: require.resolve("assert"),
    buffer: require.resolve("buffer"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    path: require.resolve("path-browserify"),
    stream: require.resolve("stream-browserify"),
    url: require.resolve("url"),
    vm: require.resolve("vm-browserify"),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser.js",
      Buffer: ["buffer", "Buffer"],
    })
  );

  // This is deprecated in webpack 5 but alias false does not seem to work
  config.module.rules.push({
    test: /node_modules[\\\/]https-proxy-agent[\\\/]/,
    use: "null-loader",
  });
  return config;
};
