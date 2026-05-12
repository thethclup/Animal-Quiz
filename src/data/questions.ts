export type Category = 'Mammals' | 'Birds' | 'Ocean Life' | 'Reptiles' | 'Mythical';

export interface Question {
  id: string;
  category: Category;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  imageUrl: string;
}

export const questions: Question[] = [
  {
    id: "q_m_1",
    category: "Mammals",
    text: "Which animal is known to have the most powerful bite of any primate?",
    options: ["Gorilla", "Chimpanzee", "Mandrill", "Orangutan"],
    correctIndex: 0,
    explanation: "Gorillas have a bite force of about 1300 PSI, specially adapted for chewing tough plants.",
    imageUrl: "https://images.unsplash.com/photo-1543440700-6cb56ec25dff?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "q_m_2",
    category: "Mammals",
    text: "What is the speed of a cheetah's top sprint?",
    options: ["40-50 mph", "50-60 mph", "60-70 mph", "70-80 mph"],
    correctIndex: 2,
    explanation: "Cheetahs can accelerate from 0 to 60 mph in just 3 seconds.",
    imageUrl: "https://images.unsplash.com/photo-1579893962657-190ea47eb3aa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "q_b_1",
    category: "Birds",
    text: "Which bird has the largest wingspan?",
    options: ["Bald Eagle", "Wandering Albatross", "Andean Condor", "California Condor"],
    correctIndex: 1,
    explanation: "The Wandering Albatross has a wingspan that can reach up to 11.5 feet (3.5m).",
    imageUrl: "https://images.unsplash.com/photo-1522033994348-1ad727bc7bcf?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "q_o_1",
    category: "Ocean Life",
    text: "Which marine creature is known to possess three hearts?",
    options: ["Squid", "Octopus", "Jellyfish", "Cuttlefish"],
    correctIndex: 1,
    explanation: "An octopus has two branchial hearts that pump blood to the gills, and one systemic heart that pumps it to the rest of the body.",
    imageUrl: "https://images.unsplash.com/photo-1545671598-a44bd4eda5bc?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "q_r_1",
    category: "Reptiles",
    text: "Which is the largest living reptile in the world?",
    options: ["Komodo Dragon", "Saltwater Crocodile", "Green Sea Turtle", "Anaconda"],
    correctIndex: 1,
    explanation: "Saltwater crocodiles can grow to be over 20 feet (6m) long and weigh over 2,000 lbs.",
    imageUrl: "https://images.unsplash.com/photo-1510461623943-7f2a13ccac17?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "q_my_1",
    category: "Mythical",
    text: "Which mythical creature is said to rise from its own ashes?",
    options: ["Dragon", "Griffin", "Phoenix", "Chimera"],
    correctIndex: 2,
    explanation: "The Phoenix is a legendary bird in Greek mythology that periodically dies in a show of flames and combustion, then reborn from the ashes.",
    imageUrl: "https://images.unsplash.com/photo-1520114815152-32b000a65349?auto=format&fit=crop&q=80&w=800",
  }
];

// Add helper to fetch a random subset
export function getRandomQuestions(count: number, category?: Category): Question[] {
  let filtered = category ? questions.filter(q => q.category === category) : [...questions];
  // Fisher-Yates shuffle
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }
  return filtered.slice(0, count);
}
