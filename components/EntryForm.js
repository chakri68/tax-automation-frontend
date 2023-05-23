import { useState } from "react";
import { Button, Form, Modal } from "semantic-ui-react";

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
  });
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
                  setFormData({ ...formData, boweb: value })
                }
              />
            </Form.Group>
            <Form.Group inline widths={"equal"}>
              <label>
                Amount Deposited After Issueing of ASMT-10 through (DRC-03)
              </label>
              <Form.Input
                type="number"
                value={formData.drc}
                onChange={(e, { value }) =>
                  setFormData({ ...formData, drc: value })
                }
              />
            </Form.Group>
            <Form.Group inline widths={"equal"}>
              <label>No of Dealer Selected For further Action for 73/74</label>
              <Form.Input
                type="number"
                value={formData.further_action}
                onChange={(e, { value }) =>
                  setFormData({ ...formData, further_action: value })
                }
              />
            </Form.Group>
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
