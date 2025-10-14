export default (code: string) => {
  const hasSession: string = localStorage.getItem("auth-public-token") || "";

  if (!hasSession) return false;

  return true;
};
