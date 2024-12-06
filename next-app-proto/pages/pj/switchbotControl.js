// switchbotControl.js
export async function controlSwitchBotBot(deviceMac, command) {
  // Bluetooth制御のコード
  try {
    const deviceName = "ボット_2E"; // デバイス名
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ name: deviceName }],
    });

    console.log("Device found:", device.name);

    const server = await device.gatt.connect();
    console.log("Connected to device!");

    const commandData = command === "press" ? [0x57, 0x01, 0x00] : null;
    if (!commandData) {
      throw new Error("Unsupported command.");
    }

    const serviceUUID = "cba20d00-224d-11e6-9fb8-0002a5d5c51b";
    const characteristicUUID = "cba20002-224d-11e6-9fb8-0002a5d5c51b";

    const service = await server.getPrimaryService(serviceUUID);
    const characteristic = await service.getCharacteristic(characteristicUUID);
    await characteristic.writeValue(new Uint8Array(commandData));

    console.log("Command sent successfully!");
    device.gatt.disconnect();
  } catch (error) {
    console.error("Error controlling SwitchBot Bot:", error);
  }
}
