const path = require('path');

module.exports = {
    entry: './src/plugin/SocketIOUploader.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        library: 'SocketIOUpload'
    }
}
