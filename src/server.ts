/* eslint-disable no-console */
// getting-started.js
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import seedSuperAdmin from "./app/DB";

const port = config.port;

async function main() {
    try {
        await mongoose.connect(config.database_url as string);
        seedSuperAdmin();
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        });
    } catch (err) {
        console.log(err)
    };
};

main();