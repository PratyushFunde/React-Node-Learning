const express=require("express");
const cors=require("cors");
const { logger } = require("./middleware/logEvents");
const userRouter=require("./routes/user");
const app=express();
const cookieParser=require('cookie-parser');

app.use(cors());

app.use(logger);

app.use(express.urlencoded({extended:false}));

app.use(express.json());

app.use(cookieParser());

app.use("/api/user",userRouter);

PORT=3500;

app.listen(PORT,()=>console.log(`Server is listening on PORT ${PORT}`))

