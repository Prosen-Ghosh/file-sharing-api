import { StorageType } from "src/common/enums/StorageType.enum";

export default () => ({
    port: parseInt(process.env.PORT, 10),
    databaseURI: process.env.DB_URI,
    folderPath: process.env.FOLDER || 'uploads',
    // config: process.env.CONFIG,
    provider: process.env.PROVIDER || StorageType.Local,
});