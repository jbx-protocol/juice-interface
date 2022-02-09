const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs").promises;
require("dotenv").config();

const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta property="og:url" content="https://juicebox.money/p/%handle%" />
    <meta property="og:title" content="%name%" />
    <meta property="og:description" content="%description%" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="%logoUri%" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="1200" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@%twitter%" />
    <meta name="twitter:creator" content="@%twitter%" />
    <meta name="twitter:title" content="%name%" />
    <meta name="twitter:description" content="%description%" />
    <meta name="twitter:image" content="%logoUri%" />
    <title>%name%</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <script>location.replace('/#' + location.pathname)</script>
  </body>
</html>`;
const targetDir = "./build/p/";
const TRIES = 3;

(async () => {
  let projects = null;
  let tries = 0;
  while (tries++ < TRIES) {
    try {
      projects = (
        await (
          await fetch(process.env.REACT_APP_SUBGRAPH_URL, {
            method: "POST",
            body: '{"query":"{ projects(first: 1000, orderBy: totalPaid, orderDirection: desc, where: { }) { handle, uri } }"}',
            headers: { "Content-Type": "application/json" },
          })
        ).json()
      ).data.projects;
      break; //loaded
    } catch (e) {
      console.log("Retry " + tries + " loading projects in 1 sec");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  if (projects !== null) {
    console.log(projects.length);
    try {
      await fs.mkdir(targetDir, { recursive: true });
    } catch (e) {}
    for (let { handle, uri } of projects) {
      let metadata = null;
      let tries = 0;
      while (tries++ < TRIES) {
        try {
          metadata = await (
            await fetch("https://jbx.mypinata.cloud/ipfs/" + uri)
          ).json();
          break; //loaded
        } catch (e) {
          console.log(
            "Retry " + tries + " loading project " + handle + " in 1 sec"
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      if (metadata !== null) {
        metadata.handle = handle;
        let data = template;
        for (let key in metadata) {
          data = data.replaceAll("%" + key + "%", metadata[key]);
        }
        try {
          console.log("Write " + handle + " metadata");
          await fs.writeFile(targetDir + handle, data);
        } catch (e) {
          console.log(e);
          console.log("Write file " + handle + " eror");
        }
      } else console.log("Can't load project " + handle);
    }
  } else console.log("Can't load projects");
})();
