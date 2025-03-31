export const addLitUser = async (addresses: string[]) => {
  const response = await fetch('/api/lit/addUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(addresses),
  });
  return response;
};
