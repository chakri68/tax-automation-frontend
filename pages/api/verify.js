import { MD5 } from "crypto-js";
import jwt from "jsonwebtoken";
import { formatDate } from "../../components/utils";

export default async function handler(req, res) {
  let { token } = JSON.parse(req.body);
  if (!token) {
    res
      .status(400)
      .json({ success: false, data: null, message: "TOKEN NOT PROVIDED" });
    return;
  }
  try {
    let decodedJWT = jwt.verify(token, process.env.JWT_KEY);
    let { S, P } = decodedJWT;
    let md5Hash = MD5(
      `${S}|${formatDate(new Date())}|${process.env.PIN}`
    ).toString();
    if (md5Hash === P) {
      res.status(200).json({ success: true, data: { verified: true } });
    } else {
      res.status(200).json({ success: true, data: { verified: false } });
    }
  } catch (e) {
    console.error("HANDLED ERROR", e);
    res
      .status(400)
      .json({ success: false, data: null, message: "INVALID TOKEN" });
  }
}
