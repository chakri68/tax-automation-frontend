import { styled } from "@stitches/react";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import React, { useEffect, useRef, useState } from "react";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const StyledIframe = styled("iframe", {
  border: "none",
  width: "100%",
  height: "100%",
});

function checkRound(num) {
  if (num == null || num == undefined) return num;
  return parseFloat(num).toFixed(2);
}

const GSTR1 = React.memo(function GSTR1({ tableData, gstin, setPdfMake }) {
  let {
    table4A,
    table4B,
    table4C,
    table6A,
    table6B,
    table6C,
    table7,
    table8,
    table9A_1,
    table9A_2,
    table9A_3,
    table9A_4,
    table9A_5,
    table9A_6,
    table9B_1,
    table9B_2,
    table9C_1,
    table9C_2,
    "table11(A)1": table11_A_1,
    "table11(B)2": table11_B_2,
    table12,
  } = tableData;

  let [iFrameSrc, setIFrameSrc] = useState("");
  var html = htmlToPdfmake(
    `<div style="font-size: 9px; margin-bottom: 5px">
  <p style="font-size: 20px; font-weight: bold; text-align: center">
    Form GSTR-1
  </p>

  <p style="text-align: center">[See rule 59(1)]</p>
  <p style="text-align: center">
    Details of outward supplies of goods or services
  </p>

  <table style="width: 100%" border="2" cellpadding="4">
    <tr>
      <td style="width: 10%">1.</td>
      <th style="width: 45%" colspan="2">GSTIN</th>
      <td style="width: 45%">${gstin}</td>
    </tr>
    <tr>
      <td rowspan="4" style="width: 10%">2</td>
      <th style="width: 10%">(a)</th>
      <th style="width: 40%">Legal name of the registered person</th>
      <td style="width: 40%"></td>
    </tr>
    <tr>
      <th style="width: 10%">(b)</th>
      <th style="width: 40%">Trade name, if any</th>
      <td style="width: 40%"></td>
    </tr>
    <tr>
      <th style="width: 10%">(c)</th>
      <th style="width: 40%">ARN</th>
      <td style="width: 40%"></td>
    </tr>
    <tr>
      <th style="width: 10%">(d)</th>
      <th style="width: 40%">Date of ARN</th>
      <td style="width: 40%"></td>
    </tr>
  </table>

  <table style="width: 100%" border="2" cellpadding="4">
    <tr>
      <th style="width: 30%">Desciption</th>
      <th>No. of records</th>
      <th>Document Type</th>
      <th>Value (<span>&#8377;</span>)</th>
      <th>Integrated Tax (<span>&#8377;</span>)</th>
      <th>Central Tax (<span>&#8377;</span>)</th>
      <th>State/UT Tax (<span>&#8377;</span>)</th>
      <th>Cess (<span>&#8377;</span>)</th>
    </tr>

    <tr>
      <th colspan="8">
        4A - Taxable outward supplies made to registered persons(other than
        reverse charge supplies) - B2B Regular
      </th>
    </tr>
    <tr>
      <td>Total</td>
      <td>${checkRound(table4A?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table4A?.txval) ?? "-"}</td>
      <td>${checkRound(table4A?.iamt) ?? "-"}</td>
      <td>${checkRound(table4A?.camt) ?? "-"}</td>
      <td>${checkRound(table4A?.samt) ?? "-"}</td>
      <td>${checkRound(table4A?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td colspan="8"><br /></td>
    </tr>

    <tr>
      <th colspan="8">
        4B - Taxable outward supplies made to registered persons attracting tax
        on reverse charge - B2B Reverse charge
      </th>
    </tr>
    <tr>
      <td>Total</td>
      <td>${checkRound(table4B?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table4B?.txval) ?? "-"}</td>
      <td>${checkRound(table4B?.iamt) ?? "-"}</td>
      <td>${checkRound(table4B?.camt) ?? "-"}</td>
      <td>${checkRound(table4B?.samt) ?? "-"}</td>
      <td>${checkRound(table4B?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td colspan="8"><br /></td>
    </tr>

    <tr>
      <th colspan="8">
        5A - Taxable outward inter-state supplies made to unregistered persons (
        where invoice value is more than Rs 2.5 lakh ) - B2C (Large)
      </th>
    </tr>
    <tr>
      <td>Total</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td colspan="8"><br /></td>
    </tr>

    <tr>
      <th colspan="8">6A - Exports (with/without payment)</th>
    </tr>
    <tr>
      <td>Total</td>
      <td>${checkRound(table6A?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table6A?.txval) ?? "-"}</td>
      <td>${checkRound(table6A?.iamt) ?? "-"}</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td>${checkRound(table6A?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td>- EXPWP</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
    </tr>
    <tr>
      <td>- EXPWOP</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
    </tr>
    <tr>
      <td colspan="8"><br /></td>
    </tr>

    <tr>
      <th colspan="8">
        6B - Supplies made to SEZ unit or SEZ developer SEZWP/SEZWOP
      </th>
    </tr>
    <tr>
      <td>Total</td>
      <td>${checkRound(table6B?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table6B?.txval) ?? "-"}</td>
      <td>${checkRound(table6B?.iamt) ?? "-"}</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td>${checkRound(table6B?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td>- SEZWP</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>- SEZWOP</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th colspan="8">6C - Deemed Exports - DE</th>
    </tr>
    <tr>
      <td>Total</td>
      <td>${checkRound(table6C?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table6C?.txval) ?? "-"}</td>
      <td>${checkRound(table6C?.iamt) ?? "-"}</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td>${checkRound(table6C?.csamt) ?? "-"}</td>
    </tr>

    <tr>
      <th colspan="8">
        7 - Taxable supplies (Net of debt and credit noter) to unregistered
        persons (other then the supplies covered in Table 5) - B2CS (Others)
      </th>
    </tr>
    <tr>
      <td>Total</td>
      <td>${checkRound(table7?.numberOfRecords) ?? "-"}</td>
      <td>Net Value</td>
      <td>${checkRound(table7?.txval) ?? "-"}</td>
      <td>${checkRound(table7?.iamt) ?? "-"}</td>
      <td>${checkRound(table7?.camt) ?? "-"}</td>
      <td>${checkRound(table7?.samt) ?? "-"}</td>
      <td>${checkRound(table7?.csamt) ?? "-"}</td>
    </tr>

    <tr>
      <th colspan="8">8 - Nil rated exempted and non GST outward supplies</th>
    </tr>
    <tr>
      <td colspan="3">Total</td>
      <td>
        ${
          checkRound(table8?.nil_amt + table8?.expt_amt + table8?.ngsup_amt) ??
          "-"
        }
      </td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td colspan="3">- Nil</td>
      <td>${checkRound(table8?.nil_amt) ?? "-"}</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td colspan="3">- Exempted</td>
      <td>${checkRound(table8?.expt_amt) ?? "-"}</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td colspan="3">- Non-GST</td>
      <td>${checkRound(table8?.ngsup_amt) ?? "-"}</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>

    <tr>
      <th colspan="8">
        9A - Amendment to taxable outward supplies made to registered person in
        returns of earlier tax periods in table 4 - B2B Regular
      </th>
    </tr>
    <tr>
      <td>Amended amount - Total</td>
      <td>${checkRound(table9A_1?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9A_1?.txval) ?? "-"}</td>
      <td>${checkRound(table9A_1?.iamt) ?? "-"}</td>
      <td>${checkRound(table9A_1?.camt) ?? "-"}</td>
      <td>${checkRound(table9A_1?.samt) ?? "-"}</td>
      <td>${checkRound(table9A_1?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td>Net differential amount (Amended - Original)</td>
      <td></td>
      <td></td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
    </tr>

    <tr>
      <th colspan="8">
        9A - Amendment to taxable outward supplies made to registered person in
        returns of earlier tax periods in table 4 - B2B Reverse charge
      </th>
    </tr>
    <tr>
      <td>Amended amount - Total</td>
      <td>${checkRound(table9A_2?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9A_2?.txval) ?? "-"}</td>
      <td>${checkRound(table9A_2?.iamt) ?? "-"}</td>
      <td>${checkRound(table9A_2?.camt) ?? "-"}</td>
      <td>${checkRound(table9A_2?.samt) ?? "-"}</td>
      <td>${checkRound(table9A_2?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td>Net differential amount (Amended - Original)</td>
      <td></td>
      <td></td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
    </tr>

    <tr>
      <th colspan="8">
        9A - Amendment to Inter State made to unregistered person (where invoice
        value is more than Rs 2.5 lakh) in returns of earlier tax periods in
        table 5 - B2CL (Large)
      </th>
    </tr>
    <tr>
      <td>Amended amount - Total</td>
      <td>${checkRound(table9A_3?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9A_3?.txval) ?? "-"}</td>
      <td>${checkRound(table9A_3?.iamt) ?? "-"}</td>
      <td>${checkRound(table9A_3?.camt) ?? "-"}</td>
      <td>${checkRound(table9A_3?.samt) ?? "-"}</td>
      <td>${checkRound(table9A_3?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td>Net differential amount (Amended - Original)</td>
      <td></td>
      <td></td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
    </tr>

    <tr>
      <th colspan="8">
        9A - Amendment to Deemed Exports in returns of earlier tax periods in
        table 6C (DE)
      </th>
    </tr>
    <tr>
      <td>Amended amount - Total</td>
      <td>${checkRound(table9A_6?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9A_6?.txval) ?? "-"}</td>
      <td>${checkRound(table9A_6?.iamt) ?? "-"}</td>
      <td>${checkRound(table9A_6?.camt) ?? "-"}</td>
      <td>${checkRound(table9A_6?.samt) ?? "-"}</td>
      <td>${checkRound(table9A_6?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td>Net differential amount (Amended - Original) - Total</td>
      <td></td>
      <td></td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
    </tr>

    <tr>
      <th colspan="8">
        9A - Amendment to supplies made to SEZ units or SEZ developers in
        returns of earlier tax periods in table 6B (SEZWP/SEZWOP)
      </th>
    </tr>
    <tr>
      <td>Amended amount - Total</td>
      <td>${checkRound(table9A_5?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9A_5?.txval) ?? "-"}</td>
      <td>${checkRound(table9A_5?.iamt) ?? "-"}</td>
      <td>${checkRound(table9A_5?.camt) ?? "-"}</td>
      <td>${checkRound(table9A_5?.samt) ?? "-"}</td>
      <td>${checkRound(table9A_5?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td>Net differential amount (Amended - Original) - Total</td>
      <td></td>
      <td></td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
    </tr>

    <tr>
      <th colspan="8">
        9A - Amendment to Export Supplies in returns of earlier tax periods in
        table 5A
      </th>
    </tr>
    <tr>
      <td>Amended amount - Total</td>
      <td>${checkRound(table9A_4?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9A_4?.txval) ?? "-"}</td>
      <td>${checkRound(table9A_4?.iamt) ?? "-"}</td>
      <td>${checkRound(table9A_4?.camt) ?? "-"}</td>
      <td>${checkRound(table9A_4?.samt) ?? "-"}</td>
      <td>${checkRound(table9A_4?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td>Net differential amount (Amended - Original)</td>
      <td></td>
      <td></td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0.00</td>
    </tr>

    <tr>
      <th colspan="8">9B - Credit/Debit Notes(Registered) - CDNR</th>
    </tr>
    <tr>
      <td>Net Total (Debit notes - Credit notes)</td>
      <td>${checkRound(table9B_1?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9B_1?.txval) ?? "-"}</td>
      <td>${checkRound(table9B_1?.iamt) ?? "-"}</td>
      <td>${checkRound(table9B_1?.camt) ?? "-"}</td>
      <td>${checkRound(table9B_1?.samt) ?? "-"}</td>
      <td>${checkRound(table9B_1?.csamt) ?? "-"}</td>
    </tr>

    <tr>
      <th colspan="8">9B - Credit/Debit Notes(Unregistered) - CDNUR</th>
    </tr>
    <tr>
      <td>Net Total (Debit notes - Credit notes)</td>
      <td>${checkRound(table9B_2?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9B_2?.txval) ?? "-"}</td>
      <td>${checkRound(table9B_2?.iamt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.camt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.samt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.csamt) ?? "-"}</td>
    </tr>

    <tr>
      <td>- B2CL</td>
      <td>${checkRound(table9B_2?.B2CL?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9B_2?.B2CL?.txval) ?? "-"}</td>
      <td>${checkRound(table9B_2?.B2CL?.iamt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.B2CL?.camt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.B2CL?.samt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.B2CL?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td>- EXPWP</td>
      <td>${checkRound(table9B_2?.EXPWP?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9B_2?.EXPWP?.txval) ?? "-"}</td>
      <td>${checkRound(table9B_2?.EXPWP?.iamt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.EXPWP?.camt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.EXPWP?.samt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.EXPWP?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td>- EXPWOP</td>
      <td>${checkRound(table9B_2?.EXPWOP?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9B_2?.EXPWOP?.txval) ?? "-"}</td>
      <td>${checkRound(table9B_2?.EXPWOP?.iamt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.EXPWOP?.camt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.EXPWOP?.samt) ?? "-"}</td>
      <td>${checkRound(table9B_2?.EXPWOP?.csamt) ?? "-"}</td>
    </tr>

    <tr>
      <th colspan="8">9C - Amended Credit/Debit Notes (Registered) - CDNRA</th>
    </tr>
    <tr>
      <td>Net Total (Debit notes - Credit notes)</td>
      <td>${checkRound(table9C_1?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9C_1?.txval) ?? "-"}</td>
      <td>${checkRound(table9C_1?.iamt) ?? "-"}</td>
      <td>${checkRound(table9C_1?.camt) ?? "-"}</td>
      <td>${checkRound(table9C_1?.samt) ?? "-"}</td>
      <td>${checkRound(table9C_1?.csamt) ?? "-"}</td>
    </tr>

    <tr>
      <th colspan="8">
        9C - Amended Credit/Debit Notes (Unregistered) - CDNURA
      </th>
    </tr>
    <tr>
      <td>Net Total (Debit notes - Credit notes)</td>
      <td>${checkRound(table9C_2?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table9C_2?.txval) ?? "-"}</td>
      <td>${checkRound(table9C_2?.iamt) ?? "-"}</td>
      <td>${checkRound(table9C_2?.camt) ?? "-"}</td>
      <td>${checkRound(table9C_2?.samt) ?? "-"}</td>
      <td>${checkRound(table9C_2?.csamt) ?? "-"}</td>
    </tr>
    <tr>
      <td colspan="8">Unregistered Type</td>
    </tr>
    <tr>
      <td>- B2CL</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>- EXPWP</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>- EXPWOP</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td colspan="8"><br /></td>
    </tr>

    <tr>
      <th colspan="8">
        10 - Amendment to taxable outward supplies made to unregistered persons
        in returns for earlier tax periods in table 7 - B2C (Others)
      </th>
    </tr>
    <tr>
      <td>Amended amount - Total</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Net differential amount(Amended - Original)</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr></tr>

    <tr>
      <th colspan="8">
        11A(1),11A(2) - Advance received for which invoice has not been issued
        (tax amount to be added to the output tax liability)(Net of refund
        vouchers)
      </th>
    </tr>
    <tr>
      <td>Total</td>
      <td>${checkRound(table11_A_1?.numberOfRecords) ?? "-"}</td>
      <td>Net Value</td>
      <td>${checkRound(table11_A_1?.txval) ?? "-"}</td>
      <td>${checkRound(table11_A_1?.iamt) ?? "-"}</td>
      <td>${checkRound(table11_A_1?.camt) ?? "-"}</td>
      <td>${checkRound(table11_A_1?.samt) ?? "-"}</td>
      <td>${checkRound(table11_A_1?.csamt) ?? "-"}</td>
    </tr>

    <tr>
      <th colspan="8">
        11B(1), 11B(2) - Advance amount received in earlier tax period and
        adjusted against the supplies being shown in this tax period in Table
        Nos 4,5,6 and 7
      </th>
    </tr>
    <tr>
      <td>Total</td>
      <td>${checkRound(table11_B_2?.numberOfRecords) ?? "-"}</td>
      <td>Net Value</td>
      <td>${checkRound(table11_B_2?.txval) ?? "-"}</td>
      <td>${checkRound(table11_B_2?.iamt) ?? "-"}</td>
      <td>${checkRound(table11_B_2?.camt) ?? "-"}</td>
      <td>${checkRound(table11_B_2?.samt) ?? "-"}</td>
      <td>${checkRound(table11_B_2?.csamt) ?? "-"}</td>
    </tr>

    <tr>
      <th colspan="8">
        11A - Amendment to advances received in returns for earlier tax periods
        in table 11A(1), 11A(2)
      </th>
    </tr>
    <tr>
      <td>Amended amount - Total</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Total</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td colspan="8"><br /></td>
    </tr>

    <tr>
      <th colspan="8">
        11B - Amendment to advances received in returns for earlier tax periods
        in table 11B(1), 11B(2)
      </th>
    </tr>
    <tr>
      <td>Amended amount - Total</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Total</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td colspan="8"><br /></td>
    </tr>

    <tr>
      <th colspan="8">12 - HSN wise summary of outward supplies</th>
    </tr>
    <tr>
      <td>Total</td>
      <td>${checkRound(table12?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table12?.txval) ?? "-"}</td>
      <td>${checkRound(table12?.iamt) ?? "-"}</td>
      <td>${checkRound(table12?.camt) ?? "-"}</td>
      <td>${checkRound(table12?.samt) ?? "-"}</td>
      <td>${checkRound(table12?.csamt) ?? "-"}</td>
    </tr>

    <tr>
      <th colspan="8">13 - Documents issued</th>
    </tr>
    <tr>
      <td>Net issued documents</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td colspan="8"><br /></td>
    </tr>

    <tr>
      <td colspan="8"></td>
    </tr>
    <tr class="c-row">
      <td></td>
      <td>${checkRound(table12?.numberOfRecords) ?? "-"}</td>
      <td>Invoice</td>
      <td>${checkRound(table12?.txval) ?? "-"}</td>
      <td>${checkRound(table12?.iamt) ?? "-"}</td>
      <td>${checkRound(table12?.camt) ?? "-"}</td>
      <td>${checkRound(table12?.samt) ?? "-"}</td>
      <td>${checkRound(table12?.csamt) ?? "-"}</td>
    </tr>
  </table>

  <br />
  <p>
    Verification:<br />
    I hereby solemnly affirm and declare that the information given herein above
    is true and correct to the best of my knowledge belief and nothing has been
    concealed there from and in case of any reduction in output tax liability
    the benefit thereof has been/will be passed on to the recipient of
    supply.<br />
    <br />
    Date:<br />
    Signature<br />
    Name of Authorized Signatory<br />
    <br />
    Designaion/Status: <br />
  </p>
</div>
`,
    {
      tableAutoSize: true,
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
        p: { margin: [0, 3, 0, 3] },
        ul: { marginBottom: 5 },
        li: { marginLeft: 5 },
        table: { marginBottom: 5 },
        th: { bold: true, fillColor: "#EEEEEE" },
      },
    }
  );

  // https://aymkdn.github.io/html-to-pdfmake/index.html

  let iframeContainer = useRef(null);

  let docDefinition = useRef({
    content: [html],
    styles: {
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
    },
  });

  useEffect(() => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition.current);
    pdfDocGenerator.getDataUrl((dataUrl) => {
      setIFrameSrc(dataUrl);
      setPdfMake(pdfDocGenerator);
    });
  }, [setPdfMake, tableData]);
  return (
    <StyledIframe ref={iframeContainer} src={iFrameSrc + "#page=1&view=FitV"} />
  );
});

export default GSTR1;
