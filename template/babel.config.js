const { forEach, keys } = require("lodash");

const getAliasesFromTsConfig = () => {
  const tsConfig = require("./tsconfig.json");
  const paths = tsConfig.compilerOptions.paths;

  let alias = {};

  const pathKeys = keys(paths);

  forEach(pathKeys, (key) => {
    alias[key] = `./${paths[key][0]}`;
  });

  return alias;
};

const isProduction = process.env.NODE_ENV === "production";

const presets = ["module:metro-react-native-babel-preset"];

const plugins = [
  [
    "module-resolver",
    {
      alias: getAliasesFromTsConfig(),
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      root: ["./src"],
    },
  ],
  "@babel/plugin-transform-flow-strip-types",
  [
    "@babel/plugin-transform-react-jsx",
    {
      runtime: "automatic",
    },
  ],
  "lodash",
  ...(isProduction
    ? [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-transform-react-inline-elements",
      ]
    : []),
  [
    "transform-remove-console",
    {
      exclude: isProduction
        ? ["error"]
        : ["disableYellowBox", "error", "info", "log"],
    },
  ],
];

module.exports = {
  presets,
  plugins,
  env: {
    production: {
      plugins: [...plugins],
    },
  },
};
