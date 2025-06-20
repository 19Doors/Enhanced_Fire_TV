"use server";

let init_url = "http://localhost:8080";
export async function createRoom(room_name, content_id, content) {
  let toSend = {
    host_user_id: "sakaar",
    room_name: room_name,
    content_id: content_id,
    content: content
  };
  console.log(toSend);
  let response = await fetch(init_url + "/social-viewing/create-room", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(toSend),
  });
  const data = await response.json();
  console.log(data);
  return data;
}

export async function joinRoom(room_code) {
  let toSend = {
    room_id: room_code,
    user_id: "guest",
  };
  console.log(toSend);
  let response = await fetch(init_url + "/social-viewing/join-room", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(toSend),
  });
  const data = await response.json();
  console.log("JOIN ROOM");
  console.log(data);
  return data;
}
