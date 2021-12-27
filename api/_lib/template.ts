import { readFileSync } from "fs";
import marked from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  "base64"
);
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
);

const ibmRglr = readFileSync(
  `${__dirname}/../_fonts/IBMPlexSans-Regular.ttf`
).toString("base64");
const ibmBold = readFileSync(
  `${__dirname}/../_fonts/IBMPlexSans-Bold.ttf`
).toString("base64");

function getCss(theme: string, fontSize: string) {
  let background = "white";
  let foreground = "#fbbf24";
  let radial = "lightgray";

  if (theme === "dark") {
    background = "black";
    radial = "dimgray";
  }
  return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
    }

    @font-face {
      font-family: 'IBM Plex Sans';
      font-style: normal;
      font-weight: normal;
      src: url(https://fonts.gstatic.com/s/ibmplexsans/v9/zYXgKVElMYYaJe8bpLHnCwDKhdHeFaxOedc.woff2) format("woff2");
    }
    @font-face {
        font-family: 'IBM Plex Sans';
        font-style: normal;
        font-weight: bold;
        src: url(https://fonts.gstatic.com/s/ibmplexsans/v9/zYX9KVElMYYaJe8bpLHnCwDKjWr7AIFsdP3pBms.woff2) format("woff2");
    }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 3%, transparent 0%),
          radial-gradient(circle at 75px 75px, ${radial} 3%, transparent 0%);
        background-size: 100px 100px;
        color: ${foreground};
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
      }
      code {
        font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif;
        font-size: .875em;
        white-space: pre-wrap;
      }
      code:before,
      code:after {
        content: '\`';
      }
      .img-wrapper {
        margin: 50px 0 50px;
        padding-top: 75px;
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
      }
      .img {
        width: 200px;
        height: 200px;
      }
      .plus {
        color: #7a8c97;
        font-size: 75px;
        padding: 0 30px;
      }
      .container {
        margin: 100px 150px 150px;
      }
      .spacer {
        margin: 50px 0;
        width: 100%;
      }
      .brand {
        font-size: 105px;
        padding: 50px;
        text-align: center;
        font-weight: bold;
        position: absolute;
        top: 0;
        width: 100%;
        color: ${foreground};
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .brand span {
        color: #7a8c97;
        font-weight: normal;
        margin-right: 0.2em;
      }
      .logo {
        width: 125px;
        margin: 0 50px;
      }
      .heading {
        background-image: linear-gradient(to bottom right, #fbbf24, #f59e0b 66%);
        background-repeat: no-repeat;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0 50px;
        padding-bottom: 50px;
        line-height: 0.875;
        font-weight: bold;
      }
      .heading * {
        margin: 0;
      }
      .caption {
        font-size: ${Number(sanitizeHtml(fontSize).match(/\d+/)) * 0.375}px;
        text-transform: uppercase;
        color: #7a8c97;
        letter-spacing: 0;
      }
      .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
      }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, caption } = parsedReq;
  return `<!DOCTYPE html>
  <html>
  <meta charset="utf-8">
  <title>Generated Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    ${getCss(theme, fontSize)}
  </style>
  <body>
    <div class="brand">
      <img class="logo" src="https://raw.githubusercontent.com/PurdueHackers/PH-Website-Frontend/master/src/assets/images/logo_square.png">
      Purdue Hackers
    </div>
    <div class="container">
      ${
        images.length > 0
          ? `<div class="img-wrapper">
              <img class="img" src="${sanitizeHtml(images[0])}" />
              ${images
                .slice(1)
                .map(
                  (img) =>
                    `<div class="plus">+</div>
                <img class="img" src="${sanitizeHtml(img)}" />`
                )
                .join("")}
            </div>`
          : '<div class="spacer"></div>'
      }
      <div class="heading">${emojify(
        md ? marked(text) : sanitizeHtml(text)
      )}</div>
      ${
        caption && caption !== "undefined"
          ? `<div class="caption">${emojify(sanitizeHtml(caption))}</div>`
          : ""
      }
    </div>
  </body>
</html>`;
}
