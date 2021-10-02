export default () => ({
    port: parseInt(process.env.PORT, 10),
    database: {
        uri: process.env.DB_URI
    }
});