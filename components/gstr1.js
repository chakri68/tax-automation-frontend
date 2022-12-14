import { styled } from "@stitches/react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";
import { useEffect, useRef, useState } from "react";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const StyledIframe = styled("iframe", {
  border: "none",
  width: "100%",
  height: "100%",
});

function round(num){
  return Math.round(num*100)/100;
}

export default function GSTR3B({ tableData },gstin){
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
    table11_A_1,
    table11_B_2,
    table12,
  } = tableData;
  console.log(tableData);

  let [iFrameSrc, setIFrameSrc] = useState("");
  var html = htmlToPdfmake(
    `
<div>
    <p style="font-size: 20px;font-weight: bold;text-align: center">Form GSTR-3b</p>

    <p style="text-align: center">[See rule 61(5)]</p>
    <p style="text-align: center">Details of outward supplies of goods or services</p>
    <table>
        <tr>
            <td style="width:150px;font-weight:bold">Year</td>
            <td style="width:150px;"></td>
        </tr>
        <tr>
            <td style="width:150px;font-weight:bold">Period</td>
            <td style="width:150px;"></td>
        </tr>
    </table>

    <table>
        <tr>
            <td style="width:10%;">1.</td>
            <th style="width:45%" colspan="2">GSTIN</td>
            <td style="width:45%">${gstin}</td>
        </tr>
        <tr>
            <td rowspan="4" style="width: 10%;">2</td>
            <th style="width: 10%;">(a)</th>
            <th style="width:40%">Legal name of the registered person</th>
            <td style="width:40%"></td>
        </tr>
        <tr>
            <th style="width: 10%;">(b)</th>
            <th style="width:40%">Trade name, if any</td>
            <td style="width:40%"></td>
        </tr>
        <tr>
            <th style="width: 10%;">(c)</th>
            <th style="width:40%">ARN</td>
            <td style="width:40%"></td>
        </tr>
        <tr>
            <th style="width: 10%;">(d)</th>
            <th style="width:40%">Date of ARN</td>
            <td style="width:40%"></td>
        </tr>
    </table>

    <table>
        <tr>
            <th style="width: 30%;">Desciption</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (<span>&#8377;</span>)</th>
            <th>Integrated Tax (<span>&#8377;</span>)</th>
            <th>Central Tax (<span>&#8377;</span>)</th>
            <th>State/UT Tax (<span>&#8377;</span>)</th>
            <th>Cast Tax (<span>&#8377;</span>)</th>
        </tr>

        <tr>
            <th colspan="8">4A - Taxable outward supplies made to registered persons(other than reverse charge supplies) - B2B Regular</th>
        </tr>
        <tr>
            <td>Total</td>
            <td>${round(table4A?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table4A?.txval) ?? "-"}</td>
            <td>${round(table4A?.iamt) ?? "-"}</td>
            <td>${round(table4A?.camt) ?? "-"}</td>
            <td>${round(table4A?.samt) ?? "-"}</td>
            <td>${round(table4A?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">4B - Taxable outward supplies made to registered persons attracting tax on reverse charge - B2B Reverse charge</th>
        </tr>
        <tr>
            <td>Total</td>
            <td>${round(table4B?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table4B?.txval) ?? "-"}</td>
            <td>${round(table4B?.iamt) ?? "-"}</td>
            <td>${round(table4B?.camt) ?? "-"}</td>
            <td>${round(table4B?.samt) ?? "-"}</td>
            <td>${round(table4B?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">5A - Taxable outward inter-state supplies made to unregistered persons ( where invoice value is more than Rs 2.5 lakh ) - B2C (Large)</th>
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
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">6A - Exports (with/without payment)</th>
        </tr>
        <tr>
            <td>Total</td>
            <td>${round(table6A?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table6A?.txval) ?? "-"}</td>
            <td>${round(table6A?.iamt) ?? "-"}</td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td>${round(table6A?.csamt) ?? "-"}</td>
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
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">6B - Supplies made to SEZ unit or SEZ developer SEZWP/SEZWOP</th>
        </tr>
        <tr>
            <td>Total</td>
            <td>${round(table6B?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table6B?.txval) ?? "-"}</td>
            <td>${round(table6B?.iamt) ?? "-"}</td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td>${round(table6B?.csamt) ?? "-"}</td>
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
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">6C - Deemed Exports - DE</th>
        </tr>
        <tr>
            <td>Total</td>
            <td>${round(table6C?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table6C?.txval) ?? "-"}</td>
            <td>${round(table6C?.iamt) ?? "-"}</td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td>${round(table6C?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">7 - Taxable supplies (Net of debt and credit noter) to unregistered persons (other then the supplies covered in Table 5) - B2CS (Others)</th>
        </tr>
    </table>

    <br/><br/><br/><br/><br/>

    <table>
        <tr>
            <th style="width: 30%;">Desciption</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (<span>&#8377;</span>)</th>
            <th>Integrated Tax (<span>&#8377;</span>)</th>
            <th>Central Tax (<span>&#8377;</span>)</th>
            <th>State/UT Tax (<span>&#8377;</span>)</th>
            <th>Cast Tax (<span>&#8377;</span>)</th>
        </tr>
        <tr>
            <td>Total</td>
            <td>${round(table7?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table7?.txval) ?? "-"}</td>
            <td>${round(table7?.iamt) ?? "-"}</td>
            <td>${round(table7?.camt) ?? "-"}</td>
            <td>${round(table7?.samt) ?? "-"}</td>
            <td>${round(table7?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">8 - Nil rated exempted and non GST outward supplies</th>
        </tr>
        <tr>
            <td colspan="3">Total</td>
            <td>${round(table8?.nil_amt + table8?.expt_amt + table8?.ngsup_amt) ?? "-"}</td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td class="n-a"></td>
        </tr>
        <tr>
            <td colspan="3">- Nil</td>
            <td>${round(table8?.nil_amt) ?? "-"}</td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td class="n-a"></td>
        </tr>
        <tr>
            <td colspan="3">- Exempted</td>
            <td>${round(table8?.expt_amt) ?? "-"}</td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td class="n-a"></td>
        </tr>
        <tr>
            <td colspan="3">- Non-GST</td>
            <td>${round(table8?.ngsup_amt) ?? "-"}</td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td class="n-a"></td>
            <td class="n-a"></td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">9A - Amendment to taxable outward supplies made to registered person in returns of earlier tax periods in table 4 - B2B Regular</th>
        </tr>
        <tr>
            <td>Amended amount - Total</td>
            <td>${round(table9A_1?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9A_1?.txval) ?? "-"}</td>
            <td>${round(table9A_1?.iamt) ?? "-"}</td>
            <td>${round(table9A_1?.camt) ?? "-"}</td>
            <td>${round(table9A_1?.samt) ?? "-"}</td>
            <td>${round(table9A_1?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td>Net differential amount (Amended - Original)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">9A - Amendment to taxable outward supplies made to registered person in returns of earlier tax periods in table 4 - B2B Reverse charge</th>
        </tr>
        <tr>
            <td>Amended amount - Total</td>
            <td>${round(table9A_2?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9A_2?.txval) ?? "-"}</td>
            <td>${round(table9A_2?.iamt) ?? "-"}</td>
            <td>${round(table9A_2?.camt) ?? "-"}</td>
            <td>${round(table9A_2?.samt) ?? "-"}</td>
            <td>${round(table9A_2?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td>Net differential amount (Amended - Original)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">9A - Amendment to Inter State made to unregistered person (where invoice value is more than Rs 2.5 lakh) in returns of earlier tax periods in table 5 - B2C (Large)</th>
        </tr>
        <tr>
            <td>Amended amount - Total</td>
            <td>${round(table9A_3?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9A_3?.txval) ?? "-"}</td>
            <td>${round(table9A_3?.iamt) ?? "-"}</td>
            <td>${round(table9A_3?.camt) ?? "-"}</td>
            <td>${round(table9A_3?.samt) ?? "-"}</td>
            <td>${round(table9A_3?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td>Net differential amount (Amended - Original)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">9A - Amendment to Export supplies in returns of earlier tax periods in table 5A (EXPWP/EXPWOP)</th>
        </tr>
        <tr>
            <td>Amended amount - Total</td>
            <td>${round(table9A_4?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9A_4?.txval) ?? "-"}</td>
            <td>${round(table9A_4?.iamt) ?? "-"}</td>
            <td>${round(table9A_4?.camt) ?? "-"}</td>
            <td>${round(table9A_4?.samt) ?? "-"}</td>
            <td>${round(table9A_4?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td>Net differential amount (Amended - Original) - Total</td>
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
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">9A - Amendment to supplies made to SEZ units or SEZ developers in returns of earlier tax periods in table 6B (SEZWP/SEZWOP)</th>
        </tr>
        <tr>
            <td>Amended amount - Total</td>
            <td>${round(table9A_5?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9A_5?.txval) ?? "-"}</td>
            <td>${round(table9A_5?.iamt) ?? "-"}</td>
            <td>${round(table9A_5?.camt) ?? "-"}</td>
            <td>${round(table9A_5?.samt) ?? "-"}</td>
            <td>${round(table9A_5?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td>Net differential amount (Amended - Original) - Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
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
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">9A - Amendment to Deemed Exports in returns of earlier tax periods in table 6C(DE)</th>
        </tr>
        <tr>
            <td>Amended amount - Total</td>
            <td>${round(table9A_6?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9A_6?.txval) ?? "-"}</td>
            <td>${round(table9A_6?.iamt) ?? "-"}</td>
            <td>${round(table9A_6?.camt) ?? "-"}</td>
            <td>${round(table9A_6?.samt) ?? "-"}</td>
            <td>${round(table9A_6?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td>Net differential amount (Amended - Original)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">9B - Credit/Debit Notes(Registered) - CDNR</th>
        </tr>
    </table>

    <br/><br/><br/><br/><br/><br/><br/><br/>

    <table>
        <tr>
            <th style="width: 30%;">Desciption</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (<span>&#8377;</span>)</th>
            <th>Integrated Tax (<span>&#8377;</span>)</th>
            <th>Central Tax (<span>&#8377;</span>)</th>
            <th>State/UT Tax (<span>&#8377;</span>)</th>
            <th>Cast Tax (<span>&#8377;</span>)</th>
        </tr>
        <tr>
            <td>Net Total (Debit notes - Credit notes)</td>
            <td>${round(table9B_1?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9B_1?.txval) ?? "-"}</td>
            <td>${round(table9B_1?.iamt) ?? "-"}</td>
            <td>${round(table9B_1?.camt) ?? "-"}</td>
            <td>${round(table9B_1?.samt) ?? "-"}</td>
            <td>${round(table9B_1?.csamt) ?? "-"}</td>
        </tr>

        <tr>
            <td colspan="8">Credit/Debit notes issued to registered person for taxable outward supplies in table 4 other than table 6 - B2B Regular</td>
        </tr>
        <tr>
            <td>Total - Net off debit/credit notes (Debit notes - Credit notes)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td colspan="8">Credit/Debit notes issued to registered person for taxable outward supplies in table 4 other than table 6 - B2B Reverse charge</td>
        </tr>
        <tr>
            <td>Net Total (Debit notes - Credit notes)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td colspan="8">Credit/Debit notes issued to registered person for taxable outward supplies in table 6B - SEZWP/SEZWOP</td>
        </tr>
        <tr>
            <td>Net Total (Debit notes - Credit notes)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td colspan="8">Credit/Debit notes issued to registered person for taxable outward supplies in table 6C - DE</td>
        </tr>
        <tr>
            <td>Net Total (Debit notes - Credit notes)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">9B - Credit/Debit Notes (Unregistered) - CDNUR</th>
        </tr>
        <tr>
            <td>Total - Net off debit/credit notes (Debit notes - Credit notes)</td>
            <td>${round(table9B_2?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9B_2?.txval) ?? "-"}</td>
            <td>${round(table9B_2?.iamt) ?? "-"}</td>
            <td>${round(table9B_2?.camt) ?? "-"}</td>
            <td>${round(table9B_2?.samt) ?? "-"}</td>
            <td>${round(table9B_2?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td colspan="8">Unregistered Type</td>
        </tr>
        <tr>
            <td>- B2CL</td>
            <td>${round(table9B_2?.B2CL?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9B_2?.B2CL?.txval) ?? "-"}</td>
            <td>${round(table9B_2?.B2CL?.iamt) ?? "-"}</td>
            <td>${round(table9B_2?.B2CL?.camt) ?? "-"}</td>
            <td>${round(table9B_2?.B2CL?.samt) ?? "-"}</td>
            <td>${round(table9B_2?.B2CL?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td>- EXPWP</td>
            <td>${round(table9B_2?.EXPWP?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9B_2?.EXPWP?.txval) ?? "-"}</td>
            <td>${round(table9B_2?.EXPWP?.iamt) ?? "-"}</td>
            <td>${round(table9B_2?.EXPWP?.camt) ?? "-"}</td>
            <td>${round(table9B_2?.EXPWP?.samt) ?? "-"}</td>
            <td>${round(table9B_2?.EXPWP?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td>- EXPWOP</td>
            <td>${round(table9B_2?.EXPWOP?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9B_2?.EXPWOP?.txval) ?? "-"}</td>
            <td>${round(table9B_2?.EXPWOP?.iamt) ?? "-"}</td>
            <td>${round(table9B_2?.EXPWOP?.camt) ?? "-"}</td>
            <td>${round(table9B_2?.EXPWOP?.samt) ?? "-"}</td>
            <td>${round(table9B_2?.EXPWOP?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">9C - Amended Credit/Debit Notes(Registered) - CDNRA</th>
        </tr>
        <tr>
            <td>Amended amount Total</td>
            <td>${round(table9C_1?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9C_1?.txval) ?? "-"}</td>
            <td>${round(table9C_1?.iamt) ?? "-"}</td>
            <td>${round(table9C_1?.camt) ?? "-"}</td>
            <td>${round(table9C_1?.samt) ?? "-"}</td>
            <td>${round(table9C_1?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td>Net Differential amount (Net Amended Debit notes - Net Amended Credit notes) - Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td colspan="8">Amended Credit/Debit notes issued to registered person for taxable outward supplies in table 4 other than table 6 - B2B Regular</td>
        </tr>
        <tr>
            <td>Net total (Net Amended Debit notes - Net Amended Credit notes)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td colspan="8">Amended Credit/Debit notes issued to registered person for taxable outward supplies in table 4 other than table 6 - B2B Reverse charge</td>
        </tr>
        <tr>
            <td>Net Total (Net Amended Debit notes - Net Amended Credit notes)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td colspan="8">Amended Credit/Debit notes issued to registered person for taxable outward supplies in table 6B - SEZWP/SEZWOP</td>
        </tr>
        <tr>
            <td>Net Total (Net Amended Debit notes - Net Amended Credit notes)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>

        <tr>
            <td colspan="8">Amended Credit/Debit notes issued to registered person for taxable outward supplies in table 6C - DE</td>
        </tr>
        <tr>
            <td>Net Total (Net Amended Debit notes - Net Amended Credit notes)</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">9C - Amended Credit/Debit Notes(Unregistered) - CDNURA</th>
        </tr>
        <tr>
            <td>Amended amount - Total</td>
            <td>${round(table9C_2?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table9C_2?.txval) ?? "-"}</td>
            <td>${round(table9C_2?.iamt) ?? "-"}</td>
            <td>${round(table9C_2?.camt) ?? "-"}</td>
            <td>${round(table9C_2?.samt) ?? "-"}</td>
            <td>${round(table9C_2?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td>Net Differential amount (Net Amended Debit notes - Net Amended Credit notes) - Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="8">Unregistered Type</td>
        </tr>
    </table>

    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

    <table>
        <tr>
            <th style="width: 30%;">Desciption</th>
            <th>No. of records</th>
            <th>Document Type</th>
            <th>Value (<span>&#8377;</span>)</th>
            <th>Integrated Tax (<span>&#8377;</span>)</th>
            <th>Central Tax (<span>&#8377;</span>)</th>
            <th>State/UT Tax (<span>&#8377;</span>)</th>
            <th>Cast Tax (<span>&#8377;</span>)</th>
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
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">10 - Amendment to taxable outward supplies made to unregistered persons in returns for earlier tax periods in table 7 - B2C (Others)</th>
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
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">11A(1),11A(2) - Advance received for which invoice has not been issued (tax amount to be added to the output tax liability)(Net of refund vouchers)</th>
        </tr>
        <tr>
            <td>Total</td>
            <td>${round(table11_A_1?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table11_A_1?.txval) ?? "-"}</td>
            <td>${round(table11_A_1?.iamt) ?? "-"}</td>
            <td>${round(table11_A_1?.camt) ?? "-"}</td>
            <td>${round(table11_A_1?.samt) ?? "-"}</td>
            <td>${round(table11_A_1?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">11B(1), 11B(2) - Advance amount received in earlier tax period and adjusted against the supplies being shown in this tax period in Table Nos 4,5,6 and 7</th>
        </tr>
        <tr>
            <td>Total</td>
            <td>${round(table11_B_2?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table11_B_2?.txval) ?? "-"}</td>
            <td>${round(table11_B_2?.iamt) ?? "-"}</td>
            <td>${round(table11_B_2?.camt) ?? "-"}</td>
            <td>${round(table11_B_2?.samt) ?? "-"}</td>
            <td>${round(table11_B_2?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">11A - Amendment to advances received in returns for earlier tax periods in table 11A(1), 11A(2)</th>
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
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">11B - Amendment to advances received in returns for earlier tax periods in table 11B(1), 11B(2)</th>
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
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="8">12 - HSN wise summary of outward supplies</th>
        </tr>
        <tr>
            <td>Total</td>
            <td>${round(table12?.numberOfRecords) ?? "-"}</td>
            <td>Invoice</td>
            <td>${round(table12?.txval) ?? "-"}</td>
            <td>${round(table12?.iamt) ?? "-"}</td>
            <td>${round(table12?.camt) ?? "-"}</td>
            <td>${round(table12?.samt) ?? "-"}</td>
            <td>${round(table12?.csamt) ?? "-"}</td>
        </tr>
        <tr>
            <td colspan="8"><br/></td>
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
            <td colspan="8"><br/></td>
        </tr>

        <tr>
            <th colspan="3">Total Liability Outward supplies other than Reverse charge</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
    </table>

    <br/>
    <p>Verification:<br/>
    I hereby solemnly affirm and declare that the information given herein above is true and correct to the best of my knowledge belief and nothing has been concealed there from and in case of any reduction in output tax liability the benefit thereof has been/will be passed on to the recipient of supply.<br/>
    <br/>
    Date:<br/>
    Signature<br/>
    Name of Authorized Signatory<br/>
    <br/>
    Designaion/Status: <br/>
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
    });
  }, [tableData]);
  return <StyledIframe ref={iframeContainer} src={iFrameSrc} />;
}
