import "./App.css";
import React,{useState, useEffect} from "react";
import { Notyf } from 'notyf';
import connectToNetwork from './helpers/web3.config';

export default function App() {
  const notyf = new Notyf({ dismissible: true });
  const [state, setState] = useState({
    manager: '',
    participate_amount : '0.5',
  });
  const [totalBalance, setTotalBalance] = useState('0')
  const [web3, setWeb3] = useState(undefined);
  const [contract, setContract] = useState(undefined);

  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    if(state.participate_amount < 0.01){
      notyf.error('amount is less 0.01 please enter a bigger amount');
    }else{
      const enter_lotery = await contract.methods.enterLottery().send({
        from : accounts[0],
        value: web3.utils.toWei(state.participate_amount, 'ether'),
      });
      notyf.success('You have been added to the lottery!');
    }
  }

  const onPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    const winner = await contract.methods.pickWinner().send({
      from: accounts[0]
    })
    notyf.success('Payment send to winner')
  }

  useEffect(()=>{
    const load = async () => {
      try {
        const { result, web3 } = await connectToNetwork();
        setTotalBalance(await web3.eth.getBalance(result._address) + '')
        setState({...state, manager: await result.methods.manager().call()})
        setWeb3(web3);
        setContract(result);
      } catch (error) {
        console.log(error);
      }
    }

    load()
  },[contract, web3])
  if(web3 && contract){
    return (
      <div className="App">
        <div className="card">
          <h1>LOTTERY APPLICATION WITH SMART CONTRACT</h1>
          <div>
            <p>Total lottery amount is {web3.utils.fromWei(totalBalance, 'ether')} ether</p>
          </div>
          <form onSubmit={onSubmit}>
            <input value={state.participate_amount} onChange={event => setState({...state, participate_amount : event.target.value})}></input>
            <button type="submit">Participate</button>
          </form>
          <hr/> <br/> <hr/>
          <p>The manager of the lottery app is {state.manager}</p>
          <button type="submit" onClick={onPickWinner}>Pick Winner</button>
        </div>
      </div>
    );
  }else{
    return(
      <div className="App">
        <h4>Loading ...</h4>
      </div>
    )
  }
}