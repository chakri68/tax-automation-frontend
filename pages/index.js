import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar.js";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Grid,
  Header,
  Input,
  Dropdown,
  Segment,
  Table,
} from "semantic-ui-react";
import styles from "../styles/Home.module.css";
import { useState, Component } from "react";
import { withRouter } from "next/router";
import AppContext from "../contexts/appContext.js";

export default withRouter(
  class Home extends Component {
    state = {
      loading: false,
      scode: "",
      selectedGSTIN: null,
    };
    handleGSTINSelection = (gstin = null) => {
      if (gstin) {
        this.props.router.push(`/report/${gstin}`);
        this.setState({ loading: false });
        return;
      }
      this.props.router.push(`/report/${this.state.selectedGSTIN}`);
      this.setState({ loading: false });
    };
    getScodeData = async (scode) => {
      const response = await fetch(`/api/scode?scode=${scode}`);
      const data = await response.json();
      console.log({ data });
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
      let { GSTINList: list, empDetails } = await this.getScodeData(
        e.nativeEvent.target[0].value
      );
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
                            value.updates.update(newData)
                          )
                        }
                      >
                        <Form.Field>
                          <label>Enter Sector Code</label>
                          <input placeholder="Sector Code" />
                        </Form.Field>
                        <Button type="submit" loading={this.state.loading}>
                          Get GSTINS
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
                              <Table.HeaderCell textAlign="left">
                                Legal Name
                              </Table.HeaderCell>
                              <Table.HeaderCell textAlign="center">
                                GSTIN Number
                              </Table.HeaderCell>
                              <Table.HeaderCell textAlign="center">
                                Generate Button
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
                                    <Table.Cell textAlign="left">
                                      {value?.legal_name ||
                                        value?.trade_name ||
                                        "-"}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      {text}
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
