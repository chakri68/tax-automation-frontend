import config from "../../config";
import jwt from "jsonwebtoken";

const { backendURL } = config;

export default async function handler(req, res) {
  let { token, id, review, actionRequired } = JSON.parse(req.body);
  if (!token) {
    res
      .status(400)
      .json({ success: false, data: null, message: "TOKEN NOT PROVIDED" });
    return;
  }
  let decodedJWT = jwt.verify(token, process.env.JWT_KEY);

  let responses = await Promise.all([
    fetch(`${backendURL}/api/v1/post-review`, {
      method: "POST",
      body: JSON.stringify({
        id,
        review,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }),
    fetch(`${backendURL}/api/v1/action-required`, {
      method: "POST",
      body: JSON.stringify({
        id,
        action: actionRequired,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }),
  ]);

  let data = await Promise.all(responses.map((response) => response.json()));
  res
    .status(200)
    .json({
      success: true,
      data: { actionRequired: data[1], review: data[0] },
    });
}
