import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export const exportReportsToExcel = (reports, periodName) => {
    try {
        // Excel uchun ma'lumotlarni tayyorlash
        const excelData = reports.map((report, index) => ({
            '№': index + 1,
            'Mijoz ismi': report.fullName,
            'Avtomobil modeli': report.model,
            'To\'lov turi': report.paymentMethod,
            'Kasbi': report.workplace,
            'Manzil': report.address,
            'Telefon raqam': report.phoneNumber,
            'Status': report.status,
            'Qayerdan': report.whereFromClient,
            'Ro\'yxatdan o\'tish sanasi': new Date(report.registrationDate).toLocaleDateString('uz-UZ'),
            'Sana': new Date(report.createdAt).toLocaleDateString('ru-RU'),
            'Telegram foydalanuvchi': report.telegramUser?.username || report.telegramUser?.firstName || 'Noma\'lum'
        }));

        // Yangi workbook yaratish
        const workbook = XLSX.utils.book_new();
        
        // Worksheet yaratish
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        
        // Headerlarni bold qilish
        const headerStyle = {
            font: { bold: true },
            fill: { fgColor: { rgb: "E6E6FA" } },
            alignment: { horizontal: "center", vertical: "center" }
        };
        
        // Header qatorini style qo'llash
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (!worksheet[cellAddress]) continue;
            
            worksheet[cellAddress].s = headerStyle;
        }
        
        // Ustun kengliklarini o'rnatish
        const columnWidths = [
            { wch: 5 },   // №
            { wch: 20 },  // Mijoz ismi
            { wch: 15 },  // Avtomobil modeli
            { wch: 15 },  // To'lov turi
            { wch: 15 },  // Ish joyi
            { wch: 20 },  // Manzil
            { wch: 15 },  // Telefon raqam
            { wch: 15 },  // Status
            { wch: 15 },  // Qayerdan
            { wch: 20 },  // Ro'yxatdan o'tish sanasi
            { wch: 12 },  // Sana
            { wch: 20 }   // Telegram foydalanuvchi
        ];
        worksheet['!cols'] = columnWidths;

        // Workbook ga worksheet qo'shish
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Hisobotlar');

        // Fayl nomini yaratish
        let fileName;
        const today = new Date().toLocaleDateString('ru-RU').replace(/\./g, '-');
        
        if (periodName.includes('Kunlik')) {
            // Kunlik hisobot uchun faqat sana
            fileName = `${today}.xlsx`;
        } else if (periodName.includes('Haftalik')) {
            // Haftalik hisobot uchun haftalik + sana
            fileName = `haftalik ${today}.xlsx`;
        } else if (periodName.includes('Oylik')) {
            // Oylik hisobot uchun oylik + sana
            fileName = `oylik ${today}.xlsx`;
        } else if (periodName.includes('Barchasi')) {
            // Barchasi uchun barcha + sana
            fileName = `barcha ${today}.xlsx`;
        } else {
            // Boshqa holatlar uchun eski format
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            fileName = `hisobotlar_${periodName.replace(/\s+/g, '_')}_${timestamp}.xlsx`;
        }
        const filePath = path.join(process.cwd(), 'temp', fileName);

        // Temp papkasini yaratish (agar mavjud bo'lmasa)
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Excel faylini yozish
        XLSX.writeFile(workbook, filePath);

        return {
            success: true,
            filePath: filePath,
            fileName: fileName,
            count: reports.length
        };
    } catch (error) {
        console.error('Excel export error:', error);
        return {
            success: false,
            message: `Excel fayl yaratishda xatolik: ${error.message}`
        };
    }
};

export const deleteTempFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return { success: true };
        }
        return { success: false, message: 'Fayl topilmadi' };
    } catch (error) {
        console.error('File deletion error:', error);
        return { success: false, message: `Fayl o'chirishda xatolik: ${error.message}` };
    }
};
