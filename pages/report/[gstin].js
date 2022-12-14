import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
// import styles from "../styles/Home.module.css";
import config from "../../config";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Card, Dimmer, Header, Loader, Segment } from "semantic-ui-react";
import { styled } from "@stitches/react";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const { backendURL } = config;

const StyledSection = styled("section", {
  padding: "10px",
  marginTop: "20px",
});

const PDFSegment = styled(Segment, {
  margin: "auto",
  width: "600px",
  // aspectRatio: "1 / 1.414",
  aspectRatio: "1",
});

const DynamicGSTR9 = dynamic(() => import("../../components/gstr9"), {
  ssr: false,
});
const DynamicGSTR3B = dynamic(() => import("../../components/gstr3b"), {
  ssr: false,
});
const DynamicGSTR1 = dynamic(() => import("../../components/gstr1"), {
  ssr: false,
});

async function getGSTR9Data(gstin, callback) {
  let res = await fetch(`${backendURL}/api/v1/r9?GSTIN=${gstin}`);
  let data = await res.json();
  callback(data.data);
}

async function getGSTR3BData(gstin, callback) {
  let res = await fetch(`${backendURL}/api/v1/r3b?GSTIN=${gstin}`);
  let data = await res.json();
  callback(data.data);
}

async function getGSTR1Data(gstin, callback) {
  let res1 = await fetch(`${backendURL}/api/v1/r1?GSTIN=${gstin}`);
  let res2 = await fetch(`${backendURL}/api/v1/r12?GSTIN=${gstin}`);
  let data1 = await res1.json();
  let data2 = await res2.json();
  let data = {...(data1.data),...(data2.data)};
  callback(data);
}

export default function GSTSummary() {
  let router = useRouter();

  const { gstin } = router.query;

  let [GSTR1Data, setGSTR1Data] = useState(null);
  let [GSTR12Data, setGSTR12Data] = useState(null);
  let [GSTR9Data, setGSTR9Data] = useState(null);
  let [GSTR3BData, setGSTR3BData] = useState(null);
  useEffect(() => {
    if (gstin) {
      getGSTR1Data(gstin, setGSTR1Data);
      getGSTR9Data(gstin, setGSTR9Data);
      getGSTR3BData(gstin, setGSTR3BData);
    }
  }, [gstin]);
  return (
    <StyledSection>
      <PDFSegment>
        {GSTR1Data ? (
          <>
            <Header as="h3">GSTR-1</Header>
            <DynamicGSTR1 tableData={GSTR1Data} gstin={gstin}/>
          </>
        ) : (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </PDFSegment>
      <PDFSegment>
        {GSTR3BData ? (
          <>
            <Header as="h3">GSTR-3B</Header>
            <DynamicGSTR3B tableData={GSTR3BData} />
          </>
        ) : (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </PDFSegment>
      <PDFSegment>
        {GSTR9Data ? (
          <>
            <Header as="h3">GSTR-9</Header>
            <DynamicGSTR9 tableData={GSTR9Data} />
          </>
        ) : (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </PDFSegment>
    </StyledSection>
  );
}
