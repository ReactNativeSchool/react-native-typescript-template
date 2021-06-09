const path = require("path");
const { forEach, keys, includes } = require("lodash");
const appDirectory = path.resolve(__dirname, "../");

const getAliasesFromTsConfig = () => {
  const tsConfig = require("../tsconfig.json");
  const paths = tsConfig.compilerOptions.paths;

  let alias = {};

  const pathKeys = keys(paths);

  forEach(pathKeys, (key) => {
    alias[key] = `./${paths[key][0]}`;
  });

  return {
    ...alias,
    "^react-native$": "react-native-web",
  };
};

module.exports = (env, argv) => {
  return {
    mode: "development",
    entry: path.resolve(appDirectory, "index.web.ts"),
    output: {
      filename: "bundle.web.js",
      //path: path.resolve(appDirectory, 'dist'),
      path: path.resolve(__dirname, "public"),
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.(tsx|ts|jsx|js|mjs)$/,
          exclude:
            /node_modules[/\\](?!react-native-flipper|@react-native-community)/,

          use: {
            loader: "babel-loader",
            options: {
              babelrc: false,
              configFile: false,

              presets: [
                ["@babel/preset-env", { corejs: "3", useBuiltIns: "usage" }],
                "@babel/preset-react",
                "@babel/preset-typescript",
                "@babel/preset-flow",
              ],
              plugins: [
                [
                  "module-resolver",
                  {
                    alias: getAliasesFromTsConfig(),
                    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
                    root: ["./src"],
                  },
                ],
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-object-rest-spread",
                [
                  "@babel/plugin-transform-react-jsx",
                  {
                    runtime: "automatic",
                  },
                ],
                "react-native-reanimated/plugin",
              ],
            },
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          loader: "file-loader",
        },
        {
          test: /\.(webp|gif|jpe?g|png|svg)$/,
          use: {
            loader: "url-loader",
            options: {
              name: "[name].[ext]",
              //limit: 8192, // in bytes
            },
          },
        },
        {
          test: /\.css$/,
          use: ["css-loader"],
        },
      ],
    },
    // plugins: [
    //   "react-native-web", // there is now a babel RNW plugin. Not added it to the project yet...
    // ],
    resolve: {
      alias: {
        "react-native$": "react-native-web",
      },
      extensions: [
        ".web.tsx",
        ".web.ts",
        ".tsx",
        ".ts",
        ".mjs",
        ".web.jsx",
        ".web.js",
        ".jsx",
        ".js",
      ],
    },
    devServer: {
      contentBase: [path.resolve(__dirname, "public")],
      historyApiFallback: true,
      host: "0.0.0.0",
      port: 8082,
      disableHostCheck: true,
    },
  };
};
