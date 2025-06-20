"use server";

import { backend_social } from "./urls";

// let init_url = "http://35.244.41.155:3002";
// let init_url = "http://34.47.135.240:3002"
let init_url = backend_social
// let init_url = "http://127.0.0.1:8000";
export async function createRoom(room_name, content_id, content) {
  let toSend = {
    host_user_id: "sakaar",
    room_name: room_name,
    content_id: content_id,
    content: content
  };
  console.log(toSend);
  let response = await fetch(init_url + "/create-room", {
  // let response = await fetch(init_url + "/create-room", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(toSend),
  });
  console.log(response)
  const data = await response.json();
  console.log("DATA RE")
  console.log(data);
  return data;
}

export async function joinRoom(room_code) {
  let toSend = {
    room_id: room_code,
    user_id: "guest",
  };
  console.log(toSend);
  // let response = await fetch(init_url + "/social-viewing/join-room", {
  let response = await fetch(init_url + "/join-room", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(toSend),
  });
  const data = await response.json();
  console.log("JOIN ROOM");
  console.log(data);
  return data;
}
