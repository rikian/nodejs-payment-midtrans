const { createServer } = require("http");
const server = createServer();
server.listen(9093, "127.0.0.1");
server.on("listening", () => console.log(`Server linstening on port 9093...`));

const midtransClient = require("midtrans-client");
const SERVER_kEY = process.env.SERVER_kEY || "your server key midtrans";
const CLIENT_kEY = process.env.CLIENT_kEY || "your client key midtrans";
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: SERVER_kEY,
  clientKey: CLIENT_kEY,
});

let apiClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: SERVER_kEY,
  clientKey: CLIENT_kEY,
});

server.on("request", (req, res) => {
  if (req.method === "GET") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    res.end("hello world");
    return;
  }

  if (req.method === "POST") {
    if (req.url === "/test/payment/bayar") {
      var body = "";
      req.on("data", (data) => {
        body += data.toString();
      });
      req.on("end", () => {
        coreApi
          .charge(JSON.parse(body))
          .then((chargeResponse) => {
            res.end(JSON.stringify(chargeResponse));
            return;
          })
          .catch((err) => {
            res.end(JSON.stringify({ message: "failed" }));
            return;
          });
      });
      req.on("error", (err) => console.log(err));
      return;
    }

    if (req.url === "/test/payment/notif") {
      var body = "";
      req.on("data", (data) => {
        body += data.toString();
      });
      req.on("end", () => {
        const dataClient = JSON.parse(body);
        const transaction_status = apiClient.transaction;
        transaction_status.notification(dataClient).then((statusResponse) => {
          console.log(statusResponse);
          let orderId = statusResponse.order_id;
          let transactionStatus = statusResponse.transaction_status;
          let fraudStatus = statusResponse.fraud_status;

          console.log(
            `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
          );
          res.end("ok");
          return;
        });

        res.end(JSON.stringify({ message: "data masuk" }));
        return;
      });
      req.on("error", (err) => console.log(err));
      return;
    }

    res.writeHead(500, {
      "content-type": "application/json",
    });
    res.end({ message: "error" });
    return;
  }

  res.writeHead(200, {
    "content-type": "text/html",
  });
  res.end("method not allwoed");
  return;
});
