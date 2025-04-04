//This is the Lit action stored in ipfs for verifying if a user is allowed to access an event
export const verifyUser = async (eventId, userAddress, env) => {
  try {
    const baseUrl =
      env === 'dev'
        ? 'http://209.38.177.187:7007'
        : 'http://209.38.179.97:7007';

    const chainId = env === 'dev' ? '534351' : '534352';

    const userDid = `did:pkh:eip155:${chainId}:${userAddress.toLowerCase()}`;

    const response = await fetch(`${baseUrl}/api/v0/streams/${eventId}`).then(
      (res) => res.json(),
    );

    const {
      members = [],
      admins = [],
      superAdmin = [],
    } = response.state.content;

    const allAllowedUsers = [...members, ...admins, ...superAdmin];

    return allAllowedUsers.includes(userDid);
  } catch (e) {
    console.log(e);
    return false;
  }
};
