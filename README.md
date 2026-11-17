# Wall Color Visualizer

Preview paint colours on real room photos before you paint. Pick a room, choose a colour shade and click any wall to see it painted instantly.

**Live demo:** https://sanjeet-saini.github.io/wall-color-visualization/

## Features

- **4 room types:** living room, bedroom, kitchen and kids room
- **Colour palette loaded from `colors.json`**, with 5 auto-generated shades per colour (light, soft, medium, deep, dark)
- **Paint each wall separately** by clicking it
- **Undo** the last change and **reset** all walls
- Smooth colour transitions and a brush cursor
- Responsive layout that scales the room on small screens

## Tech stack

- JavaScript (ES6+, `async/await`, Fetch API)
- HTML5 and CSS3 (Flexbox, `aspect-ratio`)
- JSON for the colour data

## How it works

Each room is made of two transparent PNG wall images placed over a coloured background. Clicking a wall changes the background colour behind that image, so the new paint shows through while the room's furniture and shadows stay on top.

Shades are generated in JavaScript by mixing each base colour with white or black (`mixColor()`), so adding a new colour to `colors.json` automatically creates all five shades.

## Run locally

The colours are loaded with `fetch()`, so the page needs to be served (not opened as a file):

```bash
git clone https://github.com/sanjeet-saini/wall-color-visualization.git
cd wall-color-visualization
npx http-server .
```

## Author

**Sanjeet Saini** · [GitHub](https://github.com/sanjeet-saini) · [LinkedIn](https://www.linkedin.com/in/sanjeet-saini-880b1827a)
