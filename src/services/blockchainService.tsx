import ethers from 'ethers';
import { isTruthy } from '../util/util';
const CryptoJS = require("crypto-js");

import { getPublicWalletAddress } from './walletService';
// import DataFactoryContract_Metis from '../smart_contracts/DataFactoryContract_Metis.json'; // TODO

const pepperShaker = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

const staticSalt: string = process.env.REACT_APP_STATIC_SALT || "";
let pepper = () => {
    let randomPepper = Math.floor(Math.random() * pepperShaker.length);
    return pepperShaker[randomPepper];
}

// --------------
// |            |
// |    READ    |
// |            |
// --------------

/**
 * Gets the user's data from the Blockchain.
 * @param password the user has given us.
 * @returns decrypted data set.
 */
export const getUserData = async (password: string) => { // TODO: enhance performance with bulk awaiting of Promises
    const contract = await getContract(); // TODO: Write the Solidity contract.
    const publicAddress = await getPublicWalletAddress();

    if (!isTruthy(staticSalt)) {
        console.error("handleLogin (service): Boob. Something wrong with the environment.");
        throw new Error("The environment failed you.");
    }

    const cipherText = await getCipherTextFromContractFactory(publicAddress); // TODO: Solidity
    const key = await CryptoJS.SHA3(publicAddress + password + staticSalt).toString(); // TODO: Use Argon2id instead of SHA3 & add pepper.

    const bytes: any = await CryptoJS.AES.decrypt(cipherText + key);
    const dataString = bytes.toString(CryptoJS.enc.Utf8);
    
    return JSON.parse(dataString);
}

const getCipherTextFromContractFactory = async (publicAddress: string) => { // TODO: Secure the hash, Error handling and Promises.
    let dataLocation = CryptoJS.SHA3(publicAddress + staticSalt).toString(); // TODO: Use Argon2id instead of SHA3.

    const contractAddress = DataFactoryContract_Metis["address"]; // You could hide the contract address in the environment.
    const contractABI = DataFactoryContract_Metis["abi"]; // The ABI needs to be public so every one can verify the contract.
    
    const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const smartContractFactory = new ethers.Contract(contractAddress, contractABI, web3Provider);

    return await smartContractFactory.getUserData(dataLocation); // TODO: located in a mapping where only msg.sender can retrieve and read the cipherText.
}

// Attempting to write a pepper decrypter.
const decrypt = async (cipherText: string, key: string): Promise<string> => { // TODO: Improve by bulk-awaiting a promise of each pepper's result. That way Argon2id could get used.
    let data;
    for (let i = 0; i < pepperShaker.length; i++) {
        data = CryptoJS.AES.decrypt(cipherText + key);
        if (isTruthy(data)) break;
    }

    return data;
}

// -------------
// |           |
// |   NOTES   |
// |           |
/* -------------

A DataContractFactory could have a mapping(address => address) private DataContract;
Only the user would be able to read the contract address (and hackers).

Inside the DataContract, there would be a mapping(string => string) private cipherTexts;
 - Where the first string is a SHA3 hash of the user's public address + static salt.
 - And the second string is the encrypted data (cipherText).
 - The mapping would also be flooded with fake data to make it harder to find the user's data.
 - Only the owner would have instant access to the right cipherText.
 - The DataContract would only be accessible & readable by its creator. (and hackers)
 











                                                        string = hash | string[] = cipherTextArray;
The user's data is stored in a mapping(address => mapping(string => string[])) => cipherTextArray.

The first map can only be checked by the msg.sender, and the second mapping can only be checked by a hash which will finally return a haystack of cipherTexts.
The second mapping needs to get flooded as well.
In theory you could generate a contract per user, using a ContractFactory. Now the hackers would also need to find the contract address.

*/



// The hacker has to hack my environment to read the salt.
// The hacker has to know the user's password.
// The hacker has to run an Argon2id hash function on the password and salt.
// But they also need to know the user's public address (which makes all of this guaranteed unique).
// The hacker needs to find a way to send a read transaction to the blockchain with that wallet address to the smart contract. (which will have a modify function to only allow the owner to read the data).
// And now they need to find the data location (which is the hash of the public address), hidden in between 1000 fake dataSets.
// The Solidity mapping will be flooded with fake addresses and cipherTexts to hide real data.



// Create a cipherText endcoded by the user's password and public address. (plus static salt and one of 100 peppers).
// Store the cipherText in the smart contract. The location of the cipherText will be an Argon2 hash of the public address.
// Every time a new user gets onboarded, 1000 additional fake dataSets will be created and stored in the smart contract with fake hashes and redundant cipherTexts.
// --> cipherText length could show a difference in data size between real and fake dataSets. Data input size would need to be quite random. This could get expensive. (But it would be a good way to hide the real data location).

// What about using an AWS? Data is public any way. I guess the Blockchain could also just host the key for the AWS cipherText database. (But then the hacker would need to hack the Blockchain and the AWS).