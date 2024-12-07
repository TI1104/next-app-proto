// pages/pj/switchbotControl.js
import React, { useState } from 'react';

const SwitchbotControl = () => {
  const [status, setStatus] = useState('');
  const [command, setCommand] = useState('');

  // SwitchBot を制御する関数
  const controlSwitchBot = async (deviceMac, command) => {
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
      setStatus("Command sent successfully!");
    } catch (error) {
      console.error("Error controlling SwitchBot Bot:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  // ボタンのクリックで SwitchBot を制御する
  const handleControlClick = (command) => {
    setCommand(command);
    controlSwitchBot(null, command); // Macアドレスが必要であれば変更
  };

  return (
    <div>
      <h1>SwitchBot Control</h1>
      <p>Control your SwitchBot device by pressing the buttons below:</p>
      <button onClick={() => handleControlClick('press')}>Press Button</button>
      <p>Status: {status}</p>
      <p>Last Command: {command}</p>
    </div>
  );
};

export default SwitchbotControl;
