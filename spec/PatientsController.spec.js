//implementar tobecalled

describe('Patients Controller', ()=>{
    
    let PatientsController;
    let Patients;

    beforeEach(()=>{

        let conf = {letters: ['A','C','T','G']};
        Patients =  jasmine.createSpyObj('Patients', ['findByDna','insertOne','stats']);
        let models = {Patients};
        let connection = {models};

        PatientsController = require('../controllers/PatientsController')(connection, conf);
    });

    it('Should be a mutant, two horizontal secuences',async() =>{
        let dna = [
            'CCCC',
            'xxxx',
            'CCCC',
            'xxxx'
        ];

        Patients.findByDna.and.returnValue(Promise.resolve(false));
        Patients.findByDna.and.returnValue(Promise.resolve());

        let isMutant = await PatientsController.isMutantAction(dna);

        expect(isMutant).toBe(true);
    });

    it('Should be a mutant, two vertical secuences',async() =>{
        let dna = [
            'AAxx',
            'AAxx',
            'AAxx',
            'AAxx'
        ];

        Patients.findByDna.and.returnValue(Promise.resolve(false));
        Patients.findByDna.and.returnValue(Promise.resolve());

        let isMutant = await PatientsController.isMutantAction(dna);

        expect(isMutant).toBe(true);
    });

    it('Should be a mutant, two diagonal secuences',async() =>{
        let dna = [
            'TxxxxGx',
            'xTxxGxx',
            'xxTGxxx',
            'xxGTxxx'
        ];

        Patients.findByDna.and.returnValue(Promise.resolve(false));
        Patients.findByDna.and.returnValue(Promise.resolve());

        let isMutant = await PatientsController.isMutantAction(dna);

        expect(isMutant).toBe(true);
    });

    it('Should be a mutant, vertical and diagonal secuences',async() =>{
        let dna = [
            'TxxxxCx',
            'xTxxxCx',
            'xxTxxCx',
            'xxxTxCx'
        ];

        Patients.findByDna.and.returnValue(Promise.resolve(false));
        Patients.findByDna.and.returnValue(Promise.resolve());

        let isMutant = await PatientsController.isMutantAction(dna);

        expect(isMutant).toBe(true);
    });

    it('Should be a mutant, horizontal and diagonal secuences',async() =>{
        let dna = [
            'AAAAAAA',
            'xxGxxxx',
            'xxxGxxx',            
            'xxxxGxx',
            'xxxxxGx'
        ];

        Patients.findByDna.and.returnValue(Promise.resolve(false));
        Patients.findByDna.and.returnValue(Promise.resolve());

        let isMutant = await PatientsController.isMutantAction(dna);

        expect(isMutant).toBe(true);
    });


    it('Should not be a mutant',async() =>{
        let dna = ['ATCT','ACGT','AATG','AATC'];

        Patients.findByDna.and.returnValue(Promise.resolve(false));
        Patients.insertOne.and.returnValue(Promise.resolve());

        let isMutant = await PatientsController.isMutantAction(dna);

        expect(isMutant).toBe(false);
    });

    it('Should match stat', async () => {
        Patients.stats.and.returnValue(Promise.resolve([30, 5]));

        const {count_mutant_dna, count_human_dna, ratio} = await PatientsController.statsAction();

        expect(count_mutant_dna).toBe(5);
        expect(count_human_dna).toBe(25);
        expect(ratio).toBeCloseTo(5/30);
    });
});
