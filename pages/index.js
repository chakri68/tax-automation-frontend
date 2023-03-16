import { withRouter } from "next/router";
import React, { Component } from "react";
import { Button, Card, Form, Grid, Header } from "semantic-ui-react";
import { MemoizedGSTINDropdown } from "../components/GSTINDropdown.js";
import GSTINReviewModal from "../components/GSTINReviewModal.js";
import { MemoizedGSTINTable } from "../components/GSTINTable.js";
import Navbar from "../components/Navbar.js";
import Protected from "../components/ProtectedComponent.js";
import { AppContext } from "../contexts/appContext.js";
import { AuthContext } from "../contexts/authContext.js";

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

    handleRowSelect = (gstinData) => {
      this.setState({
        selectedGSTIN: {
          gstin: gstinData.gstin,
          id: gstinData.id,
          actionRequired: gstinData.actionRequired,
          review: gstinData.review,
        },
      });
      this.setState({ moreDetailsModalOpen: true });
    };

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
                            <MemoizedGSTINDropdown
                              loading={loading}
                              list={value.appData.GSTINList}
                              onChange={(gstinData) =>
                                this.setState({
                                  selectedGSTIN: gstinData,
                                })
                              }
                            />
                            <br />
                            <GSTINReviewModal
                              open={this.state.moreDetailsModalOpen}
                              onOpenStateChange={(open) =>
                                this.setState({ moreDetailsModalOpen: open })
                              }
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
                          <MemoizedGSTINTable
                            onRowClick={this.handleRowSelect}
                            onReportBtnClick={this.handleGSTINSelection}
                          />
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
