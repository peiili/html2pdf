const puppeteer = require('puppeteer');
class PDFService {
  constructor() {
    this.browser = null;
  }

  /**
   * 初始化 Puppeteer 浏览器
   */
  async init() {
    console.log('正在启动 Puppeteer 浏览器...');
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    console.log('Puppeteer 浏览器启动成功');
  }

  /**
   * 将 URL 转换为 PDF
   * @param {string} url - 要转换的网页 URL
   * @returns {Promise<Buffer>} PDF 文件缓冲区
   */
  async convertURLToPDF(url) {
    if (!this.browser) {
      throw new Error('浏览器未初始化');
    }

    let page = null;
    try {
      console.log(`正在访问 URL: ${url}`);
      page = await this.browser.newPage();

      // 设置超时和等待策略
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // 等待页面完全加载
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('正在生成 PDF...');
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '1cm',
          right: '1cm',
          bottom: '1cm',
          left: '1cm'
        }
      });
      console.log('PDF 生成成功');
      return pdfBuffer;

    } catch (error) {
      console.error('PDF 转换失败:', error.message);
      throw new Error(`PDF 转换失败: ${error.message}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  /**
   * 关闭浏览器实例
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('Puppeteer 浏览器已关闭');
    }
  }
}

module.exports = PDFService;