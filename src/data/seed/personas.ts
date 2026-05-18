export interface PersonaSeed {
  id: number;
  username: string;
  createdAt: string;
  bio: string;
  voice: "analytical" | "enthusiastic" | "casual" | "competitive" | "cozy";
  preferences: {
    playerCount: string;
    duration: string;
    complexity: string;
    themes: string[];
  };
  ratings: {
    loved: string[];
    liked: string[];
    neutral?: string[];
    disliked?: string[];
  };
  collection: {
    owned: string[];
    wishlist: string[];
  };
  friends: string[];
  alertTargets?: {
    game: string;
    targetPrice: number;
    email?: string;
  }[];
}

export const PERSONAS: PersonaSeed[] = [
  {
    id: 1,
    username: "demo",
    createdAt: "2024-08-01T09:00:00.000Z",
    bio: "A balanced modern hobby gamer who mixes gateway favorites with a few medium-weight engines.",
    voice: "enthusiastic",
    preferences: {
      playerCount: "2-4",
      duration: "30-120",
      complexity: "2-4",
      themes: ["Animals", "Nature", "Science"],
    },
    ratings: {
      loved: ["Wingspan", "Cascadia", "Parks", "Heat: Pedal to the Metal", "Everdell"],
      liked: ["Azul", "Ticket to Ride", "7 Wonders", "Patchwork", "Splendor Duel"],
      neutral: ["Terraforming Mars"],
      disliked: ["Twilight Imperium (Fourth Edition)", "Advanced Squad Leader"],
    },
    collection: {
      owned: [
        "Wingspan",
        "Cascadia",
        "Azul",
        "Ticket to Ride",
        "Parks",
        "7 Wonders",
        "Patchwork",
        "Heat: Pedal to the Metal",
        "Everdell",
        "Splendor Duel",
        "Flamecraft",
      ],
      wishlist: ["Dune: Imperium", "Terraforming Mars", "Lost Ruins of Arnak", "The Search for Planet X"],
    },
    friends: ["Mia", "Jordan", "Sam", "Priya"],
    alertTargets: [
      { game: "Dune: Imperium", targetPrice: 44.99, email: "demo@gamescout.local" },
      { game: "Lost Ruins of Arnak", targetPrice: 39.99 },
    ],
  },
  {
    id: 2,
    username: "zoë_meeples",
    createdAt: "2024-07-16T11:15:00.000Z",
    bio: "Enjoys crunchy optimization puzzles, long-term planning, and scoresheets full of tiny efficiencies.",
    voice: "analytical",
    preferences: {
      playerCount: "1-4",
      duration: "90-240",
      complexity: "4-5",
      themes: ["Economic", "Medieval", "Industry"],
    },
    ratings: {
      loved: ["Brass: Birmingham", "A Feast for Odin", "Food Chain Magnate", "Anachrony", "Orléans"],
      liked: ["Great Western Trail", "Tzolk'in: The Mayan Calendar", "Castles of Burgundy", "Agricola", "Concordia"],
      disliked: ["Clue", "Just One"],
    },
    collection: {
      owned: [
        "Brass: Birmingham",
        "A Feast for Odin",
        "Orléans",
        "Tzolk'in: The Mayan Calendar",
        "Food Chain Magnate",
        "Anachrony",
        "Great Western Trail",
        "Castles of Burgundy",
        "Agricola",
        "Concordia",
        "Viticulture Essential Edition",
        "Puerto Rico",
      ],
      wishlist: ["Through the Ages: A New Story of Civilization", "Terraforming Mars", "Pax Pamir: Second Edition", "Brass: Lancashire"],
    },
    friends: ["Noah", "Elena", "Mateo", "Rin"],
    alertTargets: [
      { game: "Pax Pamir: Second Edition", targetPrice: 54.99 },
      { game: "Brass: Lancashire", targetPrice: 49.99, email: "zoe@gamescout.local" },
    ],
  },
  {
    id: 3,
    username: "carlos_coop",
    createdAt: "2024-06-05T08:40:00.000Z",
    bio: "Prefers tense teamwork, shared problem solving, and campaigns that feel like serialized TV.",
    voice: "casual",
    preferences: {
      playerCount: "2-4",
      duration: "45-180",
      complexity: "3-5",
      themes: ["Cooperative", "Adventure", "Horror"],
    },
    ratings: {
      loved: ["Spirit Island", "Pandemic Legacy: Season 1", "Sleeping Gods", "Gloomhaven", "The Crew: Mission Deep Sea"],
      liked: ["Pandemic", "Forbidden Island", "Robinson Crusoe: Adventures on the Cursed Island", "Arkham Horror: The Card Game"],
      neutral: ["Dead of Winter: A Crossroads Game"],
      disliked: ["Coup", "Skull"],
    },
    collection: {
      owned: [
        "Pandemic",
        "Spirit Island",
        "The Crew: Mission Deep Sea",
        "Forbidden Island",
        "Robinson Crusoe: Adventures on the Cursed Island",
        "Sleeping Gods",
        "Gloomhaven",
        "Frosthaven",
        "Pandemic Legacy: Season 1",
        "Dead of Winter: A Crossroads Game",
      ],
      wishlist: ["Nemesis", "Arkham Horror: The Card Game", "Lost Ruins of Arnak", "Mysterium"],
    },
    friends: ["Lucía", "Andrés", "Valentina", "Diego"],
    alertTargets: [
      { game: "Nemesis", targetPrice: 109.99 },
      { game: "Arkham Horror: The Card Game", targetPrice: 29.99 },
    ],
  },
  {
    id: 4,
    username: "party_pat",
    createdAt: "2024-08-20T17:20:00.000Z",
    bio: "Lives for punchy party games, social reads, and rules explanations under two minutes.",
    voice: "enthusiastic",
    preferences: {
      playerCount: "4-8",
      duration: "15-60",
      complexity: "1-2",
      themes: ["Party Game", "Word Game", "Bluffing"],
    },
    ratings: {
      loved: ["Codenames", "Just One", "Decrypto", "Skull", "The Resistance: Avalon"],
      liked: ["Sushi Go Party!", "Love Letter", "Dixit", "Hanabi", "No Thanks!"],
      disliked: ["Food Chain Magnate", "Advanced Squad Leader"],
    },
    collection: {
      owned: [
        "Codenames",
        "Just One",
        "Decrypto",
        "Skull",
        "Sushi Go Party!",
        "Love Letter",
        "Dixit",
        "The Resistance: Avalon",
        "Hanabi",
        "No Thanks!",
      ],
      wishlist: ["Captain Sonar", "Heat: Pedal to the Metal", "Mysterium", "Coup"],
    },
    friends: ["Tara", "Ben", "Jules", "Quinn", "Alex"],
    alertTargets: [
      { game: "Captain Sonar", targetPrice: 32.99 },
      { game: "Heat: Pedal to the Metal", targetPrice: 54.99 },
    ],
  },
  {
    id: 5,
    username: "solo_sage",
    createdAt: "2024-05-12T07:50:00.000Z",
    bio: "Mostly plays alone and appreciates elegant solo modes with lots of meaningful decisions.",
    voice: "analytical",
    preferences: {
      playerCount: "1-1",
      duration: "45-180",
      complexity: "3-5",
      themes: ["Science Fiction", "Adventure", "Fantasy"],
    },
    ratings: {
      loved: ["Spirit Island", "Terraforming Mars", "Arkham Horror: The Card Game", "A Feast for Odin", "Sleeping Gods"],
      liked: ["Lost Ruins of Arnak", "Wingspan", "The Search for Planet X", "Anachrony"],
      neutral: ["Scythe"],
      disliked: ["Captain Sonar", "The Resistance: Avalon"],
    },
    collection: {
      owned: [
        "Spirit Island",
        "Terraforming Mars",
        "Arkham Horror: The Card Game",
        "A Feast for Odin",
        "The Search for Planet X",
        "Lost Ruins of Arnak",
        "Sleeping Gods",
        "Anachrony",
        "Wingspan",
      ],
      wishlist: ["Frosthaven", "Food Chain Magnate", "Pax Pamir: Second Edition", "Brass: Birmingham"],
    },
    friends: ["Iris", "Theo", "Max"],
    alertTargets: [
      { game: "Frosthaven", targetPrice: 189.99 },
      { game: "Pax Pamir: Second Edition", targetPrice: 59.99 },
    ],
  },
  {
    id: 6,
    username: "familia_fun",
    createdAt: "2024-09-02T12:05:00.000Z",
    bio: "Plays across generations and optimizes for teachability, table presence, and replayable variety.",
    voice: "cozy",
    preferences: {
      playerCount: "2-5",
      duration: "20-60",
      complexity: "1-3",
      themes: ["Animals", "Nature", "Abstract Strategy"],
    },
    ratings: {
      loved: ["Ticket to Ride", "Azul", "Cascadia", "Boop.", "Flamecraft"],
      liked: ["Carcassonne", "Patchwork", "Sagrada", "Parks", "Santorini"],
      neutral: ["Café"],
      disliked: ["Nemesis", "Twilight Imperium (Fourth Edition)"],
    },
    collection: {
      owned: [
        "Ticket to Ride",
        "Azul",
        "Flamecraft",
        "Cascadia",
        "Parks",
        "Sagrada",
        "Patchwork",
        "Carcassonne",
        "Splendor",
        "Boop.",
        "Santorini",
        "Café",
      ],
      wishlist: ["Heat: Pedal to the Metal", "Wingspan", "Just One", "The Search for Planet X"],
    },
    friends: ["Ana", "Luis", "Sofía", "Mateo"],
    alertTargets: [
      { game: "Wingspan", targetPrice: 48.99 },
      { game: "Heat: Pedal to the Metal", targetPrice: 58.99 },
    ],
  },
  {
    id: 7,
    username: "señor_carton",
    createdAt: "2024-06-28T18:10:00.000Z",
    bio: "Chases highly interactive games where table talk, brinkmanship, and tempo swings matter.",
    voice: "competitive",
    preferences: {
      playerCount: "3-6",
      duration: "45-240",
      complexity: "3-5",
      themes: ["Political", "Negotiation", "Fantasy"],
    },
    ratings: {
      loved: ["Cosmic Encounter", "Root", "Dune: Imperium", "Pax Pamir: Second Edition", "Oath"],
      liked: ["Coup", "The Resistance: Avalon", "Blood Rage", "Captain Sonar"],
      neutral: ["Scythe"],
      disliked: ["Forbidden Island", "Just One"],
    },
    collection: {
      owned: [
        "Cosmic Encounter",
        "Dune: Imperium",
        "Root",
        "Pax Pamir: Second Edition",
        "Coup",
        "The Resistance: Avalon",
        "Blood Rage",
        "Oath",
        "Captain Sonar",
      ],
      wishlist: ["Twilight Imperium (Fourth Edition)", "War of the Ring: Second Edition", "Food Chain Magnate", "Brass: Lancashire"],
    },
    friends: ["María", "Tomás", "Inés", "Raúl"],
    alertTargets: [
      { game: "War of the Ring: Second Edition", targetPrice: 74.99 },
      { game: "Food Chain Magnate", targetPrice: 96.99 },
    ],
  },
  {
    id: 8,
    username: "minh_combo",
    createdAt: "2024-07-03T13:30:00.000Z",
    bio: "Loves chaining actions together, building engines, and squeezing value out of every card.",
    voice: "analytical",
    preferences: {
      playerCount: "2-4",
      duration: "45-150",
      complexity: "2-4",
      themes: ["Science Fiction", "Economic", "Fantasy"],
    },
    ratings: {
      loved: ["Terraforming Mars", "Dune: Imperium", "Lost Ruins of Arnak", "Dominion", "Wingspan"],
      liked: ["Everdell", "Splendor Duel", "Architects of the West Kingdom", "Viticulture Essential Edition"],
      neutral: ["Scythe"],
      disliked: ["Clue", "No Thanks!"],
    },
    collection: {
      owned: [
        "Terraforming Mars",
        "Dune: Imperium",
        "Lost Ruins of Arnak",
        "Dominion",
        "Wingspan",
        "Splendor Duel",
        "Everdell",
        "Architects of the West Kingdom",
        "Viticulture Essential Edition",
        "Brass: Birmingham",
      ],
      wishlist: ["Anachrony", "Arkham Horror: The Card Game", "Orléans", "Great Western Trail"],
    },
    friends: ["Linh", "Bao", "Alex", "Casey"],
    alertTargets: [
      { game: "Anachrony", targetPrice: 69.99 },
      { game: "Great Western Trail", targetPrice: 45.99 },
    ],
  },
  {
    id: 9,
    username: "riley_dungeon",
    createdAt: "2024-05-24T15:45:00.000Z",
    bio: "Wants cinematic stories, brutal boss fights, and campaigns that feel like treasure chests.",
    voice: "enthusiastic",
    preferences: {
      playerCount: "1-5",
      duration: "60-240",
      complexity: "3-5",
      themes: ["Adventure", "Fantasy", "Horror"],
    },
    ratings: {
      loved: ["Gloomhaven", "Frosthaven", "Nemesis", "Sleeping Gods", "Clank!: A Deck-Building Adventure"],
      liked: ["Betrayal at House on the Hill", "Dead of Winter: A Crossroads Game", "Arkham Horror: The Card Game", "Star Wars: Rebellion"],
      neutral: ["Blood Rage"],
      disliked: ["Café", "Patchwork"],
    },
    collection: {
      owned: [
        "Gloomhaven",
        "Frosthaven",
        "Nemesis",
        "Clank!: A Deck-Building Adventure",
        "Sleeping Gods",
        "Betrayal at House on the Hill",
        "Dead of Winter: A Crossroads Game",
        "Arkham Horror: The Card Game",
        "Star Wars: Rebellion",
        "Blood Rage",
      ],
      wishlist: ["War of the Ring: Second Edition", "Robinson Crusoe: Adventures on the Cursed Island", "Spirit Island", "Oath"],
    },
    friends: ["Harper", "Dev", "Mina", "Owen"],
    alertTargets: [
      { game: "War of the Ring: Second Edition", targetPrice: 79.99 },
      { game: "Oath", targetPrice: 89.99 },
    ],
  },
  {
    id: 10,
    username: "élise_euro",
    createdAt: "2024-06-14T10:25:00.000Z",
    bio: "Curates elegant euros, especially titles with satisfying decision density and clear scoring arcs.",
    voice: "cozy",
    preferences: {
      playerCount: "2-4",
      duration: "45-150",
      complexity: "2-4",
      themes: ["Economic", "Medieval", "City Building"],
    },
    ratings: {
      loved: ["Castles of Burgundy", "Concordia", "Orléans", "Brass: Lancashire", "Great Western Trail"],
      liked: ["Café", "Jórvík", "Viticulture Essential Edition", "Puerto Rico", "Azul"],
      neutral: ["Agricola"],
      disliked: ["Betrayal at House on the Hill", "Clue"],
    },
    collection: {
      owned: [
        "Castles of Burgundy",
        "Concordia",
        "Orléans",
        "Café",
        "Jórvík",
        "Viticulture Essential Edition",
        "Puerto Rico",
        "Agricola",
        "Brass: Lancashire",
        "Great Western Trail",
        "Azul",
        "Santorini",
      ],
      wishlist: ["Brass: Birmingham", "A Feast for Odin", "Food Chain Magnate", "Tzolk'in: The Mayan Calendar"],
    },
    friends: ["Camille", "Luc", "Marion", "Étienne"],
    alertTargets: [
      { game: "A Feast for Odin", targetPrice: 84.99 },
      { game: "Brass: Birmingham", targetPrice: 59.99 },
    ],
  },
  {
    id: 11,
    username: "kai_棋士",
    createdAt: "2024-08-09T06:55:00.000Z",
    bio: "Seeks clean tactical puzzles, especially titles that reward reading an opponent one move ahead.",
    voice: "competitive",
    preferences: {
      playerCount: "2-2",
      duration: "15-60",
      complexity: "1-3",
      themes: ["Abstract Strategy", "Deduction", "Card Game"],
    },
    ratings: {
      loved: ["Hive", "Santorini", "Boop.", "The Search for Planet X", "Jaipur"],
      liked: ["Patchwork", "Splendor Duel", "Hanabi", "Skull", "No Thanks!"],
      neutral: ["Cascadia"],
      disliked: ["Twilight Imperium (Fourth Edition)", "Advanced Squad Leader"],
    },
    collection: {
      owned: [
        "Hive",
        "Santorini",
        "Boop.",
        "Patchwork",
        "Splendor Duel",
        "Hanabi",
        "The Search for Planet X",
        "Skull",
        "No Thanks!",
        "Jaipur",
      ],
      wishlist: ["War of the Ring: Second Edition", "Cascadia", "Heat: Pedal to the Metal", "Captain Sonar"],
    },
    friends: ["Yuna", "Ren", "Miko", "Sora"],
    alertTargets: [
      { game: "Heat: Pedal to the Metal", targetPrice: 57.99 },
      { game: "Cascadia", targetPrice: 29.99 },
    ],
  },
  {
    id: 12,
    username: "nora_history",
    createdAt: "2024-05-01T14:35:00.000Z",
    bio: "A history-minded player who embraces long arcs, difficult rules, and conflict with context.",
    voice: "analytical",
    preferences: {
      playerCount: "2-4",
      duration: "90-300",
      complexity: "4-5",
      themes: ["Historical", "Political", "Economic"],
    },
    ratings: {
      loved: ["Pax Pamir: Second Edition", "War of the Ring: Second Edition", "Through the Ages: A New Story of Civilization", "Advanced Squad Leader", "Brass: Birmingham"],
      liked: ["Power Grid", "Concordia", "Tzolk'in: The Mayan Calendar", "Puerto Rico"],
      neutral: ["Twilight Imperium (Fourth Edition)"],
      disliked: ["Dixit", "Just One"],
    },
    collection: {
      owned: [
        "Pax Pamir: Second Edition",
        "War of the Ring: Second Edition",
        "Twilight Imperium (Fourth Edition)",
        "Advanced Squad Leader",
        "Through the Ages: A New Story of Civilization",
        "Power Grid",
        "Brass: Birmingham",
        "Puerto Rico",
        "Concordia",
        "Tzolk'in: The Mayan Calendar",
      ],
      wishlist: ["Food Chain Magnate", "Anachrony", "Oath", "Nemesis"],
    },
    friends: ["Evan", "Sloane", "Gabe", "Imani"],
    alertTargets: [
      { game: "Food Chain Magnate", targetPrice: 98.99 },
      { game: "Nemesis", targetPrice: 114.99 },
    ],
  },
];
