import axios from 'axios'

export default axios.create({
  baseURL: 'http://13.124.143.208/location/',
  responseType: 'json',
})
