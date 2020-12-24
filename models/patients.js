const mongodb = require('mongodb');

module.exports = function(db){

    function insertOne(dna){
        return db.Patients.insertOne(dna);
    }

    function findOneByDna(dna){
        return db.Patients.findOne({dna});
    }

    async function stats(){
        const countPatientsQuery = db.Patients.countDocuments();
        const count_mutant_dnaQuery = db.Patients.countDocuments({isMutant: true});

        const [countPatients, count_mutant_dna] = await Promise.all([countPatientsQuery, count_mutant_dnaQuery]);

        const count_human_dna = countPatients - count_mutant_dna;

        const ratio = (count_mutant_dna / countPatients) || 0;

        return {
            count_mutant_dna,
            count_human_dna,
            ratio
        }
    }

    return {
        insertOne,
        findOneByDna,
        stats
    }
}