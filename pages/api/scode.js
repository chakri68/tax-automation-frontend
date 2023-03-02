import config from "../../config";

const { backendURL } = config;

export default async function handler(req, res) {
  let { scode } = req.query;
  let response = await fetch(`${backendURL}/api/v1/gstin-details?scode=${scode}`);
  let data = await response.json()
  let send = [];
  data.data.forEach((element)=>{
    send.push(element.GSTIN)
  })
  res.status(200).json({ success: true, data: send })
}
