const express = require('express');
const path = require('path');
const app = express();

// خدمة الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// علشان نعرف نستقبل بيانات من الفورم
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// الراوت الأساسي
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API للتحميل (دمية حالياً)
app.post('/download', (req, res) => {
    const { url } = req.body;
    
    // ده كود دمي - هيحتاج تطوير
    res.json({
        success: true,
        message: 'جاري التطوير - استخدم y2mate مؤقتاً',
        links: [
            { quality: '720p', format: 'MP4', url: '#' },
            { quality: '480p', format: 'MP4', url: '#' },
            { quality: 'MP3', format: 'MP3', url: '#' }
        ]
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
    console.log(`🎯 افتح المتصفح على الرابط ده`);
});