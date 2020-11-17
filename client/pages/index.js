import httpClient from "../api/httpClient";

const Homepage = ({ currentUser }) => {
  return <div> Hello! {currentUser ? currentUser.email : null}</div>;
};

export async function getServerSideProps({ req }) {
  // Pass data to the page via props
  return { props: {} };
}

export default Homepage;
