"use client";
import StreamingLayout from "@/components/streamingLayout";
import { getContentNetflix } from "@/lib/content";
import { useEffect, useState } from "react";

export default function Netflix() {
  const [netflixData, setNetflixData] = useState({"content":[]});
  useEffect(() => {
    async function fetchNetflixContent() {
      try {
        const content = await getContentNetflix();
        setNetflixData(content);
      } catch (e) {}
    }
    fetchNetflixContent();
  },[]);
  return (
    <>
      <StreamingLayout data={netflixData} config={{ name: "NetFlix" }} />
    </>
  );
}
