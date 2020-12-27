const mongodb = require('mongodb');

module.exports = function(Patients){

    function insertOne(dna){
        return Patients.insertOne(dna);
    }

    function findByDna(dna){
        return Patients.findOne({dna});
    }

    function stats(){
        const countPatientsQuery = Patients.countDocuments();
        const count_mutant_dnaQuery = Patients.countDocuments({isMutant: true});

        return Promise.all([countPatientsQuery, count_mutant_dnaQuery]);
    }

    return {
        insertOne,
        findByDna,
        stats
    }
}