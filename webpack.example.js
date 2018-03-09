const path = require('path');

module.exports = {
    entry: './example/example.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'example')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './example'
    },
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
