const { isRef } = require('joi');
const proxyquire = require('proxyquire');

const letters = ['A','C','T','G'];

const {createPatientSchema} = proxyquire('../schemas/patient',{
    '../configs/config': {letters: letters.concat(['x'])}
});

function isInvalid(dna){
    const {error} = createPatientSchema.validate({dna});

    return error;
}

function isValidDna(dna){
    let valid = true;

    if(isInvalid(dna)){
        valid = false;
    }
    
    expect(valid).toBe(true, 'Invalid dna');
}

describe('Patients Controller', ()=>{
    let conf = {letters};
    let PatientsController;
    let Patients = jasmine.createSpyObj('Patients', ['findByDna','insertOne','stats']);;
    let models = {Patients};
    let connection = {models};
    
    Patients.insertOne.and.returnValue(Promise.resolve());
    Patients.stats.and.returnValue(Promise.resolve([30, 5]));

    PatientsController = require('../controllers/PatientsController')(connection, conf);

    beforeEach(() =>{
        Patients.findByDna.and.returnValue(Promise.resolve(false));
    });

    describe('Dna validator', () =>{
        it('Should be a valid dna', () => {
            const dna = [
                'xxAAT',
                'CTGAx',
                'xxTAT',
                'CCGTA',
                'TxCGG'
            ];
            
            isValidDna(dna);
        });

        it('Should not be a valid dna, unknow letter', () => {
            const dna = [
                'MMAAT',
                'CTGAM',
                'MMTAT',
                'CCGTA',
                'TMCGG'
            ];
            
            const invalid = !!isInvalid(dna);

            expect(invalid).toBe(true);
        });

        it('Should not be a valid dna, it is not nxn table', () => {
            const dna = [
                'xxAAT',
                'CTGAx',
                'xxTAT',
                'CCGTA'
            ];
            
            const invalid = !!isInvalid(dna);

            expect(invalid).toBe(true);
        });
    });

    describe('Should be a mutant', () => {

        async function isMutant(dna){
        
            isValidDna(dna);
        
            let mutant = await PatientsController.isMutantAction(dna);
        
            expect(mutant).toBe(true);
        }

        it('Registered patient', async () => {
            const dna = [
                'AAAA',
                'AAAA',
                'xxxx',
                'xxxx'
            ];

            const findByDna = Patients.findByDna.and.callFake((dna)=> {return Promise.resolve({isMutant: true})});
            
            const mutant = isMutant(dna);
            
            expect(findByDna).toHaveBeenCalledWith(dna);

            return mutant;
        });

        it('two horizontal sequences',() =>{
            let dna = [
                'CCCC',
                'xxxx',
                'CCCC',
                'xxxx'
            ];

            return isMutant(dna);
        });

        it('two vertical sequences',() =>{
            let dna = [
                'AAxx',
                'AAxx',
                'AAxx',
                'AAxx'
            ];
            
            return isMutant(dna);
        });

        it('two diagonal sequences',() =>{
            let dna = [
                'TxxxxGx',
                'xTxxGxx',
                'xxTGxxx',
                'xxGTxxx',
                'xxxxxxx',
                'xxxxxxx',
                'xxxxxxx'
            ];
            
            return isMutant(dna);
        });

        it('vertical and diagonal sequences',() =>{
            let dna = [
                'TxxxxCx',
                'xTxxxCx',
                'xxTxxCx',
                'xxxTxCx',
                'xxxxxxx',
                'xxxxxxx',
                'xxxxxxx'
            ];

            return isMutant(dna);
        });

        it('horizontal and diagonal sequences',() =>{
            let dna = [
                'AAAAAAA',
                'xxGxxxx',
                'xxxGxxx',            
                'xxxxGxx',
                'xxxxxGx',
                'xxxxxxx',
                'xxxxxxx'
            ];

            return isMutant(dna);
        });

        it('large horizontal sequence',() =>{
            let dna = [
                'xxxxxxx',
                'CCCCCCC',
                'xxxxxxx',
                'xxxxxxx',
                'xxxxxxx',
                'xxxxxxx',
                'xxxxxxx',
            ];
            
            return isMutant(dna);
        });

        it('large vertical sequence',() =>{
            let dna = [
                'xxxGxxx',
                'xxxGxxx',
                'xxxGxxx',
                'xxxGxxx',
                'xxxGxxx',
                'xxxGxxx',
                'xxxGxxx',
            ];
            
            return isMutant(dna);
        });

        it('large first diagonal sequence',() =>{
            let dna = [
                'xxxxxxxxx',
                'xxxxxxxxx',
                'xTxxxxxxx',
                'xxTxxxxxx',
                'xxxTxxxxx',
                'xxxxTxxxx',
                'xxxxxTxxx',
                'xxxxxxTxx',
                'xxxxxxxTx'            
            ];
            
            return isMutant(dna);
        });

        it('large second diagonal sequence',() =>{
            let dna = [
                'xxxxxxxxG',
                'xxxxxxxGx',
                'xxxxxxGxx',
                'xxxxxGxxx',
                'xxxxGxxxx',
                'xxxGxxxxx',
                'xxGxxxxxx',
                'xxxxxxxxx',
                'xxxxxxxxx',
            ];
            
            return isMutant(dna);
        });

        it('intersection sequences',() =>{
            let dna = [
                'xxxxxxxxx',
                'xxxxxxxxx',
                'xxxxxxxxT',
                'xxxxxxxTx',
                'xxxxTTTTx',
                'xxxxxTxxx',
                'xxxxTxxxx',            
                'xxxxxxxxx',
                'xxxxxxxxx',
            ];
            
            return isMutant(dna);
        });   

        
    });

    describe('Should not be a mutant', () =>{

        async function isNotMutant(dna){
        
            isValidDna(dna);
        
            let mutant = await PatientsController.isMutantAction(dna);

            expect(mutant).toBeFalsy();
        }       

        it('no sequence',() =>{
            let dna = [
                "ACCG",
                "ATGT",
                "AGCC",
                "TTTC"
            ];

            return isNotMutant(dna);
        });

        it('one sequence',() =>{
            let dna = [
                'AxxG',
                'AxGx',
                'AGxx',
                'Axxx'
            ];

            return isNotMutant(dna);
        });
    });

    it('Should match stat', async() => {

        const {count_mutant_dna, count_human_dna, ratio} = await PatientsController.statsAction();

        expect(count_mutant_dna).toBe(5);
        expect(count_human_dna).toBe(25);
        expect(ratio).toBeCloseTo(5/30);
    });
});