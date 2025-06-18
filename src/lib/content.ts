"use server";

let init_url = "http://35.244.41.155:8080"
export async function getContentNetflix() {
  let response = await fetch(
    init_url+"/content-aggregation/getContentNetflix",
  );
  const data = await response.json();
  return data;
}
export async function getContentPrime() {
  let response = await fetch(
    init_url+"/content-aggregation/getContentPrime",
  );
  const data = await response.json();
  return data;
}
export async function getContentHotstar() {
  let response = await fetch(
    init_url+"/content-aggregation/getContentHotstar",
  );
  const data = await response.json();
  return data;
}

export async function userInteraction(interaction) {
  let toSend = {};
  console.log(interaction);
  if (interaction.watchTime == 0) {
    toSend = {
      user_id: "01",
      interaction_type: interaction.type,
      content_id: interaction.context_data.id,
      content_type: interaction.context_data.type,
      content_platform: interaction.context_data.platform,
      context_data: {
        title: interaction.context_data.title,
        rating: interaction.context_data.rating,
        mood_tags: interaction.context_data.mood_tags,
        genres: interaction.context_data.genres,
        release_date: interaction.context_data.release_date,
        overview: interaction.context_data.overview,
      },
    };
  } else {
    toSend = {
      user_id: "01",
      interaction_type: interaction.type,
      content_id: interaction.context_data.id,
      content_type: interaction.context_data.type,
      content_platform: interaction.context_data.platform,
      watchProgress: interaction.watchProgress,
      context_data: {
        title: interaction.context_data.title,
        rating: interaction.context_data.rating,
        mood_tags: interaction.context_data.mood_tags,
        genres: interaction.context_data.genres,
        release_date: interaction.context_data.release_date,
        overview: interaction.context_data.overview,
      },
    };
  }
  console.log(toSend);
  let response = await fetch(
    init_url+"/content-aggregation/track-interaction",
    {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(toSend),
    },
  );
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Validation error:", errorData);
    return;
  }
}
