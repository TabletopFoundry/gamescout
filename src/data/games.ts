export interface GameSeed {
  id: number;
  name: string;
  year: number;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  minPlaytime: number;
  maxPlaytime: number;
  complexity: number; // 1-5
  bggRating: number; // 1-10
  bggRank: number;
  categories: string[];
  mechanics: string[];
  designer: string;
  publisher: string;
  imageUrl: string;
  thumbnailUrl: string;
  // Mock price data
  prices: { retailer: string; price: number; url: string; updatedAt: string }[];
}

export const GAMES: GameSeed[] = [
  {
    id: 1,
    name: "Catan",
    year: 1995,
    description:
      "In Catan, players try to be the dominant force on the island of Catan by building settlements, cities, and roads. On each turn dice are rolled to determine what resources the island produces. Players build by spending resources (sheep, wheat, wood, brick and ore) that are depicted by these resource cards.",
    minPlayers: 3,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 120,
    complexity: 2.3,
    bggRating: 7.1,
    bggRank: 420,
    categories: ["Negotiation", "Territory Building"],
    mechanics: ["Dice Rolling", "Trading", "Modular Board"],
    designer: "Klaus Teuber",
    publisher: "Catan Studio",
    imageUrl:
      "https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__imagepage/img/M_3Vg1j2HlNgkv7PL5bMGD2-nDo=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2419375.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__thumb/img/8a9HeqFydO7UnHUVQaTCjMBh850=/fit-in/200x150/filters:strip_icc()/pic2419375.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 44.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Target",
        price: 49.99,
        url: "https://target.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "GameNerdz",
        price: 42.99,
        url: "https://gamenerdz.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 2,
    name: "Ticket to Ride",
    year: 2004,
    description:
      "Ticket to Ride is a cross-country train adventure game. Players collect train cards that enable them to claim railway routes connecting cities throughout North America.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 45,
    maxPlaytime: 90,
    complexity: 1.9,
    bggRating: 7.4,
    bggRank: 200,
    categories: ["Route/Network Building", "Transportation"],
    mechanics: ["Card Drafting", "Route/Network Building", "Set Collection"],
    designer: "Alan R. Moon",
    publisher: "Days of Wonder",
    imageUrl:
      "https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__imagepage/img/A_r2-K3uqm0m6ADDPBCBxQnHBeE=/fit-in/900x600/filters:no_upscale():strip_icc()/pic38668.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/ZWJg0dCdrWHxVnc0eFXK8w__thumb/img/g0aac5bSHNDzRlNOEU7RHRrXi8E=/fit-in/200x150/filters:strip_icc()/pic38668.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 39.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Target",
        price: 44.99,
        url: "https://target.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 3,
    name: "Pandemic",
    year: 2008,
    description:
      "In Pandemic, several virulent diseases have broken out simultaneously all over the world! The players are disease-fighting specialists whose mission is to treat disease hotspots while researching cures for each of four plagues.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 45,
    maxPlaytime: 75,
    complexity: 2.4,
    bggRating: 7.6,
    bggRank: 130,
    categories: ["Medical", "Cooperative"],
    mechanics: ["Cooperative Game", "Hand Management", "Point to Point Movement"],
    designer: "Matt Leacock",
    publisher: "Z-Man Games",
    imageUrl:
      "https://cf.geekdo-images.com/S3ybV1LAp-8sFQ2hm_jZHw__imagepage/img/sK7nHnlxoESdrdA7JLpBeFT3Fg8=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1534148.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/S3ybV1LAp-8sFQ2hm_jZHw__thumb/img/nFtHjInmgXEfO59GDjkxOsYfUZw=/fit-in/200x150/filters:strip_icc()/pic1534148.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 34.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Walmart",
        price: 29.97,
        url: "https://walmart.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 4,
    name: "Wingspan",
    year: 2019,
    description:
      "Wingspan is a competitive, medium-weight, card-driven, engine-building board game from Stonemaier Games. You are bird enthusiasts—researchers, bird watchers, ornithologists, and collectors.",
    minPlayers: 1,
    maxPlayers: 5,
    minPlaytime: 40,
    maxPlaytime: 70,
    complexity: 2.4,
    bggRating: 8.0,
    bggRank: 22,
    categories: ["Animals", "Nature"],
    mechanics: ["Card Drafting", "Engine Building", "Deck Building"],
    designer: "Elizabeth Hargrave",
    publisher: "Stonemaier Games",
    imageUrl:
      "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__imagepage/img/9KtXHfMhXz6QkGzaUFVfW5i79P4=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4458123.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__thumb/img/oA5_hRJRvMvTHOYijpAZFLNETgY=/fit-in/200x150/filters:strip_icc()/pic4458123.jpg",
    prices: [
      {
        retailer: "Stonemaier Games",
        price: 65.0,
        url: "https://stonemaiergames.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Amazon",
        price: 59.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 5,
    name: "Codenames",
    year: 2015,
    description:
      "Two rival spymasters know the secret identities of 25 agents. Their teammates know the agents only by their codenames. The teams compete to see who can make contact with all of their agents first.",
    minPlayers: 2,
    maxPlayers: 8,
    minPlaytime: 15,
    maxPlaytime: 30,
    complexity: 1.3,
    bggRating: 7.7,
    bggRank: 100,
    categories: ["Party Game", "Word Game"],
    mechanics: ["Team-Based Game", "Voting", "Communication Limits"],
    designer: "Vlaada Chvátil",
    publisher: "Czech Games Edition",
    imageUrl:
      "https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__imagepage/img/Nv5LCcBdtFVuPLNMVpJj7X3x_7o=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2582929.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__thumb/img/s1p3R19cKLcpEiWQSJdIXThN2Z8=/fit-in/200x150/filters:strip_icc()/pic2582929.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 19.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Target",
        price: 21.99,
        url: "https://target.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 6,
    name: "Gloomhaven",
    year: 2017,
    description:
      "Gloomhaven is a game of Euro-inspired tactical combat in a persistent world of shifting motives. Players will take on the role of a wandering adventurer with their own special set of skills and a desire for riches and fame.",
    minPlayers: 1,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 120,
    complexity: 3.9,
    bggRating: 8.8,
    bggRank: 1,
    categories: ["Adventure", "Dungeon Crawler", "Fantasy"],
    mechanics: [
      "Action Queue",
      "Cooperative Game",
      "Deck Building",
      "Hand Management",
    ],
    designer: "Isaac Childres",
    publisher: "Cephalofair Games",
    imageUrl:
      "https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__imagepage/img/ikHM12qFjg0SB1WnHWpJBkNmRhE=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2437871.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/sZYp_3BTDGjh2unaZfZmuA__thumb/img/pItGRMRhqNWI4pYKOqXXGTXU7Ms=/fit-in/200x150/filters:strip_icc()/pic2437871.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 134.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "GameNerdz",
        price: 129.99,
        url: "https://gamenerdz.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 7,
    name: "7 Wonders",
    year: 2010,
    description:
      "You are the leader of one of the 7 great cities of the Ancient World. Gather resources, develop commercial routes and affirm your military supremacy. Build your city and erect an architectural wonder which will transcend future times.",
    minPlayers: 2,
    maxPlayers: 7,
    minPlaytime: 30,
    maxPlaytime: 45,
    complexity: 2.3,
    bggRating: 7.8,
    bggRank: 55,
    categories: ["Ancient", "Card Game", "Civilization"],
    mechanics: ["Card Drafting", "Simultaneous Action Selection", "Hand Management"],
    designer: "Antoine Bauza",
    publisher: "Repos Production",
    imageUrl:
      "https://cf.geekdo-images.com/FS1RE8mSBAbmSxkdb0VtGg__imagepage/img/4P7rHnhJ7OcMRkNmg_AhSzNgX_s=/fit-in/900x600/filters:no_upscale():strip_icc()/pic860217.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/FS1RE8mSBAbmSxkdb0VtGg__thumb/img/mGxbGa8FBzrKBcqMjCjk2TmCMYs=/fit-in/200x150/filters:strip_icc()/pic860217.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 39.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 8,
    name: "Terraforming Mars",
    year: 2016,
    description:
      "The taming of the Red Planet has begun! Corporations are competing to transform Mars into a habitable planet by spending vast resources and using innovative technology to raise temperature, create a breathable atmosphere, and make oceans of water.",
    minPlayers: 1,
    maxPlayers: 5,
    minPlaytime: 120,
    maxPlaytime: 180,
    complexity: 3.2,
    bggRating: 8.4,
    bggRank: 4,
    categories: ["Economic", "Science Fiction", "Territory Building"],
    mechanics: [
      "Card Drafting",
      "Engine Building",
      "Hand Management",
      "Tile Placement",
    ],
    designer: "Jacob Fryxelius",
    publisher: "FryxGames",
    imageUrl:
      "https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__imagepage/img/kSbcHBDSMBSBkJFpZxTxiStSNKY=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3536616.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__thumb/img/LMgQWWwHBqcLWbj-bw2rJMNRqRo=/fit-in/200x150/filters:strip_icc()/pic3536616.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 59.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "GameNerdz",
        price: 55.99,
        url: "https://gamenerdz.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 9,
    name: "Azul",
    year: 2017,
    description:
      "Azul was designed by the award-winning designer Michael Feld. Azul challenges players to take turns drafting colored tiles from suppliers to complete lines on their personal player board.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 30,
    maxPlaytime: 45,
    complexity: 1.8,
    bggRating: 7.9,
    bggRank: 30,
    categories: ["Abstract Strategy", "Puzzle"],
    mechanics: ["Drafting", "Pattern Building", "Set Collection"],
    designer: "Michael Feld",
    publisher: "Plan B Games",
    imageUrl:
      "https://cf.geekdo-images.com/aPSHiTBC_4xMv_Bv-e79rA__imagepage/img/P-3UcnNknWAOoflb0Vz3-Jj3HrA=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3718275.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/aPSHiTBC_4xMv_Bv-e79rA__thumb/img/XAQy-3jWHnMlGjhq3DSmzfE1vGE=/fit-in/200x150/filters:strip_icc()/pic3718275.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 34.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Target",
        price: 37.99,
        url: "https://target.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 10,
    name: "Scythe",
    year: 2016,
    description:
      "It is a time of unrest in 1920s Europa. The ashes from the first great war still darken the snow. The capitalistic city-state known simply as The Factory, which fueled the war with heavily armored mechs, has closed its doors.",
    minPlayers: 1,
    maxPlayers: 5,
    minPlaytime: 90,
    maxPlaytime: 115,
    complexity: 3.4,
    bggRating: 8.2,
    bggRank: 8,
    categories: ["Economic", "Fighting", "Science Fiction"],
    mechanics: [
      "Area Control",
      "Engine Building",
      "Variable Player Powers",
      "Worker Placement",
    ],
    designer: "Jamey Stegmaier",
    publisher: "Stonemaier Games",
    imageUrl:
      "https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BvynA__imagepage/img/oAjPCJHWDIfhcQRBPJQN1yVYb_k=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3163924.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/7k_nOxpO9OGIjhLq2BvynA__thumb/img/lEkDjKYT3a2VuFmCqkRcv6HuZN8=/fit-in/200x150/filters:strip_icc()/pic3163924.jpg",
    prices: [
      {
        retailer: "Stonemaier Games",
        price: 90.0,
        url: "https://stonemaiergames.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Amazon",
        price: 79.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 11,
    name: "Arkham Horror: The Card Game",
    year: 2016,
    description:
      "Arkham Horror: The Card Game is a cooperative Living Card Game set amid a backdrop of Lovecraftian horror. As strange monsters and forbidden mysteries threaten to unravel the world, one to two investigators must work together.",
    minPlayers: 1,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 120,
    complexity: 3.6,
    bggRating: 8.5,
    bggRank: 5,
    categories: ["Adventure", "Card Game", "Horror"],
    mechanics: [
      "Cooperative Game",
      "Deck Building",
      "Story/Narrative",
      "Variable Player Powers",
    ],
    designer: "Nate French",
    publisher: "Fantasy Flight Games",
    imageUrl:
      "https://cf.geekdo-images.com/pDUmOzDqjJMcCJQhXNWYeQ__imagepage/img/Mb3IvPEZAcS9UBTKFGCXeFrI5Ts=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6120500.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/pDUmOzDqjJMcCJQhXNWYeQ__thumb/img/SvFaWjRqhCJKhaBNQYVl3FenX4I=/fit-in/200x150/filters:strip_icc()/pic6120500.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 44.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 12,
    name: "Dominion",
    year: 2008,
    description:
      "You are a monarch, like your parents before you, a ruler of a small pleasant kingdom of rivers and evergreen trees. Unlike your parents, however, you have hopes and dreams! You want a bigger and more pleasant kingdom, with more rivers and an ocean.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 30,
    maxPlaytime: 45,
    complexity: 2.3,
    bggRating: 7.6,
    bggRank: 150,
    categories: ["Card Game", "Medieval"],
    mechanics: ["Deck Building", "Hand Management", "Set Collection"],
    designer: "Donald X. Vaccarino",
    publisher: "Rio Grande Games",
    imageUrl:
      "https://cf.geekdo-images.com/j6iQpZ4XkemZB8CgaulKJA__imagepage/img/j2MNbxXJaFaMY8pU6OBoMRGMXIA=/fit-in/900x600/filters:no_upscale():strip_icc()/pic394356.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/j6iQpZ4XkemZB8CgaulKJA__thumb/img/bM3a78RHH3jEXDrPNVLs1XbE_rs=/fit-in/200x150/filters:strip_icc()/pic394356.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 44.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 13,
    name: "Betrayal at House on the Hill",
    year: 2004,
    description:
      "Betrayal at House on the Hill quickly builds suspense and excitement as players explore a haunted mansion of their own design, encountering spirits and frightening omens that foretell their fate.",
    minPlayers: 3,
    maxPlayers: 6,
    minPlaytime: 60,
    maxPlaytime: 90,
    complexity: 2.8,
    bggRating: 7.1,
    bggRank: 350,
    categories: ["Adventure", "Horror", "Exploration"],
    mechanics: ["Modular Board", "Variable Setup", "Co-operative Play"],
    designer: "Bruce Glassco",
    publisher: "Avalon Hill",
    imageUrl:
      "https://cf.geekdo-images.com/oAB7o-Y2lH3TN0vCnFqpFg__imagepage/img/Y-_l-q0E7Cd6YqpPbLpKg5FGXe0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic828598.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/oAB7o-Y2lH3TN0vCnFqpFg__thumb/img/JKRD4JnxIeG9MjCWLb2Gi3rY2RU=/fit-in/200x150/filters:strip_icc()/pic828598.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 37.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Target",
        price: 41.99,
        url: "https://target.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 14,
    name: "Love Letter",
    year: 2012,
    description:
      "Love Letter is a game of risk, deduction, and luck for 2–6 players. Your goal is to get your love letter into Princess Annette's hands while deflecting the letters from competing suitors.",
    minPlayers: 2,
    maxPlayers: 6,
    minPlaytime: 10,
    maxPlaytime: 20,
    complexity: 1.2,
    bggRating: 7.1,
    bggRank: 250,
    categories: ["Card Game", "Deduction"],
    mechanics: ["Hand Management", "Player Elimination", "Deduction"],
    designer: "Seiji Kanai",
    publisher: "AEG",
    imageUrl:
      "https://cf.geekdo-images.com/RPD9skz2VPE0RNVjGYY7xA__imagepage/img/UXzN2HEFGNMmhKFl_0Nf7aFmqJo=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3979976.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/RPD9skz2VPE0RNVjGYY7xA__thumb/img/TSTOQMYsGKyQJZ-nzXnQlGkWAkw=/fit-in/200x150/filters:strip_icc()/pic3979976.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 11.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 15,
    name: "Spirit Island",
    year: 2017,
    description:
      "In the most distant reaches of the world, magic still exists, embodied by spirits of the land, of the sea, and of the air. As colonizers spread across a distant island, the native Dahan people and the land's spirits must unite to drive them back.",
    minPlayers: 1,
    maxPlayers: 4,
    minPlaytime: 90,
    maxPlaytime: 120,
    complexity: 4.0,
    bggRating: 8.5,
    bggRank: 6,
    categories: ["Fantasy", "Fighting", "Cooperative"],
    mechanics: [
      "Area Control",
      "Cooperative Game",
      "Variable Player Powers",
      "Hand Management",
    ],
    designer: "R. Eric Reuss",
    publisher: "Greater Than Games",
    imageUrl:
      "https://cf.geekdo-images.com/viAkEt5grrlDgpXYZcMvkA__imagepage/img/O-u8RyYiT6O5FgNvCQllGBwHqQc=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3615739.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/viAkEt5grrlDgpXYZcMvkA__thumb/img/JCY3I2ZR2uFJJGlbMSMfJpAIxAA=/fit-in/200x150/filters:strip_icc()/pic3615739.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 69.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 16,
    name: "Agricola",
    year: 2007,
    description:
      "In Agricola, you're a farmer in a wooden shack with your spouse and little else. On a turn, you get to take only 2 actions, one for you and one for the spouse, from all the possibilities you'll find on a farm.",
    minPlayers: 1,
    maxPlayers: 5,
    minPlaytime: 90,
    maxPlaytime: 150,
    complexity: 3.6,
    bggRating: 7.9,
    bggRank: 40,
    categories: ["Economic", "Farming"],
    mechanics: ["Hand Management", "Worker Placement", "Set Collection"],
    designer: "Uwe Rosenberg",
    publisher: "Lookout Games",
    imageUrl:
      "https://cf.geekdo-images.com/dDDo2Hexl80ucK1IlqTk-g__imagepage/img/bGDzWuZQK4N83g8U9ZwpQXSe9bk=/fit-in/900x600/filters:no_upscale():strip_icc()/pic831744.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/dDDo2Hexl80ucK1IlqTk-g__thumb/img/F3vFCW7cBFEbOIirjdxcN7K9qjo=/fit-in/200x150/filters:strip_icc()/pic831744.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 59.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 17,
    name: "Splendor",
    year: 2014,
    description:
      "Splendor is a game of chip-collecting and card development. Players are merchants of the Renaissance trying to buy gem mines, means of transportation, shops—all in order to acquire the most prestige points.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 30,
    maxPlaytime: 30,
    complexity: 1.8,
    bggRating: 7.4,
    bggRank: 160,
    categories: ["Card Game", "Renaissance"],
    mechanics: ["Card Drafting", "Set Collection", "Engine Building"],
    designer: "Marc André",
    publisher: "Space Cowboys",
    imageUrl:
      "https://cf.geekdo-images.com/jwE-Vg6oZedMaTXWHFDDDA__imagepage/img/yvVwRPDWfECLaLlRFHHGDVxJDqc=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1904079.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/jwE-Vg6oZedMaXWHFDDDA__thumb/img/dIq0qqUQXOMpNrPXAtjXQBaAdnI=/fit-in/200x150/filters:strip_icc()/pic1904079.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 29.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Target",
        price: 32.99,
        url: "https://target.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 18,
    name: "Carcassonne",
    year: 2000,
    description:
      "Carcassonne is a tile-placement game in which the players draw and place a tile with a piece of southern French landscape on it. The tile might feature a city, a road, a cloister, grassland or some combination thereof.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 30,
    maxPlaytime: 45,
    complexity: 1.9,
    bggRating: 7.4,
    bggRank: 170,
    categories: ["Medieval", "Territory Building"],
    mechanics: ["Area Control", "Tile Placement", "Pattern Building"],
    designer: "Klaus-Jürgen Wrede",
    publisher: "Hans im Glück",
    imageUrl:
      "https://cf.geekdo-images.com/okM0dq_bEXnbyQTOvHUntruhCBc__imagepage/img/lf8NiLXSQG_6pMEsBFdA4bGKEvo=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2337577.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/okM0dq_bEXnbyQTOvHUntruhCBc__thumb/img/0YFiRmpMVWV2DnlFgTVNTWQEMhw=/fit-in/200x150/filters:strip_icc()/pic2337577.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 34.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 19,
    name: "Everdell",
    year: 2018,
    description:
      "Within the charming valley of Everdell, beneath the boughs of towering trees, among meandering streams and mossy hollows, a civilization of forest critters is thriving and expanding.",
    minPlayers: 1,
    maxPlayers: 4,
    minPlaytime: 40,
    maxPlaytime: 80,
    complexity: 2.8,
    bggRating: 8.1,
    bggRank: 16,
    categories: ["Animals", "Card Game", "Fantasy"],
    mechanics: ["Card Drafting", "Engine Building", "Worker Placement"],
    designer: "James A. Wilson",
    publisher: "Starling Games",
    imageUrl:
      "https://cf.geekdo-images.com/1mhL5WiFdHPMH5Pr0r8rRA__imagepage/img/5vDRGQwxo9iMBWamwxEuNHAUDKw=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6377344.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/1mhL5WiFdHPMH5Pr0r8rRA__thumb/img/JtNx_g5uS1RZEfI_V7vxq7AH-PM=/fit-in/200x150/filters:strip_icc()/pic6377344.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 54.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 20,
    name: "Viticulture Essential Edition",
    year: 2013,
    description:
      "In Viticulture, the players find themselves in the roles of people in rustic, pre-modern Tuscany who have inherited meager vineyards. They have a few plots of land, an old crush pad, a cellar, and three workers.",
    minPlayers: 1,
    maxPlayers: 6,
    minPlaytime: 45,
    maxPlaytime: 90,
    complexity: 2.9,
    bggRating: 8.1,
    bggRank: 20,
    categories: ["Economic", "Farming"],
    mechanics: ["Cooperative Game", "Worker Placement", "Hand Management"],
    designer: "Jamey Stegmaier",
    publisher: "Stonemaier Games",
    imageUrl:
      "https://cf.geekdo-images.com/l_PRDCQPv7nU8OiPMqA8vw__imagepage/img/e1V_bgCE1C6PWRFR9l8JLSYF8OI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3347906.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/l_PRDCQPv7nU8OiPMqA8vw__thumb/img/4RVxQdpLGsLZpvuIkNWnON3TbfI=/fit-in/200x150/filters:strip_icc()/pic3347906.jpg",
    prices: [
      {
        retailer: "Stonemaier Games",
        price: 60.0,
        url: "https://stonemaiergames.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Amazon",
        price: 55.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 21,
    name: "Coup",
    year: 2012,
    description:
      "In Coup, you want to be the last player with influence in the game, with influence being represented by face-down character cards in your tableau.",
    minPlayers: 2,
    maxPlayers: 6,
    minPlaytime: 15,
    maxPlaytime: 15,
    complexity: 1.4,
    bggRating: 7.4,
    bggRank: 185,
    categories: ["Bluffing", "Card Game", "Deduction"],
    mechanics: ["Bluffing", "Player Elimination", "Hand Management"],
    designer: "Rikki Tahta",
    publisher: "Indie Boards & Cards",
    imageUrl:
      "https://cf.geekdo-images.com/MWhSY_GOe2-bmlQ_1pA0eg__imagepage/img/Ij93G8n4cAp0eQ9mBuLNDY1o2xg=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2016054.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/MWhSY_GOe2-bmlQ_1pA0eg__thumb/img/w4YT9HKy0G5bhXiC_3RcICzPnGE=/fit-in/200x150/filters:strip_icc()/pic2016054.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 14.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 22,
    name: "Patchwork",
    year: 2014,
    description:
      "In Patchwork, two players compete to build the most aesthetic (and high-scoring) patchwork quilt on a personal 9x9 game board. To start the game, lay out all 33 patches at random in a circle.",
    minPlayers: 2,
    maxPlayers: 2,
    minPlaytime: 15,
    maxPlaytime: 30,
    complexity: 1.7,
    bggRating: 7.7,
    bggRank: 65,
    categories: ["Abstract Strategy", "Puzzle"],
    mechanics: ["Pattern Building", "Tile Placement", "Turn Order"],
    designer: "Uwe Rosenberg",
    publisher: "Lookout Games",
    imageUrl:
      "https://cf.geekdo-images.com/iFSFRc_v2Fk6XWBagrRfBw__imagepage/img/1xfZqA4rfNjFIaBXs-cKU6pPfTo=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2526755.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/iFSFRc_v2Fk6XWBagrRfBw__thumb/img/qNh0FkQUjEzJJpEVkT3N2B_xlC4=/fit-in/200x150/filters:strip_icc()/pic2526755.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 24.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 23,
    name: "Dead of Winter: A Crossroads Game",
    year: 2014,
    description:
      "Dead of Winter puts 2-5 players together in a post-apocalyptic, snow-covered world where they are fighting to survive as a colony of survivors.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 60,
    maxPlaytime: 120,
    complexity: 3.0,
    bggRating: 7.8,
    bggRank: 95,
    categories: ["Horror", "Post-Apocalyptic", "Zombies"],
    mechanics: [
      "Co-operative Play",
      "Dice Rolling",
      "Hand Management",
      "Variable Player Powers",
    ],
    designer: "Jonathan Gilmour",
    publisher: "Plaid Hat Games",
    imageUrl:
      "https://cf.geekdo-images.com/6XQEALkSBfTxVtThXXIJiQ__imagepage/img/aYSZCBXkMv4A7q-Y58mqp7K6TOI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2177577.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/6XQEALkSBfTxVtThXXIJiQ__thumb/img/Gf9TF_7VJR-oE9x3Bx2QD3lD7b8=/fit-in/200x150/filters:strip_icc()/pic2177577.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 49.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 24,
    name: "Pandemic Legacy: Season 1",
    year: 2015,
    description:
      "Pandemic Legacy is a co-operative campaign game, with an overarching story-arc played through successive games. In the game, you and your team must prevent the world from the ravages of virulent plagues.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 75,
    complexity: 2.8,
    bggRating: 8.6,
    bggRank: 3,
    categories: ["Medical", "Cooperative", "Campaign"],
    mechanics: ["Co-operative Play", "Legacy Game", "Hand Management"],
    designer: "Matt Leacock",
    publisher: "Z-Man Games",
    imageUrl:
      "https://cf.geekdo-images.com/vqNBQ4a5ZRuYlkElPGmlFQ__imagepage/img/GPqjvFP_sJeT7S9GxCZV2M0_Yrk=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2452831.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/vqNBQ4a5ZRuYlkElPGmlFQ__thumb/img/-C1oKYnT7IKlvPLpHxWIBY7aBAg=/fit-in/200x150/filters:strip_icc()/pic2452831.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 59.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 25,
    name: "Root",
    year: 2018,
    description:
      "Root is a game of adventure and war where 2 to 4 players battle for control of a vast wilderness. The nefarious Marquise de Cat has seized the great woodland, intent on harvesting its riches.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 90,
    complexity: 3.7,
    bggRating: 8.1,
    bggRank: 13,
    categories: ["Animals", "Fantasy", "Fighting"],
    mechanics: [
      "Area Control",
      "Card Drafting",
      "Asymmetric Gameplay",
      "Hand Management",
    ],
    designer: "Cole Wehrle",
    publisher: "Leder Games",
    imageUrl:
      "https://cf.geekdo-images.com/JhWhbCxAGsGs4Gv43Zp5TQ__imagepage/img/mO-hy6SmjGS27xPMJJAqknfDTts=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4254509.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/JhWhbCxAGsGs4Gv43Zp5TQ__thumb/img/qUFPu6WbfkB7wWbcNPfRUIPM33A=/fit-in/200x150/filters:strip_icc()/pic4254509.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 54.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Leder Games",
        price: 60.0,
        url: "https://ledergames.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 26,
    name: "Through the Ages: A New Story of Civilization",
    year: 2015,
    description:
      "Through the Ages: A New Story of Civilization is the new edition of Through the Ages: A Story of Civilization.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 120,
    maxPlaytime: 240,
    complexity: 4.4,
    bggRating: 8.4,
    bggRank: 7,
    categories: ["Card Game", "Civilization"],
    mechanics: ["Card Drafting", "Hand Management", "Worker Placement"],
    designer: "Vlaada Chvátil",
    publisher: "Czech Games Edition",
    imageUrl:
      "https://cf.geekdo-images.com/fhbLqTPa0MvFRLATiHVNtg__imagepage/img/r--fNFM-mCOjY-UmX_QH5mz6Wqw=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2765665.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/fhbLqTPa0MvFRLATiHVNtg__thumb/img/TqpDDkwBfxYiJPIxwNwqB4gEi3M=/fit-in/200x150/filters:strip_icc()/pic2765665.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 69.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 27,
    name: "Brass: Birmingham",
    year: 2018,
    description:
      "Brass: Birmingham is an economic strategy game sequel to Martin Wallace's 2007 masterpiece, Brass. Birmingham tells the story of competing entrepreneurs in Birmingham during the industrial revolution.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 120,
    complexity: 3.9,
    bggRating: 8.7,
    bggRank: 2,
    categories: ["Economic", "Industry / Manufacturing"],
    mechanics: ["Hand Management", "Network Building", "Point to Point Movement"],
    designer: "Gavan Brown",
    publisher: "Roxley",
    imageUrl:
      "https://cf.geekdo-images.com/x3zxjr-Vw5iU4yDPg70Jgw__imagepage/img/giVOPBMBhPGcHTiAbxnCPg3UzGM=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3490053.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/x3zxjr-Vw5iU4yDPg70Jgw__thumb/img/qYQPKlk5HfPNYpYSPPQVv_IA5zQ=/fit-in/200x150/filters:strip_icc()/pic3490053.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 59.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 28,
    name: "Twilight Imperium (Fourth Edition)",
    year: 2017,
    description:
      "Twilight Imperium is an epic game of galactic conquest in which three to six players fight for galactic domination through military might, political maneuvering, and economic bargaining.",
    minPlayers: 3,
    maxPlayers: 6,
    minPlaytime: 240,
    maxPlaytime: 480,
    complexity: 4.3,
    bggRating: 8.7,
    bggRank: 9,
    categories: ["Negotiation", "Science Fiction", "Space Exploration"],
    mechanics: [
      "Area Control",
      "Auction/Bidding",
      "Modular Board",
      "Variable Player Powers",
    ],
    designer: "Christian T. Petersen",
    publisher: "Fantasy Flight Games",
    imageUrl:
      "https://cf.geekdo-images.com/2fsZOFVpBTjOJqH3sxBWOg__imagepage/img/yl8Hw1xyKBnmBJaAKwPMIjXA9XA=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3727516.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/2fsZOFVpBTjOJqH3sxBWOg__thumb/img/xXHb3zU-fmoxHGb1pf-v8CmJ8WY=/fit-in/200x150/filters:strip_icc()/pic3727516.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 149.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "GameNerdz",
        price: 144.99,
        url: "https://gamenerdz.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 29,
    name: "Mysterium",
    year: 2015,
    description:
      "In the 1920s, Mr. MacDowell, a gifted astrologist, invited several colleagues to his property, where a mysterious murder had occurred. This plantation has housed a ghost for years.",
    minPlayers: 2,
    maxPlayers: 7,
    minPlaytime: 42,
    maxPlaytime: 42,
    complexity: 1.9,
    bggRating: 7.3,
    bggRank: 220,
    categories: ["Deduction", "Horror", "Murder/Mystery"],
    mechanics: ["Cooperative Game", "Communication Limits", "Set Collection"],
    designer: "Oleksandr Nevskiy",
    publisher: "Libellud",
    imageUrl:
      "https://cf.geekdo-images.com/f5YFME0K6JC-tnUQJbhYXw__imagepage/img/yNDrKLQfXfQcMSdFqBCHiMYfP_E=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2601779.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/f5YFME0K6JC-tnUQJbhYXw__thumb/img/kfxCPdSWYy5-ABQG4NwzWM-7r8M=/fit-in/200x150/filters:strip_icc()/pic2601779.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 44.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 30,
    name: "Dixit",
    year: 2008,
    description:
      "Dixit is a card game created by Jean-Louis Roubira, and published by Libellud. Using a deck of cards illustrated with dreamlike images, players select cards that match a title suggested by the 'storyteller'.",
    minPlayers: 3,
    maxPlayers: 8,
    minPlaytime: 30,
    maxPlaytime: 30,
    complexity: 1.2,
    bggRating: 7.2,
    bggRank: 370,
    categories: ["Card Game", "Party Game", "Storytelling"],
    mechanics: ["Hand Management", "Simultaneous Action Selection", "Voting"],
    designer: "Jean-Louis Roubira",
    publisher: "Libellud",
    imageUrl:
      "https://cf.geekdo-images.com/jkUFcWkHXo1hm5UcxSSW5A__imagepage/img/k7vlrRXE5_OFBPmrx5OWfAZr4Ks=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3536016.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/jkUFcWkHXo1hm5UcxSSW5A__thumb/img/nB0aAOAhBvIKZOoNT9xBFKqJVo8=/fit-in/200x150/filters:strip_icc()/pic3536016.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 27.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 31,
    name: "Jaipur",
    year: 2009,
    description:
      "You're one of the two most powerful traders in the city of Jaipur, the capital of Rajasthan, but that's not enough for you. You want to be invited to the Maharaja's court.",
    minPlayers: 2,
    maxPlayers: 2,
    minPlaytime: 30,
    maxPlaytime: 30,
    complexity: 1.5,
    bggRating: 7.7,
    bggRank: 75,
    categories: ["Card Game", "Economic"],
    mechanics: ["Card Drafting", "Hand Management", "Set Collection"],
    designer: "Sébastien Pauchon",
    publisher: "Gambit",
    imageUrl:
      "https://cf.geekdo-images.com/uUx7UD5ZQMUILHkgGPLXaA__imagepage/img/NB4nRVECuAJoZ4sMWlPJ3dFJvME=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3127531.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/uUx7UD5ZQMUILHkgGPLXaA__thumb/img/f2bYrEn6cHfQaSWP-CvMb_CYbwA=/fit-in/200x150/filters:strip_icc()/pic3127531.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 19.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 32,
    name: "Hanabi",
    year: 2010,
    description:
      "Hanabi is a cooperative game where players hold their cards facing outward—visible to all other players but not themselves. Players must give and receive clues to play all cards in the correct order.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 25,
    maxPlaytime: 25,
    complexity: 1.7,
    bggRating: 7.0,
    bggRank: 500,
    categories: ["Card Game", "Cooperative"],
    mechanics: ["Cooperative Game", "Communication Limits", "Hand Management"],
    designer: "Antoine Bauza",
    publisher: "R&R Games",
    imageUrl:
      "https://cf.geekdo-images.com/0gY6blABgEhXWgYCTVx9GA__imagepage/img/fKTzRwmHCIFJP_fAGvCRalxh4yk=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1623370.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/0gY6blABgEhXWgYCTVx9GA__thumb/img/D_Gk0mGTlAjf2ACbEwRGo7ZXFLE=/fit-in/200x150/filters:strip_icc()/pic1623370.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 9.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 33,
    name: "Blood Rage",
    year: 2015,
    description:
      "In Blood Rage, each player controls their own Viking clan's warriors, leader, and ship. Ragnarök has come, and it's the end of the world! It's the Vikings' last chance to go down in a blaze of glory and secure their place in Valhalla.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 90,
    complexity: 3.0,
    bggRating: 8.0,
    bggRank: 25,
    categories: ["Fantasy", "Fighting", "Mythology"],
    mechanics: ["Area Control", "Card Drafting", "Miniatures", "Variable Player Powers"],
    designer: "Eric M. Lang",
    publisher: "CMON",
    imageUrl:
      "https://cf.geekdo-images.com/viAyYd1uj6cHB3SFjYSS4w__imagepage/img/qVR7XSmT9zFxRRYv9YOiJBJWHHw=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2439223.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/viAyYd1uj6cHB3SFjYSS4w__thumb/img/5wSYicXNL5YPLKNO2U1FYoMl3j0=/fit-in/200x150/filters:strip_icc()/pic2439223.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 79.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 34,
    name: "Sentinels of the Multiverse",
    year: 2011,
    description:
      "Sentinels of the Multiverse is a cooperative, fixed-deck card game with a comic-book flavor. Each player plays as one of ten heroes, against one of four villains.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 45,
    maxPlaytime: 75,
    complexity: 2.5,
    bggRating: 7.5,
    bggRank: 240,
    categories: ["Card Game", "Comic Book / Strip", "Cooperative"],
    mechanics: ["Cooperative Game", "Hand Management", "Variable Player Powers"],
    designer: "Christopher Badell",
    publisher: "Greater Than Games",
    imageUrl:
      "https://cf.geekdo-images.com/Eu0JpfhFCnuFjKFgNfE4aQ__imagepage/img/3XpBjqUZfJPJSZqZXvfiFy6sxuQ=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1296476.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/Eu0JpfhFCnuFjKFgNfE4aQ__thumb/img/5E5iBJJ0kZxTVEMm96pJm1glqUQ=/fit-in/200x150/filters:strip_icc()/pic1296476.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 39.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 35,
    name: "Quacks of Quedlinburg",
    year: 2018,
    description:
      "In The Quacks of Quedlinburg, players are charlatans—or quack doctors—each making their own secret brew by adding ingredients one at a time. Pull too many of the wrong ingredients and the pot explodes.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 45,
    maxPlaytime: 45,
    complexity: 1.9,
    bggRating: 7.9,
    bggRank: 35,
    categories: ["Dice", "Push Your Luck"],
    mechanics: ["Bag Building", "Drafting", "Push Your Luck"],
    designer: "Wolfgang Warsch",
    publisher: "Schmidt Spiele",
    imageUrl:
      "https://cf.geekdo-images.com/IWP1PWImEGhGBsz3hFdUiQ__imagepage/img/sSqnNrUUWGigNeeyBYCN1RbnAWE=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5765526.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/IWP1PWImEGhGBsz3hFdUiQ__thumb/img/bkFqxDpxfCw5X6w5GwbCklbXMdE=/fit-in/200x150/filters:strip_icc()/pic5765526.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 44.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 36,
    name: "Concordia",
    year: 2013,
    description:
      "Two thousand years ago, the Roman Empire ruled the lands around the Mediterranean Sea. In Concordia, up to 5 Roman dynasties compete for sea and land trade routes.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 90,
    maxPlaytime: 120,
    complexity: 3.0,
    bggRating: 8.2,
    bggRank: 12,
    categories: ["Ancient", "Economic", "Territory Building"],
    mechanics: ["Card Drafting", "Hand Management", "Network Building"],
    designer: "Mac Gerdts",
    publisher: "PD-Verlag",
    imageUrl:
      "https://cf.geekdo-images.com/wxE5NBHUMbklOEMsKVGbEA__imagepage/img/TRPHgxotCRCE8EJrYdRoTRBt5Ic=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2060704.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/wxE5NBHUMbklOEMsKVGbEA__thumb/img/6bH05Bui9lsq_j01rEJAFuT4Vb4=/fit-in/200x150/filters:strip_icc()/pic2060704.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 54.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 37,
    name: "Tokaido",
    year: 2012,
    description:
      "In Tokaido, each player is a traveler crossing the 'East Sea Road', one of the most magnificent roads of Japan. While traveling, you will meet people, taste fine meals, collect beautiful items, discover great panoramas, and visit temples and wild places.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 45,
    maxPlaytime: 45,
    complexity: 1.6,
    bggRating: 7.2,
    bggRank: 290,
    categories: ["Travel"],
    mechanics: ["Set Collection", "Turn Order", "Pattern Building"],
    designer: "Antoine Bauza",
    publisher: "Funforge",
    imageUrl:
      "https://cf.geekdo-images.com/E1XZEzSN-4KFN94hGEDTFQ__imagepage/img/k1vFAC7dAUXtJhw9FWXJK4oj1lE=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1789200.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/E1XZEzSN-4KFN94hGEDTFQ__thumb/img/2OkKBKO_TxJe5LsJVIBKhCBB5PA=/fit-in/200x150/filters:strip_icc()/pic1789200.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 29.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 38,
    name: "Star Wars: Rebellion",
    year: 2016,
    description:
      "Star Wars: Rebellion is a board game of epic conflict between the Galactic Empire and Rebel Alliance for two to four players! Experience the Galactic Civil War as you never have before.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 180,
    maxPlaytime: 240,
    complexity: 3.7,
    bggRating: 8.5,
    bggRank: 10,
    categories: ["Movies / TV / Radio theme", "Science Fiction"],
    mechanics: ["Area Control", "Hand Management", "Variable Player Powers"],
    designer: "Corey Konieczka",
    publisher: "Fantasy Flight Games",
    imageUrl:
      "https://cf.geekdo-images.com/cCMGtpniyAIST4KBm5ICLA__imagepage/img/bKxOXZGSs0P8vBUhBh1GlGHcZkY=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4325841.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/cCMGtpniyAIST4KBm5ICLA__thumb/img/k6HWuZumcaBHVNFJCXS_-CwVKxA=/fit-in/200x150/filters:strip_icc()/pic4325841.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 89.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 39,
    name: "The Resistance: Avalon",
    year: 2012,
    description:
      "The Resistance: Avalon pits the forces of Good and Evil in a battle to control the future of civilization. Arthur represents the future of Britain, a promise of prosperity and honor.",
    minPlayers: 5,
    maxPlayers: 10,
    minPlaytime: 30,
    maxPlaytime: 30,
    complexity: 1.7,
    bggRating: 7.7,
    bggRank: 110,
    categories: ["Bluffing", "Deduction", "Party Game"],
    mechanics: ["Bluffing", "Voting", "Team-Based Game"],
    designer: "Don Eskridge",
    publisher: "Indie Boards & Cards",
    imageUrl:
      "https://cf.geekdo-images.com/x1ADmFSp22OmEnMsWfByIQ__imagepage/img/QxmQhQ5OY4N2XzJWFIiqPHqRkJU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1398895.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/x1ADmFSp22OmEnMsWfByIQ__thumb/img/4V1YHrNm1bk_XWnqHWdlPYiLkOA=/fit-in/200x150/filters:strip_icc()/pic1398895.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 19.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 40,
    name: "Architects of the West Kingdom",
    year: 2018,
    description:
      "Architects of the West Kingdom is set in the declining years of the Carolingian Empire, circa 850 AD. As royal architects, players compete to impress their King and maintain their noble status by constructing various buildings in the city.",
    minPlayers: 1,
    maxPlayers: 5,
    minPlaytime: 60,
    maxPlaytime: 80,
    complexity: 2.7,
    bggRating: 7.9,
    bggRank: 45,
    categories: ["Medieval", "Worker Placement"],
    mechanics: ["Worker Placement", "Set Collection", "Hand Management"],
    designer: "Shem Phillips",
    publisher: "Garphill Games",
    imageUrl:
      "https://cf.geekdo-images.com/XPDIHKXzDNijuAqVBINDgQ__imagepage/img/1-Iq9nQ43pBoRfMXxIqhgMj4r2Y=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4249792.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/XPDIHKXzDNijuAqVBINDgQ__thumb/img/Bxk5jlJQDHVkMPBFpPJXC_GFJoU=/fit-in/200x150/filters:strip_icc()/pic4249792.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 49.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 41,
    name: "Sagrada",
    year: 2017,
    description:
      "As a skilled artisan, you will use tools-of-the-trade and careful planning to construct a stained glass window masterpiece in the Sagrada Família.",
    minPlayers: 1,
    maxPlayers: 4,
    minPlaytime: 30,
    maxPlaytime: 45,
    complexity: 2.0,
    bggRating: 7.3,
    bggRank: 275,
    categories: ["Abstract Strategy", "Dice"],
    mechanics: ["Dice Rolling", "Drafting", "Pattern Building"],
    designer: "Adrian Adamescu",
    publisher: "Floodgate Games",
    imageUrl:
      "https://cf.geekdo-images.com/PZt3EAAGP3HQsxKgTFiCpw__imagepage/img/JR5GMvnRjL4PeT-SN10JEzZnXkQ=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3525306.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/PZt3EAAGP3HQsxKgTFiCpw__thumb/img/oLZJHXGAYUXovlwgzVfC5z0Tqyk=/fit-in/200x150/filters:strip_icc()/pic3525306.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 34.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 42,
    name: "Forbidden Island",
    year: 2010,
    description:
      "Dare to discover Forbidden Island! Join a team of daring adventurers on a do-or-die mission to capture four sacred treasures from the ruins of this perilous paradise.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 30,
    maxPlaytime: 45,
    complexity: 1.7,
    bggRating: 6.9,
    bggRank: 600,
    categories: ["Adventure", "Cooperative"],
    mechanics: ["Cooperative Game", "Hand Management", "Modular Board"],
    designer: "Matt Leacock",
    publisher: "Gamewright",
    imageUrl:
      "https://cf.geekdo-images.com/RoJHAqMSmYM8L0EW93tARA__imagepage/img/Btt0SChQNHiCGMtjZf1CuXqhq2Q=/fit-in/900x600/filters:no_upscale():strip_icc()/pic628829.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/RoJHAqMSmYM8L0EW93tARA__thumb/img/OMo9dY9KeRUlDQBOGjVpAtfgaFI=/fit-in/200x150/filters:strip_icc()/pic628829.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 14.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Target",
        price: 16.99,
        url: "https://target.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 43,
    name: "Clue",
    year: 1949,
    description:
      "The classic murder mystery game. Someone murdered Mr. Boddy in one of the rooms of his mansion. Players explore the mansion to determine who killed him, what weapon was used, and where the crime was committed.",
    minPlayers: 2,
    maxPlayers: 6,
    minPlaytime: 45,
    maxPlaytime: 75,
    complexity: 1.4,
    bggRating: 5.8,
    bggRank: 2500,
    categories: ["Deduction", "Murder/Mystery"],
    mechanics: ["Deduction", "Player Elimination", "Roll / Spin and Move"],
    designer: "Anthony E. Pratt",
    publisher: "Hasbro",
    imageUrl:
      "https://cf.geekdo-images.com/i5nGGVHGFGEzIjvMXqHD4g__imagepage/img/gExkPsF1g9rGLDdCfZ4T0kYc-dw=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1428734.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/i5nGGVHGFGEzIjvMXqHD4g__thumb/img/TJ9vAMvV_bvWoaCGJ7e4LVAi7SA=/fit-in/200x150/filters:strip_icc()/pic1428734.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 14.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Walmart",
        price: 12.97,
        url: "https://walmart.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 44,
    name: "Cosmic Encounter",
    year: 1977,
    description:
      "Build a galactic empire... In the depths of outer space, the aliens of the Cosmos struggle to build galactic empires. Take on the role of an alien race from Cosmic Encounter.",
    minPlayers: 3,
    maxPlayers: 5,
    minPlaytime: 60,
    maxPlaytime: 60,
    complexity: 2.3,
    bggRating: 7.3,
    bggRank: 260,
    categories: ["Negotiation", "Science Fiction", "Space Exploration"],
    mechanics: [
      "Area Control",
      "Bluffing",
      "Negotiation",
      "Variable Player Powers",
    ],
    designer: "Peter Olotka",
    publisher: "Fantasy Flight Games",
    imageUrl:
      "https://cf.geekdo-images.com/5GEtaYIRRLhCMbZnFuBrHg__imagepage/img/gHbXdgH1a0RGLlRJePbV3TFZuLA=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1738282.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/5GEtaYIRRLhCMbZnFuBrHg__thumb/img/7cjbGnGpbxQJQKGM4pBfJz5cRoQ=/fit-in/200x150/filters:strip_icc()/pic1738282.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 59.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 45,
    name: "Istanbul",
    year: 2014,
    description:
      "There's hustle and bustle at Istanbul's Grand Bazaar as merchants and their assistants rush through the narrow streets trying to be more successful than their competitors.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 40,
    maxPlaytime: 60,
    complexity: 2.2,
    bggRating: 7.5,
    bggRank: 190,
    categories: ["Economic", "Territory Building"],
    mechanics: ["Modular Board", "Network Building", "Set Collection"],
    designer: "Rüdiger Dorn",
    publisher: "Alderac Entertainment Group",
    imageUrl:
      "https://cf.geekdo-images.com/2ax5KqGVNkl3IhTVmLxnpQ__imagepage/img/K3gNSzd1VTQ4V_qhG4pF8IpFaYI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1885295.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/2ax5KqGVNkl3IhTVmLxnpQ__thumb/img/q_xCK01lHLHRsMbKPK2krgJ0ynA=/fit-in/200x150/filters:strip_icc()/pic1885295.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 39.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 46,
    name: "Castles of Burgundy",
    year: 2011,
    description:
      "The game is set in the Burgundy region of High Medieval France. Each player takes on the role of an aristocrat, originally controlling a small princedom.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 30,
    maxPlaytime: 90,
    complexity: 3.0,
    bggRating: 8.1,
    bggRank: 14,
    categories: ["Dice", "Medieval", "Territory Building"],
    mechanics: ["Dice Rolling", "Set Collection", "Tile Placement"],
    designer: "Stefan Feld",
    publisher: "Ravensburger",
    imageUrl:
      "https://cf.geekdo-images.com/pMg1JdHrUFx_O3TtEOyFUg__imagepage/img/jFVgR_nTp5p6DP-T6UT13Dz9Cjs=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1176894.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/pMg1JdHrUFx_O3TtEOyFUg__thumb/img/xjPJZIjz-2c4eSTXxYK-qxhvBrw=/fit-in/200x150/filters:strip_icc()/pic1176894.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 34.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 47,
    name: "Robinson Crusoe: Adventures on the Cursed Island",
    year: 2012,
    description:
      "Robinson Crusoe: Adventures on the Cursed Island is a game created by Ignacy Trzewiczek, the author of Imperial Settlers. This time Trzewiczek takes players to an island.",
    minPlayers: 1,
    maxPlayers: 4,
    minPlaytime: 60,
    maxPlaytime: 120,
    complexity: 3.8,
    bggRating: 7.9,
    bggRank: 33,
    categories: ["Adventure", "Exploration", "Survival"],
    mechanics: ["Cooperative Game", "Dice Rolling", "Variable Player Powers"],
    designer: "Ignacy Trzewiczek",
    publisher: "Portal Games",
    imageUrl:
      "https://cf.geekdo-images.com/hRe0Eu8Xua3GmbQkZKqMQg__imagepage/img/Y7RJJI0OGO7H5yKe7ky3ItjfkBk=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6217905.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/hRe0Eu8Xua3GmbQkZKqMQg__thumb/img/fhZ15d1jM3MJsHLHAF8A3OLnW54=/fit-in/200x150/filters:strip_icc()/pic6217905.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 59.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 48,
    name: "Clank!: A Deck-Building Adventure",
    year: 2016,
    description:
      "Burgle your way to adventure in the deck-building dungeon delve, Clank! Sneak into an angry dragon's mountain lair to steal precious artifacts.",
    minPlayers: 2,
    maxPlayers: 4,
    minPlaytime: 45,
    maxPlaytime: 75,
    complexity: 2.3,
    bggRating: 7.6,
    bggRank: 125,
    categories: ["Adventure", "Card Game", "Fantasy"],
    mechanics: ["Deck Building", "Movement", "Set Collection"],
    designer: "Paul Dennen",
    publisher: "Renegade Game Studios",
    imageUrl:
      "https://cf.geekdo-images.com/gRj7ZMmFCKqiOJpRFcsPuA__imagepage/img/ZSomqASuFGfp16-JMy3G9DpFd_Y=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3388243.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/gRj7ZMmFCKqiOJpRFcsPuA__thumb/img/FIrKmhzfpXTmSw3LMm5u9gAKq04=/fit-in/200x150/filters:strip_icc()/pic3388243.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 49.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 49,
    name: "Puerto Rico",
    year: 2002,
    description:
      "In Puerto Rico, players assume the roles of colonial governors on the island of Puerto Rico. The aim of the game is to amass victory points by shipping goods to Europe or by constructing buildings.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 90,
    maxPlaytime: 150,
    complexity: 3.3,
    bggRating: 7.9,
    bggRank: 42,
    categories: ["Economic", "Territory Building"],
    mechanics: ["Role Playing", "Variable Player Powers", "Worker Placement"],
    designer: "Andreas Seyfarth",
    publisher: "Rio Grande Games",
    imageUrl:
      "https://cf.geekdo-images.com/55rWAjR-J7Q8Km-VBoLsAA__imagepage/img/nT5aF09EHN4a3xjdIZHbEQo0N6Y=/fit-in/900x600/filters:no_upscale():strip_icc()/pic158548.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/55rWAjR-J7Q8Km-VBoLsAA__thumb/img/X_EcLMgZ4M6bXVV9R1_O8U6G84A=/fit-in/200x150/filters:strip_icc()/pic158548.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 29.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 50,
    name: "Power Grid",
    year: 2004,
    description:
      "Power Grid is the updated release of the Funkenschlag game. The object of Power Grid is to supply the most cities with power when someone's network reaches a predetermined size.",
    minPlayers: 2,
    maxPlayers: 6,
    minPlaytime: 120,
    maxPlaytime: 150,
    complexity: 3.3,
    bggRating: 7.9,
    bggRank: 43,
    categories: ["Economic", "Industry / Manufacturing", "Transportation"],
    mechanics: [
      "Auction/Bidding",
      "Network Building",
      "Route/Network Building",
    ],
    designer: "Friedemann Friese",
    publisher: "2F-Spiele",
    imageUrl:
      "https://cf.geekdo-images.com/VkdLjnp0sLj-VmGT7FD5UA__imagepage/img/mChf4P5UpVfg5J5yWiqIABJ4A5A=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1036060.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/VkdLjnp0sLj-VmGT7FD5UA__thumb/img/j0xaYGCDYxwkXH8aCCUvp2Wm6SM=/fit-in/200x150/filters:strip_icc()/pic1036060.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 39.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 51,
    name: "Flamecraft",
    year: 2022,
    description:
      "In this magical place, Flamekeepers tend to the small but mighty flame dragons who live in the shops. As a Flamekeeper, your goal is to gain the most reputation by placing and enchanting dragons.",
    minPlayers: 1,
    maxPlayers: 5,
    minPlaytime: 60,
    maxPlaytime: 90,
    complexity: 2.3,
    bggRating: 7.5,
    bggRank: 400,
    categories: ["Animals", "Fantasy"],
    mechanics: ["Card Drafting", "Hand Management", "Worker Placement"],
    designer: "Manny Vega",
    publisher: "Lucky Duck Games",
    imageUrl:
      "https://cf.geekdo-images.com/LbMiuFJkIaU2GelF1fvBRw__imagepage/img/cJjVamGwP6JHE3_Pok3C53G8Oj8=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6944272.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/LbMiuFJkIaU2GelF1fvBRw__thumb/img/S-zV5FnUWbmB3GKHalJJjGRHaMo=/fit-in/200x150/filters:strip_icc()/pic6944272.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 44.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 52,
    name: "Hive",
    year: 2001,
    description:
      "Hive is a highly addictive strategic game for two players that is not restricted by a board and can be played anywhere on any flat surface. Hive is made up of twenty two pieces.",
    minPlayers: 2,
    maxPlayers: 2,
    minPlaytime: 20,
    maxPlaytime: 30,
    complexity: 2.3,
    bggRating: 7.3,
    bggRank: 280,
    categories: ["Abstract Strategy"],
    mechanics: ["Grid Movement", "Tile Placement"],
    designer: "John Yianni",
    publisher: "Gen42 Games",
    imageUrl:
      "https://cf.geekdo-images.com/cpuX4dsBqbCl7Z5GZCE3Tg__imagepage/img/GCGdVlMLPP13qwKajvvBo-aLJgs=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1180466.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/cpuX4dsBqbCl7Z5GZCE3Tg__thumb/img/LTD5Dj-gIB7kUl8CZNGmPLGx36A=/fit-in/200x150/filters:strip_icc()/pic1180466.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 28.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 53,
    name: "Sushi Go Party!",
    year: 2016,
    description:
      "Sushi Go Party! is the party game version of Sushi Go!, in which you serve up a delectable and mouthwatering sushi feast to score the most points. The dynamic menu means you'll need to change your strategy every time you play!",
    minPlayers: 2,
    maxPlayers: 8,
    minPlaytime: 20,
    maxPlaytime: 20,
    complexity: 1.2,
    bggRating: 7.4,
    bggRank: 210,
    categories: ["Card Game", "Party Game", "Food / Cooking"],
    mechanics: ["Card Drafting", "Hand Management", "Set Collection"],
    designer: "Phil Walker-Harding",
    publisher: "Gamewright",
    imageUrl:
      "https://cf.geekdo-images.com/MCsBxOPVPCMHiEoiShc9mA__imagepage/img/jPE8AigHtIfKjYu8MNIomwJ3E-4=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4022457.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/MCsBxOPVPCMHiEoiShc9mA__thumb/img/W_D7D6cJlkCO2JHKxWyCRXHKJhU=/fit-in/200x150/filters:strip_icc()/pic4022457.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 19.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
      {
        retailer: "Target",
        price: 22.99,
        url: "https://target.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 54,
    name: "Pandemic: Iberia",
    year: 2016,
    description:
      "Set in the Iberian Peninsula in 1848, Pandemic Iberia is a reimagining of Matt Leacock's classic game that includes new mechanics alongside historical flavor.",
    minPlayers: 2,
    maxPlayers: 5,
    minPlaytime: 45,
    maxPlaytime: 75,
    complexity: 2.4,
    bggRating: 7.3,
    bggRank: 540,
    categories: ["Medical", "Historical", "Cooperative"],
    mechanics: ["Co-operative Play", "Hand Management", "Point to Point Movement"],
    designer: "Matt Leacock",
    publisher: "Z-Man Games",
    imageUrl:
      "https://cf.geekdo-images.com/Bz-NelYHuPfN3vCNZQ8OoQ__imagepage/img/jxMGIzOB0L6xtpAQhpqb_v2wCkI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3190895.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/Bz-NelYHuPfN3vCNZQ8OoQ__thumb/img/fIjEFMuaYaO8hv2UQEHQiUOHBJ8=/fit-in/200x150/filters:strip_icc()/pic3190895.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 34.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 55,
    name: "Splendor Duel",
    year: 2022,
    description:
      "Splendor Duel is a two-player version of Splendor designed by Marc André and Bruno Cathala. Gems are now on tiles that are revealed from a bag, making the game more dynamic.",
    minPlayers: 2,
    maxPlayers: 2,
    minPlaytime: 30,
    maxPlaytime: 30,
    complexity: 2.2,
    bggRating: 7.9,
    bggRank: 50,
    categories: ["Card Game", "Renaissance"],
    mechanics: ["Card Drafting", "Set Collection", "Engine Building"],
    designer: "Marc André",
    publisher: "Space Cowboys",
    imageUrl:
      "https://cf.geekdo-images.com/qlT8yCt0-t-kIfmijQJGow__imagepage/img/1Ro2aXBzBqR3FgFVYHkFMKaLz0c=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6892542.jpg",
    thumbnailUrl:
      "https://cf.geekdo-images.com/qlT8yCt0-t-kIfmijQJGow__thumb/img/9vBz_w6WJbnVf1i1yk0kXBSqC6c=/fit-in/200x150/filters:strip_icc()/pic6892542.jpg",
    prices: [
      {
        retailer: "Amazon",
        price: 29.99,
        url: "https://amazon.com",
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

// Quiz games - 10 well-known games used for the taste profile quiz
export const QUIZ_GAMES = GAMES.filter((g) =>
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(g.id)
);
