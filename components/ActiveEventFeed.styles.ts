import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  eventFeed: {
    position: "absolute",
    left: 20,
    width: "75%",
    gap: 8,
    zIndex: 100,
  },
  eventToast: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  eventToast_SUSPECT: {
    borderColor: "rgba(255, 217, 61, 0.3)",
  },
  eventToast_SUCCESS: {
    borderColor: "rgba(76, 175, 80, 0.3)",
  },
  eventToast_UNMASKED: {
    borderColor: "rgba(139, 30, 30, 0.3)",
  },
  eventToast_BLUFF_SUCCESS: {
    borderColor: "rgba(255, 217, 61, 0.3)",
  },
  eventToast_FAILED_UNMASK: {
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  eventIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  eventLabel: {
    fontSize: 8,
    fontWeight: "bold",
    letterSpacing: 1,
    color: "rgba(255,255,255,0.5)",
  },
  eventText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "500",
  },
});
