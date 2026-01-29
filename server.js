import { createServer } from "http";
import { parse } from "url";
import next from "next";

const port = process.env.PORT || 3000;

const app = next({
  dev: false,
  dir: "./",
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log("> Server started on port " + port);
  });
});
