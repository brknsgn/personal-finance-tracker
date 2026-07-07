const mongoose = require('mongoose');

const connectDB = async () => {
    
    if (process.env.NODE_ENV === 'test') {
        console.log('Test ortamı algılandı, gerçek veritabanına bağlantı atlanıyor...');
        return; // Fonksiyondan çık
    }

    
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }   
};

module.exports = connectDB;