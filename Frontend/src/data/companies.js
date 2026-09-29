const companies = {
  technova: {
    name: "TechNova Solutions",
    category: "Technology • Software & Services",
    logo: "T",
    rating: "4.8",
    reviews: "2,341",
    sentiment: { positive: 78, neutral: 14, negative: 8 },
    insights: {
      love: "Fast delivery, product quality and helpful customer support.",
      topics: "Delivery, customer service, pricing and product quality.",
    },
    reviewsList: [],
  },

  quickkart: {
    name: "QuickKart",
    category: "E-Commerce • Online Shopping",
    logo: "Q",
    rating: "4.5",
    reviews: "1,892",
    sentiment: { positive: 72, neutral: 18, negative: 10 },
    insights: {
      love: "Wide product variety, discounts and easy ordering.",
      topics: "Delivery, pricing, product quality and refunds.",
    },
    reviewsList: [],
  },

  travelease: {
    name: "TravelEase",
    category: "Travel • Booking Services",
    logo: "T",
    rating: "4.2",
    reviews: "987",
    sentiment: { positive: 65, neutral: 23, negative: 12 },
    insights: {
      love: "Easy booking, good travel options and competitive prices.",
      topics: "Booking, cancellation, pricing and customer support.",
    },
    reviewsList: [],
  },

  mcdonalds: {
    name: "McDonald's",
    category: "Food • Quick Service Restaurant",
    logo: "M",
    rating: "4.1",
    reviews: "Demo",
    sentiment: { positive: 70, neutral: 18, negative: 12 },
    insights: {
      love: "Convenient ordering, popular menu items and quick service.",
      topics: "Food quality, service, waiting time and pricing.",
    },
    reviewsList: [],
  },

  dominos: {
    name: "Domino's",
    category: "Food • Pizza & Delivery",
    logo: "D",
    rating: "4.2",
    reviews: "Demo",
    sentiment: { positive: 71, neutral: 17, negative: 12 },
    insights: {
      love: "Easy ordering and convenient food delivery.",
      topics: "Delivery, food quality, pricing and waiting time.",
    },
    reviewsList: [],
  },

  starbucks: {
    name: "Starbucks",
    category: "Food & Beverage • Cafe",
    logo: "S",
    rating: "4.3",
    reviews: "Demo",
    sentiment: { positive: 73, neutral: 17, negative: 10 },
    insights: {
      love: "Cafe atmosphere, beverages and customer experience.",
      topics: "Quality, ambience, pricing and customer service.",
    },
    reviewsList: [],
  },

  amazon: {
    name: "Amazon",
    category: "E-Commerce • Online Shopping",
    logo: "A",
    rating: "4.4",
    reviews: "Demo",
    sentiment: { positive: 74, neutral: 16, negative: 10 },
    insights: {
      love: "Product variety, delivery options and convenience.",
      topics: "Delivery, product quality, pricing and refunds.",
    },
    reviewsList: [],
  },

  flipkart: {
    name: "Flipkart",
    category: "E-Commerce • Online Shopping",
    logo: "F",
    rating: "4.3",
    reviews: "Demo",
    sentiment: { positive: 72, neutral: 18, negative: 10 },
    insights: {
      love: "Large product selection and competitive pricing.",
      topics: "Delivery, pricing, product quality and returns.",
    },
    reviewsList: [],
  },

  myntra: {
    name: "Myntra",
    category: "Shopping • Fashion & Lifestyle",
    logo: "M",
    rating: "4.3",
    reviews: "Demo",
    sentiment: { positive: 73, neutral: 17, negative: 10 },
    insights: {
      love: "Fashion variety, offers and convenient shopping.",
      topics: "Product quality, delivery, pricing and returns.",
    },
    reviewsList: [],
  },

  makemytrip: {
    name: "MakeMyTrip",
    category: "Travel • Online Booking",
    logo: "M",
    rating: "4.2",
    reviews: "Demo",
    sentiment: { positive: 68, neutral: 20, negative: 12 },
    insights: {
      love: "Travel options, booking convenience and deals.",
      topics: "Booking, cancellation, pricing and support.",
    },
    reviewsList: [],
  },

  indigo: {
    name: "IndiGo",
    category: "Travel • Airlines",
    logo: "I",
    rating: "4.1",
    reviews: "Demo",
    sentiment: { positive: 67, neutral: 21, negative: 12 },
    insights: {
      love: "Flight availability and convenient travel options.",
      topics: "Service, punctuality, baggage and pricing.",
    },
    reviewsList: [],
  },

  airindia: {
    name: "Air India",
    category: "Travel • Airlines",
    logo: "A",
    rating: "4.0",
    reviews: "Demo",
    sentiment: { positive: 64, neutral: 23, negative: 13 },
    insights: {
      love: "Flight connectivity and travel options.",
      topics: "Service, punctuality, baggage and customer support.",
    },
    reviewsList: [],
  },

  tcs: {
    name: "TCS",
    category: "Technology • IT Services",
    logo: "T",
    rating: "4.4",
    reviews: "Demo",
    sentiment: { positive: 76, neutral: 16, negative: 8 },
    insights: {
      love: "Professional services and technology expertise.",
      topics: "Service quality, support, delivery and pricing.",
    },
    reviewsList: [],
  },

  infosys: {
    name: "Infosys",
    category: "Technology • IT Services",
    logo: "I",
    rating: "4.3",
    reviews: "Demo",
    sentiment: { positive: 74, neutral: 17, negative: 9 },
    insights: {
      love: "Technology services and professional support.",
      topics: "Service quality, delivery, support and pricing.",
    },
    reviewsList: [],
  },

  wipro: {
    name: "Wipro",
    category: "Technology • IT Services",
    logo: "W",
    rating: "4.2",
    reviews: "Demo",
    sentiment: { positive: 72, neutral: 18, negative: 10 },
    insights: {
      love: "Technology solutions and enterprise services.",
      topics: "Service quality, support, delivery and pricing.",
    },
    reviewsList: [],
  },

  taj: {
    name: "Taj Hotels",
    category: "Hotels • Hospitality",
    logo: "T",
    rating: "4.6",
    reviews: "Demo",
    sentiment: { positive: 82, neutral: 12, negative: 6 },
    insights: {
      love: "Hospitality, ambience and customer service.",
      topics: "Cleanliness, service, ambience, pricing and food.",
    },
    reviewsList: [],
  },

  oyo: {
    name: "OYO",
    category: "Hotels • Accommodation",
    logo: "O",
    rating: "4.0",
    reviews: "Demo",
    sentiment: { positive: 63, neutral: 23, negative: 14 },
    insights: {
      love: "Availability, booking convenience and pricing.",
      topics: "Cleanliness, service, pricing and booking.",
    },
    reviewsList: [],
  },

  uber: {
    name: "Uber",
    category: "Transportation • Ride Sharing",
    logo: "U",
    rating: "4.2",
    reviews: "Demo",
    sentiment: { positive: 70, neutral: 19, negative: 11 },
    insights: {
      love: "Convenient booking and availability.",
      topics: "Driver service, pricing, waiting time and safety.",
    },
    reviewsList: [],
  },

  ola: {
    name: "Ola",
    category: "Transportation • Ride Sharing",
    logo: "O",
    rating: "4.0",
    reviews: "Demo",
    sentiment: { positive: 66, neutral: 21, negative: 13 },
    insights: {
      love: "Convenient rides and availability.",
      topics: "Driver service, pricing, waiting time and safety.",
    },
    reviewsList: [],
  },

  hdfc: {
    name: "HDFC Bank",
    category: "Banking • Financial Services",
    logo: "H",
    rating: "4.2",
    reviews: "Demo",
    sentiment: { positive: 70, neutral: 19, negative: 11 },
    insights: {
      love: "Banking services and digital convenience.",
      topics: "Customer service, transactions, support and accessibility.",
    },
    reviewsList: [],
  },

  icici: {
    name: "ICICI Bank",
    category: "Banking • Financial Services",
    logo: "I",
    rating: "4.1",
    reviews: "Demo",
    sentiment: { positive: 68, neutral: 20, negative: 12 },
    insights: {
      love: "Digital banking services and accessibility.",
      topics: "Customer service, transactions, support and accessibility.",
    },
    reviewsList: [],
  },
};

export default companies;