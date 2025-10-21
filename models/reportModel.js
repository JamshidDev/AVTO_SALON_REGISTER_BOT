import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    // Mijoz qayerdan keldi
    whereFromClient: {
        type: String,
        required: true,
        trim: true
    },
    
    // Mijozning to'liq ismi
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    
    // Avtomobil modeli
    model: {
        type: String,
        required: true,
        trim: true
    },
    
    // To'lov turi
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    
    // Kasb
    workplace: {
        type: String,
        required: true,
        trim: true
    },
    
    // Manzil
    address: {
        type: String,
        required: true,
        trim: true
    },
    
    // Telefon raqam
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        minlength: 9,
        maxlength: 20
    },
    
    // Status
    status: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    
    // Telegram foydalanuvchi ma'lumotlari
    telegramUser: {
        userId: {
            type: Number,
            required: true
        },
        username: {
            type: String,
            trim: true
        },
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        }
    },
    
    // Ro'yxatdan o'tish sanasi
    registrationDate: {
        type: Date,
        default: Date.now
    },
    
    // Ma'lumotlar holati
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'registration_reports'
});

const ReportModel = mongoose.model('ReportModel', reportSchema);

export default ReportModel;
