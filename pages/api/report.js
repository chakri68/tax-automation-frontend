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
  console.log({ req: req.body });

  let { gstin } = req.query;
  let {
    row1_samt,
    row2_samt,
    row3_samt,
    row1_camt,
    row2_camt,
    row3_camt,
    row1_iamt,
    row2_iamt,
    row3_iamt,
  } = JSON.parse(req.body);
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
      key === "sup_details" ||
      key === "inward_sup"
  );

  // R9 Data
  response = await fetch(`${backendURL}/api/v1/r9?GSTIN=${gstin}`);
  data = await response.json();
  let R9Data = processData(
    data.data,
    (key) => key.startsWith("table") || key === "tax_pay"
  );
  const table1 = new (function () {
    this.row1 = new (function () {
      const data = R1Data.table12;
      this.iamt = data?.iamt || 0;
      this.camt = data?.camt || 0;
      this.samt = data?.samt || 0;
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row2 = new (function () {
      const data = R9Data.table5?.total_tover;
      this.iamt = data?.iamt || 0;
      this.camt = data?.camt || 0;
      this.samt = data?.samt || 0;
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row3 = {
      iamt: this.row1.iamt - this.row2.iamt,
      camt: this.row1.camt - this.row2.camt,
      samt: this.row1.samt - this.row2.samt,
      total: this.row1.total - this.row2.total,
    };
  })();
  const table2 = new (function () {
    this.row1 = new (function () {
      const data = R9Data.table6?.itc_3b;
      this.iamt = data?.iamt || 0;
      this.camt = data?.camt || 0;
      this.samt = data?.samt || 0;
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row2 = new (function () {
      const data1 = R9Data.table10?.rtc_availd;
      const data2 = R9Data.table10?.itc_rvsl;
      this.iamt = data1?.iamt || 0 - data2?.iamt || 0;
      this.camt = data1?.camt || 0 - data2?.camt || 0;
      this.samt = data1?.samt || 0 - data2?.samt || 0;
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row3 = {
      iamt: this.row1.iamt - this.row2.iamt,
      camt: this.row1.camt - this.row2.camt,
      samt: this.row1.samt - this.row2.samt,
      total: this.row1.total - this.row2.total,
    };
    this.row4 = new (function () {
      const data = R9Data.table6?.total_itc_availed;
      this.iamt = data?.iamt || 0;
      this.camt = data?.camt || 0;
      this.samt = data?.samt || 0;
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row5 = {
      iamt: this.row3.iamt - this.row4.iamt,
      camt: this.row3.camt - this.row4.camt,
      samt: this.row3.samt - this.row4.samt,
      total: this.row3.total - this.row4.total,
    };
  })();
  const table3 = new (function () {
    this.row1 = new (function () {
      const data1 = R9Data.table5?.total_tover;
      const data2 = R9Data.table10?.dbn_amd;
      const data3 = R9Data.table10?.cdn_amd;
      this.iamt = data1?.iamt || 0 + data2?.iamt || 0 - data3?.iamt || 0;
      this.camt = data1?.camt || 0 - data2?.camt || 0 - data3?.camt || 0;
      this.samt = data1?.samt || 0 - data2?.samt || 0 - data3?.samt || 0;
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row2 = new (function () {
      const data1 = R9Data.table5?.rchrg;
      const data2 = R9Data.table5?.exmpt;
      const data3 = R9Data.table5?.nil;
      const data4 = R9Data.table5?.non_gst;
      this.iamt =
        data1?.iamt ||
        0 + data2?.iamt ||
        0 + data3?.iamt ||
        0 + data4?.iamt ||
        0;
      this.camt =
        data1?.camt ||
        0 - data2?.camt ||
        0 + data3?.camt ||
        0 + data4?.camt ||
        0;
      this.samt =
        data1?.samt ||
        0 - data2?.samt ||
        0 + data3?.samt ||
        0 + data4?.samt ||
        0;
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row3 = {
      iamt: this.row2.iamt / this.row1.iamt,
      camt: this.row2.camt / this.row1.camt,
      samt: this.row2.samt / this.row1.samt,
      total: this.row2.total / this.row1.total,
    };
    this.row4 = new (function () {
      this.iamt = table2.row2.iamt + table2.row4.iamt;
      this.camt = table2.row2.camt + table2.row4.camt;
      this.samt = table2.row2.samt + table2.row4.samt;
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row5 = {
      iamt: (this.row4.iamt * this.row2.iamt) / this.row1.iamt,
      camt: (this.row4.camt * this.row2.camt) / this.row1.camt,
      samt: (this.row4.samt * this.row2.samt) / this.row1.samt,
      total: (this.row4.total * this.row2.total) / this.row1.total,
    };
    this.row6 = new (function () {
      const data1 = R9Data.table7?.rule42;
      const data2 = R9Data.table7?.rule43;
      const data3 = R9Data.table7?.revsl_tran1;
      const data4 = R9Data.table7?.revsl_tran2;
      this.iamt =
        data1?.iamt ||
        0 + data2?.iamt ||
        0 + data3?.iamt ||
        0 + data4?.iamt ||
        0;
      this.camt =
        data1?.camt ||
        0 - data2?.camt ||
        0 + data3?.camt ||
        0 + data4?.camt ||
        0;
      this.samt =
        data1?.samt ||
        0 - data2?.samt ||
        0 + data3?.samt ||
        0 + data4?.samt ||
        0;
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row7 = {
      iamt: this.row5.iamt - this.row6.iamt,
      camt: this.row5.camt - this.row6.camt,
      samt: this.row5.samt - this.row6.samt,
      total: this.row5.total - this.row6.total,
    };
  })();
  const table4 = new (function () {
    this.row1 = new (function () {
      this.iamt = parseInt(row1_iamt);
      this.camt = parseInt(row1_camt);
      this.samt = parseInt(row1_samt);
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row2 = new (function () {
      this.iamt = parseInt(row2_iamt);
      this.camt = parseInt(row2_camt);
      this.samt = parseInt(row2_samt);
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row3 = new (function () {
      this.iamt = parseInt(row3_iamt);
      this.camt = parseInt(row3_camt);
      this.samt = parseInt(row3_samt);
      this.total = this.camt + this.iamt + this.samt;
    })();
    this.row4 = {
      iamt: this.row1.iamt + this.row2.iamt + this.row3.iamt,
      camt: this.row1.camt + this.row2.camt + this.row3.camt,
      samt: this.row1.samt + this.row2.samt + this.row3.samt,
      total: this.row1.total + this.row2.total + this.row3.total,
    };
  })();
  const table5 = new (function () {
    this.row1 = new (function () {
      this.iamt =
        table1.row3.iamt +
        table2.row5.iamt +
        table3.row7.iamt +
        table4.row4.iamt;
      this.camt =
        table1.row3.camt +
        table2.row5.camt +
        table3.row7.camt +
        table4.row4.camt;
      this.samt =
        table1.row3.samt +
        table2.row5.samt +
        table3.row7.samt +
        table4.row4.samt;
      this.total = this.camt + this.iamt + this.samt;
    })();
  })();
  let Report = {
    table1,
    table2,
    table3,
    table4,
    table5,
  };

  // console.log({ R1Data, R3Data, R9Data });

  res
    .status(200)
    .json({ success: true, data: { R1Data, R3Data, R9Data, Report } });
}
