const { ethers } = require("ethers");

let provider = null

const getProvider  = () => {
    if (provider) {
        console.log('provider exists, return the existing provider')
        return provider
    }
    else {
        console.log('initializing provider')
        provider = new ethers.providers.Web3Provider(window.ethereum)
        return provider;
    }
}

export {getProvider}
