import {connect,connection} from "mongoose"

const conn={
    isConnected: false
}

export async function connectDB(){
    if (conn.isConnected) return ;
    const db = await connect('mongodb://localhost/Sistema-Ventas')
    console.log(db.connection.db.databaseName)
}

connection.on('connected',()=>{
    console.log('Mongoose is connected')
})

connection.on('error',(err)=>{
    console.log('Moongose connection error',err)
})