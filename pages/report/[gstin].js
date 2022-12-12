import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
// import styles from "../styles/Home.module.css";
import config from "../../config";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const { backendURL } = config;

const DynamicGSTR9 = dynamic(() => import("../../components/gstr9"), {
  ssr: false,
});

async function getGSTR9Data(gstin, callback) {
  let res = await fetch(`${backendURL}/api/v1/r9?GSTIN=${gstin}`);
  let data = await res.json();
  callback(data.data);
}

export default function GSTSummary() {
  let router = useRouter();

  const { gstin } = router.query;
  console.log({ gstin });

  let [GSTR9Data, setGSTR9Data] = useState(null);
  useEffect(() => {
    if (gstin) {
      getGSTR9Data(gstin, setGSTR9Data);
    }
  }, [gstin]);
  return (
    <section>
      {/* <button onClick={() => file.print()}>Print PDF</button>
      <button onClick={() => file.download()}>Download PDF</button>
      <button onClick={() => file.open()}>Open PDF</button> */}
      {GSTR9Data ? <DynamicGSTR9 tableData={GSTR9Data} /> : ""}
      {/* <GSTR9 /> */}
    </section>
  );
}
