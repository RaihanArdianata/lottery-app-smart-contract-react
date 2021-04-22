const mysql = require('mysql')
let connection
const db_config =  {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'webapp'
}

function handleDisconnect(){
  connection = mysql.createConnection(db_config);
  connection.connect((err)=>{
    if(err){
      console.log("error connecting to db : " + err);
      setTimeout(handleDisconnect, 2000);
    }
  })
  connection.on('error',(err)=>{
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
      setTimeout(handleDisconnect, 2000);
    }else{
      throw err;
    }
  })
}

handleDisconnect()

module.exports = connection