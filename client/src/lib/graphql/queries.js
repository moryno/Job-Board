import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
// import { GraphQLClient, gql } from "graphql-request";
import { getAccessToken } from "../auth";

// const client = new GraphQLClient("http://localhost:9000/graphql", {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) return { Authorization: `Bearer ${accessToken}` };
//     return {};
//   },
// });

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: "network-only",
  //   },
  //   // watchQuery is used by react hooks
  //   watchQuery: {
  //     fetchPolicy: "network-only",
  //   },
  // },
});

export const jobsQuery = gql`
  query Jobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        title
        description
        date
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`;

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    description
    company {
      id
      name
    }
  }
`;
export const jobByIdQuery = gql`
  query getJobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const companyByIdQuery = gql`
  query getCompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
        date
      }
    }
  }
`;
export const createJobMutation = gql`
  mutation createJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
// TODO: useMutation hook from ApolloServer
// export async function createJob({ title, description }) {
//   const mutation = gql`
//     mutation createJob($input: CreateJobInput!) {
//       job: createJob(input: $input) {
//         ...JobDetail
//       }
//     }
//     ${jobDetailFragment}
//   `;
//   // const { job } = await client.request(mutation, {
//   //   input: {
//   //     title,
//   //     description,
//   //   },
//   // });

//   const {
//     data: { job },
//   } = await apolloClient.mutate({
//     mutation,
//     variables: { input: { title, description } },
//     update: (query, { data }) => {
//       query.writeQuery({
//         query: jobByIdQuery,
//         variables: { id: data.job.id },
//         data,
//       });
//     },
//   });
//   return job;
// }

// TODO: Replace with useQuery from  Apollo CLient

// export async function getJobs() {
//   const query = gql`
//     query Jobs {
//       jobs {
//         id
//         date
//         title
//         company {
//           id
//           name
//         }
//       }
//     }
//   `;

//   // const { jobs } = await client.request(query);
//   const {
//     data: { jobs },
//   } = await apolloClient.query({ query, fetchPolicy: "network-only" });
//   return jobs;
// }

// export async function getJob(id) {
//   // const { job } = await client.request(query, { id });
//   const {
//     data: { job },
//   } = await apolloClient.query({ query: jobByIdQuery, variables: { id } });
//   return job;
// }

// export async function getCompany(id) {
//   const query = gql`
//     query getCompanyById($id: ID!) {
//       company(id: $id) {
//         id
//         name
//         description
//         jobs {
//           id
//           title
//           date
//         }
//       }
//     }
//   `;

//   // const { company } = await client.request(query, { id });
//   const {
//     data: { company },
//   } = await apolloClient.query({ query, variables: { id } });

//   return company;
// }

// export async function deleteJob(id) {
//   const mutation = gql`
//     mutation deleteJob($id: ID!) {
//       job: deleteJob(id: $id) {
//         title
//       }
//     }
//   `;
//   const { job } = await client.request(mutation, {
//     id,
//   });

//   return job;
// }
