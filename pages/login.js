import { MD5 } from "crypto-js";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router.js";
import { useContext, useEffect } from "react";
import { AppContext } from "../contexts/appContext";
import { AuthContext } from "../contexts/authContext";

export default function Login(props) {
  let authContext = useContext(AuthContext);
  let appContext = useContext(AppContext);
  let data = props.data;
  let router = useRouter();
  useEffect(() => {
    authContext.setAuthToken(data.token);
    appContext.update({ scode: data.S });
    router.push("/");
  }, []);
}

export async function getServerSideProps(context) {
  let query = context?.query;
  if (!(query && query?.S && query?.P && query?.RU)) {
    return {
      redirect: {
        permanent: false,
        destination: `/error?message=NO%20QUERY%20STRING%20FOUND&callback=${context.resolvedUrl}`,
      },
      props: {
        error: true,
        data: null,
        message: "ERROR - NO QUERY STRING FOUND",
      },
    };
  }
  try {
    let { S, P, RU } = query;
    S = Buffer.from(S, "base64").toString("ascii");
    RU = Buffer.from(RU, "base64").toString("ascii");
    let token = jwt.sign({ S, P, RU }, process.env.JWT_KEY);
    let md5Hash = MD5(
      `${S}|${formatDate(new Date())}|${process.env.PIN}`
    ).toString();
    if (md5Hash === P) {
      return {
        props: {
          error: false,
          data: { S, P, RU, token },
          message: "VERIFICATION SUCCESSFUL",
        },
      };
    } else {
      throw new Error("INVALID QUERY");
    }
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: `/error?message=${e}&callback=${context.resolvedUrl}`,
      },
      props: {
        error: true,
        data: null,
        message: `VERIFICATION ERROR ${e}`,
      },
    };
  }
}

function formatDate(date) {
  let day = date.getUTCDate();
  let month = date.getUTCMonth() + 1;
  let year = date.getUTCFullYear().toString();

  day = day < 10 ? "0" + day.toString() : day.toString();
  month = month < 10 ? "0" + month.toString() : month.toString();
  year = year.slice(year.length - 2, year.length);

  return `${day}${month}${year}`;
}
