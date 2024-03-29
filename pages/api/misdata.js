import jwt from "jsonwebtoken";
import config from "../../config";

const { backendURL } = config;

export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body);
    if (!body?.token) {
      throw new Error("TOKEN NOT PROVIDED");
    }

    let decodedJWT = jwt.verify(body?.token, process.env.JWT_KEY);
    let response = await fetch(`${backendURL}/api/v1/asmt-10`, {
      method: "POST",
      body: JSON.stringify({
        scode: decodedJWT.S,
        boweb: body?.boweb || 0,
        drc: body?.drc || 0,
        further_action: body?.further_action || 0,
        gstin_array: body?.gstin_array || [],
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await response.json();
    if (data.error != null) throw new Error(data?.message);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (e) {
    console.error("HANDLED ERROR", e);
    res.status(400).json({ success: false, data: null, message: e.message });
  }
}
