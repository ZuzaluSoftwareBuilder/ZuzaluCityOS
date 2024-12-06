import axios from 'axios';

/** This EAS Data using GraphQL doesn't work on the testnet. */
export async function fetchEASData(query: any, variables: any) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    const response = await axios.post(
      'https://scroll.easscan.org/graphql',
      {
        query,
        variables,
      },
      { headers },
    );
    return { response: response, success: true };
  } catch (err) {
    return { response: null, success: false };
  }
}
