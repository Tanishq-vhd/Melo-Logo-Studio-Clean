export const generateLogo = async (prompt) => {
  const response = await fetch(
    "http://localhost:5000/api/generate/image",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate logo");
  }

  return response.json();
};
