

export default () => {
  const login = async (code: string): Promise<void> => {
    const res = await fetch(process.env.NEXT_PUBLIC_URL + "/api/loginAccount", {
      method: "POST",
      body: JSON.stringify({
        code: code
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        // "Authorization": `Bearer ${localStorage.getItem("auth-public-token")}`
        "Authorization": `Bearer ${code}`
      }
    });

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Failed to fetch data");
    };

    const jsonResponse = await res.json();

    console.log("jsonResponse login: ", jsonResponse);
  };

  return {
    login: login
  }
};