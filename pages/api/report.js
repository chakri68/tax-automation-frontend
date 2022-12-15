import config from "../../config";

const { backendURL } = config;

// Some util functions to parse the weird ass data from the database
function processData(json, matcher) {
  let res = {};
  Object.keys(json).map((key) => {
    if (matcher(key)) {
      res[key] = JSON.parse(json[key]);
    } else {
      res[key] = json[key];
    }
  });
  return res;
}

export default async function handler(req, res) {
  let { gstin } = req.query;
  let response, data;
  // fetching all the data

  // R1 Data
  let response1 = await fetch(`${backendURL}/api/v1/r1?GSTIN=${gstin}`);
  let response2 = await fetch(`${backendURL}/api/v1/r12?GSTIN=${gstin}`);
  let data1 = await response1.json();
  let data2 = await response2.json();
  let R1Data = { ...data1.data, ...data2.data };

  // R3 Data
  response = await fetch(`${backendURL}/api/v1/r3b?GSTIN=${gstin}`);
  data = await response.json();
  let R3Data = processData(
    data.data,
    (key) =>
      key === "itc_elg" ||
      key === "intr_ltfee" ||
      key === "qn" ||
      key === "sup_details"
  );

  // R9 Data
  response = await fetch(`${backendURL}/api/v1/r9?GSTIN=${gstin}`);
  data = await response.json();
  let R9Data = processData(
    data.data,
    (key) => key.startsWith("table") || key === "tax_pay"
  );

  let Report={
    table1:new function(){
      this.row1=new function (){
        const data=R1Data.table12;
        this.iamt=data.iamt
        this.camt=data.camt
        this.samt=data.samt
        this.total=this.camt+this.iamt+this.samt
      }
      this.row2=new function (){
        const data=R9Data.table4?.sup_adv;
        this.iamt=data.iamt
        this.camt=data.camt
        this.samt=data.samt
        this.total=this.camt+this.iamt+this.samt
      }
      this.row3={
        iamt:this.row1.iamt-this.row2.iamt,
        camt:this.row1.camt-this.row2.camt,
        samt:this.row1.samt-this.row2.samt,
        total:this.row1.total-this.row2.total
      }
    },
    table2:new function(){
      this.row1=new function (){
        const data=R9Data.table6?.itc_3b;
        this.iamt=data.iamt
        this.camt=data.camt
        this.samt=data.samt
        this.total=this.camt+this.iamt+this.samt
      }
      this.row2=new function (){
        const data1=R9Data.table10?.rtc_availd;
        const data2=R9Data.table10?.itc_rvsl;
        this.iamt=data1.iamt||0-data2.iamt||0
        this.camt=data1.camt||0-data2.camt||0
        this.samt=data1.samt||0-data2.samt||0
        this.total=this.camt+this.iamt+this.samt
      }
      this.row3={
        iamt:this.row1.iamt-this.row2.iamt,
        camt:this.row1.camt-this.row2.camt,
        samt:this.row1.samt-this.row2.samt,
        total:this.row1.total-this.row2.total
      }
      this.row4=new function (){
        const data=R9Data.table6?.total_itc_availed;
        this.iamt=data.iamt
        this.camt=data.camt
        this.samt=data.samt
        this.total=this.camt+this.iamt+this.samt
      }
      this.row5={
        iamt:this.row3.iamt-this.row4.iamt,
        camt:this.row3.camt-this.row4.camt,
        samt:this.row3.samt-this.row4.samt,
        total:this.row3.total-this.row4.total
      }
    }
  }

  console.log({ R1Data, R3Data, R9Data });

  res.status(200).json({ success: true, data: { R1Data, R3Data, R9Data, Report } });
}
