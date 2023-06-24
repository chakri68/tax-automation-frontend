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
  const [formData, setFormData] = useState({
    boweb: 0,
    drc: 0,
    further_action: 0,
    gstin_array: [],
  });
  const [GSTINInp, setGSTINInp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    const parsedValue = value === "" ? "" : parseInt(value);
    setFormData((prevData) => ({ ...prevData, [field]: parsedValue }));
  };

  const handleAddGSTIN = () => {
    if (!checkGSTIN(GSTINInp)) return;

    const trimmedGSTIN = GSTINInp.trim();
    if (formData.gstin_array.includes(trimmedGSTIN)) return;

    setFormData((prevData) => ({
      ...prevData,
      gstin_array: [...prevData.gstin_array, trimmedGSTIN],
    }));
    setGSTINInp("");
  };

  const handleRemoveGSTIN = (gstin) => {
    setFormData((prevData) => ({
      ...prevData,
      gstin_array: prevData.gstin_array.filter((i_gstin) => i_gstin !== gstin),
    }));
  };

  const handleFormSubmit = async () => {
    setLoading(true);
    await handleOnSubmit(formData);
    setFormData({
      boweb: 0,
      drc: 0,
      further_action: 0,
      gstin_array: [],
    });
    setLoading(false);
  };

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
                onChange={(e, { value }) => handleInputChange("boweb", value)}
              />
            </Form.Group>
            <Form.Group inline widths="equal">
              <label>
                Amount Deposited After Issuing of ASMT-10 through (DRC-03)
              </label>
              <Form.Input
                type="number"
                value={formData.drc}
                onChange={(e, { value }) => handleInputChange("drc", value)}
              />
            </Form.Group>
            <Form.Group inline widths="equal">
              <label>No of Dealer Selected For further Action for 73/74</label>
              <Form.Input
                type="number"
                value={formData.further_action}
                onChange={(e, { value }) =>
                  handleInputChange("further_action", value)
                }
              />
            </Form.Group>
            <Form.Group inline widths="equal">
              <label>Add GSTIN</label>
              <Form.Input
                type="text"
                error={GSTINInp !== "" && !checkGSTIN(GSTINInp)}
                action={
                  <Button
                    icon="add"
                    disabled={!checkGSTIN(GSTINInp)}
                    onClick={handleAddGSTIN}
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
                    onClick={() => handleRemoveGSTIN(gstin)}
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
          disabled={
            formData.boweb !== formData.gstin_array.length ||
            (!formData.boweb && !formData.further_action && !formData.drc)
          }
          content="Save"
          labelPosition="right"
          icon="checkmark"
          onClick={handleFormSubmit}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}
