module.exports = {
    up: (db) => {
        return db.patients.createIndex({dna:1},{unique:1, name:'dna_unique'})
    },
    down: (db) => {
        return db.patients.dropCollection('dna_unique');
    }
};