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
        const { uname, upass, ufiles } = req.payload;
        console.log(typeof ufiles);
        fs.writeFileSync(`uploads/${uname}_${upass}.jpg`, ufiles);
        return req.payload;
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
