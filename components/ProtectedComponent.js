import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import { AuthContext } from "../contexts/authContext";

export default function Protected({
  children,
  message = "Unauthenticated%20User",
  callback,
}) {
  const authContext = useContext(AuthContext);

  let [loading, setLoading] = useState(authContext.initLoad);

  let router = useRouter();

  useEffect(() => {
    if (!authContext.initLoad) {
      if (!authContext.isAuthenticated()) {
        // loading done
        router.push(
          `/error?message=${message}${callback ? `&callback=${callback}` : ""}`
        );
      } else {
        setLoading(false);
      }
    }
  }, [authContext]);

  return loading ? (
    <Segment style={{ width: "100vw", height: "100vh" }}>
      <Dimmer active>
        <Loader indeterminate>Checking Access</Loader>
      </Dimmer>
    </Segment>
  ) : (
    children
  );
}
