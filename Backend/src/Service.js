const Express=require('express')
const BodyParser=require('body-parser')
// const logger=require('./logger')

class Service{
    constructor(name){
        this.app=Express()
        this.app.use(BodyParser.json())
        this.name=name
    }

    start(){
        try {
            this.app.listen(3000()).on('listening',()=>logger.info(`Started ${this.name} service`))
               } catch (err) {
            throw new Error(err)
        }
    }
}