<p align="center"><a href="https://www.jeffjade.com/2019/08/25/156-arya-jarvis-born-for-efficiency/?utm_source=github.com" target="_blank"><img width="100"src="https://raw.githubusercontent.com/nicejade/arya-jarvis/master/assets/images/logo.png"></a></p>

<h1 align="center">ARYA JARVIS</h1>

<div align="center">
  <strong>
    Designed to save developers more time and energy.
  </strong>
</div>

<br>

<div align="center">
  <a href="https://nodejs.org/en/">
    <img src="https://img.shields.io/badge/node-%3E%3D%208.0.0-green.svg" alt="Node Version">
  </a>
  <a href="https://github.com/nicejade/arya-jarvis">
    <img src="https://img.shields.io/github/license/nicejade/arya-jarvis" alt="LICENSE">
  </a>
  <a href="https://site.lovejade.cn/post/5c16083e819ae45de1453caa">
    <img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat" alt="Prettier">
  </a>
  <a href="https://www.jeffjade.com/2019/08/25/156-arya-jarvis-born-for-efficiency/">
    <img src="https://img.shields.io/badge/chat-on%20blog-brightgreen.svg" alt="Arya Jarvis">
  </a>
  <a href="https://hacpai.com/article/1569170714522">
   <img src="https://img.shields.io/badge/Chat-on%20hacpai-brightgreen.svg" alt="Chat On Hacpai">
  </a>
  <a href="https://weibo.com/jeffjade">
    <img src="https://img.shields.io/badge/WeiBo-jeffjade-red.svg?style=flat" alt="Arya Jarvis">
  </a>
  <a href="https://www.thebettersites.com/?utm_source=github.com">
    <img src="https://img.shields.io/badge/Author-nicejade-%23a696c8.svg" alt="Author nicejade">
  </a>
</div>

### English | [中文](https://arya.lovejade.cn/#/zh-cn)

## Goal and Philosophy

The ideal goal is to help us deal with things that can be more precise in the simplest way. `Arya Jarvis` is an attempt to do this, it designed to save developers more time and energy.

## Prerequisites

[Node.js](https://nodejs.org/en/) (>= 8.\*), Npm version 5+ ([Yarn](https://www.jeffjade.com/2017/12/30/135-npm-vs-yarn-detial-memo/) preferred).

## Install

```bash
pnpm add -g arya-jarvis
# OR
yarn global add arya-jarvis
# OR
npm i arya-jarvis -g
```

## Usage

### 🚀 Copy the current path to the clipboard.

In macOS, if you need to quickly obtain the path of the current directory in Terminal, you can use several methods: You can directly type pwd (Print Working Directory) in Terminal and press enter. This will display the full path of the current working directory. You can manually copy this path, or proceed to the next step to copy it to the clipboard. Alternatively, you can create an alias or use the following command to copy the current directory path to the clipboard:

```bash
pwd | pbcopy
```

However, these operations aren't as convenient and quick as desired. Therefore, in `arya`, the following feature has been implemented to print the current path and copy it to the clipboard 📋:

```bash
arya copy:pwd
# 👏 Or Use Alias
arya pwd
```

### 🔐 Generate random secure password

```bash
arya password
# 👏 Or Use Alias
arya pw
```

#### Options:

- Length (`-l`, `--length`): Specify password length (default: 8)
- Special (`-s`, `--special`): Whether special characters are needed(default true).

Examples:

```bash
# Generate 16 character password with all character types
arya password -l 16 -s

# Generate password with only numbers(16) and letters
arya pw -l 16

# Quick generate with default settings
arya pw
```

The following two functions can support multiple format files, such as: `.js`, `.vue`, `.ux`, `.less`, `.scss`, `.css`, `.json`, `.md`, `.html`, `.qxml`, `.wxml`.

### 💄 Prettier the code under the specified path.

```bash
arya prettier index.js
# 👏 Or Use Alias
arya p ./src/**/**/*.js
# 👍🙌 Or Use Alias & Wildcard
arya p .
```

### 🔬 Listen for code changes in the specified path and prettier them.

```bash
arya watcher index.js
# 👏 Or Use Alias
arya w ./src/**/**/*.js
# 👍🙌 Or Use Alias & Wildcard
arya w .
```

It is worth mentioning that the code formatting of this project is handled by `arya w .`. Thanks to myself for developing this `arya jarvis` in my spare time, **I am super like it**.

### 🌍 Used to quickly build a local web server.

```bash
arya server
# 👏 Or Use Alias
arya s
```

### 🌊 One-click preview of the specified Markdown file

```bash
arya markdown README.md
arya markdown ./nice-project/README.md
# 👏 Or Use Alias
arya m README.md
```

#### Watcher (`-w` , `--watch`)

By default, the `Markdown` file you specify will not be listened. You can enable the monitor function by adding the `-w` option to refresh your preview page in real time. See the example below：

```bash
arya markdown README.md -w
arya markdown README.md --watch
```

### ⚡️ Find your local IP address and print it.

```bash
arya ip
```

### 👀 View programs that occupy the specified port.

```bash
arya port 8080
```

### 📷 Generate QR code for specified text

```bash
arya qrcode "https://www.jeffjade.com/"
arya qrcode "晚晴幽草轩轩主"
```

#### Save (`-s` , `--save`)

```bash
arya qrcode "https://site.lovejade.cn/" -s
arya qrcode "https://www.lovejade.cn/" --save
```

### ✂️ Clear the terminal screen if possible

```bash
arya clear
# Or
arya c
```

On Mac OS, if you want to implement this function, you can run the `clear` command on the terminal; but this is not particularly convenient; you can use `oh-my-zsh` to configure the command alias in the `.zshrc` file: _alias cls= 'clear'_; in this case, running `cls` is enough to clear the terminal screen content; and this is another case on Windows systems; in this case, using `arya c` is a pretty good choice.

### 📷 Greyscale: remove colour from the image.

```bash
arya img:greyscale <path>

# 👏 Or Use Alias
arya igs <path>
# local folder
arya igs ./assets/images
# local image file
arya igs ./assets/images/logo.png
# online image address
arya igs https://www.lovejade.cn/logo.png
```

All processed pictures are placed in a new folder: `arya-greyscale-imgs`. Supported Image Types: `.bmp`, `.gif`, `.jpeg`, `.jpg`, `.png`, `.tiff`.

### 🚝 List the script commands in package.json.

```bash
arya ls
# 👏 Or Use Alias
arya l
```

In addition, [arya jarvis](https://github.com/nicejade/arya-jarvis) is still implanting more useful features, if you have any needs, you can tell me, or expand on this basis. If you encounter any problems during use, you can always follow me feedback. Wish: Life is happy and work is well.

## Recommended links

- [清风明月轩](https://www.thebettersites.com/?ref=github.com)
- [逍遥自在轩](https://niceshare.site/?ref=github.com)
- [晚晴幽草轩](https://www.jeffjade.com/nicelinks?ref=github.com)
- [静轩之别苑](https://quickapp.lovejade.cn/?ref=github.com)
- [悠然宜想亭](https://forum.lovejade.cn//?ref=github.com)
- [静晴轩别苑](https://nice.lovejade.cn/?ref=github.com)
- [倾城之链 🚥](https://site.lovejade.cn/?utm_source=github.com)
- [SegmentFault](https://segmentfault.com/u/jeffjade)
- [X | MarshalXuan](https://x.com/MarshalXuan)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, [nicejade](https://www.niceshare.site/?utm_source=arya.lovejade.cn).
