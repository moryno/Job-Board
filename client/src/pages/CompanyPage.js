import { useParams } from "react-router";
// import { useEffect, useState } from "react";
// import { companyByIdQuery, getCompany } from "../lib/graphql/queries";
import JobList from "../components/JobList";
import { useCompany } from "../lib/hooks";

function CompanyPage() {
  const { companyId } = useParams();
  const { company, loading, error } = useCompany(companyId);
  // TODO: Replace with useQuery from  Apollo CLient
  // const [state, setState] = useState({
  //   company: null,
  //   loading: true,
  //   error: false,
  // });

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const company = await getCompany(companyId);
  //       setState({ company, loading: false, error: false });
  //     } catch (error) {
  //       setState({ company: null, loading: false, error: error });
  //     }
  //   })();
  // }, [companyId]);

  // const { company, loading, error } = state;

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="has-text-danger">No content to load</div>;

  return (
    <div>
      <h1 className="title">{company.name}</h1>
      <div className="box">{company.description}</div>
      <h2 className="title is-5">Job at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
