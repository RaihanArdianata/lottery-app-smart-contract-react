const db = require('../database.js')

const save_user_information = (data) =>  new Promise((resolve, reject)=>{
  db.query('INSERT INTO lottrey_information SET?', data, function(err, results, fields){
    if(err){
      reject(err);
    }
    resolve('Succesful');
  })
})

const get_total_amount = (data) =>  new Promise((resolve, reject)=>{
  db.query('select sum(amount) as total_amount from lottrey_information', null, function(err, results, fields){
    if(err){
      reject(err);
    }
    resolve(results);
  })
})



module.exports = {
  save_user_information,
  get_total_amount
}