const { Telegraf } = require('telegraf');
const axios = require('axios');
const express = require('express');

// Inisialisasi Express (Penting agar Render tetap jalan)
const app = express();
app.get('/', (req, res) => res.send('Hissa Bot is Running!'));
app.listen(process.env.PORT || 3000);

// Ganti dengan Token dari @BotFather
const bot = new Telegraf(process.env.BOT_TOKEN);

// Pesan Start (Marketing Hook)
bot.start((ctx) => {
  ctx.replyWithMarkdown(
    `Halo *${ctx.from.first_name}*! Selamat datang di Hissa Syariah Bot. 🚀\n\n` +
    `Bot ini membantu kamu cek status syariah saham secara instan.\n\n` +
    `*Perintah:* \n` +
    `🔍 /cek [KODE SAHAM] - Contoh: \`/cek BRIS\`\n` +
    `🎁 /premium - Cara dapat Akses Premium 3 Bulan\n\n` +
    `Semua data berdasarkan analisis Tim Syariah Saham.`
  );
});

// Fitur Cek Saham
bot.command('cek', async (ctx) => {
  const text = ctx.message.text.split(' ');
  if (text.length < 2) return ctx.reply('Contoh penggunaan: /cek TLKM');

  const kode = text[1].toUpperCase();
  ctx.reply(`Sabar ya, lagi cek data ${kode}...`);

  try {
    const response = await axios.get(`https://syariahsaham-api.fly.dev/emiten/${kode}`);
    const data = response.data;
    
    const status = data.issi ? "✅ SYARIAH" : "❌ NON-SYARIAH";
    const info = data.issi 
      ? "Saham ini masuk dalam Daftar Efek Syariah (DES)." 
      : "Saham ini TIDAK masuk dalam Daftar Efek Syariah.";

    ctx.replyWithMarkdown(
      `📊 *HASIL SCANNING: ${kode}*\n` +
      `--------------------------\n` +
      `Status: *${status}*\n\n` +
      `${info}\n\n` +
      `🔗 *Analisis Fundamental & Teknikal:* \n` +
      `https://hissa.syariahsaham.id/ \n\n` +
      `_Dapatkan sinyal beli/jual di akses premium!_`
    );
  } catch (error) {
    ctx.reply(`Maaf, kode saham ${kode} tidak ditemukan atau terjadi gangguan server.`);
  }
});

// Fitur Promosi Premium (Untuk ngejar target 2.000 user)
bot.command('premium', (ctx) => {
  ctx.replyWithMarkdown(
    `🎁 *PROMO AKSES PREMIUM 3 BULAN*\n\n` +
    `Kamu bisa mendapatkan fitur Full Analysis secara GRATIS selama 3 bulan.\n\n` +
    `*Caranya:*\n` +
    `1. Daftar akun di https://hissa.syariahsaham.id\n` +
    `2. Masukkan kode promo: *HISSANU2026*\n` +
    `3. Nikmati fitur premiumnya!\n\n` +
    `Bantu kami mencapai target 2.000 user dengan share bot ini ke temanmu ya!`
  );
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));