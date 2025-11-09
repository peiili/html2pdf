const { URL } = require('url');

/**
 * URL 验证工具类
 */
class URLValidator {
  /**
   * 验证 URL 是否有效
   * @param {string} urlString - 要验证的 URL 字符串
   * @returns {string} 验证通过的 URL
   * @throws {Error} 如果 URL 无效
   */
  static validateURL(urlString) {
    try {
      const url = new URL(urlString);

      // 验证协议
      if (!['http:', 'https:'].includes(url.protocol)) {
        throw new Error('仅支持 HTTP 和 HTTPS 协议');
      }

      // 验证主机名
      if (!url.hostname) {
        throw new Error('URL 必须包含有效的主机名');
      }

      return urlString;
    } catch (error) {
      throw new Error(`无效的 URL: ${error.message}`);
    }
  }

  /**
   * 从请求中提取并验证 URL 参数
   * @param {Object} req - HTTP 请求对象
   * @returns {string} 验证通过的 URL
   * @throws {Error} 如果缺少 URL 参数或 URL 无效
   */
  static extractAndValidateURL(req) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const urlParam = parsedUrl.searchParams.get('url');

    if (!urlParam) {
      throw new Error('缺少 URL 参数');
    }

    return this.validateURL(urlParam);
  }
}

module.exports = URLValidator;