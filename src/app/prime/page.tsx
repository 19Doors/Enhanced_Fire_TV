"use client";
import StreamingLayout from "@/components/streamingLayout";
import { getContentPrime } from "@/lib/content";
import { useEffect, useState } from "react";

export default function Prime() {
  const [primeData, setPrimeData] = useState({"content":[]});
  useEffect(() => {
    async function fetchPrimeContent() {
      try {
        const content = await getContentPrime();
        setPrimeData(content);
      } catch (e) {}
    }
    fetchPrimeContent();
  },[]);
  return (
    <>
      <StreamingLayout data={primeData} config={{ name: "PrimeVideo" }} />
    </>
  );
}
