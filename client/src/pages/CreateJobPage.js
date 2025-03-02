import { useState } from "react";
import // createJob,
// createJobMutation,
// jobByIdQuery,
"../lib/graphql/queries";
import { useNavigate } from "react-router";
// import { useMutation } from "@apollo/client";
import { useCreateJob } from "../lib/hooks";

function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigation = useNavigate();
  const { createJob, loading } = useCreateJob();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // TODO: useMutation hook from ApolloServer
    // const job = await createJob({ title, description });

    const job = await createJob({ title, description });

    navigation(`/jobs/${job.id}`);
    console.log("should post a new job:", { title, description });
  };

  return (
    <div>
      <h1 className="title">New Job</h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Description</label>
            <div className="control">
              <textarea
                className="textarea"
                rows={10}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button
                disabled={loading}
                className="button is-link"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
