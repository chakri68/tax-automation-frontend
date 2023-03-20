import { styled } from "@stitches/react";
import { Button } from "semantic-ui-react";

export default function NavButtons({ back, home }) {
  let btns = [back, home].filter((x) => x != null);
  const StyledGrid = styled("div", {
    display: "grid",
    maxWidth: btns.length == 1 ? "fit-content" : "450px",
    margin: "2rem auto",
    gridTemplateColumns: btns.map(() => "1fr").join(" "),
  });
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
