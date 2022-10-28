import ethers from 'ethers';
import { isTruthy } from '../util/util';
const CryptoJS = require("crypto-js");

import { getPublicWalletAddress, getUserData } from './walletService';

const staticSalt: string = process.env.REACT_APP_STATIC_SALT || "";

let pepperShaker = ["Peppery", "Pepperoni", "Pepperjack", "Peppermint", "Pepper", "Pepperidge", "Pepperidge Farm", "Pepperidge Farm Remembers", "Pepperidge Farm Remembers"]; // That's all the pepper I could think of. (Copilot, not me.)
let pepper = () => {
    let randomPepper = Math.floor(Math.random() * pepperShaker.length);
    return pepperShaker[randomPepper];
}

/**
 * 
 * @param password the user has given us.
 */
const handleLogin = async (password: string) => {
    const publicAddress = await getPublicWalletAddress();
    console.log("publicAddress: ", publicAddress);

    if (!isTruthy(staticSalt)) {
        console.error("handleLogin (service): Boob. Something wrong with the environment.");
        throw new Error("The environment failed you.");
    }

    // TODO: Check if address.toString(); is necessary.
    const key = await CryptoJS.SHA3(publicAddress.toString() + password + pepper + staticSalt).toString(); // TODO: Use Argon2id instead of SHA3.
}

/**
 * 
 * @param key to decrypt cipherText with.
 * @returns decrypted data set.
 */
const fetchData = async (key: string) => {
    const dataLocation = CryptoJS.SHA3(await getPublicWalletAddress() + pepper + staticSalt).toString();

    let cipherText = getUserData(dataLocation);

    const bytes = CryptoJS.AES.decrypt(cipherText + key);
    const dataString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(dataString);        
}





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