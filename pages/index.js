import Navbar from "../components/Navbar.js";
import {
  Button,
  Card,
  Form,
  Grid,
  Header,
  Dropdown,
  Table,
} from "semantic-ui-react";
import { Component } from "react";
import { withRouter } from "next/router";
import { AppContext } from "../contexts/appContext.js";
import { AuthContext } from "../contexts/authContext.js";

export default withRouter(
  class Home extends Component {
    state = {
      loading: false,
      selectedGSTIN: null,
    };
    static contextType = AuthContext;
    componentDidUpdate() {
      if (!this.context?.isAuthenticated()) {
        this.props.router.push(
          `/error?message=Unauthenticated%20User&callback=/`
        );
      }
    }
    componentDidMount() {
      if (!this.context?.isAuthenticated()) {
        this.props.router.push(
          `/error?message=Unauthenticated%20User&callback=/`
        );
      }
    }
    handleGSTINSelection = (gstin = null) => {
      if (gstin) {
        this.props.router.push(`/report/${gstin}`);
        this.setState({ loading: false });
        return;
      }
      this.props.router.push(`/report/${this.state.selectedGSTIN}`);
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
          value: GSTINDetails,
          text: gstin_details.GSTIN,
          key: gstin_details.id,
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
                            <p>Employee Id: {value.appData.empDetails.EmpID}</p>
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
                            options={value.appData.GSTINList}
                            onChange={(e, { name, value }) =>
                              this.setState({ selectedGSTIN: value })
                            }
                          />
                          <br />
                          <Button onClick={this.handleGSTINSelection}>
                            Generate Report
                          </Button>
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
                        <Table celled selectable padded s>
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
                                Action Required
                              </Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {value.appData.GSTINList.map(
                              ({ value, text }, ind) => {
                                return (
                                  <Table.Row key={text}>
                                    <Table.Cell textAlign="center">
                                      {ind + 1}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      {text}
                                    </Table.Cell>
                                    <Table.Cell textAlign="left">
                                      {value?.trade_name || "-"}
                                    </Table.Cell>
                                    <Table.Cell textAlign="left">
                                      {value?.legal_name || "-"}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Button
                                        onClick={() =>
                                          this.handleGSTINSelection(text)
                                        }
                                      >
                                        Generate Report
                                      </Button>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      Hello World!
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
        </>
      );
    }
  }
);
