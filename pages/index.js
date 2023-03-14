import Navbar from "../components/Navbar.js";
import {
  Button,
  Card,
  Form,
  Grid,
  Header,
  Dropdown,
  Table,
  Modal,
  Image,
} from "semantic-ui-react";
import React, { Component } from "react";
import { withRouter } from "next/router";
import { AppContext } from "../contexts/appContext.js";
import { AuthContext } from "../contexts/authContext.js";
import GSTINReviewModal from "../components/GSTINReviewModal.js";
import { purgeText } from "../components/utils.js";
import Protected from "../components/ProtectedComponent.js";

export default withRouter(
  class Home extends Component {
    // constructor(props) {
    //   super(props);
    //   this.GSTINReviewForm = React.createRef();
    // }
    state = {
      loading: false,
      selectedGSTIN: {
        gstin: null,
        id: null,
        actionRequired: null,
        review: null,
      },
      moreDetailsModalOpen: false,
    };
    static contextType = AuthContext;

    handleSaveGSTINReview = async (reviewData, appContextVal) => {
      let res = await fetch("/api/review", {
        method: "POST",
        body: JSON.stringify({
          ...reviewData,
          token: this.context.authState.token,
          id: this.state.selectedGSTIN.id,
        }),
      });
      let data = await res.json();
      // TODO: Handle Errors
      // console.log({ postReply: data });
      let reqInd = appContextVal.appData.GSTINList.findIndex(
        (x) => x.id == this.state.selectedGSTIN.id
      );
      let list = appContextVal.appData.GSTINList;
      list[reqInd] = {
        ...appContextVal.appData.GSTINList[reqInd],
        ...reviewData,
      };
      appContextVal.update({ GSTINList: list });
    };
    handleGSTINSelection = (gstin = null) => {
      if (gstin) {
        this.props.router.push(`/report/${gstin}`);
        this.setState({ loading: false });
        return;
      }
      this.props.router.push(`/report/${this.state.selectedGSTIN.gstin}`);
      this.setState({ loading: false });
    };
    getScodeData = async () => {
      const response = await fetch(`/api/scode`, {
        method: "POST",
        body: JSON.stringify({ token: this.context.authState.token }),
      });
      const data = await response.json();
      if (!data.success) return null;
      let DropListGSTINs = [];
      data.data.gstins.forEach((gstin_details) => {
        let { bzdtls } = JSON.parse(gstin_details.GSTINDetails);
        let GSTINDetails = {
          legal_name: bzdtls?.bzdtlsbz?.lgnmbzpan,
          trade_name: bzdtls?.bzdtlsbz?.trdnm,
        };
        // {"id":20566307,"GSTIN":"09BMJPS1018N1ZL","div_scode":"UP001"}
        DropListGSTINs.push({
          ...GSTINDetails,
          id: gstin_details.id,
          gstin: gstin_details.GSTIN,
          actionRequired: gstin_details.actionRequired,
          review: gstin_details.review,
        });
      });
      return { GSTINList: DropListGSTINs, empDetails: data.data.emp };
    };
    scodeFormSubmit = async (e, callback) => {
      e.preventDefault();
      this.setState({ loading: true });
      let { GSTINList: list, empDetails } = await this.getScodeData();
      this.setState({
        // GSTINList: list,
        // empDetails: empDetails,
        loading: false,
      });
      callback({ GSTINList: list, empDetails });
    };
    render() {
      let { loading } = this.state;
      return (
        <>
          <Protected>
            <Navbar />
            <AppContext.Consumer>
              {(value) => (
                <>
                  {value.appData.empDetails ? (
                    <div className="office">
                      Office: {value.appData.empDetails.sector},{" "}
                      {value.appData.empDetails.DESIG}
                    </div>
                  ) : (
                    ""
                  )}
                  <Grid
                    relaxed
                    textAlign="center"
                    // style={{
                    //   position: "absolute",
                    //   left: "50%",
                    //   top: "50%",
                    //   transform: "translate(-50%, -50%)",
                    // }}
                    verticalAlign="middle"
                  >
                    <Grid.Row columns={1}>
                      <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as="h2" color="teal" textAlign="center">
                          Get tax discrepancies
                        </Header>
                        <Form
                          onSubmit={(e) =>
                            this.scodeFormSubmit(e, (newData) =>
                              value.update(newData)
                            )
                          }
                        >
                          <Button type="submit" loading={this.state.loading}>
                            {value.appData.GSTINList.length == 0 ? (
                              <>
                                Get GSTINS for <i>{value.appData.scode}</i>
                              </>
                            ) : (
                              <>Refresh Data</>
                            )}
                          </Button>
                        </Form>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={1}>
                      <Grid.Column style={{ maxWidth: 450 }}>
                        {value.appData.empDetails ? (
                          <Card
                            fluid
                            header={value.appData.empDetails.name}
                            meta={`${value.appData.empDetails.DESIG} - ${value.appData.empDetails.sector}`}
                            extra={
                              <p>
                                Employee Id: {value.appData.empDetails.EmpID}
                              </p>
                            }
                          />
                        ) : (
                          ""
                        )}
                        {value.appData.GSTINList &&
                        value.appData.GSTINList.length != 0 ? (
                          <>
                            <Dropdown
                              placeholder="Select GSTIN"
                              fluid
                              search
                              selection
                              loading={loading}
                              options={value.appData.GSTINList.map(
                                ({ id, gstin, actionRequired, review }) => {
                                  return {
                                    key: id,
                                    text: gstin,
                                    value: JSON.stringify({
                                      gstin,
                                      id,
                                      actionRequired,
                                      review,
                                    }),
                                  };
                                }
                              )}
                              onChange={(e, { value }) => {
                                this.setState({
                                  selectedGSTIN: JSON.parse(value),
                                });
                              }}
                            />
                            <br />
                            <GSTINReviewModal
                              gstin={this.state.selectedGSTIN?.gstin}
                              GSTINReviewData={this.state.selectedGSTIN}
                              btnDisabled={!this.state.selectedGSTIN?.gstin}
                              GetReportBtn={
                                <Button
                                  fluid
                                  onClick={() =>
                                    this.handleGSTINSelection(
                                      this.state.selectedGSTIN?.gstin
                                    )
                                  }
                                >
                                  Check Report
                                </Button>
                              }
                              handleOnSubmit={async (reviewData) =>
                                this.handleSaveGSTINReview(reviewData, value)
                              }
                            />
                          </>
                        ) : (
                          ""
                        )}
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={1}>
                      <Grid.Column style={{ maxWidth: "max(90vw, 600px)" }}>
                        {value.appData.GSTINList &&
                        value.appData.GSTINList.length != 0 ? (
                          <Table celled selectable padded>
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell textAlign="center">
                                  S. No.
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  GSTIN Number
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  Trade Name
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  Legal Name
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  Generate Notice
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  Remarks
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">
                                  Action Required
                                </Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {value.appData.GSTINList.map(
                                (
                                  {
                                    legal_name,
                                    trade_name,
                                    gstin,
                                    actionRequired,
                                    review,
                                  },
                                  ind
                                ) => {
                                  return (
                                    <Table.Row
                                      key={gstin}
                                      positive={
                                        actionRequired != null &&
                                        !actionRequired
                                      }
                                      negative={
                                        actionRequired != null && actionRequired
                                      }
                                    >
                                      <Table.Cell textAlign="center">
                                        {ind + 1}
                                      </Table.Cell>
                                      <Table.Cell textAlign="center">
                                        {gstin}
                                      </Table.Cell>
                                      <Table.Cell textAlign="left">
                                        {trade_name || "-"}
                                      </Table.Cell>
                                      <Table.Cell textAlign="left">
                                        {legal_name || "-"}
                                      </Table.Cell>
                                      <Table.Cell textAlign="center">
                                        <Button
                                          onClick={() =>
                                            this.handleGSTINSelection(gstin)
                                          }
                                        >
                                          Generate Report
                                        </Button>
                                      </Table.Cell>
                                      <Table.Cell textAlign="center">
                                        {review ? purgeText(review) : ""}
                                      </Table.Cell>
                                      <Table.Cell textAlign="center">
                                        {actionRequired == null
                                          ? ""
                                          : actionRequired
                                          ? "True"
                                          : "False"}
                                      </Table.Cell>
                                    </Table.Row>
                                  );
                                }
                              )}
                            </Table.Body>
                          </Table>
                        ) : (
                          ""
                        )}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </>
              )}
            </AppContext.Consumer>
          </Protected>
        </>
      );
    }
  }
);
