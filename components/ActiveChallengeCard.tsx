import React from 'react';
import { View, Pressable, ScrollView, Text, ImageBackground, Image } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOut } from 'react-native-reanimated';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { Agent } from '../context/SessionContext';
import { styles } from './ActiveChallengeCard.styles';
import { Theme } from '../constants/Theme';

interface ActiveChallengeCardProps {
  me?: Agent;
  timeLeft: number;
  isLowTime: boolean;
  formatTime: (ms: number) => string;
  animatedScanStyle: any;
  isRevealed: boolean;
  setIsRevealed: (revealed: boolean) => void;
  myChallenge?: { text: string } | null;
  status: string;
  now: number;
  isCompleted: boolean;
}

export function ActiveChallengeCard({
  me,
  timeLeft,
  isLowTime,
  formatTime,
  animatedScanStyle,
  isRevealed,
  setIsRevealed,
  myChallenge,
  status,
  now,
  isCompleted,
}: ActiveChallengeCardProps) {
  const { t } = useTranslation();

  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(800)}
      style={styles.container}
    >
      {/* Timer Section above the folder */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>
          TEMPS RESTANT
        </Text>
        <Text style={[styles.timerValue, isLowTime && styles.timerValueLow]}>
          {formatTime(timeLeft)}
        </Text>
        <View style={styles.timerDividerContainer}>
          <View style={styles.timerDividerLine} />
          <View style={styles.timerDividerDot} />
          <View style={styles.timerDividerLine} />
        </View>
      </View>

      {/* Folder Card */}
      <ImageBackground
        source={require('../assets/UI/folder_2.png')}
        style={styles.folderBackground}
        imageStyle={styles.folderImage}
      >
        <Pressable
          onPress={() => !isCompleted && setIsRevealed(!isRevealed)}
          style={({ pressed }) => [
            styles.pressableArea,
            pressed && !isCompleted && { opacity: 0.8 },
          ]}
        >
          {/* Top Secret Stamp */}
          <View style={styles.stampContainer}>
            <Text style={styles.stampText}>TOP SECRET</Text>
          </View>

          {/* Agency Logo Background */}
          <View style={styles.agencyLogoContainer} pointerEvents="none">
            <Image
              source={require('../assets/UI/logo_agency.png')}
              style={styles.agencyLogo}
              resizeMode="contain"
            />
          </View>

          {!isRevealed && !isCompleted ? (
            <Animated.View
              key="hidden"
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(400)}
              style={styles.contentCenter}
            >
              <MaterialCommunityIcons
                name="shield-lock"
                size={34}
                color="#222"
                style={styles.lockIcon}
              />
              <Text style={styles.revealTitle}>
                {t("mission.decryption_required")}
              </Text>
              <View style={styles.starRow}>
                <View style={styles.starLine} />
                <Text style={styles.smallStar}>★</Text>
                <View style={styles.starLine} />
              </View>
              <Text style={styles.revealSubtext}>
                {t("mission.tap_to_scan")}
              </Text>
              
            </Animated.View>
          ) : (
            <Animated.View
              key="revealed"
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(400)}
              style={styles.contentCenter}
            >
              <ScrollView
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={styles.revealedScroll}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={[
                    styles.challengeText,
                    isCompleted && styles.challengeTextCompleted,
                  ]}
                >
                  {myChallenge?.text ||
                    (me
                      ? t("mission.no_objective")
                      : t("mission.searching_profile"))}
                </Text>
                {isCompleted && (
                  <View style={[styles.stampContainer, styles.stampContainerCompleted]}>
                    <Text style={[styles.stampText, styles.stampTextCompleted]}>RÉSOLU</Text>
                  </View>
                )}
              </ScrollView>
              
              <View style={styles.hideHint}>
                <FontAwesome5
                  name="eye-slash"
                  size={12}
                  color="#222"
                />
                <Text style={styles.hideHintText}>
                  {t("mission.tap_to_secure")}
                </Text>
              </View>
            </Animated.View>
          )}
        </Pressable>
      </ImageBackground>
    </Animated.View>
  );
}
