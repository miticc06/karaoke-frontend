export default err => {
    if (err && err.message && /^Network error:/.test(err.message)) {
        return 'Lỗi kết nối!'
    } 
    return err.graphQLErrors.map(error => error.message).join(',')
}