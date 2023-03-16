import jwt from "jsonwebtoken";
import config from "../../config";

const { backendURL } = config;

export default async function handler(req, res) {
  let { token } = JSON.parse(req.body);
  if (!token) {
    res
      .status(400)
      .json({ success: false, data: null, message: "TOKEN NOT PROVIDED" });
    return;
  }
  let decodedJWT = jwt.verify(token, process.env.JWT_KEY);
  let response = await fetch(
    `${backendURL}/api/v1/gstin-list?scode=${decodedJWT.S}`
  );
  let data = await response.json();
  res.status(200).json({ success: true, data: data.data });
}
