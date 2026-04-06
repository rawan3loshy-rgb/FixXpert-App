"use client"

import { useRouter } from "next/navigation"

export default function BackButton(){

const router = useRouter()

return(

<button
onClick={()=>router.push("/dashboard")}
style={{
marginBottom:"20px",
padding:"8px 14px",
borderRadius:"6px",
border:"1px solid #ccc",
cursor:"pointer"
}}
>

← Back to Dashboard

</button>

)

}