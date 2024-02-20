const recommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "requesterEmail": "requester1@gmail.com",
        "professorEmail": "professor1@gmail.com",
        "explanation": "explanation1",
        "dateRequested": "2022-01-02T12:00:00",
        "dateNeeded": "2023-01-02T12:00:00",
        "done": "false"
    },
    threeRecommendationRequests: [
        {
            "id": 1,
            "requesterEmail": "requester1@gmail.com",
            "professorEmail": "professor1@gmail.com",
            "explanation": "explanation1",
            "dateRequested": "2022-01-02T12:00:00",
            "dateNeeded": "2023-01-02T12:00:00",
            "done": "false"
        },
        {
            "id": 2,
            "requesterEmail": "requester2@gmail.com",
            "professorEmail": "professor2@gmail.com",
            "explanation": "explanation2",
            "dateRequested": "2022-02-02T12:00:00",
            "dateNeeded": "2023-02-02T12:00:00",
            "done": "true"
        },
        {
            "id": 3,
            "requesterEmail": "requester3@gmail.com",
            "professorEmail": "professor3@gmail.com",
            "explanation": "explanation3",
            "dateRequested": "2022-03-02T12:00:00",
            "dateNeeded": "2023-03-02T12:00:00",
            "done": "false"
        }
    ]
};


export { recommendationRequestFixtures };