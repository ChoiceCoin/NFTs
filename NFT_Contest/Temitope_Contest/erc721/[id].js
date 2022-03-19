const metadata = {
    1: {
      attributes: [
        {
          trait_type: "Shape",
          value: "Circle",
        },
        {
          trait_type: "Mood",
          value: "Sad",
        },
      ],
      description: "Choice Coin.",
      image: "https://choice-coin.com/Screenshot%202021-06-25%20at%2023-38-44%20Logo%20Maker%20Used%20By%202%203%20Million%20Startups.png",
      name: "Choice Coin",
    },
    2: {
      attributes: [
        {
          trait_type: "Shape",
          value: "Rectangle",
        },
        {
          trait_type: "Mood",
          value: "Angry",
        },
      ],
      description: "Choice Coin",
      image: "https://choice-coin.com/Screenshot%202021-06-25%20at%2023-38-44%20Logo%20Maker%20Used%20By%202%203%20Million%20Startups.png",
      name: "Choice Coin",
    },
    3: {
      attributes: [
        {
          trait_type: "Shape",
          value: "Triangle",
        },
        {
          trait_type: "Mood",
          value: "Bored",
        },
      ],
      description: "Choice Coin",
      image: "https://choice-coin.com/Screenshot%202021-06-25%20at%2023-38-44%20Logo%20Maker%20Used%20By%202%203%20Million%20Startups.png",
      name: "Choice Coin",
    },
  };
  
  export default function handler(req, res) {
    res.status(200).json(metadata[req.query.id] || {});
  }