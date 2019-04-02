import {
    read,
    modify
} from '@/api/index'

export function login(params) { //登录
    return modify('/admin-api/login', params)
}

export function qyLogin(params) { //企业登录
    return modify('/admin-api/companyLogin', params)
}

export function getinfo() {
    return read('/admin-api/info')
}

export function regist(params) {
    return modify('/admin-api/regist', params)
}

export async function getRoles() {
    return read('/admin-api/routers')
}
