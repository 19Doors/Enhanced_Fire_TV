"use server";

let init_url = "http://localhost:8080";
export async function createRoom() {
  let toSend = {
    "host_user_id": "sakaar",
    "room_name": "test1",
    "content_id": "01"
  }
  let response = await fetch(
    init_url+"/social-viewing/create-room",
    {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(toSend),
    },
  );
  const data = await response.json();
  console.log(data);
  return data;
}
