
const validationUserMiddleware=(schema)=>{
    return(req,res,next)=>{
        const result=schema.safeParse(req.body);
        console.log(result);
        if(!result.success){
            return res.status(400).json({
                success:false,
                errors:result.error.issues.map((item)=>({
                    field:item.path.join("."),  
                    message:item.message
                }))
            })
        }
        req.body=result.data;
        next();
    }
}

export default validationUserMiddleware