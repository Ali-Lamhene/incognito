import { StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';

export const styles = StyleSheet.create({
  container: {
    // marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  timerLabel: {
    fontFamily: Theme.fonts.subtitle,
    fontSize: 6,
    color: Theme.colors.text.muted,
    marginBottom: 10,
  },
  timerValue: {
    fontFamily: Theme.fonts.title,
    fontSize: 48,
    color: Theme.colors.red,
    // letterSpacing removed for tighter layout
    // includeFontPadding: false,
    lineHeight: 38,
    letterSpacing: 2,
    fontWeight: 600
  },
  timerValueLow: {
    color: Theme.colors.red,
  },
  timerValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
  },
  timerGradient: {
    flex: 1,
    height: 1,
    marginHorizontal: 15,
  },
  timerDividerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    height: 20,
    marginTop: 6,
  },
  timerDividerLine: {
    position: 'absolute',
    width: '100%',
    height: 4,
  },
  timerDividerDot: {
    width: 2,
    height: 2,
    borderRadius: 3,

    // 1. Le cœur du point devient presque blanc/rose très clair pour l'effet "brûlant"
    backgroundColor: '#ffe6e6',

    // 2. Empilement des ombres pour un fondu parfait
    // - Une ombre très proche et intense (couleur vive)
    // - Une ombre moyenne
    // - Une ombre très large et douce (pour l'effet d'irradiation sur la ligne)
    boxShadow: `
      0 0 4px 2px rgba(255, 100, 100, 0.8),
      0 0 10px 5px rgba(255, 50, 50, 0.5),
      0 0 20px 8px rgba(255, 0, 0, 0.2)
    `,
  },
  folderBackground: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  folderImage: {
    resizeMode: 'stretch',
  },
  pressableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    padding: 30,
  },
  stampContainer: {
    position: 'absolute',
    top: 45,
    left: 35,
    borderWidth: 2,
    borderColor: Theme.colors.red,
    paddingHorizontal: 3,
    paddingVertical: 1,
    transform: [{ rotate: '-15deg' }],
    zIndex: 10,
    opacity: 0.85,
  },
  stampText: {
    fontFamily: Theme.fonts.title,
    fontSize: 10,
    color: Theme.colors.red,
    letterSpacing: 2,
  },
  stampContainerCompleted: {
    position: 'relative',
    top: 0,
    left: 0,
    marginTop: 20,
    borderColor: Theme.colors.status.online,
    alignSelf: 'center',
  },
  stampTextCompleted: {
    color: Theme.colors.status.online,
  },
  agencyLogoContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agencyLogo: {
    width: 300,
    height: 300,
    opacity: 0.15,
  },
  contentCenter: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    paddingBottom: 10,
  },
  lockIcon: {
    marginBottom: 6,
    opacity: 0.8,
  },
  revealTitle: {
    fontFamily: Theme.fonts.title,
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
    marginBottom: 4,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    marginBottom: 4,
    gap: 8,
  },
  starLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.red,
    opacity: 0.5,
  },
  smallStar: {
    fontSize: 8,
    color: Theme.colors.red,
  },
  revealSubtext: {
    fontFamily: Theme.fonts.subtitle,
    fontSize: 7,
    color: '#444',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 10,
  },
  revealedScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  challengeText: {
    fontFamily: Theme.fonts.subtitle,
    fontSize: 12,
    lineHeight: 18,
    color: '#222',
    textAlign: 'center',
  },
  challengeTextCompleted: {
    color: Theme.colors.status.online,
  },
  hideHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    opacity: 0.5,
  },
  hideHintText: {
    fontFamily: Theme.fonts.subtitle,
    fontSize: 6,
    color: '#222',
    letterSpacing: 2,
    marginLeft: 6,
  },
});
