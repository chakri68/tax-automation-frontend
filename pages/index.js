import Head from "next/head";
import Image from "next/image";
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
import { styled } from "@stitches/react";

const StyledTable = styled("table", {
  width: "600px",
});

function getGSTIN(){
  const GSTINs = ["09AAACM2931R1Z1"];
  let DropListGSTINs = [];
  GSTINs.forEach((item) => {
      DropListGSTINs.push({ value: item, text: item, key: item })
  })
  return DropListGSTINs;
}

export default withRouter(
  class Home extends Component {
    state = {
      table: {
        row1: { samt: 0, camt: 0, iamt: 0, csamt: 0 },
        row2: { samt: 0, camt: 0, iamt: 0, csamt: 0 },
        row3: { samt: 0, camt: 0, iamt: 0, csamt: 0 },
      },
    };
    handleOnTableChange = (e, { name, value }) => {
      let n = name.split(" ");
      let res = { ...this.state.table };
      res[n[0]][n[1]] = value;
      this.setState({ table: res });
    };
    handleGSTINSelection = (e, {value}) => {
      this.props.router.push(
            `/report/${value}?${Object.keys(this.state.table)
                .map((row) =>
                    Object.keys(this.state.table[row])
                        .map((amt) => `${row}_${amt}=${this.state.table[row][amt]}&`)
                        .join("")
                )
                .join("")}`
        );
        this.setState({ loading: false });
    };
    render() {
      let { loading, table } = this.state;
      return (
        <Grid
          relaxed
          textAlign="center"
          style={{ height: "100vh" }}
          verticalAlign="middle"
          // divided="vertically"
        >
          <Grid.Row columns={1}>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as="h2" color="teal" textAlign="center">
                Get tax discrepancies
              </Header>
              <Dropdown
                placeholder='Enter GSTIN'
                fluid
                search
                selection
                loading={loading}
                onChange={this.handleGSTINSelection}
                options={getGSTIN()}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <StyledTable style={{ width: "800px" }} border="2" cellpadding="2">
              <tbody>
                <tr>
                  <th width="25">S.No.</th>
                  <th>Issue</th>
                  <th>SGST</th>
                  <th>CGST</th>
                  <th>IGST</th>
                  <th>Cess</th>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td width="25">1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                </tr>
                <tr>
                  <td width="25">1</td>
                  <td>Supplier registration canceled before date of invoice</td>
                  <td>
                    <Input
                      value={table.row1.samt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row1 samt"
                    />
                  </td>
                  <td>
                    <Input
                      value={table.row1.camt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row1 camt"
                    />
                  </td>
                  <td>
                    <Input
                      value={table.row1.iamt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row1 iamt"
                    />
                  </td>
                  <td>
                    <Input
                      value={table.row1.csamt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row1 csamt"
                    />
                  </td>
                </tr>
                <tr>
                  <td width="25">2</td>
                  <td>
                    Supply failed to file GSTR-3B and did not pay tax on the
                    invoices declared in GSTR-01
                  </td>
                  <td>
                    <Input
                      value={table.row2.samt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row2 samt"
                    />
                  </td>
                  <td>
                    <Input
                      value={table.row2.camt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row2 camt"
                    />
                  </td>
                  <td>
                    <Input
                      value={table.row2.iamt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row2 iamt"
                    />
                  </td>
                  <td>
                    <Input
                      value={table.row2.csamt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row2 csamt"
                    />
                  </td>
                </tr>
                <tr>
                  <td width="25">3</td>
                  <td>
                    Supplier filed GSTR-3B with Nil Turnover and did not declare
                    or pay tax corresponding to the invoices declared in GSTR-01
                  </td>
                  <td>
                    <Input
                      value={table.row3.samt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row3 samt"
                    />
                  </td>
                  <td>
                    <Input
                      value={table.row3.camt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row3 camt"
                    />
                  </td>
                  <td>
                    <Input
                      value={table.row3.iamt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row3 iamt"
                    />
                  </td>
                  <td>
                    <Input
                      value={table.row3.csamt}
                      onChange={this.handleOnTableChange}
                      type="number"
                      name="row3 csamt"
                    />
                  </td>
                </tr>
              </tbody>
            </StyledTable>
          </Grid.Row>
        </Grid>
      );
    }
  }
);
