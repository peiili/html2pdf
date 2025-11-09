const PDFService = require('./pdfService');
const HTTPServer = require('./httpServer');

/**
 * 主应用服务类，协调所有服务
 */
class AppService {
  constructor() {
    this.pdfService = null;
    this.httpServer = null;
  }

  /**
   * 初始化所有服务
   */
  async init() {
    console.log('正在初始化服务...');

    // 初始化 PDF 服务
    this.pdfService = new PDFService();
    await this.pdfService.init();

    // 初始化 HTTP 服务器
    this.httpServer = new HTTPServer(this.pdfService);

    console.log('所有服务初始化完成');
  }

  /**
   * 启动应用
   * @param {number} port - 端口号，默认 3000
   */
  async start(port = 3000) {
    try {
      await this.init();
      await this.httpServer.start(port);
      this.setupGracefulShutdown();
    } catch (error) {
      console.error('应用启动失败:', error);
      await this.close();
      throw error;
    }
  }

  /**
   * 设置优雅关闭处理
   */
  setupGracefulShutdown() {
    // 优雅关闭
    process.on('SIGINT', async () => {
      console.log('正在关闭服务...');
      await this.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('正在关闭服务...');
      await this.close();
      process.exit(0);
    });
  }

  /**
   * 关闭所有服务
   */
  async close() {
    console.log('正在关闭所有服务...');

    if (this.httpServer) {
      await this.httpServer.close();
    }

    if (this.pdfService) {
      await this.pdfService.close();
    }

    console.log('所有服务已关闭');
  }
}

module.exports = AppService;