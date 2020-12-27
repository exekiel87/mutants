const letters = ['A','T','C','G']; //toDo: llevar a conf

module.exports = function({models, db}){

    async function isMutantAction(dnaData){
        let isMutant;

        const patient = await models.Patients.findByDna(dnaData);

        if(patient){
            isMutant = patient.isMutant;
        }else{
            const dna = dnaData.join();
            const data = {dna: dnaData};
            const cols = dnaData[0].length + 1;
            const _rows = dnaData.length;

            data.isMutant = ((cols>6 || _rows>6) && haveLargueSecuence(dna, cols)) ||  ((cols>3 || _rows>3) && haveTwoShortSecuences(dna, cols));
            
            isMutant = data.isMutant;
            
            const result = await models.Patients.insertOne(data);
        }
        
        return isMutant;
    }

    async function statsAction(){
        const [countPatients, count_mutant_dna] = await models.Patients.stats();

        const count_human_dna = countPatients - count_mutant_dna;

        let ratio = (count_mutant_dna / countPatients) || 0;

        ratio = Math.round(ratio*100)/100;

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

                    if(cant === 1){
                        if (repeatSearch(dna, pattern)){
                            cant++;
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

            if(cant === 2){
                break;
            }
        }

        return cant === 2;

    }

    function repeatSearch(dnaStr, pattern){
        //anulo match anterior
        const dna = dnaStr.replace(pattern, 'x$1x$2x$3x');
        const match = !!dna.match(pattern);
        
        return match;
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

    function repeat(str, n){
        const cant = n;
        let add = '';
        for(let i=0; i<cant; i++){
            add += str;
        }

        return add;
    }

    function patternTo(letter, n, large=false){
        
        let pattern;
        let horizontalPattern;
        let generalPattern;
        
        if(large){
            horizontalPattern = 'X{7}';
            generalPattern = repeat('X([\\w,]{n})', 6)+'X';
        }else{
            horizontalPattern = 'X{4}';
            generalPattern = repeat('X([\\w,]{n})', 3)+'X';
        }

        if(!n){
            pattern = horizontalPattern;
        }else{
            pattern = generalPattern;
            pattern = pattern.replace(/n/g, n);
        }

        pattern = pattern.replace(/X/g, letter);

        return new RegExp(pattern, 'g');
    }

    return {
        isMutantAction,
        statsAction
    }
}