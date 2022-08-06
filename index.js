// in nodejs
// require()

// in front-end javascript you use:
// import
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js" 

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() { // this does so MetaMask don't ask "do you wanna connect" all the time
    if (typeof window.ethereum !== "undefined") { // This checks if our user has a MetaMask
        await ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML =
            "Please install MetaMask"
    }
}


async function getBalance() {
    if(typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value // <- We say "fund(ethAmount)" because we want some amount of ETH to be funded and not, solana, usd etc.
    console.log(`Funding with ${ethAmount}..`)
     if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum) // Web3Provider does so we can get our provider to the blockchain. In our code it's MetaMask that is our provider and whatever network the funders MetaMask are in.
    const signer = provider.getSigner() // this is gonna return whichever wallet that is connected from the provider 
    console.log(signer)
    try {
        const contract = new ethers.Contract(contractAddress, abi, signer)
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(transactionResponse, provider) // "hey wait for the Tx to finish"
            console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // listen for this Tx to finish
    return new Promise((resolve, reject) => { // see 13:29:13 for explantion
        provider.once(transactionResponse.hash, (transactionReceipt) => {  // a listener to be triggered for only the next eventName event, at which time it will be removed.
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve() 
        })
    })
}

// withdraw function

async function withdraw() {
    if(typeof window.ethereum != "undefined") {
        console.log("withdrawing...")
    const provider = new ethers.providers.Web3Provider(window.ethereum) // Web3Provider does so we can get our provider to the blockchain. In our code it's MetaMask that is our provider and whatever network the funders MetaMask are in.
    const signer = provider.getSigner() // this is gonna return whichever wallet that is connected from the provider 
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
        const transactionResponse = await contract.withdraw()
        await listenForTransactionMine(transactionResponse, provider)
        } catch (error) {
        console.log(error)
        }
    }
}