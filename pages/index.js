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
import "semantic-ui-css/semantic.min.css";
import { useState, Component } from "react";
import { withRouter } from "next/router";

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
    };
    handleOnGSTINChange = (e, { name, value }) => {
      this.setState({ [name]: value });
      if (checkGSTIN(value)) this.setState({ error: false });
      else this.setState({ error: true });
    };
    handleFormSubmit = async () => {
      this.setState({ loading: true });
      if (checkGSTIN(this.state.gstin)) {
        this.setState({ error: false });
        this.props.router.push(`/${this.state.gstin}`);
      } else {
        this.setState({ error: true });
      }
      this.setState({ loading: false });
    };
    render() {
      let { loading, gstin, error } = this.state;
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
        </Grid>
      );
    }
  }
);
