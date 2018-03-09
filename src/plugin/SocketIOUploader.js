import io from 'socket.io-client';
import Plugin from 'uppy/lib/core/Plugin';
import { settle } from 'uppy/lib/core/Utils';
import { readFile } from './util/file';


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
        this._initializeSocketio = this._initializeSocketio.bind(this);
        this._emitFileUploadProgress = this._emitFileUploadProgress.bind(this);

        this._initializeSocketio(this.opts.socketio);
    }

    _initializeSocketio(socketio) {
        if (typeof socketio === "object") {
            this._io = socketio;
        } else if (typeof socketio === "string") {
            this._io = io(socketio);
        } else {
            throw new Error("Please provide socketio opt.");
        }
    }

    _emitFileUploadProgress(file, bytesUploaded, bytesTotal) {
        this.uppy.emit('upload-progress', {
            uploader: this,
            id: file.id,
            bytesUploaded,
            bytesTotal
        });
    }

    /**
     * upload file
     *
     * @param fileID
     * @return promise
     */
    uploadFile(fileID) {
        const file = this.uppy.getFile(fileID);
        this.uppy.log('[SocketIOUploader] start to upload file ' + fileID);
        return new Promise((resolve, reject) => {
            
            // start upload file
            this.uppy.emit('upload-started', file.id)
            readFile(file.data)
                .then(data => {
                    // XXX don't know how to get upload progress of socketio. fixed upload progress here.
                    // this._emitFileUploadProgress(file, data.byteLength / 2, data.byteLength);
                    this._io.emit(this.opts.channel, data, data => {
                        // server need to send ack 
                        this.uppy.emit('upload-success', file.id);
                        resolve(file);
                    });
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
