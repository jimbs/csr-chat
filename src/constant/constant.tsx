export const promoColor = [
{
    background: "linear-gradient(90deg, #FFEA00, #FFC600)",
    color: "black",
    
},
{
    background: "linear-gradient(90deg, #731DB9,  #52249F)",
    color: "white",
    
},
{
    background: "linear-gradient(90deg, #FFD027, #FF6807)",
    color: "white",
    
}

]

export const promoDescription = [

    {
    qualification: [
        "Register and login to Karera.Live",
        "Make an initial deposit of at least ₱500 sa iyong Karera.Live wallet"
    
    ],
    example: [
        "You've successfully registered and logged in",
        "You've deposited at least P500.",
        "You get ₱20 bonus",
        "A 10x wagering requirement applies.",
        "₱20 x 10 = ₱200 is the required valid turnover",
        "You need to play at least ₱200 before any withdrawals."
    
    ],
    terms: [
        "This promo is exclusive for New Players",
        "Available for a one-time claim only.",
        "Only one account per player is allowed."
    ]
    
    },
    
    {
        qualification: [
            "Register and login to Karera.Live",
            "Mag-deposit ng at least ₱500.",
            "To refer, mag-generate ng iyong Referral QR Code. Go to your profile, at i-select ang \"Refer & Earn!\". Download your QR Code or  copy the Referral link.",
            "Referral must register using your Referral QR Code."
        
        ],
        example: [
            "Referral has registered successfully.",
            "You get ₱20 bonus",
            "10x wagering requirement",
            "₱20 x 10 = ₱200 is the required valid turnover",
            "You need to play at least ₱200 before any withdrawals."
        
        ],
        terms: [
            "Limited to one referral.",
            "Only one account per player is allowed.",
            "Available for a one-time claim only."
        ]
        
        },
    
        {
            qualification: [
                "Register and login to Karera.Live",
                "Make an initial deposit of at least ₱500 sa iyong Karera.Live wallet."
               
            
            ],
            example: [
                "You've successfully registered and logged in",
                "You've deposited at least P500.",
                "You get ₱20 bonus on your birthday",
                "A 10x wagering requirement applies.",
                "₱20 x 10 = ₱200 is the required valid turnover",
                "You need to play at least ₱200 before any withdrawals."
            
            ],
            terms: [
                "The promotion is valid once a year.",
                "Only one account per player is allowed.",
                "Maari lamang i-claim ang Birthday Bonus on the day of your birthday.",
                "If not claimed on the day of your birthday, the Birthday Bonus will be forfeited."
            ]
            
            }
        ]

export const promos = [
    
    {
      "id": 1,
      "name": "WELCOME_BONUS_PROMO",
      "label": "Welcome Bonus Promo",
      "amount": "20.00",
      "type": "promo",
      "turnOverMultiplyier": 10,
      "promoStartedDate": null,
      "promoEndedDate": null,
      "createdAt": "2024-12-27T04:00:13.000Z",
      "updatedAt": "2024-12-27T04:00:13.000Z",
      "image":"/assets/Promos/WELCOME_BONUS_PROMO.png",
      "isClaimed": new Date(),
      ...promoColor[0]
  },
  {
      "id": 2,
      "name": "REFER_EARN_PROMO",
      "label": "Refer and Earn Promo",
      "amount": "20.00",
      "type": "promo",
      "turnOverMultiplyier": 10,
      "promoStartedDate": null,
      "promoEndedDate": null,
      "createdAt": "2024-12-27T04:00:13.000Z",
      "updatedAt": "2024-12-27T04:00:13.000Z",
      "image":"/assets/Promos/REFER_EARN_PROMO.png",
      "isClaimed": new Date(),
      ...promoColor[1]
  },
  {
      "id": 3,
      "name": "BITHRDAY_BENTE_PROMO",
      "label": "Welcome Bonus Promo",
      "amount": "20.00",
      "type": "promo",
      "turnOverMultiplyier": 10,
      "promoStartedDate": null,
      "promoEndedDate": null,
      "createdAt": "2024-12-27T04:00:13.000Z",
      "updatedAt": "2024-12-27T04:00:13.000Z",
      "image":"/assets/Promos/BITHRDAY_BENTE_PROMO.png",
      "isClaimed": "",
      ...promoColor[2]
  }
]

export const amounts = ["5", "20", "50", "100", "200", "500", "1000", "5000", "ALL IN"];

export const badges = [

    {
        "id": 1,
        "name": "VIP_BADGE",
        "color": "#4F2787",
        "label": "VIP Badge",
        "condition": "500,000+",
        "duration": "6 months",
        "image": "/assets/Badges/VIP_BADGE.png",
        "text": {
            qualification: [
                "Players who have bet a total of",
                "%condition% within one month."
            ]
        },
        "sample": "/assets/Badges/sample-badge.png"
    },
    {
        "id": 2,
        "name": "FRONT_RUNNER_BADGE",
        "color": "#FE6100",
        "label": "Front-Runner Badge",
        "condition": "300 rounds",
        "duration": "7 days",
        "image": "/assets/Badges/FRONT_RUNNER_BADGE.png",
        "text": {
            qualification: [
                "Players who have played",
                "%condition% per week."
            ]
        }
    },
    {
        "id": 3,
        "name": "LOYALTY_BADGE",
        "color": "#00C2FF",
        "label": "Loyalty Badge",
        "condition": "Monday to Sunday",
        "duration": "7 days",
        "image": "/assets/Badges/LOYALTY_BADGE.png",
        "text": {
            qualification: [
                "Players who open Karera live daily,",
                "from %condition%"
            ]
        }
    },
    {
        "id": 4,
        "name": "MASTER_GIVER_BADGE",
        "color": "#00A24A",
        "label": "Master Giver Badge",
        "condition": "Monthly Top 10 Generous Givers",
        "duration": "30 days",
        "image": "/assets/Badges/MASTER_GIVER_BADGE.png",
        "text": {
            qualification: [
                "%condition%",
                "who sent gifts to our awesome hosts."
            ]
        }
    }
]
 