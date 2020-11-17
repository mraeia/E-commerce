import "bootstrap/dist/css/bootstrap.css";
import httpClient from "../api/httpClient";
import Header from "../components/header";
import axios from "axios";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  let response = null;
  if (typeof window === "undefined") {
    response = await httpClient(appContext.ctx.req).get(
      "/api/users/currentuser"
    );
  } else {
    response = await axios.get("/api/users/currentuser");
  }

  return response.data;
};

export default AppComponent;
