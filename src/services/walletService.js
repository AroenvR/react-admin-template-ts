import { ethers } from "ethers";

/**
 * Gets a userr's public wallet address.
 * @returns a user's public wallet address.
 */
export const getPublicWalletAddress = async () => {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const currentAddress = await web3Provider.getSigner().provider.provider.selectedAddress;

    let web3;
    if (window.ethereum) {
        console.log("window.ethereum"); 

        web3 = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.enable();

    } else if (window.web3) {
        console.log("window.web3");
        // web3 = new Web3(window.web3.currentProvider);
        web3 = new ethers.providers.Web3Provider(window.web3);
    };
        
    let accounts = await web3.listAccounts();

    return accounts[0];
}

