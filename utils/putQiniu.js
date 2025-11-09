const qiniu = require('qiniu');
const { Readable } = require('stream');

function formatDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function putQiniu(name, buffer, cb) {
    // 从环境变量获取七牛云配置
    const accessKey = process.env.QINIU_ACCESS_KEY;
    const secretKey = process.env.QINIU_SECRET_KEY;
    const bucket = process.env.QINIU_BUCKET;
    const domain = process.env.QINIU_BUCKET_DOMAIN;

    // 验证配置
    if (!accessKey || !secretKey || !bucket || !domain) {
        const error = new Error('七牛云配置不完整，请检查环境变量');
        if (cb) {
            cb(error, null);
        }
        throw error;
    }

    // 创建一个自定义的可读流
    const readableStream = new Readable({
        read() {
            // 一次性将Buffer中的数据全部推送到流中
            this.push(buffer);
            // 标记流的末尾
            this.push(null);
        }
    });

    // 使用流
    readableStream.on('data', (chunk) => {
        console.log(`Received ${chunk.length} bytes of data.`);
        // 注意：这里实际会打印整个Buffer的长度，因为我们在read方法中一次性推送了所有内容
    });

    readableStream.on('end', () => {
        console.log('No more data in stream.');
    });

    // 触发流的读取
    readableStream.resume();

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
        force: true,
        scope: bucket,
        expires: 7200
    };
    const config = new qiniu.conf.Config();
    config.regionsProvider = qiniu.httpc.Region.fromRegionId('z0');
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const key = 'pdf/' + name + '-' + formatDate() + '.pdf';
    const path = 'https://' + domain + '/' + key;

    formUploader.putStream(uploadToken, key, readableStream, putExtra)
        .then(({ data, resp }) => {
            if (resp.statusCode === 200) {
                const bucketManager = new qiniu.rs.BucketManager(mac, config);
                const headers = {
                    'Content-Type': 'application/octet-stream',
                };
                bucketManager.changeHeaders(bucket, key, headers)
                    .then(({ data, resp }) => {
                        if (cb) {
                            cb(null, { data, resp, path });
                        }
                    })
                    .catch(err => {
                        console.log('failed', err);
                        if (cb) {
                            cb(err, null);
                        }
                    });
            } else {
                if (resp.statusCode === 614) {
                    if (cb) {
                        cb(null, { data, resp, path });
                    }
                } else {
                    console.log(data);
                    if (cb) {
                        cb(new Error(`上传失败，状态码: ${resp.statusCode}`), null);
                    }
                }
            }
        })
        .catch(err => {
            console.log('failed', err);
            if (cb) {
                cb(err, null);
            }
        });
}

 module.exports = putQiniu