import React, { useContext } from "react";
import {
  Button,
  Label,
  Message,
  Popup,
  Segment,
  Table,
} from "semantic-ui-react";
import { AppContext } from "../contexts/appContext";
import { purgeText } from "./utils";

export function RawGSTINTable({ onRowClick, onReportBtnClick }) {
  const appContext = useContext(AppContext);

  return (
    <Segment>
      <Message floating color="teal" compact>
        <Message.Header>Color Codes</Message.Header>
        <Message.List>
          <Message.Item>
            <Popup
              content="Green"
              trigger={
                <Label circular color="green">
                  G
                </Label>
              }
            />{" "}
            No Action Required
          </Message.Item>
          <Message.Item>
            <Popup
              content="Blue"
              trigger={
                <Label circular color="blue">
                  B
                </Label>
              }
            />{" "}
            Visited
          </Message.Item>
          <Message.Item>
            <Popup
              content="Red"
              trigger={
                <Label circular color="red">
                  R
                </Label>
              }
            />{" "}
            Action Required
          </Message.Item>
        </Message.List>
      </Message>
      <Table celled selectable padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">S. No.</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">GSTIN Number</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Trade Name</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Legal Name</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">
              Generate Notice
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Remarks</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">
              Action Required
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {appContext.appData.GSTINList.map(
            (
              {
                id,
                legal_name,
                trade_name,
                gstin,
                actionRequired,
                review,
                viewed,
              },
              ind
            ) => {
              return (
                <Table.Row
                  key={gstin}
                  positive={actionRequired != null && !actionRequired}
                  negative={actionRequired != null && actionRequired}
                  className={actionRequired == null && viewed ? "bg-blue" : ""}
                >
                  <Table.Cell textAlign="center">{ind + 1}</Table.Cell>
                  <Table.Cell
                    className="is-hoverable"
                    selectable
                    textAlign="center"
                    onClick={() =>
                      onRowClick({
                        id,
                        legal_name,
                        trade_name,
                        gstin,
                        actionRequired,
                        review,
                        viewed,
                      })
                    }
                  >
                    {gstin}
                  </Table.Cell>
                  <Table.Cell textAlign="left">{trade_name || "-"}</Table.Cell>
                  <Table.Cell textAlign="left">{legal_name || "-"}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Button onClick={() => onReportBtnClick(gstin)}>
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
                      ? "Yes"
                      : "No"}
                  </Table.Cell>
                </Table.Row>
              );
            }
          )}
        </Table.Body>
      </Table>
    </Segment>
  );
}

export const MemoizedGSTINTable = React.memo(RawGSTINTable);
