import { Button, Table } from "semantic-ui-react";
import { purgeText } from "./utils";
import React from "react";

export function RawGSTINTable({ list, onRowClick, onReportBtnClick }) {
  console.log("GSTINList RERENDERING");
  return (
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
        {list.map(
          (
            { id, legal_name, trade_name, gstin, actionRequired, review },
            ind
          ) => {
            return (
              <Table.Row
                key={gstin}
                positive={actionRequired != null && !actionRequired}
                negative={actionRequired != null && actionRequired}
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
                    ? "True"
                    : "False"}
                </Table.Cell>
              </Table.Row>
            );
          }
        )}
      </Table.Body>
    </Table>
  );
}

export const MemoizedGSTINTable = React.memo(RawGSTINTable);
