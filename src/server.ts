import app from './app';
import './config/env';

const Port = process.env.PORT;

app.listen(Port,() =>{ 
    console.log(`Server is running on port ${Port}`);
})  