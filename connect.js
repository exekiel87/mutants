const { MongoClient } = require("mongodb");

const {DB_CONF: conf={}} = require('./configs/config');

const uri = conf.MUTANTS_DB_URL || 'mongodb://localhost:27017/';
const dbName = conf.MUTANTS_DB_NAME || 'mutants';
let db;

const client = new MongoClient(uri, { useUnifiedTopology: true });
  
const connection = client.connect();

async function connect(){
    
    const result = await connection;

    if(!db){
        db = client.db(dbName);
    }

    return db;
}

module.exports = {
    connect
}