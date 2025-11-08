const verifyRoles=(...allowedRoles)=>{
    console.log("Verifying roles !")
    return (req,res,next) =>{
        if(!req?.roles) return res.sendStatus(401);

        const rolesArray=[...allowedRoles];

        console.log("Roles array : ",rolesArray);
        console.log("Request Roles : ",req.roles);

        const result=req.roles.map(role=>rolesArray.includes(role)).find(val=>val===true);
        console.log("Result",result);

        if(!result) return res.sendStatus(401);
        next();


    }
}

module.exports=verifyRoles;