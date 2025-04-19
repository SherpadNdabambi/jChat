<!-- Top anchor -->
<div id="top">

<!-- Project Shields -->

<div align=center>

[![Contributors shield][Contributors shield url]][Contributors url]
[![Issues shield][Issues shield url]][Issues url]
[![MIT License shield][MIT License shield url]][License url]

</div>

<div align=center>

[![jChat logo][Logo url]][Repo url]

</div>

<div align=center>

# jChat

</div>

## Table of Contents

<details>

   <summary>Contents</summary>

1. [About](#about)
   1. [Built With](#built-with)
1. [Features](#features)
1. [Approach](#approach)
1. [Getting Started](#getting-started)
   1. [Prerequisites](#prerequisites)
   1. [Setting Up](#setting-up)
   1. [Testing](#testing)
1. [Usage](#usage)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)
1. [Changelog](#changelog)
1. [Contact Me](#contact-me)
1. [License](#license)
1. [Acknowledgments](#acknowledgments)

</details>

## About

[![jChat screenshot][jChat screenshot url]][jChat url]

A WhatsApp bot that lets users chat with AI models like Grok and ChatGPT.

<div align=right>

([back to top](#top))

</div>

### Built With

[![Node.js shield][Node.js shield url]][Node.js url]
[![Typescript][Typescript shield url]][Typescript url]

<div align=right>

([back to top](#top))

</div>

## Features

1. Send messages via WhatsApp to interact with AI.
1. Multi-AI support (Grok, ChatGPT, extensible to Claude, Pi).
1. Conversation context for continuity.
1. Free, open-source, powered by Baileys and Node.js.

<div align=right>

([back to top](#top))

</div>

## Approach

1. Receive messages via WhatsApp.
1. Send them to an AI model using the user's API key.
1. Return the AI model’s response to the user.

<div align=right>

([back to top](#top))

</div>

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

1. [Node.js 20+][Node.js url].
1. [npm][npm url].
1. The TypeScript compiler.

   ```sh
   sudo npm install -g typescript
   ```

1. A secondary WhatsApp account (regular or Business).
1. AI API keys from x.ai, openai.com, etc.

### Setting Up

1. Clone the repo:

   ```sh
   git clone https://github.com/your-username/jchat.git
   cd jchat
   ```

1. Install dependencies:

   ```sh
   npm install
   ```

1. Compile TypeScript to JavaScript.

   ```sh
   npm run build
   ```

1. Copy `examples/config.example.json` and `examples/users.example.json` to `./config.json` and `./users.json`. Do not commit `users.json` to your repository, as it contains sensitive user data.

1. Run the bot:

   ```sh
   npm start
   ```

1. Scan the QR code in your terminal with a secondary WhatsApp account (Don't use your primary WhatsApp account to avoid risking a ban on primary account).

![Scan QR code screenshot][Scan QR code screenshot url]

1. Send hi to start, then set your API key (e.g. !grok xai-12345 or !chatgpt sk-proj-123-456).

### Testing

Run tests with:

```sh
npm test
```

## Usage

1. Send `hi` to get started.
1. Set your API key with `!grok <xAI-key>` or `!chatgpt <OpenAI-key>`. Ensure your xAI account has sufficient credits to make API requests. Check your credits at console.x.ai and add funds if needed.
1. Send messages to chat with your chosen AI.
1. Example: `!grok What’s the meaning of life?` returns Grok’s response.

<div align=right>

([back to top](#top))

</div>

## Roadmap

- [ ] Add Claude and Pi support.
- [ ] Implement rate limiting for messages.
- [ ] Explore server-side auth if xAI opens OAuth.

See the [open issues][Issues url] for a full list of proposed features (and known issues).

<div align=right>

([back to top](#top))

</div>

## Contributing

To add a feature or fix a bug, fork the repo and create a pull request.

Example instructions to add a feature:

1. Fork the Project
1. Create your Feature Branch (`git checkout -b feature/amazing-feature-YourName`)
1. Commit your Changes (`git commit -m 'Add some amazing feature'`)
1. Push to the Branch (`git push origin feature/amazing-feature-YourName`)
1. Open a Pull Request

To suggest a new feature or report a bug, open an issue.

<div align=right>

([back to top](#top))

</div>

## Changelog

See the changelog [here][changelog url].

<div align=right>

([back to top](#top))

</div>

## Contact Me

Sherpad Ndabambi

<span title="Personal website">[<img alt="Website icon" src="./assets/img/website-ui-web-svgrepo-com.svg" style="height: 32px">][Personal website url]</span>
<span title="Email">[<img alt="Gmail icon" src="./assets/img/gmail-old-svgrepo-com.svg" style="height: 32px">][Email address]<span>

<div align=right>

([back to top](#top))

</div>

## License

Distributed under the MIT License. See [LICENSE][License url] for more information.

<div align=right>

([back to top](#top))

</div>

## Notes

1. Uses Baileys (unofficial WhatsApp API). Keep usage low to avoid bans.
1. Deploy on Render, Glitch, or Vercel for free.
1. API keys are hashed in users.json; revoke if compromised.

## Acknowledgments

1. [Logo][Logo url] generated using AI
1. [Website icon][Website icon url] edited from [Website SVG vector][Website SVG vector url] from [SVG Repo][SVG Repo url].
1. [Gmail icon][Gmail icon url] edited from [Gmail SVG vector][Gmail SVG vector url] from [SVG Repo][SVG Repo url].
1. Images in this project have been compressed using [TinyPNG][TinyPNG url].
1. Parts of this README are based on the [Best-README-Template][Best-README-Template url] template.

<div align=right>

([back to top](#top))

</div>

<!-- References -->

[Logo url]: ./assets/img/jchat-logo-128x128.jpg
[Repo url]: https://github.com/SherpadNdabambi/jChat
[Contributors shield url]: https://img.shields.io/github/contributors/SherpadNdabambi/jchat.svg?style=flat
[Contributors url]: https://github.com/SherpadNdabambi/jchat/graphs/contributors
[Issues shield url]: https://img.shields.io/github/issues/SherpadNdabambi/jchat.svg?style=flat
[Issues url]: https://github.com/SherpadNdabambi/jchat/issues
[MIT License shield url]: https://img.shields.io/badge/license-MIT-blue?style=flat
[License url]: ./LICENSE
[jChat screenshot url]: ./assets/img/ezgif-1a01d5e6b9bb03.gif
[jChat url]: https://github.com/SherpadNdabambi/jChat
[Node.js shield url]: https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white
[Node.js url]: https://nodejs.org/
[Typescript shield url]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[Typescript url]: https://www.typescriptlang.org/
[npm url]: https://www.npmjs.com/
[Scan QR code screenshot url]: ./assets/img/scan-qr-code-screenshot.png
[changelog url]: ./CHANGELOG.md
[Personal website url]: https://sherpadndaabmbi.github.io/
[Email address]: mailto:sgndabambi@gmail.com
[Website icon url]: ./assets/img/website-ui-web-svgrepo-com.svg
[Website SVG vector url]: https://www.svgrepo.com/svg/415803/website-ui-web
[Gmail icon url]: ./assets/img/gmail-old-svgrepo-com.svg
[Gmail SVG vector url]: https://www.svgrepo.com/svg/349379/gmail-old
[TinyPNG url]: https://tinypng.com/
[Best-README-Template url]: https://github.com/othneildrew/Best-README-Template
