"use client";
import StreamingLayout from "@/components/streamingLayout";
import { getContentHotstar } from "@/lib/content";
import { useEffect, useState } from "react";

export default function Prime() {
  const [hotstarData, setHotstarData] = useState({"content":[]});
  useEffect(() => {
    async function fetchHotstarContent() {
      try {
        const content = await getContentHotstar();
        setHotstarData(content);
      } catch (e) {}
    }
    fetchHotstarContent();
  },[]);
  return (
    <>
      <StreamingLayout data={hotstarData} config={{ name: "HotStar" }} />
    </>
  );
}
