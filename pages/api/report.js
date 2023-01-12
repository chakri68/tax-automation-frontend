import config from "../../config";

const { backendURL } = config;

const dev = true;
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
    row1_csamt,
    row2_csamt,
    row3_csamt,
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

  // R9C Data
  response = await fetch(`${backendURL}/api/v1/r9c?GSTIN=${gstin}`);
  data = await response.json();
  let R9CData = data.data;

  // GSTIN Details
  response = await fetch(`${backendURL}/api/v1/gstin-details?GSTIN=${gstin}`);
  data = await response.json();
  let gstin_det = data.data;
  gstin_det.GSTINDetails = JSON.parse(gstin_det.GSTINDetails);
  let { bzdtls } = gstin_det.GSTINDetails;
  let GSTINDetails = {
    legal_name: bzdtls.bzdtlsbz.lgnmbzpan,
    trade_name: bzdtls.bzdtlsbz.trdnm,
  };

  const table1 = new (function () {
    this.row1 = new (function () {
      const data = R1Data.table12;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      const data = R9Data.table5?.total_tover;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row3 = {
      iamt: Math.abs(this.row1.iamt - this.row2.iamt),
      camt: Math.abs(this.row1.camt - this.row2.camt),
      samt: Math.abs(this.row1.samt - this.row2.samt),
      csamt: Math.abs(this.row1.csamt - this.row2.csamt),
      total: Math.abs(this.row1.total - this.row2.total),
    };
  })();
  const table2 = new (function () {
    this.row1 = new (function () {
      const data = R9Data.table6?.itc_3b;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      const data1 = R9Data.table10?.rtc_availd;
      const data2 = R9Data.table10?.itc_rvsl;
      this.iamt = Math.abs((data1?.iamt || 0) - (data2?.iamt || 0));
      this.camt = Math.abs((data1?.camt || 0) - (data2?.camt || 0));
      this.samt = Math.abs((data1?.samt || 0) - (data2?.samt || 0));
      this.csamt = Math.abs((data1?.csamt || 0) - (data2?.csamt || 0));
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row3 = {
      iamt: Math.abs(this.row1.iamt - this.row2.iamt),
      camt: Math.abs(this.row1.camt - this.row2.camt),
      samt: Math.abs(this.row1.samt - this.row2.samt),
      csamt: Math.abs(this.row1.csamt - this.row2.csamt),
      total: Math.abs(this.row1.total - this.row2.total),
    };
    this.row4 = new (function () {
      const data = R9Data.table6?.total_itc_availed;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row5 = {
      iamt: Math.abs(this.row3.iamt - this.row4.iamt),
      camt: Math.abs(this.row3.camt - this.row4.camt),
      samt: Math.abs(this.row3.samt - this.row4.samt),
      csamt: Math.abs(this.row3.csamt - this.row4.csamt),
      total: Math.abs(this.row3.total - this.row4.total),
    };
  })();
  const table3 = new (function () {
    this.row1 = new (function () {
      const data1 = R9Data.table5?.total_tover;
      const data2 = R9Data.table10?.dbn_amd;
      const data3 = R9Data.table10?.cdn_amd;
      this.iamt = Math.abs(
        (data1?.iamt || 0) + (data2?.iamt || 0) - (data3?.iamt || 0)
      );
      this.camt = Math.abs(
        (data1?.camt || 0) - (data2?.camt || 0) - (data3?.camt || 0)
      );
      this.samt = Math.abs(
        (data1?.samt || 0) - (data2?.samt || 0) - (data3?.samt || 0)
      );
      this.csamt = Math.abs(
        (data1?.csamt || 0) - (data2?.csamt || 0) - (data3?.csamt || 0)
      );
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      const data1 = R9Data.table5?.rchrg;
      const data2 = R9Data.table5?.exmpt;
      const data3 = R9Data.table5?.nil;
      const data4 = R9Data.table5?.non_gst;
      this.iamt = Math.abs(
        (data1?.iamt || 0) +
          (data2?.iamt || 0) +
          (data3?.iamt || 0) +
          (data4?.iamt || 0)
      );
      this.camt = Math.abs(
        (data1?.camt || 0) -
          (data2?.camt || 0) +
          (data3?.camt || 0) +
          (data4?.camt || 0)
      );
      this.samt = Math.abs(
        (data1?.samt || 0) -
          (data2?.samt || 0) +
          (data3?.samt || 0) +
          (data4?.samt || 0)
      );
      this.csamt = Math.abs(
        (data1?.csamt || 0) -
          (data2?.csamt || 0) +
          (data3?.csamt || 0) +
          (data4?.csamt || 0)
      );
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row3 = {
      iamt: Math.abs(this.row2.iamt / this.row1.iamt),
      camt: Math.abs(this.row2.camt / this.row1.camt),
      samt: Math.abs(this.row2.samt / this.row1.samt),
      csamt: Math.abs(this.row2.csamt / this.row1.csamt),
      total: Math.abs(this.row2.total / this.row1.total),
    };
    this.row4 = new (function () {
      this.iamt = Math.abs(table2.row2.iamt + table2.row4.iamt);
      this.camt = Math.abs(table2.row2.camt + table2.row4.camt);
      this.samt = Math.abs(table2.row2.samt + table2.row4.samt);
      this.csamt = Math.abs(table2.row2.csamt + table2.row4.csamt);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row5 = {
      iamt: Math.abs((this.row4.iamt * this.row2.iamt) / this.row1.iamt),
      camt: Math.abs((this.row4.camt * this.row2.camt) / this.row1.camt),
      samt: Math.abs((this.row4.samt * this.row2.samt) / this.row1.samt),
      csamt: Math.abs(
        Math.abs((this.row4.csamt * this.row2.csamt) / this.row1.csamt)
      ),
      total: Math.abs((this.row4.total * this.row2.total) / this.row1.total),
    };
    this.row6 = new (function () {
      const data1 = R9Data.table7?.rule42;
      const data2 = R9Data.table7?.rule43;
      const data3 = R9Data.table7?.revsl_tran1;
      const data4 = R9Data.table7?.revsl_tran2;
      this.iamt = Math.abs(
        (data1?.iamt || 0) +
          (data2?.iamt || 0) +
          (data3?.iamt || 0) +
          (data4?.iamt || 0)
      );
      this.camt = Math.abs(
        (data1?.camt || 0) -
          (data2?.camt || 0) +
          (data3?.camt || 0) +
          (data4?.camt || 0)
      );
      this.samt = Math.abs(
        (data1?.samt || 0) -
          (data2?.samt || 0) +
          (data3?.samt || 0) +
          (data4?.samt || 0)
      );
      this.csamt = Math.abs(
        (data1?.csamt || 0) -
          (data2?.csamt || 0) +
          (data3?.csamt || 0) +
          (data4?.csamt || 0)
      );
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row7 = {
      iamt: Math.abs(this.row5.iamt - this.row6.iamt),
      camt: Math.abs(this.row5.camt - this.row6.camt),
      samt: Math.abs(this.row5.samt - this.row6.samt),
      csamt: Math.abs(this.row5.csamt - this.row6.csamt),
      total: Math.abs(this.row5.total - this.row6.total),
    };
  })();
  const table4 = new (function () {
    this.row1 = new (function () {
      this.iamt = Math.abs(parseInt(row1_iamt));
      this.camt = Math.abs(parseInt(row1_camt));
      this.samt = Math.abs(parseInt(row1_samt));
      this.csamt = Math.abs(parseInt(row1_csamt));
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      this.iamt = Math.abs(parseInt(row2_iamt));
      this.camt = Math.abs(parseInt(row2_camt));
      this.samt = Math.abs(parseInt(row2_samt));
      this.csamt = Math.abs(parseInt(row2_csamt));
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row3 = new (function () {
      this.iamt = Math.abs(parseInt(row3_iamt));
      this.camt = Math.abs(parseInt(row3_camt));
      this.samt = Math.abs(parseInt(row3_samt));
      this.csamt = Math.abs(parseInt(row3_csamt));
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row4 = {
      iamt: Math.abs(this.row1.iamt + this.row2.iamt + this.row3.iamt),
      camt: Math.abs(this.row1.camt + this.row2.camt + this.row3.camt),
      samt: Math.abs(this.row1.samt + this.row2.samt + this.row3.samt),
      csamt: Math.abs(
        Math.abs(this.row1.csamt + this.row2.csamt + this.row3.csamt)
      ),
      total: Math.abs(this.row1.total + this.row2.total + this.row3.total),
    };
  })();
  const table5 = new (function () {
    this.row1 = new (function () {
      this.iamt = Math.abs(
        table1.row3.iamt +
          table2.row5.iamt +
          table3.row7.iamt +
          table4.row4.iamt
      );
      this.camt = Math.abs(
        table1.row3.camt +
          table2.row5.camt +
          table3.row7.camt +
          table4.row4.camt
      );
      this.samt = Math.abs(
        table1.row3.samt +
          table2.row5.samt +
          table3.row7.samt +
          table4.row4.samt
      );
      this.csamt = Math.abs(
        table1.row3.csamt +
          table2.row5.csamt +
          table3.row7.csamt +
          table4.row4.csamt
      );
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
  })();
  const table6 = new (function () {
    this.row1 = new (function () {
      const data = R9Data.table8?.itc_2a;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      const data = R9Data.table6?.itc_3b;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row3 = {
      iamt: this.row2.iamt - this.row1.iamt,
      camt: this.row2.camt - this.row1.camt,
      samt: this.row2.samt - this.row1.samt,
      csamt: this.row2.csamt - this.row1.csamt,
      total: this.row2.total - this.row1.total,
    };
    this.flag = dev || this.row1.total.toFixed(2) < this.row2.total.toFixed(2);
  })();
  const table7 = new (function () {
    this.row1 = new (function () {
      const data1 = R1Data.table4a;
      const data2 = R1Data.table4b;
      const data3 = R1Data.table6b;
      const data4 = R1Data.table6c;
      this.iamt = Math.abs(
        (data1?.iamt || 0) +
          (data2?.iamt || 0) +
          (data3?.iamt || 0) +
          (data4?.iamt || 0)
      );
      this.camt = Math.abs(
        (data1?.camt || 0) -
          (data2?.camt || 0) +
          (data3?.camt || 0) +
          (data4?.camt || 0)
      );
      this.samt = Math.abs(
        (data1?.samt || 0) -
          (data2?.samt || 0) +
          (data3?.samt || 0) +
          (data4?.samt || 0)
      );
      this.csamt = Math.abs(
        (data1?.csamt || 0) -
          (data2?.csamt || 0) +
          (data3?.csamt || 0) +
          (data4?.csamt || 0)
      );
      this.total = Math.abs(data1?.txval || 0);
    })();
    this.row2 = new (function () {
      const data = R1Data.table7;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row3 = new (function () {
      const data = R1Data.table11A_1;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row4 = {
      iamt: Math.abs(this.row1.iamt + this.row2.iamt + this.row3.iamt),
      camt: Math.abs(this.row1.camt + this.row2.camt + this.row3.camt),
      samt: Math.abs(this.row1.samt + this.row2.samt + this.row3.samt),
      csamt: Math.abs(
        Math.abs(this.row1.csamt + this.row2.csamt + this.row3.csamt)
      ),
      total: Math.abs(this.row1.total + this.row2.total + this.row3.total),
    };
    this.row5 = new (function () {
      const data1 = R1Data.table9B_1;
      const data2 = R1Data.table9B_2;
      this.iamt = Math.abs((data1?.iamt || 0) + (data2?.iamt || 0));
      this.camt = Math.abs((data1?.camt || 0) + (data2?.camt || 0));
      this.samt = Math.abs((data1?.samt || 0) + (data2?.samt || 0));
      this.csamt = Math.abs((data1?.csamt || 0) + (data2?.csamt || 0));
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row6 = new (function () {
      const data = R1Data.table11B_2;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row7 = {
      iamt: Math.abs(this.row4.iamt - this.row5.iamt - this.row6.iamt),
      camt: Math.abs(this.row4.camt - this.row5.camt - this.row6.camt),
      samt: Math.abs(this.row4.samt - this.row5.samt - this.row6.samt),
      csamt: Math.abs(
        Math.abs(this.row4.csamt - this.row5.csamt - this.row6.csamt)
      ),
      total: Math.abs(this.row4.total - this.row5.total - this.row6.total),
    };
    this.row8 = new (function () {
      const data = R3Data.sup_details?.osup_det;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(data?.txval || 0);
    })();
    this.row9 = {
      iamt: this.row7.iamt - this.row8.iamt,
      camt: this.row7.camt - this.row8.camt,
      samt: this.row7.samt - this.row8.samt,
      csamt: this.row7.csamt - this.row8.csamt,
      total: this.row7.total - this.row8.total,
    };
    this.flag = dev || this.row7.total.toFixed(2) > this.row8.total.toFixed(2);
  })();
  const table8 = new (function () {
    this.row1 = new (function () {
      const data1 = R1Data.table4a;
      const data2 = R1Data.table4b;
      const data3 = R1Data.table6b;
      const data4 = R1Data.table6c;
      this.iamt = Math.abs(
        (data1?.iamt || 0) +
          (data2?.iamt || 0) +
          (data3?.iamt || 0) +
          (data4?.iamt || 0)
      );
      this.camt = Math.abs(
        (data1?.camt || 0) -
          (data2?.camt || 0) +
          (data3?.camt || 0) +
          (data4?.camt || 0)
      );
      this.samt = Math.abs(
        (data1?.samt || 0) -
          (data2?.samt || 0) +
          (data3?.samt || 0) +
          (data4?.samt || 0)
      );
      this.csamt = Math.abs(
        (data1?.csamt || 0) -
          (data2?.csamt || 0) +
          (data3?.csamt || 0) +
          (data4?.csamt || 0)
      );
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      const data = R1Data.table7;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row3 = new (function () {
      const data = R1Data.table11A_1;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row4 = {
      iamt: Math.abs(this.row1.iamt + this.row2.iamt + this.row3.iamt),
      camt: Math.abs(this.row1.camt + this.row2.camt + this.row3.camt),
      samt: Math.abs(this.row1.samt + this.row2.samt + this.row3.samt),
      csamt: Math.abs(
        Math.abs(this.row1.csamt + this.row2.csamt + this.row3.csamt)
      ),
      total: Math.abs(this.row1.total + this.row2.total + this.row3.total),
    };
    this.row5 = new (function () {
      const data1 = R1Data.table9B_1;
      const data2 = R1Data.table9B_2;
      this.iamt = Math.abs((data1?.iamt || 0) + (data2?.iamt || 0));
      this.camt = Math.abs((data1?.camt || 0) + (data2?.camt || 0));
      this.samt = Math.abs((data1?.samt || 0) + (data2?.samt || 0));
      this.csamt = Math.abs((data1?.csamt || 0) + (data2?.csamt || 0));
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row6 = new (function () {
      const data = R1Data.table11B_2;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row7 = {
      iamt: Math.abs(this.row4.iamt - this.row5.iamt - this.row6.iamt),
      camt: Math.abs(this.row4.camt - this.row5.camt - this.row6.camt),
      samt: Math.abs(this.row4.samt - this.row5.samt - this.row6.samt),
      csamt: Math.abs(
        Math.abs(this.row4.csamt - this.row5.csamt - this.row6.csamt)
      ),
      total: Math.abs(this.row4.total - this.row5.total - this.row6.total),
    };
    this.row8 = new (function () {
      const data = R3Data.sup_details?.osup_det;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row9 = {
      iamt: this.row7.iamt - this.row8.iamt,
      camt: this.row7.camt - this.row8.camt,
      samt: this.row7.samt - this.row8.samt,
      csamt: this.row7.csamt - this.row8.csamt,
      total: this.row7.total - this.row8.total,
    };
    this.flag = dev || this.row7.total.toFixed(2) > this.row8.total.toFixed(2);
  })();
  const table9 = new (function () {
    this.row1 = new (function () {
      const data = R9Data.table8?.itc_inwd_supp;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      const data = R9CData?.row12c;
      // this.iamt = Math.abs((data?.iamt || 0));
      // this.camt = Math.abs((data?.camt || 0));
      // this.samt = Math.abs((data?.samt || 0));
      // this.csamt = Math.abs((data?.csamt || 0));
      this.total = Math.abs(data?.itc_book_curr || 0);
    })();
    this.row3 = {
      // iamt: this.row1.iamt - this.row2.iamt,
      // camt: this.row1.camt - this.row2.camt,
      // samt: this.row1.samt - this.row2.samt,
      // csamt: this.row1.csamt - this.row2.csamt,
      total: this.row1.total - this.row2.total,
    };
    this.flag = dev || this.row1.total.toFixed(2) > this.row2.total.toFixed(2);
  })();
  const table10 = new (function () {
    this.row1 = new (function () {
      const data1 = R1Data.table9B_1;
      const data2 = R1Data.table9B_2;
      this.iamt = Math.abs((data1?.iamt || 0) + (data2?.iamt || 0));
      this.camt = Math.abs((data1?.camt || 0) + (data2?.camt || 0));
      this.samt = Math.abs((data1?.samt || 0) + (data2?.samt || 0));
      this.csamt = Math.abs((data1?.csamt || 0) + (data2?.csamt || 0));
      // this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
      this.total = Math.abs((data1?.txval || 0) + (data2?.txval || 0));
    })();
    this.row2 = new (function () {
      const data = R9Data.table4?.sub_totalIL;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      // this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
      this.total = Math.abs(data?.txval || 0);
    })();
    this.row3 = {
      iamt: this.row1.iamt - this.row2.iamt,
      camt: this.row1.camt - this.row2.camt,
      samt: this.row1.samt - this.row2.samt,
      csamt: this.row1.csamt - this.row2.csamt,
      total: this.row1.total - this.row2.total,
    };
    this.flag =
      dev || this.row1.total.toFixed(2) !== this.row2.total.toFixed(2);
  })();
  const table11 = new (function () {
    this.row1 = new (function () {
      const data = R9Data.table5?.total_tover;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      // this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
      this.total = Math.abs(data?.txval || 0);
    })();
    this.row2 = new (function () {
      const data = R9CData.row5p;
      // this.iamt = Math.abs((data?.iamt || 0));
      // this.camt = Math.abs((data?.camt || 0));
      // this.samt = Math.abs((data?.samt || 0));
      // this.csamt = Math.abs((data?.csamt || 0));
      this.total = Math.abs(data?.annul_turn_adj || 0);
    })();
    this.row3 = {
      // iamt: this.row1.iamt - this.row2.iamt,
      // camt: this.row1.camt - this.row2.camt,
      // samt: this.row1.samt - this.row2.samt,
      // csamt: this.row1.csamt - this.row2.csamt,
      total: this.row1.total - this.row2.total,
    };
    this.flag =
      dev || this.row1.total.toFixed(2) !== this.row2.total.toFixed(2);
  })();
  const table12 = new (function () {
    this.row1 = new (function () {
      const data = null;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      const data = R9CData.row9p;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row3 = {
      iamt: this.row1.iamt - this.row2.iamt,
      camt: this.row1.camt - this.row2.camt,
      samt: this.row1.samt - this.row2.samt,
      csamt: this.row1.csamt - this.row2.csamt,
      total: this.row1.total - this.row2.total,
    };
    this.flag =
      dev || this.row1.total.toFixed(2) !== this.row2.total.toFixed(2);
  })();
  const table13 = new (function () {
    this.row1 = new (function () {
      const data = R9Data.table8?.tot_itc_lapsed;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
  })();
  const table14 = new (function () {
    this.row1 = new (function () {
      const data = R9Data.table6?.tran2;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
  })();
  const table15 = new (function () {
    this.row1 = new (function () {
      const data = R9CData.row12f;
      // this.iamt = Math.abs((data?.iamt || 0));
      // this.camt = Math.abs((data?.camt || 0));
      // this.samt = Math.abs((data?.samt || 0));
      // this.csamt = Math.abs((data?.csamt || 0));
      this.total = Math.abs(data?.unrec_itc || 0);
    })();
  })();

  let Report = {
    GSTINDetails,
    table1,
    table2,
    table3,
    table4,
    table5,
    table6,
    table7,
    table8,
    table9,
    table10,
    table11,
    table12,
    table13,
    table14,
    table15,
  };

  // console.log({ R1Data, R3Data, R9Data });

  res
    .status(200)
    .json({ success: true, data: { R1Data, R3Data, R9Data, R9CData, Report } });
}
