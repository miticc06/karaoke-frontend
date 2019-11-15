export default err => {
    if (err && err.message && /^Network error:/.test(err.message)) {
        return 'Lỗi kết nối!'
    }
    if (err.graphQLErrors) {
        return err.graphQLErrors.map(error => error.message).join(',')
    }
    if (err.message) {
        return err.message
    }
}  