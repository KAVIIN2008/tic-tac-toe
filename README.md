# Good Game — Tic Tac Toe

A responsive tic-tac-toe game that runs entirely in the browser. Play against
an unbeatable computer opponent or pass the screen and play with a friend.

## Run locally

Open `index.html` in a browser, or serve this folder with any static file
server, for example:

```sh
npx serve .
```

## Publish and deploy

Create an empty GitHub repository named `tic-tac-toe`, then run these commands
from this folder:

```sh
git remote add origin https://github.com/<your-username>/tic-tac-toe.git
git add .
git commit -m "Create tic-tac-toe game"
git push -u origin main
```

In Vercel, import that GitHub repository as its own project. It is a static
site: use the **Other** framework preset, leave the build command empty, and
set the output directory to `.`.
