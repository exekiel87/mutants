module.exports = {
    up: (db) => {
        return db.collection('patients').createIndex({dna:1},{unique:1, name:'dna_unique'})
    },
    down: (db) => {
        return db.collection('patients').dropIndex('dna_unique');
    }
};