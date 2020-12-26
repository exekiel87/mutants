const { MongoClient } = require("mongodb");

const {DB_CONF: conf={}} = require('./configs/config');

const uri = conf.SENSORS_DB_URL || 'mongodb://localhost:27017/';
const dbName = conf.SENSORS_DB_NAME || 'mutants';

const models = {};

const connection = {models};

async function connect(uri, dbName){

  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  await client.connect();

  const db = client.db(dbName);

  connection.db = db;
  
  models.Patients = require('./models/patients.js')(db.collection('patients'));
}

connect(uri, dbName);

const PatientsController = require('./controllers/PatientsController')(connection);

module.exports = {
  PatientsController
}