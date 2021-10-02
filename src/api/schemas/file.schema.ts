import * as mongoose from 'mongoose';

export const FileSchema = new mongoose.Schema({
    
}, {
    timestamps: true,
    versionKey: false
});

export const TaxiModel = mongoose.model('File', FileSchema);