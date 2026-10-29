export interface Challenge {
    id: string;
    text: string;
    terrain: number; // 1: BASE SECRÈTE, 2: TERRAIN LIBRE, 3: INFILTRATION
}

export const CHALLENGES: Challenge[] = [
    // --- MANIPULATION ---
    { id: "MANIPULATION_001_1", text: "Fais prononcer le mot « Grave » à un autre joueur.", terrain: 1 },
    { id: "MANIPULATION_001_2", text: "Fais prononcer le mot « Grave » à un autre joueur.", terrain: 2 },
    { id: "MANIPULATION_001_3", text: "Fais prononcer le mot « Grave » à un autre joueur.", terrain: 3 },

    { id: "MANIPULATION_002_1", text: "Fais chanter au moins un joueur.", terrain: 1 },
    { id: "MANIPULATION_002_2", text: "Fais chanter au moins un joueur.", terrain: 2 },
    { id: "MANIPULATION_002_3", text: "Fais chanter au moins un joueur.", terrain: 3 },

    { id: "MANIPULATION_003_1", text: "Fais applaudir au moins deux joueurs.", terrain: 1 },
    { id: "MANIPULATION_003_2", text: "Fais applaudir au moins deux joueurs.", terrain: 2 },
    { id: "MANIPULATION_003_3", text: "Fais applaudir au moins deux joueurs.", terrain: 3 },

    { id: "MANIPULATION_004_1", text: "Fais prendre une photo de groupe.", terrain: 1 },
    { id: "MANIPULATION_004_2", text: "Fais prendre une photo de groupe.", terrain: 2 },
    { id: "MANIPULATION_004_3", text: "Fais prendre une photo de groupe.", terrain: 3 },

    { id: "MANIPULATION_005_1", text: "Fais changer de place deux joueurs.", terrain: 1 },
    { id: "MANIPULATION_005_3", text: "Fais changer de place deux joueurs.", terrain: 3 },

    { id: "MANIPULATION_006_1", text: "Fais goûter la boisson d'un joueur à un autre.", terrain: 1 },
    { id: "MANIPULATION_006_3", text: "Fais goûter la boisson d'un joueur à un autre.", terrain: 3 },

    { id: "MANIPULATION_007_1", text: "Fais imiter un animal à un joueur.", terrain: 1 },
    { id: "MANIPULATION_007_2", text: "Fais imiter un animal à un joueur.", terrain: 2 },
    { id: "MANIPULATION_007_3", text: "Fais imiter un animal à un joueur.", terrain: 3 },

    { id: "MANIPULATION_008_1", text: "Fais en sorte qu'un joueur te prête son téléphone.", terrain: 1 },
    { id: "MANIPULATION_008_2", text: "Fais en sorte qu'un joueur te prête son téléphone.", terrain: 2 },
    { id: "MANIPULATION_008_3", text: "Fais en sorte qu'un joueur te prête son téléphone.", terrain: 3 },

    { id: "MANIPULATION_009_1", text: "Fais en sorte qu'un joueur te prenne dans ses bras.", terrain: 1 },
    { id: "MANIPULATION_009_2", text: "Fais en sorte qu'un joueur te prenne dans ses bras.", terrain: 2 },
    { id: "MANIPULATION_009_3", text: "Fais en sorte qu'un joueur te prenne dans ses bras.", terrain: 3 },

    { id: "MANIPULATION_010_1", text: "Fais dire « Je t'aime » à un joueur, peu importe à qui.", terrain: 1 },
    { id: "MANIPULATION_010_2", text: "Fais dire « Je t'aime » à un joueur, peu importe à qui.", terrain: 2 },
    { id: "MANIPULATION_010_3", text: "Fais dire « Je t'aime » à un joueur, peu importe à qui.", terrain: 3 },

    // --- OBSERVATION ---
    { id: "OBSERVATION_001_1", text: "À chaque fois qu'un joueur te pose une question, lève le pouce avant de répondre.", terrain: 1 },
    { id: "OBSERVATION_001_2", text: "À chaque fois qu'un joueur te pose une question, lève le pouce avant de répondre.", terrain: 2 },
    { id: "OBSERVATION_001_3", text: "À chaque fois qu'un joueur te pose une question, lève le pouce avant de répondre.", terrain: 3 },

    { id: "OBSERVATION_002_1", text: "À chaque fois que quelqu'un rit, prends ton verre en main.", terrain: 1 },
    { id: "OBSERVATION_002_3", text: "À chaque fois que quelqu'un rit, prends ton verre en main.", terrain: 3 },

    { id: "OBSERVATION_003_1", text: "À chaque fois que quelqu'un prononce ton prénom, touche ton oreille.", terrain: 1 },
    { id: "OBSERVATION_003_2", text: "À chaque fois que quelqu'un prononce ton prénom, touche ton oreille.", terrain: 2 },
    { id: "OBSERVATION_003_3", text: "À chaque fois que quelqu'un prononce ton prénom, touche ton oreille.", terrain: 3 },

    { id: "OBSERVATION_004_1", text: "À chaque fois qu'un joueur regarde son téléphone, regarde le tien.", terrain: 1 },
    { id: "OBSERVATION_004_2", text: "À chaque fois qu'un joueur regarde son téléphone, regarde le tien.", terrain: 2 },
    { id: "OBSERVATION_004_3", text: "À chaque fois qu'un joueur regarde son téléphone, regarde le tien.", terrain: 3 },

    { id: "OBSERVATION_005_1", text: "À chaque fois que quelqu'un dit « oui », croise les bras.", terrain: 1 },
    { id: "OBSERVATION_005_2", text: "À chaque fois que quelqu'un dit « oui », croise les bras.", terrain: 2 },
    { id: "OBSERVATION_005_3", text: "À chaque fois que quelqu'un dit « oui », croise les bras.", terrain: 3 },

    { id: "OBSERVATION_006_1", text: "Commence chacune de tes phrases par « Alors… ».", terrain: 1 },
    { id: "OBSERVATION_006_2", text: "Commence chacune de tes phrases par « Alors… ».", terrain: 2 },
    { id: "OBSERVATION_006_3", text: "Commence chacune de tes phrases par « Alors… ».", terrain: 3 },

    { id: "OBSERVATION_007_1", text: "À chaque fois qu'un joueur touche ses cheveux, touche les tiens.", terrain: 1 },
    { id: "OBSERVATION_007_2", text: "À chaque fois qu'un joueur touche ses cheveux, touche les tiens.", terrain: 2 },
    { id: "OBSERVATION_007_3", text: "À chaque fois qu'un joueur touche ses cheveux, touche les tiens.", terrain: 3 },

    { id: "OBSERVATION_008_1", text: "Réponds à chaque question par une autre question.", terrain: 1 },
    { id: "OBSERVATION_008_2", text: "Réponds à chaque question par une autre question.", terrain: 2 },
    { id: "OBSERVATION_008_3", text: "Réponds à chaque question par une autre question.", terrain: 3 },

    { id: "OBSERVATION_009_1", text: "À chaque fois que quelqu'un dit un gros mot, tousse.", terrain: 1 },
    { id: "OBSERVATION_009_2", text: "À chaque fois que quelqu'un dit un gros mot, tousse.", terrain: 2 },
    { id: "OBSERVATION_009_3", text: "À chaque fois que quelqu'un dit un gros mot, tousse.", terrain: 3 },

    { id: "OBSERVATION_010_1", text: "À chaque fois qu'on te tend un objet, dis « Merci chef ».", terrain: 1 },
    { id: "OBSERVATION_010_2", text: "À chaque fois qu'on te tend un objet, dis « Merci chef ».", terrain: 2 },
    { id: "OBSERVATION_010_3", text: "À chaque fois qu'on te tend un objet, dis « Merci chef ».", terrain: 3 },

    // --- INFILTRATION ---
    { id: "INFILTRATION_001_1", text: "Fais croire à un joueur que tu as déjà rencontré une célébrité.", terrain: 1 },
    { id: "INFILTRATION_001_2", text: "Fais croire à un joueur que tu as déjà rencontré une célébrité.", terrain: 2 },
    { id: "INFILTRATION_001_3", text: "Fais croire à un joueur que tu as déjà rencontré une célébrité.", terrain: 3 },

    { id: "INFILTRATION_002_1", text: "Fais croire à un joueur que tu parles une langue que tu ne parles pas.", terrain: 1 },
    { id: "INFILTRATION_002_2", text: "Fais croire à un joueur que tu parles une langue que tu ne parles pas.", terrain: 2 },
    { id: "INFILTRATION_002_3", text: "Fais croire à un joueur que tu parles une langue que tu ne parles pas.", terrain: 3 },

    { id: "INFILTRATION_003_1", text: "Fais croire à un joueur que tu as un jumeau ou une jumelle.", terrain: 1 },
    { id: "INFILTRATION_003_2", text: "Fais croire à un joueur que tu as un jumeau ou une jumelle.", terrain: 2 },
    { id: "INFILTRATION_003_3", text: "Fais croire à un joueur que tu as un jumeau ou une jumelle.", terrain: 3 },

    { id: "INFILTRATION_004_1", text: "Fais croire à un joueur que c'est ton anniversaire aujourd'hui.", terrain: 1 },
    { id: "INFILTRATION_004_2", text: "Fais croire à un joueur que c'est ton anniversaire aujourd'hui.", terrain: 2 },
    { id: "INFILTRATION_004_3", text: "Fais croire à un joueur que c'est ton anniversaire aujourd'hui.", terrain: 3 },

    { id: "INFILTRATION_005_1", text: "Fais croire à un joueur que tu t'es fait tatouer récemment.", terrain: 1 },
    { id: "INFILTRATION_005_2", text: "Fais croire à un joueur que tu t'es fait tatouer récemment.", terrain: 2 },
    { id: "INFILTRATION_005_3", text: "Fais croire à un joueur que tu t'es fait tatouer récemment.", terrain: 3 },

    { id: "INFILTRATION_006_1", text: "Fais croire à un joueur que tu vas te raser la tête la semaine prochaine.", terrain: 1 },
    { id: "INFILTRATION_006_2", text: "Fais croire à un joueur que tu vas te raser la tête la semaine prochaine.", terrain: 2 },
    { id: "INFILTRATION_006_3", text: "Fais croire à un joueur que tu vas te raser la tête la semaine prochaine.", terrain: 3 },

    { id: "INFILTRATION_007_1", text: "Fais croire à au moins deux joueurs que tu as entendu un bruit étrange.", terrain: 1 },
    { id: "INFILTRATION_007_2", text: "Fais croire à au moins deux joueurs que tu as entendu un bruit étrange.", terrain: 2 },
    { id: "INFILTRATION_007_3", text: "Fais croire à au moins deux joueurs que tu as entendu un bruit étrange.", terrain: 3 },

    { id: "INFILTRATION_008_1", text: "Fais croire à un joueur que tu as perdu tes clés.", terrain: 1 },
    { id: "INFILTRATION_008_2", text: "Fais croire à un joueur que tu as perdu tes clés.", terrain: 2 },
    { id: "INFILTRATION_008_3", text: "Fais croire à un joueur que tu as perdu tes clés.", terrain: 3 },

    { id: "INFILTRATION_009_3", text: "Fais croire à un joueur que tu connais personnellement le serveur.", terrain: 3 },

    { id: "INFILTRATION_010_2", text: "Fais croire à un joueur que tu viens de voir passer une célébrité.", terrain: 2 },
    { id: "INFILTRATION_010_3", text: "Fais croire à un joueur que tu viens de voir passer une célébrité.", terrain: 3 }
];
