// 加载环境变量
require('dotenv').config();

const AppService = require('./services/appService');

/**
 * 主应用入口文件
 * 使用模块化的服务架构
 */

// 如果直接运行此文件，则启动服务
if (require.main === module) {
  const app = new AppService();

  // 从环境变量获取端口，默认 3333
  const port = process.env.PORT || 3333;

  app.start(port).catch(error => {
    console.error('服务启动失败:', error);
    process.exit(1);
  });
}

module.exports = AppService;