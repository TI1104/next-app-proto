export async function controlSwitchBotBot(deviceMac, command) {
    try {
      // Web Bluetooth APIを使用してデバイスをスキャン
      const deviceName = "ボット_2E"; // デバイス名
      const requestBluetoothDevice = async () => {
        try {
          const device = await navigator.bluetooth.requestDevice({
            filters: [{ name: deviceName }] // デバイス名でフィルタリング
          });
  
          console.log("Device found:", device.name);
  
          // デバイスに接続
          const server = await device.gatt.connect();
          console.log("Connected to device!");
  
          // Botの制御（例えば短押し）
          const commandData = command === "press" ? [0x57, 0x01, 0x00] : null;
          if (!commandData) {
            throw new Error("Unsupported command.");
          }
  
          // SwitchBotのサービスUUIDとキャラクタリスティックUUID
          const serviceUUID = "cba20d00-224d-11e6-9fb8-0002a5d5c51b";
          const characteristicUUID = "cba20002-224d-11e6-9fb8-0002a5d5c51b";
  
          // コマンドを送信
          const service = await server.getPrimaryService(serviceUUID);
          const characteristic = await service.getCharacteristic(characteristicUUID);
          await characteristic.writeValue(new Uint8Array(commandData));
  
          console.log("Command sent successfully!");
          device.gatt.disconnect();
        } catch (error) {
          console.error("Error controlling SwitchBot Bot:", error);
        }
      };
  
      // ユーザー操作によってBluetoothデバイスに接続する
      document.getElementById("startBluetoothBtn").addEventListener("click", requestBluetoothDevice);
    } catch (error) {
      console.error("Error in controlSwitchBotBot:", error);
    }
  }
  