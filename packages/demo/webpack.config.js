const path = require("path");

const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const webAppDir = __dirname;
const rootDir = path.resolve(webAppDir, ".");
const distrDir = path.join(webAppDir, "dist");

module.exports = {
    // mode: "production",
    context: rootDir,
    entry: "./src/index.tsx",
    output: {
        path: distrDir,
        filename: "index.[hash].js",
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: {
                    loader: "ts-loader",
                },
                include: rootDir,
                exclude: [/node_modules/, /\.test\.ts/],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            '@src': path.resolve(__dirname, "./src"),
            '@components': path.resolve(__dirname, "./src/components"),
            '@stores': path.resolve(__dirname, "./src/stores"),
            '@utils': path.resolve(__dirname, "./src/utils")
          },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            minify: false
        }),
    ],
    devServer: {
        port: 9000,
        static: './',
        compress: true,
        historyApiFallback: true,
        client: {
            overlay: false,
        },
    },
    watchOptions: {
        ignored: [distrDir, "node_modules"],
        aggregateTimeout: 1500,
    },
};
