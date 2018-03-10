const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './example/example.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'example')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './example',
        hot: true
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
}
