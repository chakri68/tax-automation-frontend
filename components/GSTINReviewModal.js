import { useEffect, useState } from "react";
import { Button, Form, Header, Modal } from "semantic-ui-react";

export default function GSTINReviewModal({
  handleOnSubmit,
  btnDisabled = false,
  gstin,
  GSTINReviewData,
  GetReportBtn,
}) {
  let [reviewData, setReviewData] = useState({
    review: GSTINReviewData.review || "",
    actionRequired: GSTINReviewData.actionRequired || false,
  });
  let [open, setOpen] = useState(false);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    setReviewData({
      review: GSTINReviewData.review || "",
      actionRequired: GSTINReviewData.actionRequired || false,
    });
  }, [GSTINReviewData]);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button disabled={btnDisabled}>Get Details</Button>}
    >
      <Modal.Header>GSTIN {gstin} Details</Modal.Header>
      <Modal.Content
      // image
      >
        {/* <Image
                                size="medium"
                                src="https://react.semantic-ui.com/images/avatar/large/rachel.png"
                                wrapped
                              /> */}
        <Modal.Description>
          <Header>{gstin}</Header>
          <Form>
            <Form.Checkbox
              checked={reviewData.actionRequired}
              name="actionRequired"
              label="Action Required"
              onChange={(e, { checked }) =>
                setReviewData({ ...reviewData, actionRequired: checked })
              }
            />
            <Form.Input
              placeholder="Remarks"
              name="review"
              value={reviewData.review}
              onChange={(e, { value }) =>
                setReviewData({ ...reviewData, review: value })
              }
            />
            {GetReportBtn}
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="submit"
          color="red"
          onClick={() => setOpen(false)}
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
            await handleOnSubmit(reviewData);
            setLoading(false);
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}
