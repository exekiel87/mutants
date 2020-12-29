# Mutants
https://mutantsdb.herokuapp.com/
# DB

MongoDB

# Configs

./configs/config.js

# .env example
MUTANTS_DB_URL=mongodb://localhost:27017/<br>
MUTANTS_DB_NAME=mutants

# Migrate
Levantar configuración de base de datos

npm run setup

# Dev

npm run dev

# Production

npm start

# Test

npm run test:server

# Test Coverage

npm run test:server:coverage

# Endpoints

/api/mutant<br>
POST<br>
{dna:['ATCG','GTCG','ATTC','GTGG']}<br>
Return<br>
Status<br>
<br>
/api/stats<br>
POST<br>
Return<br>
{count_mutant_dna:5, count_human_dna:25,ratio:0.16}


