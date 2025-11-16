const http = require('http');
const URLValidator = require('../utils/urlValidator');

class HTTPServer {
  constructor(pdfService) {
    this.pdfService = pdfService;
    this.server = null;
  }

  /**
   * 处理 HTTP 请求
   * @param {Object} req - HTTP 请求对象
   * @param {Object} res - HTTP 响应对象
   */
  handleRequest(req, res) {
    // 只处理 /api/convert 路径
    if (req.url.startsWith('/api/convert')) {
      this.handleConvertRequest(req, res);
    } else {
      this.sendErrorResponse(res, 404, '接口不存在');
    }
  }

  /**
   * 处理 PDF 转换请求
   * @param {Object} req - HTTP 请求对象
   * @param {Object} res - HTTP 响应对象
   */
  handleConvertRequest(req, res) {
    // 只支持 GET 请求
    if (req.method !== 'GET') {
      this.sendErrorResponse(res, 405, '只支持 GET 请求');
      return;
    }

    let validatedURL;
    try {
      validatedURL = URLValidator.extractAndValidateURL(req);
    } catch (error) {
      this.sendErrorResponse(res, 400, error.message);
      return;
    }

    // 异步处理 PDF 转换
    this.pdfService.convertURLToPDF(validatedURL)
      .then(pdfBuffer => {
        this.sendPDFResponse(res, pdfBuffer);
      })
      .catch(error => {
        console.error('处理请求时出错:', error);
        this.sendErrorResponse(res, 500, error.message);
      });
  }

  /**
   * 发送 PDF 响应
   * @param {Object} res - HTTP 响应对象
   * @param {Buffer} pdfBuffer - PDF 文件缓冲区
   */
  sendPDFResponse(res, pdfBuffer) {
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename="converted.pdf"',
      'Content-Length': pdfBuffer.length
    });

    // 流式传输 PDF 数据
    res.end(pdfBuffer);

    console.log('PDF 流传输完成');
  }

  /**
   * 发送错误响应
   * @param {Object} res - HTTP 响应对象
   * @param {number} statusCode - HTTP 状态码
   * @param {string} message - 错误消息
   */
  sendErrorResponse(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: message }));
  }

  /**
   * 启动 HTTP 服务器
   * @param {number} port - 端口号，默认 3000
   * @returns {Promise<void>}
   */
  async start(port = 3000) {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this.handleRequest(req, res);
      });

      this.server.listen(port, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`HTML to PDF 服务已启动，监听端口: ${port}`);
          console.log(`使用示例: http://localhost:${port}/api/convert?url=https://baidu.com`);
          resolve();
        }
      });
    });
  }

  /**
   * 关闭 HTTP 服务器
   * @returns {Promise<void>}
   */
  async close() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          console.log('HTTP 服务器已关闭');
          resolve();
        });
      });
    }
  }
}

module.exports = HTTPServer;