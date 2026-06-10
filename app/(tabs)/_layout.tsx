import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '../../store/appState';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      tabBar={({ state, descriptors, navigation }) => {
        return (
          <View style={[styles.navbar, { height: 100 + insets.bottom, paddingBottom: insets.bottom }]}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = state.index === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (isFocused && route.name === 'index') {
                  useAppState.getState().setShowProfileModal(true);
                } else if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };

              let iconName: keyof typeof Ionicons.glyphMap = 'finger-print-outline';
              const displayName = typeof label === 'string' ? label : route.name;
              
              if (route.name === 'index') {
                iconName = 'finger-print-outline';
              } else if (route.name === 'rules') {
                iconName = 'document-text-outline';
              } else if (route.name === 'settings') {
                iconName = 'settings-outline';
              }

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={styles.navItem}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={iconName}
                    size={28}
                    color={isFocused ? '#F2E8CF' : 'rgba(242, 232, 207, 0.4)'}
                    style={styles.navIcon}
                  />
                  <Text style={[
                    styles.navText,
                    {
                      color: isFocused ? '#F2E8CF' : 'rgba(242, 232, 207, 0.4)',
                    }
                  ]}>
                    {displayName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil' }} />
      <Tabs.Screen name="rules" options={{ title: 'Règles' }} />
      <Tabs.Screen name="settings" options={{ title: 'Paramètres' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#070707',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(242, 232, 207, 0.12)',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    marginBottom: 6,
  },
  navText: {
    fontFamily: 'BebasNeue-Bold',
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
