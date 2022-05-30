const { createServer } = require("http");
const server = createServer();
server.listen(9091, "127.0.0.1");

server.on("listening", () => console.log(`Server linstening on port 9091...`));

const midtransClient = require("midtrans-client");
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: "SB-Mid-server-uEYJcwRwASsLN8pJqEuTe2o7",
  clientKey: "SB-Mid-client-JjjYU58YZM_W2Ayo",
});

server.on("request", (req, res) => {
  console.log(req.url);
  console.log(req.headers);
  if (req.method === "GET") {
    switch (req.url) {
      case "/":
      default:
        res.end("not found");
    }
  }
  if (req.method === "POST") {
    var body = "";
    req.on("data", (data) => {
      // console.log(data.toString());
      body += data.toString();
    });
    req.on("end", () => {
      console.log(JSON.parse(body));
      console.log("data siap diprocess");
      coreApi
        .charge(JSON.parse(body))
        .then((chargeResponse) => {
          console.log("chargeResponse:");
          console.log(chargeResponse);
          res.end(JSON.stringify(chargeResponse));
          return;
        })
        .catch((err) => {
          console.log(err);
          res.end(JSON.stringify({ message: "failed" }));
          return;
        });
    });

    req.on("error", (err) => console.log(err));
  }
});
