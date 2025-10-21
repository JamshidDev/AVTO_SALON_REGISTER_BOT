import ReportModel from '../models/reportModel.js';

// CREATE - Yangi report yaratish
export const createReport = async (reportData) => {
    try {
        const newReport = await ReportModel.create(reportData);
        return {
            success: true,
            message: 'Report muvaffaqiyatli yaratildi',
            data: newReport
        };
    } catch (error) {
        return {
            success: false,
            message: 'Report yaratishda xatolik',
            error: error.message
        };
    }
};

// READ - Barcha reportlarni olish
export const getAllReports = async (filters = {}) => {
    try {
        const reports = await ReportModel.find(filters).sort({ createdAt: -1 });
        return {
            success: true,
            data: reports
        };
    } catch (error) {
        return {
            success: false,
            message: 'Reportlarni olishda xatolik',
            error: error.message
        };
    }
};

// READ - ID bo'yicha report olish
export const getReportById = async (id) => {
    try {
        const report = await ReportModel.findById(id);
        
        if (!report) {
            return {
                success: false,
                message: 'Report topilmadi'
            };
        }
        
        return {
            success: true,
            data: report
        };
    } catch (error) {
        return {
            success: false,
            message: 'Report olishda xatolik',
            error: error.message
        };
    }
};

// UPDATE - Report yangilash
export const updateReport = async (id, updateData) => {
    try {
        const report = await ReportModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!report) {
            return {
                success: false,
                message: 'Report topilmadi'
            };
        }
        
        return {
            success: true,
            message: 'Report muvaffaqiyatli yangilandi',
            data: report
        };
    } catch (error) {
        return {
            success: false,
            message: 'Report yangilashda xatolik',
            error: error.message
        };
    }
};

// DELETE - Report o'chirish
export const deleteReport = async (id) => {
    try {
        const report = await ReportModel.findByIdAndDelete(id);
        
        if (!report) {
            return {
                success: false,
                message: 'Report topilmadi'
            };
        }
        
        return {
            success: true,
            message: 'Report muvaffaqiyatli o\'chirildi',
            data: report
        };
    } catch (error) {
        return {
            success: false,
            message: 'Report o\'chirishda xatolik',
            error: error.message
        };
    }
};

// READ - Vaqt davri bo'yicha reportlar
export const getReportsByPeriod = async (period = 'all') => {
    try {
        let filter = {};
        const now = new Date();
        
        switch (period) {
            case 'daily':
                // Bugungi kun
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                filter.registrationDate = {
                    $gte: startOfDay,
                    $lt: endOfDay
                };
                break;
                
            case 'weekly':
                // Bu hafta
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 7);
                filter.registrationDate = {
                    $gte: startOfWeek,
                    $lt: endOfWeek
                };
                break;
                
            case 'monthly':
                // Bu oy
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                filter.registrationDate = {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                };
                break;
                
            case 'all':
            default:
                // Barcha reportlar
                filter = {};
                break;
        }
        
        const reports = await ReportModel.find(filter).sort({ createdAt: -1 });
        const count = reports.length;
        
        return {
            success: true,
            data: reports,
            count: count,
            period: period
        };
    } catch (error) {
        return {
            success: false,
            message: 'Vaqt davri bo\'yicha reportlarni olishda xatolik',
            error: error.message
        };
    }
};