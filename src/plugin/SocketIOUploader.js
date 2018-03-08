import io from 'socket.io-client';
import Plugin from 'uppy/lib/core/Plugin';


class SocketIOUploader extends Plugin {
    constructor(uppy, opts) {
        super(uppy, opts);
        this.type = 'uploader';
        this.id = 'SocketIOUploader';
        this.title = 'SocketIOUploader';

        const defaultOptions = {
            channel: '/file',
            // provide socketio object or socketio server url
            socketio: null
        };

        this.opts = Object.assign({}, defaultOptions, opts);

        this.handleUpload = this.handleUpload.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this._initialize_socketio = this._initialize_socketio.bind(this);

        this._initialize_socketio(this.opts.socketio);
    }

    _initialize_socketio(socketio) {
        if (typeof socketio === "object") {
            this._io = socketio;
        } else if (typeof socketio === "string") {
            this._io = io(socketio);
        } else {
            throw new Error("Please provide socketio opt.");
        }
    }

    /**
     * upload file
     *
     * @param fileID
     * @return promise
     */
    uploadFile(fileID) {
        const file = this.uppy.getFile(fileID);
        return new Promise((resolve, reject) => {
            this.uppy.emit('upload-started', file.id)
            this._io.emit(this.opts.channel, file.data, data => {
                // server need to send ack data
                this.uppy.emit('upload-success', file.id);
            });
        });
    }

    handleUpload(fileIDs) {
        const promises = fileIDs.map(fileId => {
            return this.uploadFile(fileId);
        });
        return settle(promises);
    }

    install() {
        this.uppy.addUploader(this.handleUpload);
    }

    uninstall() {
        this.uppy.removeUploader(this.handleUpload);
    }
}

export default SocketIOUploader;
