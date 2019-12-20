export default (text) => text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
