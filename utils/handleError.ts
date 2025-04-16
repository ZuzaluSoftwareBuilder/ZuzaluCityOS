export const isUserDenied = (error: any) => {
  const errorMessageLower = error.message?.toLowerCase() || '';
  return (
    errorMessageLower.includes('user denied') ||
    errorMessageLower.includes('user rejected') ||
    errorMessageLower.includes('request rejected') ||
    errorMessageLower.includes('cancelled') ||
    errorMessageLower.includes('canceled') ||
    error.code === 4001
  );
};
