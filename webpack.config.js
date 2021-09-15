const webpack = require("webpack");
const path = require('path');
const resolve = path.resolve;

const time = new Date().toLocaleDateString('ru', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
const definePLugin = new webpack.DefinePlugin({
    VERSION: time,
});

module.exports = [
    {
        entry: './src/index.ts',
        mode: "production",
        module: {
            rules: [
                {
                    test: /\.ts/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.less$/,
                    use: [
                        // conf.mode === 'production' ? MiniCssExtractPlugin.loader : 
                        { loader: "style-loader" },
                        {
                            loader: "css-loader",
                            options: {
                                modules: true,
                                localIdentName: '[folder]__[local]--[hash:base64:5]',
                            }
                        },
                        {
                            loader: "less-loader",
                            options: { root: path.resolve(__dirname, './') }
                        },
                    ]
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            libraryTarget: 'umd',
            globalObject: 'this',
            library: 'providerMetamask',
            filename: 'provider-metamask.js',
            path: resolve(__dirname, 'dist'),
        }
    }
];
