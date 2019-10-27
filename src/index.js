const app = require('./app');

//Staring server
app.listen( app.get('port'), () =>{
    console.log(`Server on port ${app.get('port')}`);
    
});

