const {connect} = require('./connect');

const models = {};
const connection = {models};
const conf = require('./configs/config');

connect().then((db) =>{
  connection.db = db;
  
  models.Patients = require('./models/patients.js')(db.collection('patients'));
});

const PatientsController = require('./controllers/PatientsController')(connection, conf);

module.exports = {
  PatientsController
}