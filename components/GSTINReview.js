import { styled } from "@stitches/react";
import React, { useEffect, useState } from "react";
import { Button, Container, Form, Header, Segment } from "semantic-ui-react";

const StyledSegment = styled(Segment, {
  maxWidth: "600px",
});

function RawGSTINReview({ handleOnSubmit, gstin, GSTINReviewData }) {
  let [reviewData, setReviewData] = useState({
    review: GSTINReviewData.review || "",
    actionRequired: GSTINReviewData.actionRequired || true,
    // viewed: GSTINReviewData.viewed || false,
  });
  let [loading, setLoading] = useState(false);

  function handleActionRequiredChange(actionRequired) {
    setReviewData({ ...reviewData, actionRequired: actionRequired });
  }

  function handleReviewChange(e, { value }) {
    setReviewData({ actionRequired: reviewData.actionRequired, review: value });
  }

  useEffect(() => {
    setReviewData({
      review: GSTINReviewData.review || "",
      actionRequired: GSTINReviewData.actionRequired || false,
      // viewed: GSTINReviewData.viewed || false,
    });
  }, [GSTINReviewData]);

  return (
    <StyledSegment raised>
      <Header>GSTIN {gstin} Details</Header>
      <Container style={{ margin: "2rem auto" }}>
        <Form>
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
            key="INPUT"
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
            onChange={handleReviewChange}
          />
        </Form>
      </Container>
      <Button
        fluid
        disabled={!reviewData.actionRequired && reviewData.review.length == 0}
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
    </StyledSegment>
  );
}

export const MemoizedGSTINReview = React.memo(RawGSTINReview);
