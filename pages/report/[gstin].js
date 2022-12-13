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

export default function GSTSummary() {
  let router = useRouter();

  const { gstin } = router.query;
  console.log({ gstin });

  let [GSTR9Data, setGSTR9Data] = useState(null);
  let [GSTR3BData, setGSTR3BData] = useState(null);
  useEffect(() => {
    if (gstin) {
      getGSTR9Data(gstin, setGSTR9Data);
      getGSTR3BData(gstin, setGSTR3BData);
    }
  }, [gstin]);
  return (
    <StyledSection>
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
