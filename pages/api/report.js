import jwt from "jsonwebtoken";
import config from "../../config";

const { backendURL } = config;

const dev = false;
function processData(json, matcher) {
  let res = {};
  if (!json) {
    return null;
  }
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
  let { token, gstin } = JSON.parse(req.body);
  if (!token) {
    res
      .status(400)
      .json({ success: false, data: null, message: "TOKEN NOT PROVIDED" });
    return;
  }
  let decodedJWT = jwt.verify(token, process.env.JWT_KEY);

  let data;

  const warnings = [];

  function addWarning(errorTable) {
    warnings.push(errorTable);
    return {};
  }

  try {
    let urls = [
      `${backendURL}/api/v1/r1?GSTIN=${gstin}`,
      `${backendURL}/api/v1/r3b?GSTIN=${gstin}`,
      `${backendURL}/api/v1/r9?GSTIN=${gstin}`,
      `${backendURL}/api/v1/r9c?GSTIN=${gstin}`,
      `${backendURL}/api/v1/gstin-details?GSTIN=${gstin}`,
    ];

    let reqs = urls.map((url) => fetch(url));
    let responses = await Promise.all(reqs);
    let json = responses.map((response) => response.json());
    var allData = await Promise.all(json);
  } catch (e) {
    console.log("ERORR in FETCH", e.message);
    res.status(500).json({ success: false, data: null, error: e.message });
  }

  // R1 Data
  let data1 = allData[0];
  let R1Data =
    data1.data ||
    addWarning({
      table: "R1",
      message: "No entires found for the given gstin",
    });

  // R3 Data
  data = allData[1];
  let R3Data =
    processData(
      data.data,
      (key) =>
        key === "itc_elg" ||
        key === "intr_ltfee" ||
        key === "qn" ||
        key === "sup_details" ||
        key === "inward_sup"
    ) ||
    addWarning({
      table: "R3",
      message: "No entires found for the given gstin",
    });

  // R9 Data
  data = allData[2];
  let R9Data =
    processData(
      data.data,
      (key) => key.startsWith("table") || key === "tax_pay"
    ) ||
    addWarning({
      table: "R9",
      message: "No entires found for the given gstin",
    });

  // R9C Data
  data = allData[3];
  let R9CData =
    data.data ||
    addWarning({
      table: "R9C",
      message: "No entires found for the given gstin",
    });

  // GSTIN Details
  data = allData[4];
  let gstin_det =
    data.data ||
    addWarning({
      table: "GSTIN_Details",
      message: "No entires found for the given gstin",
    });
  gstin_det.GSTINDetails = JSON.parse(gstin_det.GSTINDetails);
  let { bzdtls } = gstin_det.GSTINDetails;
  let GSTINDetails = {
    legal_name: bzdtls.bzdtlsbz.lgnmbzpan,
    trade_name: bzdtls.bzdtlsbz.trdnm,
  };

  // Check user privileges

  if (gstin_det.div_scode.toLowerCase() !== decodedJWT.S.toLowerCase()) {
    res.status(403).json({
      success: false,
      data: null,
      error: "Unauthorized Access",
    });
    return;
  }

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
      this.iamt = (data1?.iamt || 0) - (data2?.iamt || 0);
      this.camt = (data1?.camt || 0) - (data2?.camt || 0);
      this.samt = (data1?.samt || 0) - (data2?.samt || 0);
      this.csamt = (data1?.csamt || 0) - (data2?.csamt || 0);
      this.total = this.camt + this.iamt + this.samt + this.csamt;
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
      this.iamt = data?.iamt || 0;
      this.camt = data?.camt || 0;
      this.samt = data?.samt || 0;
      this.csamt = data?.csamt || 0;
      this.total = this.camt + this.iamt + this.samt + this.csamt;
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
      const data1 = R9Data.table10?.total_turnover;
      this.txval = Math.abs(data1?.txval || 0);
      this.iamt = Math.abs(data1?.iamt || 0);
      this.camt = Math.abs(data1?.camt || 0);
      this.samt = Math.abs(data1?.samt || 0);
      this.csamt = Math.abs(data1?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      const data1 = R9Data.table5?.rchrg;
      const data2 = R9Data.table5?.exmt;
      const data3 = R9Data.table5?.nil;
      const data4 = R9Data.table5?.non_gst;
      this.txval = Math.abs(
        (data1?.txval || 0) +
          (data2?.txval || 0) +
          (data3?.txval || 0) +
          (data4?.txval || 0)
      );
      this.iamt = Math.abs(
        (data1?.iamt || 0) +
          (data2?.iamt || 0) +
          (data3?.iamt || 0) +
          (data4?.iamt || 0)
      );
      this.camt = Math.abs(
        (data1?.camt || 0) +
          (data2?.camt || 0) +
          (data3?.camt || 0) +
          (data4?.camt || 0)
      );
      this.samt = Math.abs(
        (data1?.samt || 0) +
          (data2?.samt || 0) +
          (data3?.samt || 0) +
          (data4?.samt || 0)
      );
      this.csamt = Math.abs(
        (data1?.csamt || 0) +
          (data2?.csamt || 0) +
          (data3?.csamt || 0) +
          (data4?.csamt || 0)
      );
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.ratio = Math.abs(this.row2.txval / this.row1.txval);
    this.row3 = new (function () {
      const data1 = R9Data.table6?.total_itc_availed;
      const data2 = R9Data.table10?.itc_availd;
      const data3 = R9Data.table10?.itc_rvsl;
      this.txval = null;
      this.iamt = Math.abs(
        (data1?.iamt || 0) + (data2?.iamt || 0) - (data3?.iamt || 0)
      );
      this.camt = Math.abs(
        (data1?.camt || 0) + (data2?.camt || 0) - (data3?.camt || 0)
      );
      this.samt = Math.abs(
        (data1?.samt || 0) + (data2?.samt || 0) - (data3?.samt || 0)
      );
      this.csamt = Math.abs(
        (data1?.csamt || 0) + (data2?.csamt || 0) - (data3?.csamt || 0)
      );
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row4 = {
      txval: Math.abs(this.ratio * this.row3.txval),
      iamt: Math.abs(this.ratio * this.row3.iamt),
      camt: Math.abs(this.ratio * this.row3.camt),
      samt: Math.abs(this.ratio * this.row3.samt),
      csamt: Math.abs(this.ratio * this.row3.csamt),
      get total() {
        return Math.abs(this.iamt + this.camt + this.samt + this.csamt);
      },
    };
    this.row5 = new (function () {
      const data1 = R9Data.table7?.rule42;
      const data2 = R9Data.table7?.rule43;
      this.txval = Math.abs((data1?.txval || 0) + (data2?.txval || 0));
      this.iamt = Math.abs((data1?.iamt || 0) + (data2?.iamt || 0));
      this.camt = Math.abs((data1?.camt || 0) + (data2?.camt || 0));
      this.samt = Math.abs((data1?.samt || 0) + (data2?.samt || 0));
      this.csamt = Math.abs((data1?.csamt || 0) + (data2?.csamt || 0));
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row6 = {
      txval: (this.row4.txval || 0) - (this.row5.txval || 0),
      iamt: (this.row4.iamt || 0) - (this.row5.iamt || 0),
      camt: (this.row4.camt || 0) - (this.row5.camt || 0),
      samt: (this.row4.samt || 0) - (this.row5.samt || 0),
      csamt: (this.row4.csamt || 0) - (this.row5.csamt || 0),
      total: (this.row4.total || 0) - (this.row5.total || 0),
    };
  })();

  const table5 = new (function () {
    this.row1 = new (function () {
      this.iamt = Math.abs(
        table1.row3.iamt + table2.row5.iamt + table3.row6.iamt
      );
      this.camt = Math.abs(
        table1.row3.camt + table2.row5.camt + table3.row6.camt
      );
      this.samt = Math.abs(
        table1.row3.samt + table2.row5.samt + table3.row6.samt
      );
      this.csamt = Math.abs(
        table1.row3.csamt + table2.row5.csamt + table3.row6.csamt
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
    this.flag = dev || this.row1.total < this.row2.total;
  })();
  const table7 = new (function () {
    this.row1 = new (function () {
      const data1 = R1Data.table4A;
      const data2 = R1Data.table4B;
      const data3 = R1Data.table6B;
      const data4 = R1Data.table6C;
      this.txval = Math.abs(
        (data1?.txval || 0) +
          (data2?.txval || 0) +
          (data3?.txval || 0) +
          (data4?.txval || 0)
      );
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
      const data1 = R1Data.table7;
      const data2 = R1Data.table5A_5B;
      this.txval = Math.abs((data1?.txval || 0) + (data2?.txval || 0));
      this.iamt = Math.abs((data1?.iamt || 0) + (data2?.iamt || 0));
      this.camt = Math.abs((data1?.camt || 0) + (data2?.camt || 0));
      this.samt = Math.abs((data1?.samt || 0) + (data2?.samt || 0));
      this.csamt = Math.abs((data1?.csamt || 0) + (data2?.csamt || 0));
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row3 = new (function () {
      const data = R1Data.table11A_1;
      this.txval = Math.abs(data?.ad_amt || 0);
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row4 = {
      txval: Math.abs(this.row1.txval + this.row2.txval + this.row3.txval),
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
      this.txval = Math.abs((data1?.txval || 0) + (data2?.txval || 0));
      this.iamt = Math.abs((data1?.iamt || 0) + (data2?.iamt || 0));
      this.camt = Math.abs((data1?.camt || 0) + (data2?.camt || 0));
      this.samt = Math.abs((data1?.samt || 0) + (data2?.samt || 0));
      this.csamt = Math.abs((data1?.csamt || 0) + (data2?.csamt || 0));
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row6 = new (function () {
      const data = R1Data.table11B_2;
      this.txval = Math.abs(data?.ad_amt || 0);
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row7 = {
      txval: Math.abs(this.row4.txval - this.row5.txval - this.row6.txval),
      iamt: Math.abs(this.row4.iamt - this.row5.iamt - this.row6.iamt),
      camt: Math.abs(this.row4.camt - this.row5.camt - this.row6.camt),
      samt: Math.abs(this.row4.samt - this.row5.samt - this.row6.samt),
      csamt: Math.abs(
        Math.abs(this.row4.csamt - this.row5.csamt - this.row6.csamt)
      ),
      total: Math.abs(this.row4.total - this.row5.total - this.row6.total),
    };
    this.row8 = new (function () {
      const data = R3Data.total_sup_details?.osup_det;
      this.txval = Math.abs(data?.txval || 0);
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(data?.txval || 0);
    })();
    this.row9 = {
      txval: this.row7.txval - this.row8.txval,
      iamt: this.row7.iamt - this.row8.iamt,
      camt: this.row7.camt - this.row8.camt,
      samt: this.row7.samt - this.row8.samt,
      csamt: this.row7.csamt - this.row8.csamt,
      total: this.row7.total - this.row8.total,
    };
    this.flag = dev || this.row7.total > this.row8.total;
  })();
  const table8 = new (function () {
    this.row1 = new (function () {
      const data1 = R1Data.table4A;
      const data2 = R1Data.table4B;
      const data3 = R1Data.table6B;
      const data4 = R1Data.table6C;
      this.iamt = Math.abs(
        (data1?.iamt || 0) +
          (data2?.iamt || 0) +
          (data3?.iamt || 0) +
          (data4?.iamt || 0)
      );
      this.camt = Math.abs(
        (data1?.camt || 0) +
          (data2?.camt || 0) +
          (data3?.camt || 0) +
          (data4?.camt || 0)
      );
      this.samt = Math.abs(
        (data1?.samt || 0) +
          (data2?.samt || 0) +
          (data3?.samt || 0) +
          (data4?.samt || 0)
      );
      this.csamt = Math.abs(
        (data1?.csamt || 0) +
          (data2?.csamt || 0) +
          (data3?.csamt || 0) +
          (data4?.csamt || 0)
      );
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      const data1 = R1Data.table7;
      const data2 = R1Data.table5A_5B;
      this.iamt = Math.abs((data1?.iamt || 0) + (data2?.iamt || 0));
      this.camt = Math.abs((data1?.camt || 0) + (data2?.camt || 0));
      this.samt = Math.abs((data1?.samt || 0) + (data2?.samt || 0));
      this.csamt = Math.abs((data1?.csamt || 0) + (data2?.csamt || 0));
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
      const data = R3Data.total_sup_details?.osup_det;
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
    this.flag = dev || this.row7.total > this.row8.total;
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
      this.total = Math.abs(data?.itc_book_curr || 0);
    })();
    this.row3 = {
      total: Math.abs(this.row1.total - this.row2.total),
    };
    this.flag = dev || this.row1.total != this.row2.total;
  })();
  const table10 = new (function () {
    this.row1 = new (function () {
      const data1 = R1Data.table9B_1;
      const data2 = R1Data.table9B_2;
      this.iamt = Math.abs((data1?.iamt || 0) + (data2?.iamt || 0));
      this.camt = Math.abs((data1?.camt || 0) + (data2?.camt || 0));
      this.samt = Math.abs((data1?.samt || 0) + (data2?.samt || 0));
      this.csamt = Math.abs((data1?.csamt || 0) + (data2?.csamt || 0));
      this.total = Math.abs((data1?.txval || 0) + (data2?.txval || 0));
    })();
    this.row2 = new (function () {
      const data = R9Data.table4?.sub_totalIL;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(data?.txval || 0);
    })();
    this.row3 = {
      iamt: this.row1.iamt - this.row2.iamt,
      camt: this.row1.camt - this.row2.camt,
      samt: this.row1.samt - this.row2.samt,
      csamt: this.row1.csamt - this.row2.csamt,
      total: this.row1.total - this.row2.total,
    };
    this.flag = dev || this.row1.total !== this.row2.total;
  })();
  const table11 = new (function () {
    this.row1 = new (function () {
      const data = R9Data.table5?.total_tover;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(data?.txval || 0);
    })();
    this.row2 = new (function () {
      const data = R9CData.row5p;
      this.total = Math.abs(data?.annul_turn_adj || 0);
    })();
    this.row3 = {
      total: this.row1.total - this.row2.total,
    };
    this.flag = dev || this.row1.total !== this.row2.total;
  })();
  const table12 = new (function () {
    this.row1 = new (function () {
      const data = R9Data.table9;
      this.iamt = Math.abs(data?.iamt?.txpyble || 0);
      this.camt = Math.abs(data?.camt?.txpyble || 0);
      this.samt = Math.abs(data?.samt?.txpyble || 0);
      this.csamt = Math.abs(data?.csamt?.txpyble || 0);
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
    this.flag = dev || this.row1.total !== this.row2.total;
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
      const data = R9Data.table6?.tran1;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
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
      this.total = Math.abs(data?.unrec_itc || 0);
    })();
  })();
  const table16 = new (function () {
    this.row1 = new (function () {
      const data = R9CData.row5r;
      this.total = Math.abs(data?.unrec_turnovr || 0);
    })();
    this.row2 = new (function () {
      const data = R9CData.row7g;
      this.total = Math.abs(data?.unrec_tax_turn || 0);
    })();
    this.row3 = new (function () {
      const data = R9CData.row12f;
      this.total = Math.abs(data?.unrec_itc || 0);
    })();
  })();
  const table17 = new (function () {
    this.row1 = new (function () {
      const data = R9CData.row9r;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
    })();
  })();
  const table18 = new (function () {
    this.description = "Refund Claimed";
    this.row1 = new (function () {
      const data = R9Data?.table15?.rfd_clmd;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
    this.row2 = new (function () {
      const data = R9Data?.table15?.rfd_sanc;
      this.iamt = Math.abs(data?.iamt || 0);
      this.camt = Math.abs(data?.camt || 0);
      this.samt = Math.abs(data?.samt || 0);
      this.csamt = Math.abs(data?.csamt || 0);
      this.total = Math.abs(this.camt + this.iamt + this.samt + this.csamt);
    })();
  })();

  let Report = {
    GSTINDetails,
    table1,
    table2,
    table3,
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
    table16,
    table17,
    table18,
  };

  res.status(200).json({
    success: true,
    data: { R1Data, R3Data, R9Data, R9CData, Report, warnings },
  });
}
