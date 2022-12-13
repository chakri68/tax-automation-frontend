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

function processData(json) {
  let res = {};
  Object.keys(json).map((key) => {
    if (key.startsWith("table") || key === "tax_pay") {
      res[key] = JSON.parse(json[key]);
    } else {
      res[key] = json[key];
    }
  });
  return res;
}
function jsonparse(json) {
  return JSON.parse(json);
}

export default function GSTR3B({ tableData }) {
  const data = processData(tableData);
  let {
    Id,
    gstin,
    ret_period,
    fil_dt,
    qn,
    sup_details,
    sup_inter,
    itc_elg,
    inward_sup,
    intr_ltfee,
    tax_pmt,
    EntryDate,
    FileURL,
    IsFiltered,
    FileId,
    CompiledTurnOver,
    MainJSON,
  } = data;

  let intr_ltfeeJSON = jsonparse(intr_ltfee);
  let sup_detailsJSON = jsonparse(sup_details);
  let inward_supJSON = jsonparse(inward_sup);
  let itc_elgJSON = jsonparse(itc_elg);

  // Null values
  let tax_pmtJSON = jsonparse(tax_pmt);
  let sup_interJSON = jsonparse(sup_inter);
  console.log(data);

  let [iFrameSrc, setIFrameSrc] = useState("");
  var html = htmlToPdfmake(
    `<div>
  <p style="font-size: 20px; font-weight: bold; text-align: center">
    Form GSTR-3b
  </p>

  <p style="text-align: center">[See rule 61(5)]</p>
  <table>
    <tr>
      <td style="width: 150px; font-weight: bold">Year</td>
      <td style="width: 150px"></td>
    </tr>
    <tr>
      <td style="width: 150px; font-weight: bold">Period</td>
      <td style="width: 150px"></td>
    </tr>
  </table>

  <table>
    <tr>
      <th style="width: 50%">1. GSTIN</th>
      <td style="width: 50%">${gstin}</td>
    </tr>
    <tr>
      <th style="width: 50%">2(a). Legal name of the registered person</th>
      <td style="width: 50%"></td>
    </tr>
    <tr>
      <th style="width: 50%">2(b). Trade name, if any</th>
      <td style="width: 50%"></td>
    </tr>
    <tr>
      <th style="width: 50%">2(c). ARN</th>
      <td style="width: 50%"></td>
    </tr>
    <tr>
      <th style="width: 50%">2(d). Date of ARN</th>
      <td style="width: 50%"></td>
    </tr>
  </table>

  <h6>
    3.1 Details of Outward supplies and inward supplies liable to reverse charge
    (other than those covered by Table 3.1.1)
  </h6>
  <table>
    <tr>
      <th style="width: 50%">Nature of Supplies</th>
      <th style="width: auto">Total taxable value</th>
      <th style="width: auto">Integrated tax</th>
      <th style="width: auto">Central tax</th>
      <th style="width: auto">State/UT tax</th>
      <th style="width: auto">Cess</th>
    </tr>
    <tr>
      <td>
        (a) Outward taxable supplies (other than zero rated, nil rated and
        exempted)
      </td>
      <td>${sup_detailsJSON?.osup_det?.txval ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_det?.iamt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_det?.camt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_det?.samt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_det?.csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>(b) Outward taxable supplies (zero rated)</td>
      <td>${sup_detailsJSON?.osup_zero?.txval ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_zero?.iamt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_zero?.camt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_zero?.samt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_zero?.csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>(c) Other outward supplies (nil rated, exempted)</td>
      <td>${sup_detailsJSON?.osup_nil_exmp?.txval ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_nil_exmp?.iamt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_nil_exmp?.camt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_nil_exmp?.samt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_nil_exmp?.csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>(d) Inward supplies (liable to reverse charge)</td>
      <td>${sup_detailsJSON?.isup_rev?.txval ?? "-"}</td>
      <td>${sup_detailsJSON?.isup_rev?.iamt ?? "-"}</td>
      <td>${sup_detailsJSON?.isup_rev?.camt ?? "-"}</td>
      <td>${sup_detailsJSON?.isup_rev?.samt ?? "-"}</td>
      <td>${sup_detailsJSON?.isup_rev?.csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>(e) Non-GST outward Suppl</td>
      <td>${sup_detailsJSON?.osup_nongst?.txval ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_nongst?.iamt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_nongst?.camt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_nongst?.samt ?? "-"}</td>
      <td>${sup_detailsJSON?.osup_nongst?.csamt ?? "-"}</td>
    </tr>
  </table>

  <h6>
    3.1.1 Details of Supplies notified under section 9(5) of the CGST Act, 2017
    and corresponding provisions in IGST/UTGST/SGST Acts
  </h6>
  <table>
    <tr>
      <th style="width: 50%">Nature of Supplies</th>
      <th style="width: auto">Total taxable value</th>
      <th style="width: auto">Integrated tax</th>
      <th style="width: auto">Central tax</th>
      <th style="width: auto">State/UT tax</th>
      <th style="width: auto">Cess</th>
    </tr>
    <tr>
      <td>
        (i) Taxable supplies on which electronic commerce operator pays tax u/s
        9(5) [to be be furnished by electronic commerce operator]
      </td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>
        (ii) Taxable supplies made by registered person through electronic
        commerce operator, on which electronic commerce operator is required to
        pay tax u/s 9(5) [to be furnished by registered person making.supplies
        through electronic commerce operator]
      </td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
  </table>

  <h6>
    3.2 Out of supplies made in 3.1 (a) and 3.1.1 (i), details of inter-state
    supplies made
  </h6>
  <table>
    <tr>
      <th style="width: 34%">Nature of Supplies</th>
      <th style="width: 33%">Total taxable value</th>
      <th style="width: 33%">Integrated tax</th>
    </tr>
    <tr>
      <td>Supplies made to Unregistered Persons</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>Supplies made to Composition Taxable Persons</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>Supplies made to UIN holders</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
  </table>

  <h6>4. Eligible ITC</h6>
  <table>
    <tr>
      <th style="width: 50%">Details</th>
      <th style="width: auto">Integrated tax</th>
      <th style="width: auto">Central tax</th>
      <th style="width: auto">State/UT tax</th>
      <th style="width: auto">Cess</th>
    </tr>
    <tr>
      <td><strong>A. ITC Available (whether in full or part)</strong></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>(1) Import of goods</td>
      <td>${itc_elgJSON?.itc_avl[0]?.iamt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[0]?.camt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[0]?.samt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[0]?.csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>(2) Import of services</td>
      <td>${itc_elgJSON?.itc_avl[1]?.iamt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[1]?.camt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[1]?.samt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[1]?.csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>
        (3) Inward supplies liable to reverse charge (other than 1 & 2 above)
      </td>
      <td>${itc_elgJSON?.itc_avl[2]?.iamt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[2]?.camt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[2]?.samt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[2]?.csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>(4) Inward supplies from ISD</td>
      <td>${itc_elgJSON?.itc_avl[3]?.iamt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[3]?.camt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[3]?.samt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[3]?.csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>(5) All other ITC</td>
      <td>${itc_elgJSON?.itc_avl[4]?.iamt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[4]?.camt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[4]?.samt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_avl[4]?.csamt ?? "-"}</td>
    </tr>

    <tr>
      <td><strong>B. ITC Reversed</strong></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>(1) As per rules 28,42 & 43 of CGST Rules and section 17(5)</td>
      <td>${itc_elgJSON?.itc_rev[0].iamt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_rev[0].camt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_rev[0].samt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_rev[0].csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>(2) Others</td>
      <td>${itc_elgJSON?.itc_rev[1].iamt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_rev[1].camt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_rev[1].samt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_rev[1].csamt ?? "-"}</td>
    </tr>

    <tr>
      <td><strong>C. Net ITC available (A-B)</strong></td>
      <td>${itc_elgJSON?.itc_net.iamt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_net.camt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_net.samt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_net.csamt ?? "-"}</td>
    </tr>

    <tr>
      <td><strong>(D) Other Details</strong></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>
        (1) ITC reclaimed which was reversed under Table 4(B)(2) in earlier tax
        period
      </td>
      <td>${itc_elgJSON?.itc_inelg[0].iamt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_inelg[0].camt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_inelg[0].samt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_inelg[0].csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>
        (2) Ineligible ITC under section 16(a) & 11 restricted due to PoS rules
      </td>
      <td>${itc_elgJSON?.itc_inelg[1].iamt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_inelg[1].camt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_inelg[1].samt ?? "-"}</td>
      <td>${itc_elgJSON?.itc_inelg[1].csamt ?? "-"}</td>
    </tr>
  </table>

    <h6>5. Values of exempt, nil-rated and non-GST inward supplies</h6>
    <table>
        <tr>
            <th style="width:50%">Nature of Supplies</td>
            <th style="width:auto">Inter-State supplies</th>
            <th style="width:auto">Intra-State supplies</th>
        </tr>
        <tr>
            <td>From a supplier under composition scheme, Exempt, Nil rated supply</td>
            <td>${inward_supJSON?.isup_details[0]?.inter ?? "-"}</td>
            <td>${inward_supJSON?.isup_details[0]?.intra ?? "-"}</td>
        </tr>
        <tr>
            <td>Non GST supply</td>
            <td>${inward_supJSON?.isup_details[1]?.inter ?? "-"}</td>
            <td>${inward_supJSON?.isup_details[1]?.intra ?? "-"}</td>
        </tr>
    </table>

  <h6>5.1 Interest and Late fee for previous tax period</h6>
  <table>
    <tr>
      <th style="width: 20%">Details</th>
      <th style="width: 20%">Integrated tax</th>
      <th style="width: 20%">Central tax</th>
      <th style="width: 20%">State/UT tax</th>
      <th style="width: 20%">Cess</th>
    </tr>
    <tr>
      <td>System computed Interest</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Interest Paid</td>
      <td>${intr_ltfeeJSON?.intr_details?.iamt ?? "-"}</td>
      <td>${intr_ltfeeJSON?.intr_details?.camt ?? "-"}</td>
      <td>${intr_ltfeeJSON?.intr_details?.samt ?? "-"}</td>
      <td>${intr_ltfeeJSON?.intr_details?.csamt ?? "-"}</td>
    </tr>
    <tr>
      <td>Late fee</td>
      <td>${intr_ltfeeJSON?.ltfee_details?.iamt ?? "-"}</td>
      <td>${intr_ltfeeJSON?.ltfee_details?.camt ?? "-"}</td>
      <td>${intr_ltfeeJSON?.ltfee_details?.samt ?? "-"}</td>
      <td>${intr_ltfeeJSON?.ltfee_details?.csamt ?? "-"}</td>
    </tr>
  </table>

  <h6>Payment of tax</h6>
  <table>
    <tr>
      <th rowspan="2">Description</th>
      <th rowspan="2">Total tax payable</th>
      <th colspan="4">Tax paid through ITC</th>
      <th rowspan="2">Tax paid in cash</th>
      <th rowspan="2">Interest paid in cash</th>
      <th rowspan="2">Late free paid in cash</th>
    </tr>
    <tr>
      <th><strong>Integrated tax</strong></th>
      <th><strong>Central tax</strong></th>
      <th><strong>State/UT tax</strong></th>
      <th><strong>Cess tax</strong></th>
    </tr>
    <tr>
      <th colspan="9"><strong>(A) Other than reverse charge</strong></th>
    </tr>
    <tr>
      <td>Integrated tax</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>Central tax</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>State/UT tax</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>Cess</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <th colspan="9"><strong>(B) Reverse charge</strong></th>
    </tr>
    <tr>
      <td>Integrated tax</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>Central tax</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>State/UT tax</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
    <tr>
      <td>Cess</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
  </table>

  <h6>Breakup of tax liability declared (for interest computation)</h6>
  <table>
    <tr>
      <th style="width: 20%">Period</th>
      <th style="width: 20%">Integrated tax</th>
      <th style="width: 20%">Central tax</th>
      <th style="width: 20%">State/UT tax</th>
      <th style="width: 20%">Cess</th>
    </tr>
    <tr>
      <td>September 2022</td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
      <td class="n-a"></td>
    </tr>
  </table>

  <h6>Verification:</h6>
  <p>
    I hereby solemnly affirm and declare that the information given herein above
    is true and correct to the best of my knowledge and belief and nothing has
    been concealed there from
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
