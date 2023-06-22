export const Formatter = {
  parseRequestURL: () => {
    const url = location.hash.slice(1) || '/'
    const r = url.split('/')
    const request = {
      resource: null,
      id: null,
    }
    request.resource = r[1]
    request.id = r[2]

    return request
  },
}
