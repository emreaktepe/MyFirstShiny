require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/quote', (req, res) => {
  const { name, phone, email, thickness, description } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Ad Soyad ve Telefon alanları zorunludur.',
    });
  }

  console.log('=== YENİ TEKLİF TALEBİ ===');
  console.log(`Tarih: ${new Date().toLocaleString('tr-TR')}`);
  console.log(`Ad Soyad: ${name}`);
  console.log(`Telefon: ${phone}`);
  console.log(`E-posta: ${email || '-'}`);
  console.log(`Malzeme Kalınlığı: ${thickness || '-'}`);
  console.log(`Açıklama: ${description || '-'}`);
  console.log('==========================');

  res.json({
    success: true,
    message: 'Talebiniz alındı. En kısa sürede sizi arayacağız.',
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Aktepe Pleksi sunucusu http://localhost:${PORT} adresinde çalışıyor`);
});
