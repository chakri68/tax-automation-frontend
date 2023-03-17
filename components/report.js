import { styled } from "@stitches/react";
import htmlToPdfmake from "html-to-pdfmake";
import mammoth from "mammoth";
import PDFMerger from "pdf-merger-js/browser";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import React, { useEffect, useRef, useState } from "react";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  Noto_Sans: {
    normal: "http://0.0.0.0:80/fonts/Noto_Sans/NotoSans-Regular.ttf",
    bold: "http://0.0.0.0:80/fonts/Noto_Sans/NotoSans-Bold.ttf",
    italics: "http://0.0.0.0:80/fonts/Noto_Sans/NotoSans-Italic.ttf",
    bolditalics: "http://0.0.0.0:80/fonts/Noto_Sans/NotoSans-BoldItalic.ttf",
  },
};

const html2pdfmakeStyles = {
  tableAutoSize: true,
  removeExtraBlanks: true,
  defaultStyles: {
    b: { bold: true },
    strong: { bold: true },
    u: { decoration: "underline" },
    s: { decoration: "lineThrough" },
    em: { italics: true },
    i: { italics: true },
    h1: { fontSize: 24, bold: true, marginBottom: 5 },
    h2: { fontSize: 22, bold: true, marginBottom: 5 },
    h3: { fontSize: 20, bold: true, marginBottom: 5 },
    h4: { fontSize: 18, bold: true, marginBottom: 5 },
    h5: { fontSize: 16, bold: true, marginBottom: 5 },
    h6: { fontSize: 14, bold: true, marginBottom: 5 },
    a: { color: "blue", decoration: "underline" },
    strike: { decoration: "lineThrough" },
    p: { margin: [0, 2, 0, 2] },
    ul: { marginBottom: 5 },
    li: { marginLeft: 5, marginBottom: 5 },
    table: { marginBottom: 5 },
    th: { bold: true, fillColor: "#EEEEEE" },
    div: {
      margin: [0, 2, 0, 2],
    },
  },
};

const pdfMakeStyles = {
  "t-d": {
    width: 10,
  },
  "t-v": {
    width: 60,
  },
  "c-1": {
    width: 25,
    alignment: "center",
  },
  "c-2": {
    width: "auto",
  },
  "c-row": {
    fillColor: "#EEEEEE",
  },
  "n-a": {
    fillColor: "#5A5A5A",
  },
  bold: {
    bold: true,
  },
  underline: {
    decoration: "underline",
  },
  "fs-small": {
    fontSize: 9,
  },
  "fs-l": {
    fontSize: 16,
  },
  "fs-mid": {
    fontSize: 12,
  },
  "fs-midl": {
    fontSize: 14,
  },
};

const StyledIframe = styled("iframe", {
  border: "none",
  width: "100%",
  height: "100%",
});

function checkRound(num) {
  if (num == null || num == undefined) return num;
  return parseFloat(parseFloat(num).toFixed(2)).toLocaleString("en-IN");
}

const Report = React.memo(function Report({
  tableData,
  setPdfUrl,
  gstin,
  remarkFiles,
}) {
  let [iFrameSrc, setIFrameSrc] = useState("");

  function getTableNum() {
    let toRet = tableCount.current + 1;
    tableCount.current = (tableCount.current + 1) % 15;
    return toRet;
  }

  const tableCount = useRef(0);

  let {
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
    table16,
    table17,
    table18,
  } = tableData;

  let tableNumData = useRef(null);

  function getTableNum(num, override = false) {
    if (num == 6) tableNumData.current = null;
    if (tableNumData.current == null) tableNumData.current = 0;
    tableNumData.current = tableNumData.current + 1;
    return tableNumData.current;
  }

  var html = htmlToPdfmake(
    `<div class="fs-small">
  <div style="text-align: center" class="fs-midl">
    <p class="bold">ASMT-10</p>
    <p class="bold">[See Rule 99 (1)]</p>
  </div>

  <!-- <table style="width: 100%; text-align: left" border="2" cellpadding="5">
    <tbody>
      <tr style="height: 21px">
        <td style="width: 50%">DIN</td>
        <td style="width: 50%"></td>
      </tr>
      <tr style="height: 21px">
        <td style="width: 50%">Office Designation</td>
        <td style="width: 50%">DEPUTY COMMISSIONER (ST)</td>
      </tr>
      <tr style="height: 21.5px">
        <td style="width: 50%">
          <p>Details of Tax payer<br />Name</p>
          <p>Trade</p>
          <p>GSTIN</p>
        </td>
        <td style="width: 50%">
          <p><br />${GSTINDetails.legal_name}</p>
          <p>${GSTINDetails.trade_name}</p>
          <p>${gstin}</p>
        </td>
      </tr>
      <tr style="height: 21px">
        <td style="width: 50%">Financial Year</td>
        <td style="width: 50%">2017-18</td>
      </tr>
    </tbody>
  </table> -->
  <!-- You have filed an annual return in GSTR-09 for the financial year 2017-18 On
  examination of the information furnished in this return under various heads
  and also the information furnished in TRAN-1, GSTR-01, GSTR-2A, GSTR-3B, EWB
  and other records available in this office, it is found that you have not
  declare your correct tax liability while filing the annual returns of GSTR-09,
  The summary of under declared tax is as shown: <br />
  SGST Rs. ${checkRound(table5?.row1?.samt) ?? "-"} <br />
  CGST Rs. ${checkRound(table5?.row1?.camt) ?? "-"} <br />
  IGST Rs. ${checkRound(table5?.row1?.iamt) ?? "-"} <br />
  Cess Rs. ${checkRound(table5?.row1?.csamt) ?? "-"} <br />
  Total Rs. ${checkRound(table5?.row1?.total) ?? "-"} <br /> -->

  <div>
    <p><span class="bold fs-mid">Reference Number: </span></p>
    <p><span class="bold fs-midl">To, </span></p>
    <p>
      <span class="bold fs-mid">Name: </span
      ><span>${GSTINDetails.legal_name}</span>
    </p>
    <p><span class="bold fs-mid">GSTIN: </span><span>${gstin}</span></p>
    <p><span class="bold fs-mid">Tax Period: </span><span>2017-18</span></p>
  </div>

  <br />

  <div
    class="underline bold fs-l"
    style="text-align: center; margin-bottom: 10px"
  >
    <p>Notice for intimating discrepancies in the return after scrutiny</p>
    <p class="hindi">संवीक्षण उपरान्त विवरणी में पाई गई विसंगतियों की नोटिस</p>
  </div>
  <br />
  <div class="intro" style="margin-bottom: 10px">
    <p class="bold fs-midl">
      एतद्द्वारा सूचित किया जाता है कि उपरोक्त संदर्भित कर अवधि हेतु दाखिल की गई
      विवरणियों जीएसटीआर 3B, 2A, R1, R9,9C में प्रदर्शित सूचनाओं के संवीक्षण के
      दौरान निम्‍न प्रकार की विसंगतियाँ परिलक्षित होती है ।
    </p>
    <p class="fs-small">
      It is, hereby, intimated that during the scrutiny of returns GSTR 3B, 2A,
      R1, R9,9C, filed for the above referred tax period, following
      discrepancies in informations furnished therein have been detected:
    </p>
  </div>

  <ol style="list-style: none">
    ${
      table7?.flag
        ? `
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार दाखिल जी0एस0टी0आर-1 (4A, 4B, 4C, 6B, 6C,
        B2C +7-9B) में घोषित करावर्त एवं मासिक विवरणी 3B (3.1a) में घोषित
        करावर्त में अन्तर स्पष्ट है । साक्ष्य सहित स्पष्टीकरण अपेक्षित है,
        अन्यथा क्यों न करावर्त में अन्तर पर कर की मांग ब्याज / अर्थदण्ड सहित
        सृजित की जाए ?
      </p>
      <p class="fs-small">
        There is an apparent difference between taxable turnover as declared in
        GSTR-1 (4A, 4B, 4C, 6B, 6C, B2C+7-9B) and that declared in monthly
        returns 3B (3.1a). Clarification with evidence is expected, else why a
        demand of tax along with interest and penalty on the differences between
        turnovers should not be generated?
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="2"
        data-pdfmake="{'widths':[25,'*', 80]}"
      >
        <tbody>
          <tr>
            <th>S.No.</th>
            <th>Issue</th>
            <!-- <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cess</th> -->
            <th>Taxable Value</th>
          </tr>
          <!-- <tr style="text-align: center">
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
            <td>E</td>
            <td>F</td>
          </tr> -->
          <tr>
            <td class="c-1">A</td>
            <td>B2B Supply</td>
            <!-- <td>${checkRound(table7?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table7?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table7?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table7?.row1?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table7?.row1?.txval) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">B</td>
            <td>B2C Supply (if any) (GSTR1_7 + GSTR1_5A_5B)</td>
            <!-- <td>${checkRound(table7?.row2?.samt) ?? "-"}</td>
            <td>${checkRound(table7?.row2?.camt) ?? "-"}</td>
            <td>${checkRound(table7?.row2?.iamt) ?? "-"}</td>
            <td>${checkRound(table7?.row2?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table7?.row2?.txval) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">C</td>
            <td>Advances Received (if any) (GSTR1_11A_1)</td>
            <!-- <td>${checkRound(table7?.row3?.samt) ?? "-"}</td>
            <td>${checkRound(table7?.row3?.camt) ?? "-"}</td>
            <td>${checkRound(table7?.row3?.iamt) ?? "-"}</td>
            <td>${checkRound(table7?.row3?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table7?.row3?.txval) ?? "-"}</td>
          </tr>
          <tr class="c-row">
            <td class="c-1">D</td>
            <td>Sub Total (A) + (B) + (C)</td>
            <!-- <td>${checkRound(table7?.row4?.samt) ?? "-"}</td>
            <td>${checkRound(table7?.row4?.camt) ?? "-"}</td>
            <td>${checkRound(table7?.row4?.iamt) ?? "-"}</td>
            <td>${checkRound(table7?.row4?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table7?.row4?.txval) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">E</td>
            <td>Credit/Debit Note (if any) (GSTR1_9B)</td>
            <!-- <td>${checkRound(table7?.row5?.samt) ?? "-"}</td>
            <td>${checkRound(table7?.row5?.camt) ?? "-"}</td>
            <td>${checkRound(table7?.row5?.iamt) ?? "-"}</td>
            <td>${checkRound(table7?.row5?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table7?.row5?.txval) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">F</td>
            <td>Advance adjustment if any (GSTR1_11B_1)</td>
            <!-- <td>${checkRound(table7?.row6?.samt) ?? "-"}</td>
            <td>${checkRound(table7?.row6?.camt) ?? "-"}</td>
            <td>${checkRound(table7?.row6?.iamt) ?? "-"}</td>
            <td>${checkRound(table7?.row6?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table7?.row6?.txval) ?? "-"}</td>
          </tr>
          <tr class="c-row">
            <td class="c-1">G</td>
            <td>Subtotal (D) - [(E) + (F)]</td>
            <!-- <td>${checkRound(table7?.row7?.samt) ?? "-"}</td>
            <td>${checkRound(table7?.row7?.camt) ?? "-"}</td>
            <td>${checkRound(table7?.row7?.iamt) ?? "-"}</td>
            <td>${checkRound(table7?.row7?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table7?.row7?.txval) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">H</td>
            <td>
              Outward taxable supplies (other than zero rated, nil rated and
              exempted) (GSTR3B_(3.1A))
            </td>
            <!-- <td>${checkRound(table7?.row8?.samt) ?? "-"}</td>
            <td>${checkRound(table7?.row8?.camt) ?? "-"}</td>
            <td>${checkRound(table7?.row8?.iamt) ?? "-"}</td>
            <td>${checkRound(table7?.row8?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table7?.row8?.txval) ?? "-"}</td>
          </tr>
          <tr class="c-row">
            <td class="c-1">I</td>
            <td>Difference (G) - (H)</td>
            <!-- <td>${checkRound(table7?.row9?.samt) ?? "-"}</td>
            <td>${checkRound(table7?.row9?.camt) ?? "-"}</td>
            <td>${checkRound(table7?.row9?.iamt) ?? "-"}</td>
            <td>${checkRound(table7?.row9?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table7?.row9?.txval) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    `
        : ``
    } ${
      table11?.flag
        ? `
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार GSTR-9 के कॉलम 5N में घोषित सकल करावर्त
        एवं GSTR-9C के कॉलम 5P/7A में घोषित सकल करावर्त में अंतर है।
        स्‍पष्‍टीकरण साक्ष्‍य सहित अपेक्षित है अन्‍यथा क्‍यों न विधि अनुसार
        अतिरिक्‍त करदेयता निर्धारित की जाए ?
      </p>
      <p class="fs-small">
        As below, there is difference in total taxable turnover as declared in
        col. 5N of GSTR-9 and that declared in col. 5P/7A of GSTR-9c.
        Clarification with evidence is expected, else why extra liability may
        not be determined as per law?
      </p>
      <table
        style="width: 100%"
        border="2"
        data-pdfmake="{'widths':[25,'*',90]}"
      >
        <tbody>
          <!-- <tr>
            <th rowspan="2" class="c-1">S. No.</th>
            <th rowspan="2">Issue</th>
            <th rowspan="2">Taxable Value</th>
            <th style="text-align: center" colspan="4">
              (Amount in all tables)
            </th>
          </tr> -->
          <tr>
            <th class="c-1">S. No.</th>
            <th>Issue</th>
            <th>Amount</th>
          </tr>
          <!-- <tr>
            <th>Central Tax</th>
            <th>State Tax/ UT Tax</th>
            <th>Integrated Tax</th>
            <th>Cess</th>
          </tr> -->
          <!-- <tr>
        <td class="c-1"></td>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
      </tr> -->
          <tr>
            <td class="c-1">A</td>
            <td>Total Turnover (including advances) (GSTR9_5N) (Point 11)</td>
            <td>${checkRound(table11?.row1?.total) ?? "-"}</td>
            <!-- <td>${checkRound(table11?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table11?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table11?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table11?.row1?.csamt) ?? "-"}</td> -->
          </tr>
          <tr>
            <td class="c-1">B</td>
            <td>Annual Turnover (GSTR9C_5P/7A) (Point 12)</td>
            <td>${checkRound(table11?.row2?.total) ?? "-"}</td>
            <!-- <td>${checkRound(table11?.row2?.camt) ?? "-"}</td>
            <td>${checkRound(table11?.row2?.samt) ?? "-"}</td>
            <td>${checkRound(table11?.row2?.iamt) ?? "-"}</td>
            <td>${checkRound(table11?.row2?.csamt) ?? "-"}</td> -->
          </tr>
          <tr class="c-row">
            <td class="c-1">C</td>
            <td>Difference (A) - (B)</td>
            <td>${checkRound(table11?.row3?.total) ?? "-"}</td>
            <!-- <td>${checkRound(table11?.row3?.camt) ?? "-"}</td>
            <td>${checkRound(table11?.row3?.samt) ?? "-"}</td>
            <td>${checkRound(table11?.row3?.iamt) ?? "-"}</td>
<td>${checkRound(table11?.row3?.csamt) ?? "-"}</td> -->
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    `
        : ``
    } ${
      table8?.flag
        ? `
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार GSTR-1 में घोषित करदेयता एवं मासिक
        विवरणियों में घोषित करदेयता में अंतर परिलक्षित है। साक्ष्‍य सहित
        स्‍पष्‍टीकरण अपेक्षित है अन्‍यथा क्‍यों न समायोजित न की गयी करदेयता की
        मांग ब्‍याज/अर्थदंड सहित सृजित की जाए ?
      </p>
      <p class="fs-small">
        As below, there is apparent difference between liability declared in
        GSTR-1 and that declared in monthly returns. Clarification with proof is
        required else why a demand of unreconciled liability along with interest
        and penalty may not be generated?
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="2"
        data-pdfmake="{'widths':[25,'*', 65, 65, 65, 65, 65]}"
      >
        <tbody>
          <tr>
            <th>S.No.</th>
            <th>Issue</th>
            <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cess</th>
            <th>Total</th>
          </tr>
          <!-- <tr style="text-align: center">
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
            <td>E</td>
            <td>F</td>
          </tr> -->
          <tr>
            <td class="c-1">A</td>
            <td>B2B Tax</td>
            <td>${checkRound(table8?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table8?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table8?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table8?.row1?.csamt) ?? "-"}</td>
            <td>${checkRound(table8?.row1?.total) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">B</td>
            <td>B2C Tax (if any)</td>
            <td>${checkRound(table8?.row2?.samt) ?? "-"}</td>
            <td>${checkRound(table8?.row2?.camt) ?? "-"}</td>
            <td>${checkRound(table8?.row2?.iamt) ?? "-"}</td>
            <td>${checkRound(table8?.row2?.csamt) ?? "-"}</td>
            <td>${checkRound(table8?.row2?.total) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">C</td>
            <td>Advances Received (if any)</td>
            <td>${checkRound(table8?.row3?.samt) ?? "-"}</td>
            <td>${checkRound(table8?.row3?.camt) ?? "-"}</td>
            <td>${checkRound(table8?.row3?.iamt) ?? "-"}</td>
            <td>${checkRound(table8?.row3?.csamt) ?? "-"}</td>
            <td>${checkRound(table8?.row3?.total) ?? "-"}</td>
          </tr>
          <tr class="c-row">
            <td class="c-1">D</td>
            <td>Subtotal (A) + (B) + (C)</td>
            <td>${checkRound(table8?.row4?.samt) ?? "-"}</td>
            <td>${checkRound(table8?.row4?.camt) ?? "-"}</td>
            <td>${checkRound(table8?.row4?.iamt) ?? "-"}</td>
            <td>${checkRound(table8?.row4?.csamt) ?? "-"}</td>
            <td>${checkRound(table8?.row4?.total) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">E</td>
            <td>Credit/Debit Note (if any)</td>
            <td>${checkRound(table8?.row5?.samt) ?? "-"}</td>
            <td>${checkRound(table8?.row5?.camt) ?? "-"}</td>
            <td>${checkRound(table8?.row5?.iamt) ?? "-"}</td>
            <td>${checkRound(table8?.row5?.csamt) ?? "-"}</td>
            <td>${checkRound(table8?.row5?.total) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">F</td>
            <td>Advance adjustment if any</td>
            <td>${checkRound(table8?.row6?.samt) ?? "-"}</td>
            <td>${checkRound(table8?.row6?.camt) ?? "-"}</td>
            <td>${checkRound(table8?.row6?.iamt) ?? "-"}</td>
            <td>${checkRound(table8?.row6?.csamt) ?? "-"}</td>
            <td>${checkRound(table8?.row6?.total) ?? "-"}</td>
          </tr>
          <tr class="c-row">
            <td class="c-1">G</td>
            <td>Subtotal (D) - [(E) + (F)]</td>
            <td>${checkRound(table8?.row7?.samt) ?? "-"}</td>
            <td>${checkRound(table8?.row7?.camt) ?? "-"}</td>
            <td>${checkRound(table8?.row7?.iamt) ?? "-"}</td>
            <td>${checkRound(table8?.row7?.csamt) ?? "-"}</td>
            <td>${checkRound(table8?.row7?.total) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">H</td>
            <td>
              Outward taxable supplies (other than zero rated, nil rated and
              exempted)
            </td>
            <td>${checkRound(table8?.row8?.samt) ?? "-"}</td>
            <td>${checkRound(table8?.row8?.camt) ?? "-"}</td>
            <td>${checkRound(table8?.row8?.iamt) ?? "-"}</td>
            <td>${checkRound(table8?.row8?.csamt) ?? "-"}</td>
            <td>${checkRound(table8?.row8?.total) ?? "-"}</td>
          </tr>
          <tr class="c-row">
            <td class="c-1">I</td>
            <td>Difference (G) - (H)</td>
            <td>${checkRound(table8?.row9?.samt) ?? "-"}</td>
            <td>${checkRound(table8?.row9?.camt) ?? "-"}</td>
            <td>${checkRound(table8?.row9?.iamt) ?? "-"}</td>
            <td>${checkRound(table8?.row9?.csamt) ?? "-"}</td>
            <td>${checkRound(table8?.row9?.total) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    `
        : ``
    } ${
      table6?.flag
        ? `
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार मासिक विवरणी GSTR-3B में दावाकृत आई0टी0सी0
        तथा GSTR-2A/B में घोषित आई0टी0सी0 में अंतर स्‍पष्‍ट है। स्‍पष्‍टीकरण
        साक्ष्‍यों सहित अपेक्षित है अन्‍यथा क्‍यों न उक्‍त की मांग/रिवर्सल की
        कार्यवाही प्रारंभ की जाए ?
      </p>
      <p class="fs-small">
        As below, there is apparent difference between ITC claimed in GSTR-3B
        And ITC declared in GSTR-2A/2B. Clarification along with evidence is
        required, otherwise why proceedings for demand/reversal thereof should
        not be initiated ?
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="4"
        data-pdfmake="{'widths':[25,'*', 55, 60, 60, 60, 60, 60]}"
      >
        <tbody>
          <tr style="height: 21px">
            <th>S.No.</th>
            <th>Issue</th>
            <th>Table No. in GSTR-09</th>
            <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cess</th>
            <th>Total</th>
          </tr>
          <!-- <tr style="height: 21px; text-align: center">
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
            <td>E</td>
            <td>F</td>
            <td>G</td>
            <td>H</td>
          </tr> -->
          <tr style="height: 21px">
            <td class="c-1">A</td>
            <td>ITC as per GSTR-2A</td>
            <td>8A</td>
            <td>${checkRound(table6?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table6?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table6?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table6?.row1?.csamt) ?? "-"}</td>
            <td>${checkRound(table6?.row1?.total) ?? "-"}</td>
          </tr>
          <tr style="height: 21px">
            <td class="c-1">B</td>
            <td>
              Total amount of input tax credit availed through FORM GSTR-3B (sum
              total of Table 4A of FORM GSTR-3B)
            </td>
            <td>6A</td>
            <td>${checkRound(table6?.row2?.samt) ?? "-"}</td>
            <td>${checkRound(table6?.row2?.camt) ?? "-"}</td>
            <td>${checkRound(table6?.row2?.iamt) ?? "-"}</td>
            <td>${checkRound(table6?.row2?.csamt) ?? "-"}</td>
            <td>${checkRound(table6?.row2?.total) ?? "-"}</td>
          </tr>
          <tr class="c-row" style="height: 21px">
            <td class="c-1">C</td>
            <td>Difference/Excess ITC claimed</td>
            <td>(B) - (A)</td>
            <td>${checkRound(table6?.row3?.samt) ?? "-"}</td>
            <td>${checkRound(table6?.row3?.camt) ?? "-"}</td>
            <td>${checkRound(table6?.row3?.iamt) ?? "-"}</td>
            <td>${checkRound(table6?.row3?.csamt) ?? "-"}</td>
            <td>${checkRound(table6?.row3?.total) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    `
        : ``
    } ${
      table12?.flag
        ? `
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार GSTR-9 के कॉलम 9 में वित्‍तीय वर्ष में
        घोषित देय कर एवं GSTR-9C के कॉलम 9P में घोषित देय कर के आंकडों में अंतर
        है। स्‍पष्‍टीकरण अपेक्षित है।
      </p>
      <p class="fs-small">
        As per the chart below, there is apparent difference between tax payable
        in F.Y as declared in col. 9 of GSTR-9 and tax to be paid during the F.Y
        as declared in col. 9P of GSTR-9C. Clarification is expected.
      </p>
      <table
        style="width: 100%"
        border="2"
        data-pdfmake="{'widths':[25,'*', 55, 55, 55, 55]}"
      >
        <tbody>
          <tr>
            <th rowspan="2" class="c-1">S. No.</th>
            <th rowspan="2">Issue</th>
            <!-- <th rowspan="2">Taxable Value</th> -->
            <th style="text-align: center" colspan="4">
              (Amount in all tables)
            </th>
          </tr>
          <tr>
            <th>Central Tax</th>
            <th>State Tax/ UT Tax</th>
            <th>Integrated Tax</th>
            <th>Cess</th>
          </tr>
          <!-- <tr>
        <td class="c-1"></td>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
      </tr> -->
          <tr>
            <td class="c-1">A</td>
            <td>
              Details of tax payable as declared in returns filed during the
              financial year (GSTR9_9)
            </td>
            <!-- <td>${checkRound(table12?.row1?.total) ?? "-"}</td> -->
            <td>${checkRound(table12?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table12?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table12?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table12?.row1?.csamt) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">B</td>
            <td>Total amount to be paid as per tables above (GSTR9C_9P)</td>
            <!-- <td>${checkRound(table12?.row2?.total) ?? "-"}</td> -->
            <td>${checkRound(table12?.row2?.camt) ?? "-"}</td>
            <td>${checkRound(table12?.row2?.samt) ?? "-"}</td>
            <td>${checkRound(table12?.row2?.iamt) ?? "-"}</td>
            <td>${checkRound(table12?.row2?.csamt) ?? "-"}</td>
          </tr>
          <tr class="c-row">
            <td class="c-1">C</td>
            <td>Difference (A) - (B)</td>
            <!-- <td>${checkRound(table12?.row3?.total) ?? "-"}</td> -->
            <td>${checkRound(table12?.row3?.camt) ?? "-"}</td>
            <td>${checkRound(table12?.row3?.samt) ?? "-"}</td>
            <td>${checkRound(table12?.row3?.iamt) ?? "-"}</td>
            <td>${checkRound(table12?.row3?.csamt) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    `
        : ``
    }
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. ट्रांन-1/ट्रांन-2 के अनुसार आई0टी0सी0 का दावा GSTR-9C
        (6L)/(6K) में किया गया है। उक्‍त के सत्‍यापन का साक्ष्‍य अपेक्षित है।
      </p>
      <p class="fs-small">
        ITC as per Tran-1/2 has been claimed in GSTR-9 (6 L)/(6K). Proof of
        verification is required .
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="4"
        data-pdfmake="{'widths':[25,'*', 70, 70, 70, 70, 70]}"
      >
        <tbody>
          <tr style="height: 21px">
            <th>S.No.</th>
            <th>Issue</th>
            <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cess</th>
            <th>Total</th>
          </tr>
          <!-- <tr style="height: 21px; text-align: center">
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
            <td>E</td>
            <td>F</td>
            <td>G</td>
          </tr> -->
          <tr style="height: 21px">
            <td class="c-1">A</td>
            <td>Transition Credit through TRAN-I (GSTR9_6K)</td>
            <td class="n-a"></td>
            <td>${checkRound(table14?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table14?.row1?.iamt) ?? "-"}</td>
            <td class="n-a"></td>
            <td>${checkRound(table14?.row1?.total) ?? "-"}</td>
          </tr>
          <tr style="height: 21px">
            <td class="c-1">B</td>
            <td>Transition Credit through TRAN-II (GSTR9_6L)</td>
            <td class="n-a"></td>
            <td>${checkRound(table14?.row2?.camt) ?? "-"}</td>
            <td>${checkRound(table14?.row2?.iamt) ?? "-"}</td>
            <td class="n-a"></td>
            <td>${checkRound(table14?.row2?.total) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. GSTR-9 के कॉलम 8K में आई0टी0सी0 लैप्‍स किया जाना घोषित
        है। उक्‍त के रिवर्सल का साक्ष्‍य अपेक्षित है।
      </p>
      <p class="fs-small">
        In col. 8 K of GSTR-9, ITC has been declared as lapsed. Proof of
        reversal is expected.
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="4"
        data-pdfmake="{'widths':[25,'*', 70, 70, 70, 70, 70]}"
      >
        <tbody>
          <tr style="height: 21px">
            <th>S.No.</th>
            <th>Issue</th>
            <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cess</th>
            <th>Total</th>
          </tr>
          <!-- <tr style="height: 21px; text-align: center">
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
            <td>E</td>
            <td>F</td>
            <td>G</td>
          </tr> -->
          <tr style="height: 21px">
            <td class="c-1">A</td>
            <td>Total ITC to be lapsed in current financial year (GSTR9_8K)</td>
            <td>${checkRound(table13?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table13?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table13?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table13?.row1?.csamt) ?? "-"}</td>
            <td>${checkRound(table13?.row1?.total) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    ${
      table10?.flag
        ? `
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार GSTR-1 के कॉलम 9(B) में घोषित क्रेडिट
        नोट्स के मूल्‍य एवं GSTR-9 के कॉलम 4(M) में प्रदर्शित क्रेडिट नोट्स के
        मूल्‍य में अंतर है। दावाकृत क्रेडिट नोट्स का आपूर्ति इनवाइस वार विवरण
        सहित स्‍पष्‍टीकरण अपेक्षित है।
      </p>
      <p class="fs-small">
        As below, there is difference in the value of credit notes as declared
        in col. 9 (B) of GSTR-1 and col. 4 (M) of GSTR-9. Clarification along
        with details of outward invoices related to credit notes claimed is
        required.
      </p>
      <table
        style="width: 100%"
        border="2"
        data-pdfmake="{'widths':[25,'*',70, 55, 55, 55, 55]}"
      >
        <tbody>
          <tr>
            <th rowspan="2" class="c-1">S. No.</th>
            <th rowspan="2">Issue</th>
            <th rowspan="2">Taxable Value</th>
            <th style="text-align: center" colspan="4">
              (Amount in all tables)
            </th>
          </tr>
          <tr>
            <th>Central Tax</th>
            <th>State Tax/ UT Tax</th>
            <th>Integrated Tax</th>
            <th>Cess</th>
          </tr>
          <!-- <tr>
        <td class="c-1"></td>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
        <td>6</td>
      </tr> -->
          <tr>
            <td class="c-1">A</td>
            <td>Credit/Debit Notes (GSTR-1 9(B))</td>
            <td>${checkRound(table10?.row1?.total) ?? "-"}</td>
            <td>${checkRound(table10?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table10?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table10?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table10?.row1?.csamt) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">B</td>
            <td>GSTR-9 4(M)</td>
            <td>${checkRound(table10?.row2?.total) ?? "-"}</td>
            <td>${checkRound(table10?.row2?.camt) ?? "-"}</td>
            <td>${checkRound(table10?.row2?.samt) ?? "-"}</td>
            <td>${checkRound(table10?.row2?.iamt) ?? "-"}</td>
            <td>${checkRound(table10?.row2?.csamt) ?? "-"}</td>
          </tr>
          <tr class="c-row">
            <td class="c-1">C</td>
            <td>Difference (A) - (B)</td>
            <td>${checkRound(table10?.row3?.total) ?? "-"}</td>
            <td>${checkRound(table10?.row3?.camt) ?? "-"}</td>
            <td>${checkRound(table10?.row3?.samt) ?? "-"}</td>
            <td>${checkRound(table10?.row3?.iamt) ?? "-"}</td>
            <td>${checkRound(table10?.row3?.csamt) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    `
        : ``
    }
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार GSTR-9C के प्रस्‍तर 12 (F) में असंगत
        आई0टी0सी0 घोषित है। स्‍पष्‍टीकरण अपेक्षित है! अन्‍यथा क्‍यों न उक्‍त की
        मांग कर, ब्‍याज एवं अर्थदंड सहित सृजित की जाए ?
      </p>
      <p class="fs-small">
        As below, unreconciled ITC is declared in col. 12 (F) of GSTR-9c.
        Clarification is required, else why a demand of tax along with interest
        and penalty may not be generated?
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="4"
        data-pdfmake="{'widths':[25,'*', 80]}"
      >
        <tbody>
          <tr style="height: 21px">
            <th>S.No.</th>
            <th>Issue</th>
            <!-- <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cess</th> -->
            <th>Amount</th>
          </tr>
          <!-- <tr style="height: 21px; text-align: center">
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
            <td>E</td>
            <td>F</td>
            <td>G</td>
          </tr> -->
          <tr style="height: 21px">
            <td class="c-1">A</td>
            <td>Un-reconciled ITC (GSTR9C_12F)</td>
            <!-- <td class="n-a">${checkRound(table15?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table15?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table15?.row1?.iamt) ?? "-"}</td>
            <td class="n-a">${checkRound(table15?.row1?.csamt) ?? "-"}</td>
            <td>${checkRound(table15?.row1?.total) ?? "-"}</td> -->
            <td>${checkRound(table15?.row1?.total) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    ${
      table9?.flag
        ? `
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार वर्तमान वित्‍तीय वर्ष में प्राप्‍त परन्‍तु
        आगामी वित्‍तीय वर्ष में प्रयुक्‍त आई0टी0सी0 GSTR-9 के कॉलम 8(C) में एवं
        GSTR-9C के कॉलम 12C में भिन्‍न-भिन्‍न घोषित है। स्‍पष्‍टीकरण अपेक्षित
        है, क्‍यों न उक्‍त का वर्तमान वित्‍तीय वर्ष में प्रयोग मानकर मांग सृजित
        की जाए ?
      </p>
      <p class="fs-small">
        As below, ITC received in current F.Y but utilized in subsequent F.Y has
        been declared in col. 8 (C) of GSTR-9 and col. 12 (C) of GSTR-9C
        differently. Clarification required, else why a demand should not be
        generated contemplating its utilization in current F.Y ?
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="2"
        data-pdfmake="{'widths':[25,'*', 90]}"
      >
        <tbody>
          <tr>
            <th>S.No.</th>
            <th>Issue</th>
            <!-- <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cess</th> -->
            <th>Total</th>
          </tr>
          <!-- <tr style="text-align: center">
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
          </tr> -->
          <tr>
            <td class="c-1">A</td>
            <td>
              ITC on inward supplies (other than imports and inward supplies
              liable to reverse charge but includes services received from SEZs)
              received during the financial year but availed in the next
              financial year upto specified period (GSTR9_8C)
            </td>
            <!-- <td>${checkRound(table9?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table9?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table9?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table9?.row1?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table9?.row1?.total) ?? "-"}</td>
          </tr>
          <tr>
            <td class="c-1">B</td>
            <td>
              ITC booked in current Financial Year to be claimed in subsequent
              Financial Years (GSTR9C_12C)
            </td>
            <!-- <td>${checkRound(table9?.row2?.samt) ?? "-"}</td>
            <td>${checkRound(table9?.row2?.camt) ?? "-"}</td>
            <td>${checkRound(table9?.row2?.iamt) ?? "-"}</td>
            <td>${checkRound(table9?.row2?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table9?.row2?.total) ?? "-"}</td>
          </tr>
          <tr class="c-row">
            <td class="c-1">C</td>
            <td>Difference</td>
            <!-- <td>${checkRound(table9?.row3?.samt) ?? "-"}</td>
            <td>${checkRound(table9?.row3?.camt) ?? "-"}</td>
            <td>${checkRound(table9?.row3?.iamt) ?? "-"}</td>
<td>${checkRound(table9?.row3?.csamt) ?? "-"}</td> -->
            <td>${checkRound(table9?.row3?.total) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    `
        : ``
    }
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. GSTR-9C के कॉलम 9R में असंगत कर भुगतान का उल्‍लेख है।
        स्‍पष्‍टीकरण अपेक्षित है।
      </p>
      <p class="fs-small">
        In col. 9R of GSTR-9C unconciled Payment of tax is shown. Clarification
        is required .
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="4"
        data-pdfmake="{'widths':[25,'*', 70, 70, 70, 70]}"
      >
        <tbody>
          <tr>
            <th>S.No.</th>
            <th>Issue</th>
            <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cess</th>
          </tr>
          <!-- <tr style="height: 21px; text-align: center">
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
            <td>E</td>
            <td>F</td>
            <td>G</td>
          </tr> -->
          <tr>
            <td class="c-1">A</td>
            <td>Unreconciled payment of amount (GSTR9C_9R)</td>
            <td>${checkRound(table17?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table17?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table17?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table17?.row1?.csamt) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार GSTR-9C के कॉलम 5R में असंगत आवर्त का
        उल्‍लेख है। स्‍पष्‍टीकरण अपेक्षित है।
      </p>
      <p class="fs-small">
        As below, in col. 5 (R) of GSTR-9C unreconciled Turnover has been
        declared. Clarification is hereby sought.
      </p>
      <br />
      <table
        style="width: 100%"
        border="2"
        cellpadding="4"
        data-pdfmake="{'widths':[25,'*', 100]}"
      >
        <tbody>
          <tr>
            <th>S.No.</th>
            <th>Issue</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td class="c-1">A</td>
            <td>Unreconciled Turnover (GSTR9C_5R)</td>
            <td>${checkRound(table16?.row1?.total) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार GSTR-9C के प्रस्‍तर 7(G) में असंगत
        करयोग्‍य आवर्त घोषित है। स्‍पष्‍टीकरण अपेक्षित है।
      </p>
      <p class="fs-small">
        As below, unreconciled taxable turnover has been declared in col. 7G of
        GSTR-9C. Clarification is hereby expected.
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="4"
        data-pdfmake="{'widths':[25,'*', 100]}"
      >
        <tbody>
          <tr>
            <th>S.No.</th>
            <th>Issue</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td class="c-1">A</td>
            <td>Unreconciled Taxable Turnover (GSTR9C_7G)</td>
            <td>${checkRound(table16?.row2?.total) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार आई0टी0सी0 का रिवर्सल नियम 42 एवं 43 के
        अनुसार नहीं किया गया है, क्‍यों न उक्‍त की रिवर्सल की कार्यवाही प्रारंभ
        की जाए। स्‍पष्‍टीकरण अपेक्षित है?
      </p>
      <p class="fs-small">
        As below, ITC has not been reversed as per rule 42 and 43. Why
        proceeding for its reversal may not be initiated. Clarification is
        hereby expected?
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="4"
        data-pdfmake="{'widths':[25,'*', 55, 55, 55, 55, 55, 55, 55]}"
      >
        <tbody>
          <tr style="height: 21px">
            <th>S.No.</th>
            <th>Issue</th>
            <th>Table No. in GSTR-09</th>
            <th>Taxable Value</th>
            <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cess</th>
            <th>Total</th>
          </tr>
          <tr style="height: 21px; text-align: center">
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
            <td>E</td>
            <td>F</td>
            <td>G</td>
            <td>H</td>
            <td>I</td>
          </tr>
          <tr style="height: 21px">
            <td class="c-1">1</td>
            <td>Total supplies</td>
            <td>5N + 10 - 11</td>
            <td>${checkRound(table3?.row1?.txval) ?? "-"}</td>
            <td>${checkRound(table3?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table3?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table3?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table3?.row1?.csamt) ?? "-"}</td>
            <td>${checkRound(table3?.row1?.total) ?? "-"}</td>
          </tr>
          <tr style="height: 21px">
            <td class="c-1">2</td>
            <td>Exempt supplies</td>
            <td>5C + 5D + 5E + 5F</td>
            <td>${checkRound(table3?.row2?.txval) ?? "-"}</td>
            <td>${checkRound(table3?.row2?.samt) ?? "-"}</td>
            <td>${checkRound(table3?.row2?.camt) ?? "-"}</td>
            <td>${checkRound(table3?.row2?.iamt) ?? "-"}</td>
            <td>${checkRound(table3?.row2?.csamt) ?? "-"}</td>
            <td>${checkRound(table3?.row2?.total) ?? "-"}</td>
          </tr>
          <tr style="height: 21px">
            <td class="c-1">3</td>
            <td>Common input tax credit</td>
            <td>6O + 13 - 12</td>
            <td>${checkRound(table3?.row3?.txval) ?? "-"}</td>
            <td>${checkRound(table3?.row3?.samt) ?? "-"}</td>
            <td>${checkRound(table3?.row3?.camt) ?? "-"}</td>
            <td>${checkRound(table3?.row3?.iamt) ?? "-"}</td>
            <td>${checkRound(table3?.row3?.csamt) ?? "-"}</td>
            <td>${checkRound(table3?.row3?.total) ?? "-"}</td>
          </tr>
          <tr style="height: 21px">
            <td class="c-1">4</td>
            <td>ITC to be reversed</td>
            <td>(S.No.2 /S.No.1) (x) S.No.3</td>
            <td>${checkRound(table3?.row4?.txval) ?? "-"}</td>
            <td>${checkRound(table3?.row4?.samt) ?? "-"}</td>
            <td>${checkRound(table3?.row4?.camt) ?? "-"}</td>
            <td>${checkRound(table3?.row4?.iamt) ?? "-"}</td>
            <td>${checkRound(table3?.row4?.csamt) ?? "-"}</td>
            <td>${checkRound(table3?.row4?.total) ?? "-"}</td>
          </tr>
          <tr style="height: 21.5px">
            <td class="c-1">5</td>
            <td>ITC reversed as per GSTR-09</td>
            <td>7C + 7D</td>
            <td>${checkRound(table3?.row5?.txval) ?? "-"}</td>
            <td>${checkRound(table3?.row5?.samt) ?? "-"}</td>
            <td>${checkRound(table3?.row5?.camt) ?? "-"}</td>
            <td>${checkRound(table3?.row5?.iamt) ?? "-"}</td>
            <td>${checkRound(table3?.row5?.csamt) ?? "-"}</td>
            <td>${checkRound(table3?.row5?.total) ?? "-"}</td>
          </tr>
          <tr style="height: 21px">
            <td class="c-1">6</td>
            <td>Difference/Excess ITC claimed</td>
            <td>S.No 4 (-) S.No. 5</td>
            <td>${checkRound(table3?.row6?.txval) ?? "-"}</td>
            <td>${checkRound(table3?.row6?.samt) ?? "-"}</td>
            <td>${checkRound(table3?.row6?.camt) ?? "-"}</td>
            <td>${checkRound(table3?.row6?.iamt) ?? "-"}</td>
            <td>${checkRound(table3?.row6?.csamt) ?? "-"}</td>
            <td>${checkRound(table3?.row6?.total) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
  </ol>
  <ul style="list-style: none">
    <li>
      <p class="bold fs-mid">
        ${getTableNum()}. निम्नानुसार दावाकृत एवं स्‍वीकृत रिफंड के संबंध में,
        यदि माल की जीरो रेटेड आपूर्ति हो, भुगतान प्राप्‍त का साक्ष्‍य अपेक्षित
        है।
      </p>
      <p class="fs-small">
        As below, proof of remittance details is required in case of refund
        claimed and sanctioned if it relates to zero rated supply of goods.
      </p>
      <table
        style="width: 100%"
        border="2"
        cellpadding="2"
        data-pdfmake="{'widths':[25,'*', 65, 65, 65, 65, 65]}"
      >
        <tbody>
          <tr>
            <th>S.No.</th>
            <th>Issue</th>
            <th>SGST</th>
            <th>CGST</th>
            <th>IGST</th>
            <th>Cess</th>
            <th>Total</th>
          </tr>
          <tr style="text-align: center">
            <td>A</td>
            <td>B</td>
            <td>C</td>
            <td>D</td>
            <td>E</td>
            <td>F</td>
            <td>G</td>
          </tr>
          <tr>
            <td style="text-align: center">1</td>
            <td>Refunds Claimed (As per 15A of GSTR9_15A)</td>
            <td>${checkRound(table18?.row1?.samt) ?? "-"}</td>
            <td>${checkRound(table18?.row1?.camt) ?? "-"}</td>
            <td>${checkRound(table18?.row1?.iamt) ?? "-"}</td>
            <td>${checkRound(table18?.row1?.csamt) ?? "-"}</td>
            <td>${checkRound(table18?.row1?.total) ?? "-"}</td>
          </tr>
          <tr>
            <td style="text-align: center">2</td>
            <td>Refunds Sanctioned (As per 15B of GSTR9_15B)</td>
            <td>${checkRound(table18?.row2?.samt) ?? "-"}</td>
            <td>${checkRound(table18?.row2?.camt) ?? "-"}</td>
            <td>${checkRound(table18?.row2?.iamt) ?? "-"}</td>
            <td>${checkRound(table18?.row2?.csamt) ?? "-"}</td>
            <td>${checkRound(table18?.row2?.total) ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </li>
    <br />
  </ul>
</div>
`,
    html2pdfmakeStyles
  );

  let iframeContainer = useRef(null);

  let docDefinition = useRef({
    content: [html],
    styles: pdfMakeStyles,
    defaultStyle: {
      font: "Noto_Sans",
    },
  });

  async function handleMerging(pdfs) {
    const merger = new PDFMerger();
    for (let i = 0; i < pdfs.length; i++) {
      await merger.add(pdfs[i]);
    }
    const finalPDF = await merger.saveAsBlob();
    const url = URL.createObjectURL(finalPDF);
    setIFrameSrc(url);
    setPdfUrl(url);
  }

  useEffect(() => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition.current);
    pdfDocGenerator.getBlob((blob) => {
      const url = URL.createObjectURL(blob);
      setIFrameSrc(url);
      setPdfUrl(url);
    });
    async function handleRemarks(pdfDocGenerator) {
      let remarksPDFs = [];
      pdfDocGenerator.getBlob(async (blob) => {
        let ab = await blob.arrayBuffer();
        remarksPDFs.push(ab);
        await remarkFiles.forEach(async ({ file, arrayBuffer }) => {
          if (file.type === "application/pdf") {
            remarksPDFs.push(arrayBuffer);
            if (remarksPDFs.length == remarkFiles.length + 1) {
              await handleMerging(remarksPDFs);
            }
            return;
          }
          let { value } = await mammoth.convertToHtml({
            arrayBuffer: arrayBuffer,
          });
          let pdfDocGen = pdfMake.createPdf({
            content: [htmlToPdfmake(value, html2pdfmakeStyles)],
            styles: pdfMakeStyles,
          });
          pdfDocGen.getBlob(async (blob) => {
            let ab = await blob.arrayBuffer();
            remarksPDFs.push(ab);
            if (remarksPDFs.length == remarkFiles.length + 1) {
              await handleMerging(remarksPDFs);
            }
          });
        });
      });
    }
    handleRemarks(pdfDocGenerator);
  }, [setPdfUrl, tableData, remarkFiles]);
  return (
    <StyledIframe ref={iframeContainer} src={iFrameSrc + "#page=1&view=FitH"} />
  );
});

export default Report;
