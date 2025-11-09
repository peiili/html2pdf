# html2pdf
这是一个用于将web前端网页通过后端服务生成pdf的服务端工具，主要使用[Puppeteer](https://pptr.dev/guides/what-is-puppeteer)进行实现

What is Puppeteer?
Puppeteer is a JavaScript library which provides a high-level API to control Chrome or Firefox over the DevTools Protocol or WebDriver BiDi. Puppeteer runs in the headless (no visible UI) by default but can be configured to run in a visible ("headful") browser.

*系统环境*： ubuntu 22.04

*nodejs* : 20.9

*系统依赖*：
```shell
sudo apt update
sudo apt install \
libasound2 \
libatk-bridge2.0-0 \
libatk1.0-0 \
libatspi2.0-0 \
libc6 \
libcairo2 \
libcups2 \
libdbus-1-3 \
libdrm2 \
libexpat1 \
libgbm1 \
libglib2.0-0 \
libnspr4 \
libnss3 \
libpango-1.0-0 \
libpangocairo-1.0-0 \
libstdc++6 \
libudev1 \
libuuid1 \
libx11-6 \
libx11-xcb1 \
libxcb-dri3-0 \
libxcb1 \
libxcomposite1 \
libxcursor1 \
libxdamage1 \
libxext6 \
libxfixes3 \
libxi6 \
libxkbcommon0 \
libxrandr2 \
libxrender1 \
libxshmfence1 \
libxss1 \
libxtst6

```
*[更多系统依赖](https://pptr.dev/guides/system-requirements)*：

