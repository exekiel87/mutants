module.exports = {
    up: (db) => {
        return db.createCollection('patients', {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: ['dna', 'isMutant'],
                        properties:{
                            dna:{
                                bsonType: 'array'
                            },
                            isMutant:{
                                bsonType: 'bool'
                            }
                        }
                    }
                }
            });
    },
    down: (db) => {
        return db.dropCollection('patients');
    }
};