const cluster=require('cluster')
const os=require('os')
const logger=require('./logger')
const config=require('./config/service.config')
const MealPlannarService=require('./MealplannerService')

if(cluster.isMaster){
    console.log(`Master ${process.pid} is running`)
    for(let i=0;i<os.cpus().length;i++){
        cluster.fork()
    }
    cluster.on('exit',worker=>{
        console.log(`Worker ${worker.process.pid} died`)
        cluster.fork()
    })
}else{
    require('./server')
}