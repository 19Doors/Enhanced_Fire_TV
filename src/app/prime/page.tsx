"use client"
import StreamingLayout from "@/components/streamingLayout";
import primeContent from "../../data/prime_video_content.json";

export default function Prime() {
  return(
    <>
      <StreamingLayout data={primeContent} config={{name:"PrimeVideo"}}/>
    </>
  )
}
