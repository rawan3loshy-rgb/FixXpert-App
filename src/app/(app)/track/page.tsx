"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BackButton from "@/components/BackButton"

export default function TrackPage(){

const router = useRouter()
const [order,setOrder] = useState("")

const handleTrack = () => {

if(!order) return

router.push(`/track/${order}`)

}

return(

<div style={{padding:"40px"}}>
<BackButton />
<h2>Track Repair</h2>

<input
placeholder="Enter Order Number"
value={order}
onChange={(e)=>setOrder(e.target.value)}
style={{
padding:"10px",
border:"1px solid #ccc",
borderRadius:"6px",
marginRight:"10px"
}}
/>

<button onClick={handleTrack}>
Track
</button>

</div>

)

}