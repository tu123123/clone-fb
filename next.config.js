module.exports = {
  
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
     webpack(config) {
    config.module.rules.push({
      test: /\.pdf$/,
      type: "asset/resource",
    });
    return config;
  },
  }

  