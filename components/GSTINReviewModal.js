import { useEffect, useState } from "react";
import { Button, Form, Header, Message, Modal } from "semantic-ui-react";

export default function GSTINReviewModal({
  handleOnSubmit,
  btnDisabled = false,
  gstin,
  GSTINReviewData,
  GetReportBtn,
  open,
  onOpenStateChange,
}) {
  let [reviewData, setReviewData] = useState({
    review: GSTINReviewData.review || "",
    actionRequired: GSTINReviewData.actionRequired || true,
    viewed: GSTINReviewData.viewed || false,
  });
  let [loading, setLoading] = useState(false);

  function handleActionRequiredChange(actionRequired) {
    setReviewData({ ...reviewData, actionRequired: actionRequired });
  }

  useEffect(() => {
    setReviewData({
      review: GSTINReviewData.review || "",
      actionRequired: GSTINReviewData.actionRequired || false,
      viewed: GSTINReviewData.viewed || false,
    });
  }, [GSTINReviewData]);

  return (
    <Modal
      closeIcon
      onClose={() => onOpenStateChange(false)}
      onOpen={() => onOpenStateChange(true)}
      open={open}
      trigger={<Button disabled={btnDisabled}>Get Details</Button>}
    >
      <Modal.Header>GSTIN {gstin} Details</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Header>{gstin}</Header>
          {reviewData.viewed ? (
            ""
          ) : (
            <Message
              warning
              header="Review can't be saved"
              content="Please view the report before the review"
            />
          )}
          <Form warning={!reviewData.viewed}>
            <Form.Group inline>
              <label>Action Required</label>
              <Form.Radio
                label="Yes"
                checked={reviewData.actionRequired}
                onChange={() => handleActionRequiredChange(true)}
              />
              <Form.Radio
                label="No"
                checked={!reviewData.actionRequired}
                onChange={() => handleActionRequiredChange(false)}
              />
            </Form.Group>
            <Form.Input
              error={
                !reviewData.actionRequired && reviewData.review.length == 0
                  ? {
                      content: "Review field can't be empty",
                      pointing: "below",
                    }
                  : false
              }
              disabled={reviewData.actionRequired}
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
          onClick={() => onOpenStateChange(false)}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          disabled={
            !reviewData.viewed ||
            (!reviewData.actionRequired && reviewData.review.length == 0)
          }
          loading={loading}
          content="Save"
          labelPosition="right"
          icon="checkmark"
          onClick={async () => {
            setLoading(true);
            await handleOnSubmit(
              reviewData.actionRequired
                ? {
                    actionRequired: reviewData.actionRequired,
                    review: null,
                  }
                : reviewData
            );
            setLoading(false);
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}
