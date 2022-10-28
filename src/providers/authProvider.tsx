import { AuthProvider } from "react-admin";
const CryptoJS = require("crypto-js");

const domainUrl = process.env.REACT_APP_DOMAIN_URL || "";

interface LoginInput {
    username: string;
    password: string;
}

const authProvider: AuthProvider = {
    login: async ({ username, password }: LoginInput) => {

        // // TODO: Read the salt. 
        // // TODO: Argon2?
        // const hash = CryptoJS.SHA3(password + "Public wallet address (TODO)").toString(); // Public addres solves the duplicate passwords issue.
        // let data = "I am data!";
        // const cipherText = CryptoJS.AES.encrypt(data, hash).toString();

        // // TODO: Send to the blockchain. (todo: Soldity storing contract).
        // const sendToBlockchain = async (cipherText: string) => { // Read the salt.
        //     const dataLocation = CryptoJS.SHA3("Public address (TODO)").toString();

        //     // Store the cipherText in a Solidity mapping(dataLocation => cipherText).
        // }

        // // When we want to retrieve the data: user needs to enter the password.
        // // By looking at the public address, we can find the cipherText.
        // // We can decrypt the cipherText with the password.
        // const retrieveFromBlockchain = async (password: string) => {
        //     const dataLocation = CryptoJS.SHA3("Public address (TODO)").toString();
        //     // contract.getData(dataLocation) => cipherText

        //     const bytes = CryptoJS.AES.decrypt(password + "Public wallet address (TODO)");
        //     const dataString = bytes.toString(CryptoJS.enc.Utf8);
        //     const data = JSON.parse(dataString);            
        // }




        // install CryptoJS.
        // Also install Argon2 and use that to hash the password input.1
        // blockchainLogin(username, password).then((response) => {

        // Remove the following two lines of code when you want to use an actual login API.
        sessionStorage.setItem("session_token", "token");
        return Promise.resolve();

        const request = new Request(`${domainUrl}/api/login`, {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: new Headers({ "Content-Type": "application/json" }),
        });
        return fetch(request)
            .then((response) => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(({ token }) => {
                sessionStorage.setItem("session_token", token);
            });        
    },

    logout: () => {
        localStorage.clear();
        sessionStorage.clear();
        return Promise.resolve();
    },

    checkError:  (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.clear();
            sessionStorage.clear();
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },

    // TODO:
    checkAuth: () =>
        sessionStorage.getItem('session_token') ? Promise.resolve() : Promise.reject(),

    getIdentity: () =>
        Promise.resolve({ id: "" }),

    getPermissions: () => Promise.resolve(''),
};

export default authProvider;