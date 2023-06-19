import jwt from "jsonwebtoken";
import config from "../../config";

const { backendURL } = config;

export default async function handler(req, res) {
  try {
    let { token, id, review, actionRequired } = JSON.parse(req.body);
    if (!token) {
      res
        .status(400)
        .json({ success: false, data: null, message: "TOKEN NOT PROVIDED" });
      return;
    }
    let decodedJWT = jwt.verify(token, process.env.JWT_KEY);

    let response = await fetch(`${backendURL}/api/v1/post-status`, {
      method: "POST",
      body: JSON.stringify({
        id,
        review,
        action: actionRequired,
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
