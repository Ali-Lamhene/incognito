export const Theme = {
  colors: {
    background: '#0D0D0D',       // Fond principal noir
    totalBlack: '#000000',       // Noir total
    surface: '#121212',          // Fond de carte / panel sombre
    border: '#2A2A2A',           // Bordure grise fine
    
    red: '#8B1E1E',              // Rouge sombre (Bordeaux)
    
    paper: '#F2E8CF',            // Crème / Beige (Dossier tactique / Texte clair)
    accentGold: '#D4AF37',       // Or (Badges / Lauriers)
    
    text: {
      light: '#F2E8CF',          // Texte sur fond sombre (crème)
      dark: '#0D0D0D',           // Texte sur fond clair (dossier)
      muted: '#4A4A4A',          // Texte secondaire / désactivé
    },
    
    status: {
      online: '#2E7D32',         // Vert de connexion
      waiting: '#4A4A4A',        // Gris d'attente
      alert: '#D62828',          // Rouge alerte
    }
  },
  
  fonts: {
    title: 'BebasNeue-Bold',
    subtitle: 'Montserrat-SemiBold',
    button: 'Montserrat-SemiBold',
    body: 'Montserrat-Regular',
  }
};

export type AppTheme = typeof Theme;
