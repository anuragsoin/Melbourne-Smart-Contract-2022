require('dotenv').config();
const {deploy} = require('./deploy');
async function main(){
    //here call the function of deploy.js
    console.log(`Multi Network deployment Started===========================\n`);
    await deploy(80001, false);
    await deploy(42, false);
    // await deploy(process.env.ETHEREUM_NETWORK, process.env.API_KEY, process.env.WALLET_PRIVATE_KEY);
    console.log(`Multi Network deployment Finished===========================\n`);
}

main().then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(-1);
    });