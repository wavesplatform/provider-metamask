const webpack = require("webpack");
const path = require('path');
const resolve = path.resolve;
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = [
    {
        mode: "production",
        entry: './src/index.ts',
        output: {
            libraryTarget: 'umd',
            globalObject: 'this',
            library: 'providerMetamask',
            filename: 'provider-metamask.js',
            path: resolve(__dirname, 'dist'),
        },
        module: {
            rules: [
                {
                    test: /\.ts/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                }
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        // plugins: [
        //     new BundleAnalyzerPlugin()
        // ]
    }
];
