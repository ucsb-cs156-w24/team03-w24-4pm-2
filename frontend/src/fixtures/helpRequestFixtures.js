const helpRequestFixtures = {
    oneDate: {
        "id": 1,
        "requesterEmail": "cgaucho@ucsb.edu",
        "teamId": "s22-5pm-3",
        "tableOrBreakoutRoom": "7",
        "explanation": "Need help with Swagger-ui",
        "solved": "false",
        "requestTime": "2022-01-02T12:00:00"
    },
    threeDates: [
        {
            "id": 1,
            "requesterEmail": "ldelplaya@ucsb.edu",
            "teamId": "s22-6pm-3",
            "tableOrBreakoutRoom": "11",
            "explanation": "Dokku problems",
            "solved": "false",
            "localDateTime": "2022-01-02T12:00:00"
        },
        {
            "id": 2,
            "requesterEmail": "mraccoon@ucsb.edu",
            "teamId": "s22-4pm-3",
            "tableOrBreakoutRoom": "8",
            "explanation": "Need help with mutation tests",
            "solved": "false",
            "localDateTime": "2022-04-03T12:00:00"
        },
        {
            "id": 3,
            "requesterEmail": "pdg@ucsb.edu",
            "teamId": "s22-6pm-4",
            "tableOrBreakoutRoom": "13",
            "explanation": "Merge conflict",
            "solved": "false",
            "localDateTime": "2022-07-04T12:00:00"
        }
    ]
};


export { helpRequestFixtures };