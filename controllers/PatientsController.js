const letters = ['A','T','C','G']; //toDo: llevar a conf

module.exports = function({models, db}){

    async function isMutantAction(dnaData){

        const dna = dnaData.join(); //toDo: no permitir usar coma como letra
        const data = {dnaData};
        const cols = dnaData[0].length;

        data.isMutant = (cols>6 && haveLargueSecuence(dna, cols)) || (cols>3 && haveTwoShortSecuences(dna, cols));
        
        const result = await models.Patients.insertOne(data);
        
        return data.isMutant;
    }

    async function statsAction(){
        const [countPatients, count_mutant_dna] = await models.Patients.stats();

        const count_human_dna = countPatients - count_mutant_dna;

        const ratio = (count_mutant_dna / countPatients) || 0;

        return {
            count_mutant_dna,
            count_human_dna,
            ratio
        }
    }

    function haveLargueSecuence(dna, cols){
        let result = false;
        
        for(letter of letters){
            const patterns = largePatterns(letter, cols);

            for(pattern of patterns){

                if(pattern.test(dna)){
                    result = true;
                    break;
                }

            }

            if(result){
                break;
            }
        }
        
        return result;
        
    }

    function haveTwoShortSecuences(dna, cols){
        let patterns;
        let matchs;
        let cant = 0;

        for(letter of letters){
            patterns = shortPatterns(letter, cols);

            for(pattern of patterns){
                matchs = dna.matchAll(pattern);
                
                for(match of matchs){
                    cant++;
                    if(cant === 2){
                        break;
                    }
                }

                if(cant === 2){
                    break;
                }
            }

            if(cant === 2){
                break;
            }
        }

        return cant === 2;

    }

    function * largePatterns(letter, cols){
        yield patternTo(letter, 0, true); //horizontal
        yield patternTo(letter, cols - 1, true); //vertical
        yield patternTo(letter, cols, true); //primer diagonal
        yield patternTo(letter, cols - 4 + 2, true); //segunda diagonal
    }

    function * shortPatterns(letter, cols){
        yield patternTo(letter, 0); //horizontal
        yield patternTo(letter, cols - 1); //vertical
        yield patternTo(letter, cols); //primer diagonal
        yield patternTo(letter, cols - 4 + 2); //segunda diagonal
    }   

    function patternTo(letter, n, large=false){
        
        let pattern;
        let horizontalPattern;
        let generalPattern;

        if(large){
            horizontalPattern = 'X{7}';
            generalPattern = '(X.{n}){6}X';
        }else{
            horizontalPattern = 'X{4}';
            generalPattern = '(X.{n}){3}X';
        }

        if(!n){
            pattern = horizontalPattern;
        }else{
            pattern = generalPattern;
            pattern = pattern.replace('n', n);
        }

        pattern = pattern.replace(/X/g, letter);

        return new RegExp(pattern, 'g');
    }

    return {
        isMutantAction,
        statsAction
    }
}