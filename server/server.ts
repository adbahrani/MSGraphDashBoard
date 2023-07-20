import path from "path";

const { default: axios } = require("axios");
const express = require("express");
const cors = require("cors");
var compression = require("compression");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(compression());
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use(express.static("client/build"));

app.get("/token", async (_, res) => {
  const body = {
    client_id: "5107c906-38b3-4cef-b630-7fd01f814ed9",
    client_secret: "OZB8Q~l9fEVvsv06U49Cu5IxHjToqs1M2HodSaoG",
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials"
  };

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

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
  console.log(`server started on port http://localhost:${PORT}`);
});
