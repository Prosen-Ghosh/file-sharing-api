import * as mongoose from 'mongoose';
import { StorageType } from 'src/common/enums/StorageType.enum';

export const FileSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    publicKey: {
        type: String,
        trim: true,
        required: true
    },
    privateKey: {
        type: String,
        trim: true,
        required: true
    },
    path: {
        type: String,
        trim: true,
        required: true
    },
    provider: {
        type: String,
        trim: true,
        required: true,
        default: StorageType.Local
    },
    lastVisited: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

export const FileModel = mongoose.model('File', FileSchema);