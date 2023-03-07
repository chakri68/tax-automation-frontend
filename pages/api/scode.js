import config from "../../config";

const { backendURL } = config;

export default async function handler(req, res) {
  let { scode } = req.query;
  let response = await fetch(`${backendURL}/api/v1/gstin-list?scode=${scode}`);
  let data = await response.json();
  res.status(200).json({ success: true, data: data.data });
}
