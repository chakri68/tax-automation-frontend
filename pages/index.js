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
} from "semantic-ui-react";
import styles from "../styles/Home.module.css";
import { useState, Component } from "react";
import { withRouter } from "next/router";
// import { styled } from "@stitches/react";

// const StyledTable = styled("table", {
//   width: "600px",
// });

export default withRouter(
  class Home extends Component {
    state = {
      //      table: {
      //        row1: { samt: 0, camt: 0, iamt: 0, csamt: 0 },
      //        row2: { samt: 0, camt: 0, iamt: 0, csamt: 0 },
      //        row3: { samt: 0, camt: 0, iamt: 0, csamt: 0 },
      //      },
      loading: false,
      scode: "",
      GSTINList: [],
      empDetails: null,
    };
    //  handleOnTableChange = (e, { name, value }) => {
    //    let n = name.split(" ");
    //    let res = { ...this.state.table };
    //    res[n[0]][n[1]] = value;
    //    this.setState({ table: res });
    //  };
    handleGSTINSelection = (e, { value }) => {
      // this.props.router.push(
      //   `/report/${value}?${Object.keys(this.state.table)
      //     .map((row) =>
      //       Object.keys(this.state.table[row])
      //         .map((amt) => `${row}_${amt}=${this.state.table[row][amt]}&`)
      //         .join("")
      //     )
      //     .join("")}`
      // );
      this.props.router.push(
        `/report/${value}`
      );
      this.setState({ loading: false });
    };
    getScodeData = async (scode) => {
      const response = await fetch(`/api/scode?scode=${scode}`);
      const data = await response.json();
      let DropListGSTINs = [];
      data.data.gstins.forEach(({ id, GSTIN, div_scode }) => {
        // {"id":20566307,"GSTIN":"09BMJPS1018N1ZL","div_scode":"UP001"}
        DropListGSTINs.push({ value: GSTIN, text: GSTIN, key: id });
      });
      return { GSTINList: DropListGSTINs, empDetails: data.data.emp };
    };
    scodeFormSubmit = async (e) => {
      e.preventDefault();
      this.setState({ loading: true });
      let { GSTINList: list, empDetails } = await this.getScodeData(
        e.nativeEvent.target[0].value
      );
      this.setState({
        GSTINList: list,
        empDetails: empDetails,
        loading: false,
      });
    };
    render() {
      // let { loading, table } = this.state;
      let { loading, empDetails } = this.state;
      return (
        <>
          <Navbar />
          <Grid
            relaxed
            textAlign="center"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            verticalAlign="middle"
          >
            <Grid.Row columns={1}>
              <Grid.Column style={{ maxWidth: 450 }}>
                <Header as="h2" color="teal" textAlign="center">
                  Get tax discrepancies
                </Header>
                <Form onSubmit={this.scodeFormSubmit}>
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
                {empDetails ? (
                  <Card
                    fluid
                    header={empDetails.name}
                    meta={`${empDetails.DESIG} - ${empDetails.sector}`}
                    extra={<p>Employee Id: {empDetails.EmpID}</p>}
                  />
                ) : (
                  ""
                )}
                {this.state.GSTINList.length != 0 ? (
                  <Dropdown
                    placeholder="Select GSTIN"
                    fluid
                    search
                    selection
                    loading={loading}
                    onChange={this.handleGSTINSelection}
                    options={this.state.GSTINList}
                  />
                ) : (
                  ""
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
        //          <Grid.Row>
        //            <StyledTable style={{ width: "800px" }} border="2" cellpadding="2">
        //              <tbody>
        //                <tr>
        //                  <th width="25">S.No.</th>
        //                  <th>Issue</th>
        //                  <th>SGST</th>
        //                  <th>CGST</th>
        //                  <th>IGST</th>
        //                  <th>Cess</th>
        //                </tr>
        //                <tr style={{ textAlign: "center" }}>
        //                  <td width="25">1</td>
        //                  <td>2</td>
        //                  <td>3</td>
        //                  <td>4</td>
        //                  <td>5</td>
        //                  <td>6</td>
        //                </tr>
        //                <tr>
        //                  <td width="25">1</td>
        //                  <td>Supplier registration canceled before date of invoice</td>
        //                  <td>
        //                    <Input
        //                      value={table.row1.samt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row1 samt"
        //                    />
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row1.camt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row1 camt"
        //                    />
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row1.iamt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row1 iamt"
        //                    />
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row1.csamt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row1 csamt"
        //                    />
        //                  </td>
        //                </tr>
        //                <tr>
        //                  <td width="25">2</td>
        //                  <td>
        //                    Supply failed to file GSTR-3B and did not pay tax on the
        //                    invoices declared in GSTR-01
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row2.samt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row2 samt"
        //                    />
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row2.camt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row2 camt"
        //                    />
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row2.iamt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row2 iamt"
        //                    />
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row2.csamt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row2 csamt"
        //                    />
        //                  </td>
        //                </tr>
        //                <tr>
        //                  <td width="25">3</td>
        //                  <td>
        //                    Supplier filed GSTR-3B with Nil Turnover and did not declare
        //                    or pay tax corresponding to the invoices declared in GSTR-01
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row3.samt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row3 samt"
        //                    />
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row3.camt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row3 camt"
        //                    />
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row3.iamt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row3 iamt"
        //                    />
        //                  </td>
        //                  <td>
        //                    <Input
        //                      value={table.row3.csamt}
        //                      onChange={this.handleOnTableChange}
        //                      type="number"
        //                      name="row3 csamt"
        //                    />
        //                  </td>
        //                </tr>
        //              </tbody>
        //            </StyledTable>
        //          </Grid.Row>
      );
    }
  }
);
