const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const axios = require('axios');
const app = express();

// إعدادات السيرفر
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// صفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// تحليل الفيديو وإرجاع المعلومات
app.post('/analyze', async (req, res) => {
    const { url } = req.body;
    
    try {
        if (ytdl.validateURL(url)) {
            const info = await ytdl.getInfo(url);
            const videoDetails = info.videoDetails;
            
            res.json({
                success: true,
                title: videoDetails.title,
                thumbnail: videoDetails.thumbnails[0].url,
                duration: videoDetails.lengthSeconds,
                formats: [
                    { quality: '1080p', format: 'mp4', label: 'جودة عالية HD' },
                    { quality: '720p', format: 'mp4', label: 'جودة متوسطة' },
                    { quality: '480p', format: 'mp4', label: 'جودة منخفضة' },
                    { quality: 'mp3', format: 'mp3', label: 'صوت فقط MP3' }
                ]
            });
        } else {
            res.json({ 
                success: false, 
                error: 'رابط غير مدعوم. جرب رابط يوتيوب.' 
            });
        }
    } catch (error) {
        res.json({ 
            success: false, 
            error: 'فشل في تحليل الرابط: ' + error.message 
        });
    }
});

// تحميل الفيديو مباشرة
app.get('/download', async (req, res) => {
    const { url, quality, format } = req.query;
    
    try {
        if (format === 'mp3') {
            // تحميل كـ MP3
            res.header('Content-Disposition', 'attachment; filename="audio.mp3"');
            ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
                .pipe(res);
        } else {
            // تحميل كـ MP4
            let filter;
            if (quality === '1080p') filter = 'videoandaudio';
            else if (quality === '720p') filter = 'videoandaudio';
            else filter = 'videoandaudio';
            
            res.header('Content-Disposition', 'attachment; filename="video.mp4"');
            ytdl(url, { filter: filter, quality: 'highest' })
                .pipe(res);
        }
    } catch (error) {
        res.json({ 
            success: false, 
            error: 'فشل في التحميل: ' + error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال على البورت ${PORT}`);
    console.log(`🌐 افتح: http://localhost:${PORT}`);
});