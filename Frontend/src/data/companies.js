const companies = {
  technova: {
    name: "TechNova Solutions",
    category: "Technology • Software & Services",
    logo: "T",
    rating: "4.8",
    reviews: "2,341",

    sentiment: {
      positive: 78,
      neutral: 14,
      negative: 8,
    },

    insights: {
      love: "Fast delivery, product quality and helpful customer support.",
      topics: "Delivery, customer service, pricing and product quality.",
    },

    reviewsList: [
      {
        name: "Rahul Sharma",
        rating: "★★★★★",
        text: "Great service and very fast delivery. The product quality was better than I expected.",
        date: "2 days ago",
      },
      {
        name: "Priya Verma",
        rating: "★★★★☆",
        text: "Good products and reasonable pricing. Customer support could be a little faster.",
        date: "5 days ago",
      },
    ],
  },

  quickkart: {
    name: "QuickKart",
    category: "E-Commerce • Online Shopping",
    logo: "Q",
    rating: "4.5",
    reviews: "1,892",

    sentiment: {
      positive: 72,
      neutral: 18,
      negative: 10,
    },

    insights: {
      love: "Wide product variety, discounts and easy ordering.",
      topics: "Delivery, pricing, product quality and refunds.",
    },

    reviewsList: [
      {
        name: "Aman Gupta",
        rating: "★★★★★",
        text: "Very easy to order and the delivery was surprisingly fast.",
        date: "1 day ago",
      },
      {
        name: "Neha Singh",
        rating: "★★★★☆",
        text: "Good prices and lots of products. Refunds could be processed faster.",
        date: "4 days ago",
      },
    ],
  },

  travelease: {
    name: "TravelEase",
    category: "Travel • Booking Services",
    logo: "T",
    rating: "4.2",
    reviews: "987",

    sentiment: {
      positive: 65,
      neutral: 23,
      negative: 12,
    },

    insights: {
      love: "Easy booking, good travel options and competitive prices.",
      topics: "Booking, cancellation, pricing and customer support.",
    },

    reviewsList: [
      {
        name: "Rohit Mehta",
        rating: "★★★★★",
        text: "Booking was simple and the prices were reasonable.",
        date: "3 days ago",
      },
      {
        name: "Anjali Patel",
        rating: "★★★☆☆",
        text: "The booking process was good, but cancellation support took some time.",
        date: "6 days ago",
      },
    ],
  },
};

export default companies;