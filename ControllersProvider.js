const {connect} = require('./connect');

const models = {};
const connection = {models};

connect().then((db) =>{
  connection.db = db;
  
  models.Patients = require('./models/patients.js')(db.collection('patients'));
});

const PatientsController = require('./controllers/PatientsController')(connection);

module.exports = {
  PatientsController
}