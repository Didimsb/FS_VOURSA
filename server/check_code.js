const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const verificationCodeSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // 10 minutes TTL
});

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

const checkCode = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const codes = await VerificationCode.find({}).sort({ createdAt: -1 }).limit(5);

        console.log('\n--- DERNIERS CODES DE VÉRIFICATION ---');
        codes.forEach(doc => {
            console.log(`Email: ${doc.email}`);
            console.log(`Code:  ${doc.code}`);
            console.log(`Time:  ${doc.createdAt}`);
            console.log('------------------------');
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkCode();
