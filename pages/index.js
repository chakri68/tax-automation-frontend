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
  Segment,
} from "semantic-ui-react";
import styles from "../styles/Home.module.css";
import { useState, Component } from "react";
import { withRouter } from "next/router";
import { styled } from "@stitches/react";

const StyledTable = styled("table", {
  width: "600px",
});

function checkGSTIN(gstin) {
  let matcher = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;
  return matcher.test(gstin);
}

export default withRouter(
  class Home extends Component {
    state = {
      loading: false,
      gstin: "",
      error: true,
      table: {
        row1: { samt: 0, camt: 0, iamt: 0 },
        row2: { samt: 0, camt: 0, iamt: 0 },
        row3: { samt: 0, camt: 0, iamt: 0 },
      },
    };
    handleOnGSTINChange = (e, { name, value }) => {
      this.setState({ [name]: value });
      if (checkGSTIN(value)) this.setState({ error: false });
      else this.setState({ error: true });
    };
    handleOnTableChange = (e, { name, value }) => {
      let n = name.split(" ");
      let res = { ...this.state.table };
      res[n[0]][n[1]] = value;
      this.setState({ table: res });
    };
    handleFormSubmit = () => {
      this.setState({ loading: true });
      if (checkGSTIN(this.state.gstin)) {
        this.setState({ error: false });
        this.props.router.push(
          `/report/${this.state.gstin}?${Object.keys(this.state.table)
            .map((row) =>
              Object.keys(this.state.table[row])
                .map((amt) => `${row}_${amt}=${this.state.table[row][amt]}&`)
                .join("")
            )
            .join("")}`
        );
      } else {
        this.setState({ error: true });
      }
      this.setState({ loading: false });
    };
    render() {
      let { loading, gstin, error, table } = this.state;
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
              <Form
                size="large"
                onSubmit={this.handleFormSubmit}
                loading={loading}
                error={error}
              >
                <Form.Field
                  className="no-auto-fill-color"
                  required
                  fluid
                  control={Input}
                  icon="user"
                  iconPosition="left"
                  value={gstin}
                  name="gstin"
                  onChange={this.handleOnGSTINChange}
                  placeholder="GSTIN Number"
                  error={
                    error
                      ? {
                          content: "Please enter a valid GSTIN Number",
                          pointing: "below",
                        }
                      : undefined
                  }
                />
                <Button color="teal" fluid size="large">
                  Get Tax Details
                </Button>
              </Form>
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
                  <th>Total</th>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td width="25">1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
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
                </tr>
              </tbody>
            </StyledTable>
          </Grid.Row>
        </Grid>
      );
    }
  }
);
