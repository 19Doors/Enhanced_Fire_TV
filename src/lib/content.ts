"use server"

export async function getContentNetflix() {
  let response = await fetch("http://localhost:8080/content-aggregation/getContentNetflix");
  const data = await response.json();
  return data;
}
export async function getContentPrime() {
  let response = await fetch("http://localhost:8080/content-aggregation/getContentPrime");
  const data = await response.json();
  return data;
}
export async function getContentHotstar() {
  let response = await fetch("http://localhost:8080/content-aggregation/getContentHotstar");
  const data = await response.json();
  return data;
}
