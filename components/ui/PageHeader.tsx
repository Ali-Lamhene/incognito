import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Theme } from '../../constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
  showSeparator?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  onBack,
  showBack = true,
  rightComponent,
  showSeparator = false,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        {showBack ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={26} color={Theme.colors.text.light} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
          {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
        </View>

        {rightComponent ? (
          <View style={styles.rightContainer}>{rightComponent}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {showSeparator && (
        <View style={styles.separatorContainer}>
          <LinearGradient
            colors={['transparent', 'rgba(242, 232, 207, 0.25)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.separatorLine}
          />
          <FontAwesome5
            name="user-secret"
            size={18}
            color="rgba(242, 232, 207, 0.45)"
            style={styles.separatorIcon}
          />
          <LinearGradient
            colors={['rgba(242, 232, 207, 0.25)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.separatorLine}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  headerContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    width: '100%',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'BebasNeue-Bold',
    fontSize: 24,
    color: Theme.colors.red,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: 'BebasNeue-Bold',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    textAlign: 'center',
  },
  rightContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    marginBottom: 8,
    paddingHorizontal: 70,
    width: '100%',
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorIcon: {
    marginHorizontal: 5,
  },
});
