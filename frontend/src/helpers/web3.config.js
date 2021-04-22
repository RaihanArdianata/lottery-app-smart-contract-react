import { contractABI, contractAddress } from './contract.config'
import Web3 from "web3"

const connectToNetwork = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        await window.ethereum.enable()
        const web3 = await new Web3(Web3.givenProvider || "HTTP://127.0.0.1:7545")
        const result = await new web3.eth.Contract(
          contractABI,
          contractAddress,
        )
        return resolve({ result, web3 })
      }
      return resolve({ result: undefined, web3: undefined })
    })
  })
}

export default connectToNetwork