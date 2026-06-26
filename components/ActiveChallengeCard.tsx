import React from 'react';
import { View, Pressable, ScrollView, Text, ImageBackground, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOut } from 'react-native-reanimated';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTranslation } from '../hooks/useTranslation';
import { Agent } from '../context/SessionContext';
import { styles } from './ActiveChallengeCard.styles';
import { Theme } from '../constants/Theme';
import SoundService from '../services/SoundService';

interface ActiveChallengeCardProps {
  me?: Agent;
  timeLeft: number;
  isLowTime: boolean;
  formatTime: (ms: number) => string;
  animatedScanStyle: any; // Kept for backward-compatibility of prop type signature
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
  isRevealed,
  setIsRevealed,
  myChallenge,
  status,
  now,
  isCompleted,
}: ActiveChallengeCardProps) {
  const { t } = useTranslation();

  const [isScanning, setIsScanning] = React.useState(false);
  const [scanPercent, setScanPercent] = React.useState(0);
  const [isSecuring, setIsSecuring] = React.useState(false);
  const [cardWidth, setCardWidth] = React.useState(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const intervalRef = React.useRef<any>(null);

  const myChallenges = me?.challenges || (myChallenge ? [myChallenge] : []);

  const handleLayout = (e: any) => {
    const { width } = e.nativeEvent.layout;
    setCardWidth(width);
  };

  const handlePressIn = () => {
    if (isCompleted) return;

    const isLocking = isRevealed;
    if (isLocking) {
      setIsSecuring(true);
    } else {
      setIsScanning(true);
    }

    SoundService.triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);

    const startTime = Date.now();
    let lastHapticTime = startTime;
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const pct = Math.min(100, Math.floor((elapsed / 1500) * 100));
      setScanPercent(pct);

      if (pct >= 100) {
        if (isLocking) {
          handleSecured();
        } else {
          handleDecrypted();
        }
        return;
      }

      if (currentTime - lastHapticTime >= 300) {
        SoundService.triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
        lastHapticTime = currentTime;
      }
    }, 30);
  };

  const handlePressOut = () => {
    if (isCompleted) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      if (isScanning || isSecuring) {
        SoundService.triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
      }
    }

    setIsScanning(false);
    setIsSecuring(false);
    setScanPercent(0);
  };

  const handleDecrypted = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsScanning(false);
    setScanPercent(0);
    setIsRevealed(true);

    SoundService.triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleSecured = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSecuring(false);
    setIsRevealed(false);
    setActiveIndex(0);
    setScanPercent(0);

    SoundService.triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleHide = () => {
    if (isRevealed && !isCompleted) {
      handleSecured();
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const contentWidth = cardWidth ? cardWidth - 60 : 250;
    const index = Math.round(contentOffsetX / contentWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const contentWidth = cardWidth ? cardWidth - 60 : 250;

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
        <View style={styles.timerValueRow}>
          <LinearGradient
            colors={['transparent', Theme.colors.red]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.timerGradient}
          />
          <Text style={[styles.timerValue, isLowTime && styles.timerValueLow]}>
            {formatTime(timeLeft)}
          </Text>
          <LinearGradient
            colors={[Theme.colors.red, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.timerGradient}
          />
        </View>
        <View style={styles.timerDividerContainer}>
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.4)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.timerDividerLine}
          />
          <View style={styles.timerDividerDot} />
        </View>
      </View>

      {/* Folder Card */}
      <ImageBackground
        source={require('../assets/UI/folder_2.png')}
        style={styles.folderBackground}
        imageStyle={styles.folderImage}
        onLayout={handleLayout}
      >
        {!isRevealed && !isCompleted ? (
          <View style={styles.pressableArea}>
            {/* Top Secret Stamp */}
            <View style={styles.stampContainer} pointerEvents="none">
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

            <Animated.View
              key="hidden"
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(400)}
              style={[styles.contentCenter, { justifyContent: 'center', paddingTop: 20 }]}
            >
              <Text style={styles.revealTitle}>
                {t("mission.decryption_required")}
              </Text>
              <View style={styles.starRow}>
                <View style={styles.starLine} />
                <Text style={styles.smallStar}>★</Text>
                <View style={styles.starLine} />
              </View>

              {/* Large fingerprint button in the center */}
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[
                  styles.fingerprintButtonLarge,
                  isScanning && styles.fingerprintButtonLargeActive
                ]}
              >
                <MaterialCommunityIcons
                  name="fingerprint"
                  size={40}
                  color={Theme.colors.red}
                />
              </Pressable>

              <Text style={[styles.instructionText, isScanning && styles.instructionTextActive]}>
                {isScanning 
                  ? `${t("mission.verification_in_progress").split(":")[0].trim()}... ${scanPercent}%`
                  : "MAINTENIR L'EMPREINTE POUR DÉCRYPTER"}
              </Text>
            </Animated.View>
          </View>
        ) : (
          <View style={styles.pressableArea}>
            {/* Top Secret Stamp */}
            <View style={styles.stampContainer} pointerEvents="none">
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

            <Animated.View
              key="revealed"
              entering={FadeIn.duration(400)}
              exiting={FadeOut.duration(400)}
              style={[styles.contentCenter, { justifyContent: 'space-between', paddingVertical: 5 }]}
              pointerEvents="box-none"
            >
              {/* Challenges Carousel container */}
              <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 15 }} pointerEvents="box-none">
                {!isSecuring && (
                  <>
                    {/* Horizontal Challenges Carousel */}
                    <ScrollView
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      onScroll={handleScroll}
                      scrollEventThrottle={16}
                      style={{ flex: 1, width: '100%' }}
                      contentContainerStyle={{ alignItems: 'center' }}
                    >
                      {myChallenges.map((challenge: any, idx: number) => (
                        <View
                          key={challenge.id || idx}
                          style={{
                            width: contentWidth,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                          }}
                        >
                          <Text
                            style={[
                              styles.challengeText,
                              (isCompleted || challenge.completed) && styles.challengeTextCompleted,
                            ]}
                          >
                            {challenge.text ||
                              (me
                                ? t("mission.no_objective")
                                : t("mission.searching_profile"))}
                          </Text>
                          {(isCompleted || challenge.completed) && (
                            <View style={[styles.stampContainer, styles.stampContainerCompleted]}>
                              <Text style={[styles.stampText, styles.stampTextCompleted]}>RÉSOLU</Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </ScrollView>

                    {/* Carousel Pagination Dots */}
                    {myChallenges.length > 1 && (
                      <View style={styles.paginationContainer} pointerEvents="none">
                        {myChallenges.map((_: any, index: number) => (
                          <View
                            key={index}
                            style={[
                              styles.paginationDot,
                              index === activeIndex && styles.paginationDotActive
                            ]}
                          />
                        ))}
                      </View>
                    )}
                  </>
                )}

                {/* Securing overlay looking exactly like the decryption screen */}
                {isSecuring && (
                  <Animated.View
                    entering={FadeIn.duration(150)}
                    exiting={FadeOut.duration(150)}
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 20,
                      borderRadius: 12,
                      padding: 20,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="fingerprint"
                      size={34}
                      color={Theme.colors.red}
                      style={styles.lockIcon}
                    />
                    <Text style={styles.revealTitle}>
                      SÉCURISATION EN COURS...
                    </Text>
                    <View style={styles.starRow}>
                      <View style={styles.starLine} />
                      <Text style={styles.smallStar}>★</Text>
                      <View style={styles.starLine} />
                    </View>
                  </Animated.View>
                )}
              </View>

              {/* Fingerprint lock button at the bottom (ALWAYS MOUNTED to prevent touch unmounting bugs) */}
              <View style={{ alignItems: 'center', width: '100%', marginTop: 5 }}>
                <Pressable
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  style={[
                    styles.fingerprintButtonSmall,
                    isSecuring && styles.fingerprintButtonSmallActive
                  ]}
                >
                  <MaterialCommunityIcons
                    name="fingerprint"
                    size={24}
                    color={Theme.colors.red}
                  />
                </Pressable>

                <Text style={[styles.instructionText, isSecuring && styles.instructionTextActive]}>
                  {isSecuring 
                    ? `SÉCURISATION... ${scanPercent}%`
                    : "MAINTENIR POUR SÉCURISER"}
                </Text>
              </View>
            </Animated.View>
          </View>
        )}
      </ImageBackground>
    </Animated.View>
  );
}
