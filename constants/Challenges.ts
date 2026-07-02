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

    { id: "MANIPULATION_002_1", text: "Fais changer de place un joueur.", terrain: 1 },
    { id: "MANIPULATION_002_2", text: "Fais changer de place un joueur.", terrain: 2 },
    { id: "MANIPULATION_002_3", text: "Fais changer de place un joueur.", terrain: 3 },

    { id: "MANIPULATION_003_1", text: "Fais changer de place deux joueurs.", terrain: 1 },
    { id: "MANIPULATION_003_2", text: "Fais changer de place deux joueurs.", terrain: 2 },
    { id: "MANIPULATION_003_3", text: "Fais changer de place deux joueurs.", terrain: 3 },

    { id: "MANIPULATION_004_1", text: "Fais chanter au moins un joueur.", terrain: 1 },
    { id: "MANIPULATION_004_2", text: "Fais chanter au moins un joueur.", terrain: 2 },
    { id: "MANIPULATION_004_3", text: "Fais chanter au moins un joueur.", terrain: 3 },

    { id: "MANIPULATION_005_1", text: "Fais applaudir au moins deux joueurs.", terrain: 1 },
    { id: "MANIPULATION_005_2", text: "Fais applaudir au moins deux joueurs.", terrain: 2 },
    { id: "MANIPULATION_005_3", text: "Fais applaudir au moins deux joueurs.", terrain: 3 },

    { id: "MANIPULATION_006_1", text: "Fais que deux joueurs prennent une photo ensemble.", terrain: 1 },
    { id: "MANIPULATION_006_2", text: "Fais que deux joueurs prennent une photo ensemble.", terrain: 2 },
    { id: "MANIPULATION_006_3", text: "Fais que deux joueurs prennent une photo ensemble.", terrain: 3 },

    { id: "MANIPULATION_007_1", text: "Fais lever leur verre à au moins deux joueurs.", terrain: 1 },
    { id: "MANIPULATION_007_3", text: "Fais lever leur verre à au moins deux joueurs.", terrain: 3 },

    { id: "MANIPULATION_008_1", text: "Fais éclater de rire un joueur.", terrain: 1 },
    { id: "MANIPULATION_008_2", text: "Fais éclater de rire un joueur.", terrain: 2 },
    { id: "MANIPULATION_008_3", text: "Fais éclater de rire un joueur.", terrain: 3 },

    { id: "MANIPULATION_009_1", text: "Fais en sorte que deux joueurs se serrent la main.", terrain: 1 },
    { id: "MANIPULATION_009_2", text: "Fais en sorte que deux joueurs se serrent la main.", terrain: 2 },
    { id: "MANIPULATION_009_3", text: "Fais en sorte que deux joueurs se serrent la main.", terrain: 3 },

    { id: "MANIPULATION_010_1", text: "Fais que trois joueurs se retrouvent debout en même temps.", terrain: 1 },
    { id: "MANIPULATION_010_2", text: "Fais que trois joueurs se retrouvent debout en même temps.", terrain: 2 },
    { id: "MANIPULATION_010_3", text: "Fais que trois joueurs se retrouvent debout en même temps.", terrain: 3 },

    // --- COUVERTURE ---
    { id: "COUVERTURE_001_1", text: "À chaque fois qu'un joueur te pose une question, lève le pouce avant de répondre.", terrain: 1 },
    { id: "COUVERTURE_001_2", text: "À chaque fois qu'un joueur te pose une question, lève le pouce avant de répondre.", terrain: 2 },
    { id: "COUVERTURE_001_3", text: "À chaque fois qu'un joueur te pose une question, lève le pouce avant de répondre.", terrain: 3 },

    { id: "COUVERTURE_002_1", text: "À chaque fois que quelqu'un rit, prends ton verre en main.", terrain: 1 },
    { id: "COUVERTURE_002_3", text: "À chaque fois que quelqu'un rit, prends ton verre en main.", terrain: 3 },

    { id: "COUVERTURE_003_1", text: "À chaque fois qu'un joueur boit, bois une gorgée à ton tour.", terrain: 1 },
    { id: "COUVERTURE_003_3", text: "À chaque fois qu'un joueur boit, bois une gorgée à ton tour.", terrain: 3 },

    { id: "COUVERTURE_007_1", text: "À chaque fois qu'un joueur te pose une question, pose une main sur ton menton avant de répondre.", terrain: 1 },
    { id: "COUVERTURE_007_2", text: "À chaque fois qu'un joueur te pose une question, pose une main sur ton menton avant de répondre.", terrain: 2 },
    { id: "COUVERTURE_007_3", text: "À chaque fois qu'un joueur te pose une question, pose une main sur ton menton avant de répondre.", terrain: 3 },

    { id: "COUVERTURE_010_1", text: "À chaque fois qu'un joueur boit, lève ton verre.", terrain: 1 },
    { id: "COUVERTURE_010_3", text: "À chaque fois qu'un joueur boit, lève ton verre.", terrain: 3 },

    // --- MAISON ---
    { id: "MAISON_001_1", text: "Fais prendre une photo de groupe.", terrain: 1 },
    { id: "MAISON_001_2", text: "Fais prendre une photo de groupe.", terrain: 2 },
    { id: "MAISON_001_3", text: "Fais prendre une photo de groupe.", terrain: 3 },

    { id: "MAISON_002_1", text: "Fais ouvrir le réfrigérateur à un joueur.", terrain: 1 },

    { id: "MAISON_003_1", text: "Fais allumer ou éteindre une lumière.", terrain: 1 },

    { id: "MAISON_005_1", text: "Fais fermer/ouvrir une fenêtre.", terrain: 1 },

    { id: "MAISON_008_1", text: "Fais aller un joueur dans une autre pièce.", terrain: 1 },
    { id: "MAISON_008_3", text: "Fais aller un joueur dans une autre pièce.", terrain: 3 },

    { id: "MAISON_009_1", text: "Fais déplacer un objet de décoration.", terrain: 1 },
    { id: "MAISON_009_3", text: "Fais déplacer un objet de décoration.", terrain: 3 },

    // --- BAR ---
    { id: "BAR_003_1", text: "Fais prendre une photo de la table.", terrain: 1 },
    { id: "BAR_003_3", text: "Fais prendre une photo de la table.", terrain: 3 },

    { id: "BAR_004_1", text: "Fais goûter la boisson d'un joueur à un autre.", terrain: 1 },
    { id: "BAR_004_3", text: "Fais goûter la boisson d'un joueur à un autre.", terrain: 3 }
];