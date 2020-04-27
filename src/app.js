const winston = require("winston");
const bodyParser = require("body-parser").json();
const axios = require("axios").default;
const { JSDOM } = require("jsdom");
const readability = require("readability");
const createDOMPurify = require("dompurify");
const DOMPurify = createDOMPurify(new JSDOM("").window);
const app = require("express")();

const port = 13000;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const domPurifyOptions = {
    ADD_TAGS: ['video']
};

app.disable("x-powered-by");

app.get("/", (req, res) => {
  return res.status(405).send().end;
});

app.post("/", bodyParser, (req, res) => {
  const url = req.body.url;

  // we don't want to allow arbitrary URLs like file:
  if (
    url === undefined ||
    url.match(/https?:\/\//) === null ||
    url.length > 1024
  ) {
    logger.error("URL missing or invalid", { url: url });
    return res.status(400).send({
      error: "URL missing or invalid",
    }).end;
  }

  // TODO resolve URL host to IP and deny private networks?

  logger.info("Handling request", { url: url });

  config = {
    auth: req.body.auth,
    headers: req.body.headers,
  };

  axios
    .get(url, config)
    .then((response) => {
      const dom = new JSDOM(response.data);
      const parsed = new readability(dom.window.document, {}).parse();

      logger.info("Fetched and parsed content");

      return res
        .status(200)
        .send({
          url: url,
          content: DOMPurify.sanitize(parsed.content, domPurifyOptions),
          excerpt: parsed.excerpt || "",
          byline: parsed.byline || "",
          length: parsed.length,
          title: parsed.titles || "",
        })
        .end();
    })
    .catch((error) => {
      logger.error("Error while processing request", { error: error });
      return res.status(500).send({
        error: "Error processing request",
      });
    });
});

app.listen(port, () => logger.info("Server started", { port: port }));
