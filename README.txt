WHERE WERE WE — static website
==============================

Upload everything in this folder to your web host's public folder
(often called public_html, www or htdocs). Keep the folder structure as is.

  index.html      Landing page (home)
  map.html        Shared map demo with year slider
  join.html       "Add your places" screen
  css/style.css   All styles (colours are variables at the top)
  js/data.js      Demo people, cities and years: edit this to change the example
  js/map.js       Map page logic
  img/            Hero photo, world map, favicon

No build step, database or server code is needed. It works on any static host
(cPanel, Netlify, Vercel, GitHub Pages, S3, etc.).

Fonts load from Google Fonts. Everything else is self-contained.

To add a city to the demo: add its [latitude, longitude] to "cities" in
js/data.js, then use the city name in someone's "stays".
