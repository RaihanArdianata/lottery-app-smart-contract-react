import "./App.css";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Notyf } from 'notyf';
import socket from './helpers/socket.config';

export default function LotteryPayPall() {
  const notyf = new Notyf({ dismissible: true });
  const [form, setForm] = useState({ email: '', amount: '', });
  const [totalAmount, setTotalAmount] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios({
        url: 'http://localhost:5000/post_info',
        method: "POST",
        data: { ...form }
      })
      socket.emit('add');
      notyf.success("Success");

      window.location.href = data
    } catch (error) {
      notyf.error("error")
    }
  }

  const getTotalAmount = async () => {
    try {
      const { data } = await axios({
        method: "GET",
        url: 'http://localhost:5000/get_total_amount'
      })
      setTotalAmount(data[0].total_amount);
    } catch (error) {
      console.log(error);
      notyf.error("error");
    }
  }

  useEffect(() => {
    socket.on("getData", () => {
      getTotalAmount()
    });
  }, [])

  return (
    <div className="App">
      <h1>LOTTERY APPLICATION WEB 2.0</h1>
      <div>
        <p>Total lottery amount is {totalAmount}</p>
      </div>
      <form onSubmit={onSubmit}>
        <input type="number" placeholder="amount" onChange={(event) => setForm({ ...form, amount: event.target.value })} value={form.amount}></input>
        <input type="email" placeholder="email" onChange={(event) => setForm({ ...form, email: event.target.value })} value={form.email}></input>
        <button type="submit">Participate</button>
      </form>
    </div>
  );
}