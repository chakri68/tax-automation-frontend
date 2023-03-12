import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { Container, Grid, Header, Message } from "semantic-ui-react";
import { AuthContext } from "../contexts/authContext";

export default function Error() {
  let router = useRouter();
  let errorMessage = router.query?.message;
  let callback_url = router.query?.callback;
  let authContext = useContext(AuthContext);
  useEffect(() => {
    if (authContext.isAuthenticated()) {
      router.push(callback_url || "/");
    }
  });

  return (
    <>
      <Message
        style={{
          maxWidth: "600px",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        floating
        compact
        negative
        icon="exclamation"
        content={
          <Container style={{ margin: "1rem 0 0.25rem 0" }}>
            {errorMessage || "Something went wrong..."}{" "}
            {callback_url ? (
              <p>
                <Link href={callback_url}>Click here</Link> to try again
              </p>
            ) : (
              ""
            )}
          </Container>
        }
        header="Validation Error"
        color="red"
      />
    </>
  );
}
