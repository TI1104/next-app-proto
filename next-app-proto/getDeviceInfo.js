import axios from 'axios';
import dotenv from 'dotenv';

// 環境変数を読み込む
dotenv.config();

// APIトークン（.envファイルから取得）
const API_TOKEN = process.env.NEXT_PUBLIC_SWITCHBOT_TOKEN;

const getDeviceInfo = async () => {
  try {
    // SwitchBot APIのエンドポイント
    const response = await axios.get('https://api.switch-bot.com/v1.0/devices', {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    // 取得したデバイス情報を表示
    console.log('デバイス情報:', JSON.stringify(response.data, null, 2));

    // deviceListの詳細を表示
    const devices = response.data.deviceList;
    if (devices && devices.length > 0) {
      devices.forEach((device, index) => {
        console.log(`デバイス${index + 1}の詳細:`, JSON.stringify(device, null, 2));  // 各デバイスの詳細情報を表示
        if (device.deviceType === 'Bot') {
          console.log(`BotのデバイスID: ${device.deviceId}`);
          // Botを操作するコードをここに追加（例: sendSwitchBotCommand）
        }
      });
    } else {
      console.log('デバイスが見つかりませんでした');
    }
  } catch (error) {
    console.error('デバイス情報の取得に失敗しました:', error);
  }
};

// 呼び出し例
getDeviceInfo();
