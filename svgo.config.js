module.exports = {
  plugins: [
    // set of built-in plugins enabled by default
    "preset-default",

    // enable built-in plugins by name
    "prefixIds",

    // or by expanded notation which allows to configure plugin
    {
      name: "removeAttrs",
      active: true,
      params: {
        attrs: "(fill|stroke|mask)",
      },
    },
    {
      name: "removeUnknownsAndDefaults",
      active: false,
    },
    {
      name: "cleanupEnableBackground",
      active: false,
    },
    {
      name: "removeUselessStrokeAndFill",
      active: false,
    },
  ],
};
