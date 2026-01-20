export interface Challenge {
    id: string;
    text: string;
    category: 'SOCIAL' | 'ABSURD' | 'RISKY';
}

export const CHALLENGES: Challenge[] = [
    { id: '1', text: "Faire un compliment sur les chaussures de quelqu'un.", category: 'SOCIAL' },
    { id: '2', text: "Se toucher l'oreille gauche 3 fois en parlant.", category: 'SOCIAL' },
    { id: '3', text: "Dire le mot 'Anticonstitutionnellement' naturellement.", category: 'ABSURD' },
    { id: '4', text: "Bailler bruyamment pendant que quelqu'un parle.", category: 'SOCIAL' },
    { id: '5', text: "Demander l'heure alors que vous avez une montre ou votre téléphone en main.", category: 'ABSURD' },
    { id: '6', text: "Chuchoter à quelqu'un : 'Ils nous observent'.", category: 'RISKY' },
    { id: '7', text: "S'arrêter brusquement de marcher et regarder le ciel.", category: 'ABSURD' },
    { id: '8', text: "Répéter la dernière phrase de votre interlocuteur sous forme de question.", category: 'SOCIAL' },
    { id: '9', text: "Applaudir sans raison apparente après une phrase banale.", category: 'ABSURD' },
    { id: '10', text: "Dire : 'C'est exactement ce que dirait un agent double'.", category: 'RISKY' },
    { id: '11', text: "Vérifier sous votre table si rien n'est caché.", category: 'RISKY' },
    { id: '12', text: "Changer de place avec quelqu'un en plein milieu d'une conversation.", category: 'SOCIAL' },
    { id: '13', text: "Siffler l'hymne national ou une chanson très connue très bas.", category: 'SOCIAL' },
    { id: '14', text: "Demander à quelqu'un : 'Tu n'as pas entendu ce bruit ?'.", category: 'RISKY' },
    { id: '15', text: "Prendre une photo de groupe mais faire semblant de ne pas réussir à l'ouvrir.", category: 'SOCIAL' }
];
