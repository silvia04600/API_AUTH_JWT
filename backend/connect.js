const mongoose = require('mongoose');

async function main() {
    try {

        await mongoose.connect('mongodb+srv://JWT:VkjhlGZuRt4TdgdB@cluster0.7azeaoi.mongodb.net/jwt_db?retryWrites=true&w=majority&appName=Cluster0');
        console.log('conectado ao banco');
    } catch {
    console.log(`erro: ${error}`)
        
    }
}

module.exports = main

//VkjhlGZuRt4TdgdB
