import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

// create an axios instance
const request = axios.create({
  baseURL: '/endpoint',
  timeout: 60000 // request timeout
})

// request interceptor
request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.error(error)
    return Promise.reject(error)
  }
)

// response interceptor
request.interceptors.response.use(
  (response) => {
    const res = response.data
    console.log('res', res)
    if (res.code && res.code === 200) {
      // 返回数据
      return Promise.resolve(res.data)
    }

    // 其他异常
    console.error(response)
    ElMessage.error({ message: res.msg, duration: 5 * 1000 })
    return Promise.reject(response)
  },
  (error) => {
    if (error.response && error.response.status === 500 && error.response.data.msg) {
      ElMessage.error({ message: error.response.data.msg, duration: 5 * 1000 })
    } else {
      console.error(error)
    }
    return Promise.reject(error)
  }
)

/**
 * post请求
 */
export const postRequest = (url, data = {}) => {
  return request({ url: url, data: data ? data : {}, method: 'post' })
}

/**
 * get请求
 */
export const getRequest = (url,params={}) => {
  return request({ url: url, method: 'get',params: params ? params : {}})
}

/**
 * put请求
 */
export const putRequest = (url, data = {}) => {
  return request({ url: url, data: data ? data : {}, method: 'put' })
}

/**
 * delete请求
 */
export const deleteRequest = (url) => {
  return request({ url: url, method: 'delete' })
}

export const upload = (url, file, fileName, cb, cancelFun) => {
  const formData = new FormData()
  formData.append(fileName, file)
  const config = {
    onUploadProgress: (progressEvent) => {
      const percent = Number(((progressEvent.loaded / progressEvent.total) * 100).toFixed(2))
      // 计算上传进度
      if (cb) {
        cb(percent)
      }
    }
  }
  if (cancelFun) {
    config.cancelToken = new axios.CancelToken(function excutor(c) {
      cancelFun.cancel = c
    })
  }

  return request.post(url, formData, config)
}

const isEmpty = (value) => {
  return !(value != null && value !== '' && typeof value !== 'undefined')
}

function objectToQuery(params) {
  let query = ''
  for (const props of Object.keys(params)) {
    const value = params[props]
    if (!isEmpty(value)) {
      query += `${props}=${value}&`
    }
  }
  return query.slice(0, -1)
}

