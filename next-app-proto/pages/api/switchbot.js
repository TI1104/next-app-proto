// pages/api/switchbot.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { deviceId, command } = req.body;
    const API_TOKEN = process.env.NEXT_PUBLIC_SWITCHBOT_TOKEN;

    try {
      const response = await axios.post(
        `https://api.switch-bot.com/v1.0/devices/${deviceId}/commands`,
        {
          command,
          parameter: "default",
          commandType: "command",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      console.error("SwitchBot API Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      res.status(500).json({
        error: error.response?.data || "Failed to send command to SwitchBot",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
