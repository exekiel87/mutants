const { MongoClient } = require("mongodb");
const {DB_CONF: conf={}} = require('./configs/config');

async function connect(db){
  const uri = conf.SENSORS_DB_URL || 'mongodb://localhost:27017/';
  const dbName = conf.SENSORS_DB_NAME || 'mutants';

  const client = new MongoClient(uri, { useUnifiedTopology: true });
  
  await client.connect();

  const _db = client.db(dbName);
  
  db.Patients = _db.collection('patients');

  return db;
}

module.exports = function run() {
  const db = {};

  connect(db);

  const PatientsModel = require('./models/patients.js')(db);

  const PatientsController = require('./controllers/PatientsController')(PatientsModel);

  return {
    PatientsController
  }
}