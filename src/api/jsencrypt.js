import { JSEncrypt } from 'jsencrypt' //加密

// 用户公钥
const userPublicKey = "-----BEGIN PUBLIC KEY-----MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgET7mH7VkWXtHa+avbl0gxvnXBJ58rrNmG34nrSqJTEA65/6nPCKrUq7fKn8qA8dwMtaQ8XUoIh7SnzJNA6icXxsYuYHPojt7SEQFxjM5SAF17HTkH5XbEkTDvzCsglj7tkuEzTbbHukkQBBYKvl530a10aPb2vgOwYHRmI1MgGnAgMBAAE=-----END PUBLIC KEY-----"
export function encrypt(str) {
    return new Promise((resolve, reject) => {
        let encryptor = new JSEncrypt()
        let key = userPublicKey;
        encryptor.setPublicKey(key)
        let rsaPassWord = encryptor.encrypt(str)
        if (rsaPassWord) {
            return resolve(rsaPassWord)
        } else {
            reject({ 'err': "" })
        }
    })
}
