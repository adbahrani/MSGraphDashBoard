/**
 * TODO: to be moved to a subfolder
 * dependencies to install: axios, express, cors
 * change cors origin: "*" to "frontend.url"
 *  */ 
const { default: axios } = require("axios");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: "*",
  })
);

app.get("/token", async (_, res) => {
  const body = {
    client_id: "5107c906-38b3-4cef-b630-7fd01f814ed9",
    client_secret: "OZB8Q~l9fEVvsv06U49Cu5IxHjToqs1M2HodSaoG",
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  };

  const formData = Object.entries(body)
    .reduce((acc, [key, value]) => {
      acc.push(`${key}=${encodeURIComponent(value)}`);
      return acc;
    }, [])
    .join("&");

  const { data } = await axios.post(
    "https://login.microsoftonline.com/a6dfed0e-808d-4a2e-ae4f-9adac874f50d/oauth2/v2.0/token",
    formData,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  res.send(data.access_token);
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});