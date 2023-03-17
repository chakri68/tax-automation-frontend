import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Icon, Message } from "semantic-ui-react";
import Navbar from "../../components/Navbar.js";
import config from "../../config";

import { styled } from "@stitches/react";
import dynamic from "next/dynamic";
import Head from "next/head.js";
import { useRouter } from "next/router";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Dimmer,
  Header,
  Loader,
  Modal,
  Segment,
} from "semantic-ui-react";
import ErrorModal from "../../components/ErrorModal.js";
import Footer from "../../components/Footer.js";
import Protected from "../../components/ProtectedComponent.js";
import { AuthContext } from "../../contexts/authContext.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const { backendURL } = config;

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const StyledSection = styled("section", {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  alignContent: "center",
  justifyContent: "space-around",
  alignItems: "center",
  padding: "10px",
  marginTop: "20px",
});

const PDFSegment = styled(Segment, {
  margin: "auto",
  width: "600px",
  aspectRatio: "1 / 1.414",
});

const DynamicReport = dynamic(() => import("../../components/report"), {
  ssr: false,
});

async function getReportData(gstin, postData, callback) {
  let res = await fetch(`/api/report?gstin=${gstin}`, {
    method: "POST",
    body: JSON.stringify(postData),
  });
  let data = await res.json();
  if (!data.success) {
    callback(null, data.error);
    return;
  }
  callback(data.data);
}

export default function GSTSummary() {
  let [pdfMakeGSTR1, setPdfMakeGSTR1] = useState(null);
  let [pdfMakeGSTR3b, setPdfMakeGSTR3b] = useState(null);
  let [pdfMakeGSTR9, setPdfMakeGSTR9] = useState(null);
  let [pdfUrl, setPdfUrl] = useState(null);
  let [open, setOpen] = React.useState(false);
  let [files, setFiles] = useState([]);
  let [fileReading, setFileReading] = useState(false);
  let [bufferData, setBuffferData] = useState([]);
  let [errorState, setErrorState] = useState({ error: false, message: null });
  let [warningModalOpen, setWarningModalOpen] = useState(true);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open: selectFiles,
  } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    accept: {
      "application/pdf": [],
      // "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      //   [],
    },
  });

  const dropboxStyles = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  function handleDownload() {
    let element = document.createElement("a");
    element.setAttribute("href", pdfUrl);
    element.setAttribute("download", `${gstin.toUpperCase()}_17-18.pdf`);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  async function handleFiles() {
    let remarksData = [];
    files.forEach((file, ind) => {
      if (file.name == remarksData[ind]?.file?.name) return;
      const reader = new FileReader();

      reader.onabort = () =>
        console.log(`${file.name} file reading was aborted`);
      reader.onerror = () =>
        console.log(`${file.name} file reading has failed`);
      reader.onload = () => {
        const binaryStr = reader.result;
        console.log(binaryStr);
        remarksData.push({ file, arrayBuffer: binaryStr });
        if (remarksData.length == files.length) {
          setBuffferData(remarksData);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  let router = useRouter();

  const { gstin } = router.query;

  let [GSTR1Data, setGSTR1Data] = useState(null);
  let [GSTR9Data, setGSTR9Data] = useState(null);
  let [GSTR3BData, setGSTR3BData] = useState(null);
  let [reportData, setReportData] = useState(null);
  let [warnings, setWarnings] = useState([]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (gstin) {
      getReportData(
        gstin,
        { gstin, token: authContext.authState.token },
        (data, error = null) => {
          if (error) {
            setErrorState({ error: true, message: error });
            return;
          }
          setReportData(data.Report);
          setGSTR1Data(data.R1Data);
          setGSTR3BData(data.R3Data);
          setGSTR9Data(data.R9Data);
          setWarnings(data.warnings);
        }
      );
    }
  }, [authContext, gstin]);
  return (
    <>
      <Head>
        <title>Report | {gstin}</title>
      </Head>
      <Protected>
        <Navbar />
        <ErrorModal
          open={errorState.error}
          toggleOpen={(open) => setErrorState({ ...errorState, error: open })}
          onExit={router.reload}
        >
          <p>{errorState.message}</p>
        </ErrorModal>
        <StyledSection>
          <PDFSegment raised>
            <Header as="h3" color="teal" textAlign="center">
              Generated Report
            </Header>
            {warnings.length > 0 ? (
              <>
                <Message negative>
                  <Message.Header>Missing Data</Message.Header>
                  <p>
                    This gstin has some missing data. Click{" "}
                    <Button
                      compact
                      size="small"
                      onClick={() => setWarningModalOpen(true)}
                    >
                      here
                    </Button>{" "}
                    for more details
                  </p>
                </Message>
                <Modal
                  basic
                  closeOnDimmerClick={false}
                  open={warningModalOpen}
                  onOpen={() => setWarningModalOpen(true)}
                  onClose={() => setWarningModalOpen(false)}
                >
                  <Header
                    color="orange"
                    icon="warning sign"
                    content="Missing Data"
                  />
                  <Modal.Content>
                    {warnings.map(({ table, message }, ind) => {
                      return <h2 key={ind}>{`${table}: ${message}`}</h2>;
                    })}
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      color="orange"
                      onClick={() => setWarningModalOpen(false)}
                    >
                      Ok
                    </Button>
                  </Modal.Actions>
                </Modal>
              </>
            ) : (
              ""
            )}
            {reportData != null && fileReading != true ? (
              <>
                <Button
                  fluid
                  disabled={pdfUrl == null}
                  onClick={() => window.open(pdfUrl)}
                >
                  Open In New Tab
                </Button>
                <Modal
                  onClose={() => setOpen(false)}
                  onOpen={() => setOpen(true)}
                  open={open}
                  trigger={
                    <Button
                      style={{ margin: "3px 0px" }}
                      fluid
                      disabled={pdfUrl == null}
                    >
                      Add Remarks
                    </Button>
                  }
                >
                  <Modal.Header>Select a pdf document</Modal.Header>
                  <Modal.Content>
                    <Segment
                      placeholder
                      style={{
                        width: "100%",
                      }}
                      {...getRootProps({ style: dropboxStyles })}
                    >
                      <Header icon>
                        <Icon name="file pdf outline" />
                        {files.length > 0
                          ? ""
                          : "No pdf documents are listed for this gstin."}
                      </Header>
                      <Button
                        primary
                        content={
                          files.length > 0 ? "Add document" : "Choose Document"
                        }
                        labelPosition="left"
                        icon="file pdf outline"
                        onClick={selectFiles}
                      />
                      <input {...getInputProps()} />
                      {files.length > 0 ? (
                        <p style={{ marginTop: "1.5rem" }}>
                          Files Selected:{" "}
                          <em>{files.map((file) => file.name).join(", ")}</em>
                        </p>
                      ) : (
                        ""
                      )}
                    </Segment>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      color="black"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      content="Clear Files"
                      labelPosition="right"
                      icon="delete"
                      onClick={() => {
                        setFiles([]);
                        setBuffferData([]);
                      }}
                      negative
                    />
                    <Button
                      content="Done"
                      labelPosition="right"
                      icon="checkmark"
                      onClick={async () => {
                        setFileReading(true);
                        await handleFiles();
                        setFileReading(false);
                        setOpen(false);
                      }}
                      positive
                    />
                  </Modal.Actions>
                </Modal>
                <Button
                  fluid
                  style={{ margin: "3px 0px" }}
                  disabled={pdfUrl == null}
                  onClick={handleDownload}
                >
                  Download
                </Button>
                <DynamicReport
                  tableData={reportData}
                  gstin={gstin}
                  setPdfUrl={setPdfUrl}
                  remarkFiles={bufferData}
                />
              </>
            ) : (
              <Dimmer active>
                <Loader />
              </Dimmer>
            )}
          </PDFSegment>
          {/* <PDFSegment raised>
        {GSTR1Data != null ? (
          <>
            <Header as="h3" color="teal" textAlign="center">
              GSTR-1
            </Header>
            <Button
              fluid
              disabled={pdfMakeGSTR1 == null}
              onClick={() => pdfMakeGSTR1.open()}
            >
              Open In New Tab
            </Button>
            <DynamicGSTR1
              tableData={GSTR1Data}
              gstin={gstin}
              setPdfMake={setPdfMakeGSTR1}
            />
          </>
        ) : (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </PDFSegment>
      <PDFSegment raised>
        {GSTR3BData != null ? (
          <>
            <Header as="h3" color="teal" textAlign="center">
              GSTR-3B
            </Header>
            <Button
              fluid
              disabled={pdfMakeGSTR3b == null}
              onClick={() => pdfMakeGSTR3b.open()}
            >
              Open In New Tab
            </Button>
            <DynamicGSTR3B
              tableData={GSTR3BData}
              setPdfMake={setPdfMakeGSTR3b}
            />
          </>
        ) : (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </PDFSegment>
      <PDFSegment raised>
        {GSTR9Data != null ? (
          <>
            <Header as="h3" color="teal" textAlign="center">
              GSTR-9
            </Header>
            <Button
              fluid
              disabled={pdfMakeGSTR9 == null}
              onClick={() => pdfMakeGSTR9.open()}
            >
              Open In New Tab
            </Button>
            <DynamicGSTR9 tableData={GSTR9Data} setPdfMake={setPdfMakeGSTR9} />
          </>
        ) : (
          <Dimmer active>
            <Loader />
          </Dimmer>
        )}
      </PDFSegment> */}
        </StyledSection>
        <Footer />
      </Protected>
    </>
  );
}
