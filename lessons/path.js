const path=require('path')

/*console.log('join',path.join(__dirname))
const fullPath=('resolve',path.resolve('first','second.js'))

console.log(path.parse(fullPath))
console.log(path.extname(fullPath))*/

const siteUrl='https://localhost:8008/users?id=2'

const url=new URL(siteUrl)

console.log(url)
