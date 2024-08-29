import { MongoClient, ServerApiVersion, Db } from 'mongodb';

// Connection URI
const uri = "mongodb+srv://meiradobkin:4PYX5Cnj88jddWo5@cluster0.0uzte.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const databaseName = "giftcards";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db: Db;

export async function connect() {
  await client.connect();
  db = client.db(databaseName);
  console.log("Connected to MongoDB!");
}

export function getDb() {
  return db;
}

connect().catch(console.dir);

