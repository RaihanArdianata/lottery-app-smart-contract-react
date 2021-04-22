const express = require('express');
const http = require("http");
const app = express();

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  },
});

const cors = require('cors');
const PORT = 5000;
const {save_user_information, get_total_amount} = require('./models/server_db.js')
const paypal = require('paypal-rest-sdk');

//paypall config
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AUcaLc5ApnPv1uZkH688yCHYwYxyZVOdTwT71hRyChrTk2Caq8YAJdp67iXsxDoOxK33xJNdHeMl5aoI',
  'client_secret': 'ENQVsbOZlA7xaFsMf6WRdjCPQ_Ddl82OHrZqTfSZ0tQWXU-aR7JSkNirRBFh7kH1SnH0UWStN_pm-9tl'
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/post_info', async (req, res)=>{
  try {
    const email =  req.body.email;
    const amount = req.body.amount;

    if (amount <= 1){
      const error_info = {
        error: true,
        message: "Amount should be greater than 1"
      }
      return res.status(400).json(error_info)
    }
    const result = await save_user_information({"amount": amount, "email":email})

    var create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "Lottery",
            "sku": "Funding",
            "price": amount,
            "currency": "USD",
            "quantity": 1
          }]
        },
        "amount": {
          "currency": "USD",
          "total": amount
        },
        "payee": { "email": "lottery_app@gmail.com"},
        "description": "Lottery purchase"
      }]
    };


    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log("Create Payment Response");
        console.log(payment);

        for (let index = 0; index < payment.links.length; index++) {
          if(payment.links[index].rel == 'approval_url'){
            res.send(payment.links[index].href)
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.send(error)
  }
});

app.get('/get_total_amount', async (req, res)=> {
  let result = await get_total_amount()
  res.send(result)
});

io.on('connection', function (socket) {
  socket.emit('getData');
  socket.on('add', (user, callback) => {
    socket.emit('getData');
  });

  socket.on('disconnect', () => {
    console.log(`user dc`);
  });
})

server.listen(PORT,()=>{
  console.log('listening on PORT : ' + PORT);
});