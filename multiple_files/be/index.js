import Hapi from "@hapi/hapi";
import fs from "fs";

const init = async () => {
  const host = "localhost";
  const port = 8001;
  const server = Hapi.server({
    host: host,
    port: port,
    routes: {
      cors: true,
    },
  });

  server.route({
    method: "POST",
    path: "/uploadData",
    config: {
      handler: (req, h) => {
        console.log("/uploadData");
        console.log(req.payload);
        const { uname, upass } = req.payload;

        console.log(req.payload);
        const key = Object.keys(req.payload);
        let keySplit = null;
        for (let i = 0; i < key.length; i++) {
          keySplit = key[i].split("_");
          if (keySplit[0] === "ufile") {
            fs.writeFileSync(
              `uploaded/f${keySplit[1]}_u${i}_${keySplit[2]}.jpg`,
              req.payload[key[i]]
            );
          }
        }

        return { status: "success" };
      },
      payload: {
        maxBytes: 157286400,
        output: "data",
        parse: true,
        multipart: true,
      },
    },
  });

  await server.start();
  console.log(`Server running on: ${host}:${port}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
