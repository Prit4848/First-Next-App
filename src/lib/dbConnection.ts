import mongoose from "mongoose"

type ConnectionObject = {
    isConnected:number
}

const connection:ConnectionObject = {
    isConnected: 0
}

async function dbConnection():Promise<void>{
    if(connection.isConnected){
        console.log("Alredy Connected To Database");
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "",{})

        connection.isConnected = db.connections[0].readyState;

         console.log("DB Connected Sucessfully");
         
    } catch (error) {
        console.log("Db Connection Error:", error);
        process.exit(1)
    }
}

export default dbConnection;
