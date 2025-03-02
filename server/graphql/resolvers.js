import { GraphQLError } from "graphql";
import { getCompany } from "../db/companies.js";
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  getJobsCount,
  updateJob,
} from "../db/jobs.js";

export const resolvers = {
  Query: {
    company: async (_root, { id }) => {
      const company = await getCompany(id);
      if (!company) throw notFound("No company found with id" + id);

      return company;
    },
    job: async (_root, { id }) => {
      const job = await getJob(id);
      if (!job) throw notFound("No job found with id" + id);

      return job;
    },
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await getJobsCount();

      return { items, totalCount };
    },
  },

  Mutation: {
    createJob: (_root, { input: { title, description } }, { user }) => {
      if (!user) throw unAuthorizedError("Not authorized");

      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      if (!user) throw unAuthorizedError("Not authorized");

      const job = await deleteJob(id, user.companyId);
      if (!job) throw notFound("No job found with id" + id);

      return job;
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      if (!user) throw unAuthorizedError("Not authorized");
      const job = await updateJob({
        id,
        title,
        description,
        companyId: user.companyId,
      });
      if (!job) throw notFound("No job found with id" + id);

      return job;
    },
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },
  Job: {
    date: (job) => toIsoDate(job.createdAt),
    company: (job) => getCompany(job.companyId),
  },
};

function toIsoDate(value) {
  return value.slice(0, "yyyy-mm-dd".length);
}

function notFound(message) {
  return new GraphQLError(message, {
    extensions: { code: "NOT_FOUND" },
  });
}
function unAuthorizedError(message) {
  return new GraphQLError(message, {
    extensions: { code: "UNAUTHORIZED" },
  });
}
