"use client";
import StreamingLayout from "@/components/streamingLayout";
import netflixData from "../../data/netflix_content.json";

export default function Netflix() {
  return (
    <>
      <StreamingLayout data={netflixData} config={{name: "NetFlix"}} />
    </>
  );
}
