const fs = require('fs/promises')
const path = require('path')


// fs.mkdirSync(path.resolve(__dirname,'dir'))

// fs.rmdirSync(path.resolve(__dirname,'dir'))

// fs.writeFileSync(path.resolve(__dirname,'test.txt'),'Файл Создан')
/*fs.writeFile(path.resolve(__dirname,'test.txt'),'Файл Создан',(err)=>{
    if (err){
        throw err
    }
    console.log('Файл создан')
})*/
/*
const writeFileAsync = async (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
                if (err) {
                    reject(err.message)
                }
                resolve()
            }
        )
    })
}

const appendFileAsync = async (path, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(path, data, (err) => {
                if (err) {
                    reject(err.message)
                }
                resolve()
            }
        )
    })
}


const readFileAsync = async (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, {encoding: "utf-8"}, (err,data) => {
                if (err) {
                    reject(err.message)
                }
                resolve(data)
            }
        )
    })
}

writeFileAsync(testPath, 'some_word')
    .then(() => appendFileAsync(testPath, '1'))
    .then(() => appendFileAsync(testPath, '2'))
    .then(() => appendFileAsync(testPath, '3'))
    .then(()=>readFileAsync(testPath))
    .then(data=>console.log(data))
    .catch(err => console.log(err))*/


const testPath = path.resolve(__dirname, 'test2.txt')

const word = process.env.WORD

fs.writeFile(path.resolve(testPath), word)
    .then(() => fs.readFile(testPath, {encoding: 'utf-8'})
        .then(data => data.split(' ').length))
    .then(data => fs.writeFile(path.resolve(__dirname, 'count.txt'), `Количество слов ${data}`))
    .then(()=>fs.rm(testPath))
