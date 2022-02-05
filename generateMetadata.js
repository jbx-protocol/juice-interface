const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs').promises;

const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta property="og:url" content="https://juicebox.money/p/%handle%" />
    <meta property="og:title" content="%name%" />
    <meta property="og:description" content="%description%" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="%logoUri%" />
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

(async () => {
  let loaded = false;
  let projects;
  while (!loaded) {
    try {
      projects = (await (await fetch('https://gateway.thegraph.com/api/6a7675cd9c288a7b9571d5c9e78d5aff/deployments/id/QmNxBy8UnUsQr3aeBgFvdFyWbTSMiTGpJbkAJzSm5m6vYf', {
        method: 'POST',
        body: '{"query":"{ projects(first: 100, skip: 0, orderBy: totalPaid, orderDirection: desc, where: { }) { handle, uri } }"}',
        headers: {'Content-Type': 'application/json'},
      })).json()).data.projects;
      loaded = true;
    } catch (e) {
      console.log('Retry loading projects in 1 sec');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  for (let {handle, uri} of projects) {
    let loaded = false;
    let metadata;
    while (!loaded) {
      try {
        metadata = (await (await fetch('https://jbx.mypinata.cloud/ipfs/' + uri)).json());
        loaded = true;
      } catch (e) {
        console.log('Retry loading project ' + handle + ' in 1 sec');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    metadata.handle = handle;
    let data = template;
    for (let key in metadata) {
      data = data.replaceAll('%' + key + '%', metadata[key]);
    }
    try {
      console.log('Write ' + handle + ' metadata');
      await fs.writeFile('./build/p/' + handle, data);
    } catch(e) {
      console.log(e);
      console.log('Write file ' + handle + ' eror')
    }
  }
})();
