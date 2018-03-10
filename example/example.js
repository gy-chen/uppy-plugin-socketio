import Uppy from 'uppy/lib/core';
import Dashboard from 'uppy/lib/plugins/Dashboard';
import SocketIOUpload from '../src/plugin/SocketIOUploader';
import 'uppy/dist/uppy.css';

const uppy = Uppy({
    debug: true
});

uppy.use(Dashboard, {
   target: '#app',
   inline: true
});

uppy.use(SocketIOUpload, {
    channel: 'binary',
    io: 'http://127.0.0.1:8000'
});

uppy.run();