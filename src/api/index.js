import { postRequest, getRequest } from "../utils/request"

export const getConfigApi = () => {
  return getRequest("/config")
}

export const registration = (data) => {
  return postRequest("/registration/add", data)
}

export const consultation = (data) => {
  return postRequest("/consultation/add", data)
}

export const consultationList = (data) => {
  return getRequest("/consultation/list", data)
}

export const getOrgListApi = () => {
  return getRequest("/org/list")
}

export const postUploadApi = (data) => {
  return postRequest("/thesis/file/upload", data)
}

export const postAddThesisApi = (data) => {
  return postRequest("/thesis/add", data)
}

export const postAddPicturesApi = (data) => {
  return postRequest("/pictures/add", data)
}

export const getThesisListApi = (data) => {
  return getRequest("/thesis/list", data)
}

export const getGraduatesListApi = (data) => {
  return getRequest("/graduates/list", data)
}

export const getGraduatesListAllApi = (data) => {
  return getRequest("/graduates/list_all", data)
}

export const getConferenceByYearApi = (year) => {
  return getRequest("/graduates/by-year", { year })
}

export const getAgendaListApi = (data) => {
  return getRequest("/agenda/list", data)
}

export const getPicturesListApi = (data) => {
  return getRequest("/pictures/list", data)
}

// 发票申请
export const invoiceApply = (data) => {
  return postRequest("/invoice/add", data)
}

export const getCaptchaApi = (data) => {
  return getRequest("/captcha/list", data)
}

export const postCaptchaApi = (data) => {
  return postRequest("/captcha/verify", data)
}

export const checkPasswordApi = (data) => {
  return postRequest("/registration/check_password", data)
}