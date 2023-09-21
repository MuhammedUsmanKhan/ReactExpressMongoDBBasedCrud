import { MongoClient } from 'mongodb';
const url = "mongodb+srv://uktech0310:2124821aA@cluster0.htpwdc9.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.log(err.stack);
        await client.close();
        process.exit(1)
    }

}
run().catch(console.dir);

process.on('SIGINT', async ()=>{
    console.log(`app is terminating`);
    await client.close();
    process.exit(0);
});