import { styled } from "@stitches/react";
import { useState } from "react";
import { Button } from "semantic-ui-react";
import EntryForm from "./EntryForm.js";

export default function NavButtons({ back, home, handleEntryFormSubmit }) {
  let btns = [back, home].filter((x) => x != null);
  const StyledGrid = styled("div", {
    display: "grid",
    maxWidth: btns.length == 1 ? "fit-content" : "500px",
    margin: "2rem auto",
    gridTemplateColumns: btns.map(() => "1fr").join(" ") + " 1fr",
  });
  let [open, setOpen] = useState(false);
  return (
    <StyledGrid centered>
      {back != null ? (
        <Button
          labelPosition="left"
          icon="arrow left"
          onClick={back}
          content="Back to List"
        />
      ) : (
        ""
      )}
      <EntryForm
        handleOnSubmit={handleEntryFormSubmit}
        btnDisabled={false}
        open={open}
        onOpenStateChange={setOpen}
      />
      {home != null ? (
        <Button
          labelPosition="right"
          icon="home"
          onClick={home}
          content="Back to Dashboard"
        />
      ) : (
        ""
      )}
    </StyledGrid>
  );
}
