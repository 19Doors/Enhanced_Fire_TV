"use client"
import StreamingLayout from "@/components/streamingLayout";
import hotstarData from "../../data/hotstar_content.json";
export default function Hotstar() {
  return(
    <>
      <StreamingLayout data={hotstarData} config={{name: "HotStar"}} />
    </>
  )
}
