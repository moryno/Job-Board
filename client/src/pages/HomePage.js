// import { useEffect, useState } from "react";
import { useState } from "react";
import JobList from "../components/JobList";
import PaginationBar from "../components/PaginationBar";
// import { getJobs } from "../lib/graphql/queries";
import { useJobs } from "../lib/hooks";

const JOBS_PER_PAGE = 10;
function HomePage() {
  // const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, totalCount } = useJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE
  );
  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

  // useEffect(() => {
  //   getJobs().then(setJobs);
  // }, []);

  return (
    <div>
      <h1 className="title">Job Board</h1>

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
