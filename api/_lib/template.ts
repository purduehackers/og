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
    foreground = "#f59e0b";
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
        src: url(data:font/woff2;charset=utf-8;base64,${ibmRglr})  format("ttf");
    }
    @font-face {
        font-family: 'IBM Plex Sans';
        font-style: normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${ibmBold})  format("ttf");
    }

    body {
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        margin: 150px;
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
    .logo {
        width: 125px;
        margin: 0 50px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .caption {
        font-size: ${Number(sanitizeHtml(fontSize).match(/\d+/)) * 0.375}px;
        text-transform: uppercase;
        color: #7a8c97;
        letter-spacing: 0;
      }
    
    .heading {
        font-family: 'IBM Plex Sans', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize, images, widths, heights, caption } =
    parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
        <div class="brand">
            <img class="logo" src="https://assets.hackclub.com/icon-rounded.svg">
            Purdue Hackers
        </div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images
                  .map(
                    (img, i) =>
                      getPlusSign(i) + getImage(img, widths[i], heights[i])
                  )
                  .join("")}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
              md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
            ${
              caption && caption !== "undefined"
                ? `<div class="caption">${emojify(sanitizeHtml(caption))}</div>`
                : ""
            }
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "225") {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}
