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
        console.log(ufiles.length);

        if (ufiles instanceof Buffer){
          fs.writeFileSync(`uploaded/${uname}_${upass}.jpg`, ufiles);
        } else {
          for (let i = 0; i < ufiles.length; i++) {
            fs.writeFileSync(`uploaded/${uname}_${upass}_${i}.jpg`, ufiles[i]);
          }
        }
        
        return {status: "success"};
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
