import { styled } from "@stitches/react";
import { useState } from "react";
import { Button, Form, Icon, Label, Modal } from "semantic-ui-react";
import { checkGSTIN } from "./utils";

const GSTINLabels = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.25rem",
});

export default function EntryForm({
  handleOnSubmit,
  btnDisabled = false,
  GetReportBtn,
  open,
  onOpenStateChange,
}) {
  let [formData, setFormData] = useState({
    boweb: 0,
    drc: 0,
    further_action: 0,
    gstin_array: [],
  });
  let [GSTINInp, setGSTINInp] = useState("");
  let [loading, setLoading] = useState(false);

  return (
    <Modal
      closeIcon
      onClose={() => onOpenStateChange(false)}
      onOpen={() => onOpenStateChange(true)}
      open={open}
      trigger={<Button disabled={btnDisabled}>Enter Data For MIS</Button>}
    >
      <Modal.Header>Sent Forms</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Group inline>
              <label>No of ASMT-10 Sent Through BOWEB</label>
              <Form.Input
                type="number"
                value={formData.boweb}
                onChange={(e, { value }) =>
                  setFormData({ ...formData, boweb: parseInt(value) })
                }
              />
            </Form.Group>
            <Form.Group inline widths={"equal"}>
              <label>
                Amount Deposited After Issuing of ASMT-10 through (DRC-03)
              </label>
              <Form.Input
                type="number"
                value={formData.drc}
                onChange={(e, { value }) =>
                  setFormData({ ...formData, drc: parseInt(value) })
                }
              />
            </Form.Group>
            <Form.Group inline widths={"equal"}>
              <label>No of Dealer Selected For further Action for 73/74</label>
              <Form.Input
                type="number"
                value={formData.further_action}
                onChange={(e, { value }) =>
                  setFormData({ ...formData, further_action: parseInt(value) })
                }
              />
            </Form.Group>
            <Form.Group inline widths={"equal"}>
              <label>Add GSTIN</label>
              <Form.Input
                type="text"
                error={GSTINInp != "" ? !checkGSTIN(GSTINInp) : false}
                action={
                  <Button
                    icon="add"
                    disabled={!checkGSTIN(GSTINInp)}
                    onClick={() => {
                      if (formData.gstin_array.includes(GSTINInp)) return;
                      setFormData({
                        ...formData,
                        gstin_array: [...formData.gstin_array, GSTINInp.trim()],
                      });
                      setGSTINInp("");
                    }}
                  />
                }
                value={GSTINInp}
                onChange={(e, { value }) => setGSTINInp(value)}
              />
            </Form.Group>
            <Label style={{ marginBottom: "0.5rem" }}>
              GSTINS ({formData.gstin_array.length})
            </Label>
            <GSTINLabels>
              {formData.gstin_array.map((gstin) => (
                <Label style={{ margin: 0 }} key={gstin}>
                  {gstin}
                  <Icon
                    name="delete"
                    link
                    onClick={() => {
                      setFormData({
                        ...formData,
                        gstin_array: formData.gstin_array.filter(
                          (i_gstin) => i_gstin != gstin
                        ),
                      });
                    }}
                  />
                </Label>
              ))}
            </GSTINLabels>
            {GetReportBtn}
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          color="red"
          onClick={() => onOpenStateChange(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          loading={loading}
          disabled={formData.boweb != formData.gstin_array.length}
          content="Save"
          labelPosition="right"
          icon="checkmark"
          onClick={async () => {
            setLoading(true);
            await handleOnSubmit(formData);
            setLoading(false);
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}
