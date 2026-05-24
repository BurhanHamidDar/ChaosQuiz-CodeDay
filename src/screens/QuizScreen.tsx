import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import AnimatedBackground from '../components/AnimatedBackground';
import ProceduralCrackedGlass from '../components/ProceduralCrackedGlass';
import MomText from '../components/MomText';
import FragileRepairModal from '../components/FragileRepairModal';
import ApologyLetterModal from '../components/ApologyLetterModal';
import RealityMeter from '../components/RealityMeter';
import MockNotifications from '../components/MockNotifications';
import RunningCat from '../components/RunningCat';
import FakeErrorModal from '../components/FakeErrorModal';
import FakeFBICall from '../components/FakeFBICall';
import FBIScreenSmash from '../components/FBIScreenSmash';
import FakeBSOD from '../components/FakeBSOD';
import FakeUninstall from '../components/FakeUninstall';
import CountdownOverlay from '../components/CountdownOverlay';
import { COLORS } from '../constants/colors';
import { QUESTIONS } from '../data/questions';
import { triggerSuccessHaptic, triggerErrorHaptic, triggerChaosHaptic } from '../utils/haptics';

type RootStackParamList = {
  Welcome: undefined;
  Quiz: undefined;
  Results: { wrongAnswers: number; score: number };
};

type QuizScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Quiz'>;
};

const { width, height } = Dimensions.get('window');

const AnswerButton: React.FC<{
  text: string;
  index: number;
  onPress: (i: number) => void;
  selected: number | null;
  correctIndex: number;
  disabled: boolean;
  globalCollapse: boolean;
}> = ({ text, index, onPress, selected, correctIndex, disabled, globalCollapse }) => {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const isCorrect = selected !== null && index === correctIndex;
  const isWrong = selected === index && index !== correctIndex;

  useEffect(() => {
    if (globalCollapse) {
      // Entire UI falls down
      translateY.value = withTiming(height / 2, { duration: 1500, easing: Easing.bounce });
      rotation.value = withTiming(Math.random() * 40 - 20, { duration: 1000 });
    } else if (isWrong) {
      // Snap in half and fall off screen (gravity)
      translateY.value = withTiming(height + 200, { duration: 1000, easing: Easing.in(Easing.quad) });
      rotation.value = withTiming(45, { duration: 1000 });
    }
  }, [isWrong, globalCollapse]);

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.94, { duration: 80 }),
      withTiming(1, { duration: 80 }),
    );
    onPress(index);
  };

  const getBorderColor = () => {
    if (isCorrect) return COLORS.CORRECT;
    if (isWrong) return COLORS.WRONG;
    if (selected !== null) return COLORS.BG_CARD_BORDER;
    return '#2a2a4a';
  };

  const getTextColor = () => {
    if (isCorrect) return COLORS.CORRECT;
    if (isWrong) return COLORS.WRONG;
    if (selected !== null) return COLORS.TEXT_MUTED;
    return COLORS.TEXT_PRIMARY;
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    zIndex: isWrong ? 99 : 1, // falling button goes over other stuff
  }));

  const LABELS = ['A', 'B', 'C', 'D'];

  return (
    <Animated.View style={[styles.answerWrapper, animStyle]}>
      <Pressable
        style={[
          styles.answerButton,
          {
            borderColor: getBorderColor(),
            backgroundColor: isCorrect
              ? 'rgba(0,255,136,0.1)'
              : isWrong
              ? 'rgba(255,0,51,0.12)'
              : 'rgba(255,255,255,0.04)',
          },
        ]}
        onPress={handlePress}
        disabled={disabled || globalCollapse}
      >
        <View style={[styles.labelBadge, { borderColor: getBorderColor() }]}>
          <Text style={[styles.labelText, { color: getBorderColor() }]}>{LABELS[index]}</Text>
        </View>
        <Text style={[styles.answerText, { color: getTextColor() }]}>{text}</Text>
        {isCorrect && <Text style={styles.feedbackIcon}>✅</Text>}
        {isWrong && <Text style={styles.feedbackIcon}>❌</Text>}
      </Pressable>
    </Animated.View>
  );
};

const QuizScreen: React.FC<QuizScreenProps> = ({ navigation }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [crackSeverity, setCrackSeverity] = useState(0);
  const [showApologyModal, setShowApologyModal] = useState(false);
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [randomizedQuestions, setRandomizedQuestions] = useState<typeof QUESTIONS>([]);

  // Chain Reaction States
  const [stability, setStability] = useState(100);
  const [notificationsTrigger, setNotificationsTrigger] = useState(0);
  const [runningCatVisible, setRunningCatVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorModalIndex, setErrorModalIndex] = useState(0);
  const [countdownVisible, setCountdownVisible] = useState(false);
  const [fbiCallVisible, setFbiCallVisible] = useState(false);
  const [screenSmashVisible, setScreenSmashVisible] = useState(false);
  const [bsodVisible, setBsodVisible] = useState(false);
  const [uninstallVisible, setUninstallVisible] = useState(false);

  useEffect(() => {
    // Shuffle questions and pick exactly 5
    const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
    setRandomizedQuestions(shuffled.slice(0, 5));
  }, []);
  
  const question = randomizedQuestions[currentQ] || QUESTIONS[0];

  const cardOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const questionRotation = useSharedValue(0);
  const questionTranslateY = useSharedValue(0);
  const mainContainerY = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const shakeY = useSharedValue(0);

  const wrongCountRef = useRef(0);

  // Helper to play sound
  const playSound = async (soundFile: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if ('didJustFinish' in status && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {
      console.log('Error playing sound', e);
    }
  };

  useEffect(() => {
    if (randomizedQuestions.length === 0) return;
    // Entrance animation
    cardOpacity.value = withTiming(1, { duration: 400 });
    progressWidth.value = withTiming(
      ((currentQ + 1) / randomizedQuestions.length) * 100,
      { duration: 600 },
    );
  }, [currentQ, randomizedQuestions]);

  const triggerCameraShake = () => {
    shakeX.value = withSequence(
      withTiming(-12, { duration: 40 }),
      withTiming(12, { duration: 40 }),
      withTiming(-10, { duration: 40 }),
      withTiming(10, { duration: 40 }),
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(-3, { duration: 40 }),
      withTiming(3, { duration: 40 }),
      withTiming(0, { duration: 40 })
    );
    shakeY.value = withSequence(
      withTiming(10, { duration: 40 }),
      withTiming(-10, { duration: 40 }),
      withTiming(8, { duration: 40 }),
      withTiming(-8, { duration: 40 }),
      withTiming(5, { duration: 40 }),
      withTiming(-5, { duration: 40 }),
      withTiming(2, { duration: 40 }),
      withTiming(-2, { duration: 40 }),
      withTiming(0, { duration: 40 })
    );
  };

  const triggerChainReaction = (newWrongCount: number) => {
    triggerChaosHaptic();

    if (newWrongCount === 1) {
      // --- STRIKE 1 CHAIN REACTION ---
      // 1. Button falls off the screen (takes 1000ms).
      // 2. At 1000ms: Button hits bottom -> shake, sounds, cracks, stability drops
      setTimeout(() => {
        triggerCameraShake();
        setStability(70);
        setCrackSeverity(1);
        playSound(require('../../assets/sounds/shatter.mp3'));
        playSound(require('../../assets/sounds/error.mp3'));
        setTimeout(() => playSound(require('../../assets/sounds/bruh.mp3')), 200);

        // 3. Shockwave: Running cat dashes (at 1500ms)
        setTimeout(() => {
          setRunningCatVisible(true);
        }, 500);
      }, 1000);
    } 
    else if (newWrongCount === 2) {
      // --- STRIKE 2 CHAIN REACTION ---
      // 1. Button falls off (takes 1000ms).
      // 2. At 1000ms: Button hits bottom -> shake, sounds, cracks, stability drops
      setTimeout(() => {
        triggerCameraShake();
        setStability(40);
        setCrackSeverity(2);
        playSound(require('../../assets/sounds/shatter.mp3'));
        playSound(require('../../assets/sounds/boom.mp3'));
        setTimeout(() => playSound(require('../../assets/sounds/emotional-damage.mp3')), 600);

        // 3. Question card tilts and sways
        setTimeout(() => {
          questionRotation.value = withSpring(15, { damping: 5 });
          questionTranslateY.value = withSpring(40, { damping: 5 });

          // 4. Glitch error modal pops up
          setTimeout(() => {
            setErrorModalIndex(Math.floor(Math.random() * 8));
            setErrorModalVisible(true);
          }, 800);
        }, 300);
      }, 1000);
    } 
    else if (newWrongCount >= 3) {
      // --- STRIKE 3 CATASTROPHIC CHAIN REACTION ---
      // 1. Button falls off (takes 1000ms).
      // 2. At 1000ms: Massive impact -> shake, sag screen, sounds, stability to 0
      setTimeout(() => {
        triggerCameraShake();
        setStability(0);
        setCrackSeverity(3);
        playSound(require('../../assets/sounds/shatter.mp3'));
        playSound(require('../../assets/sounds/error.mp3'));
        playSound(require('../../assets/sounds/fart.mp3'));
        setTimeout(() => playSound(require('../../assets/sounds/sad-violin.mp3')), 500);

        // 3. Screen sags down
        mainContainerY.value = withTiming(height * 0.28, { duration: 1500, easing: Easing.bounce });

        // 4. Once sagging finishes, overlay countdown
        setTimeout(() => {
          setCountdownVisible(true);
        }, 1600);
      }, 1000);
    }
  };

  // --- CHAIN REACTION STEP CALLBACKS ---
  const handleCatComplete = () => {
    setRunningCatVisible(false);
    // Trigger mock notification
    setNotificationsTrigger(n => n + 1);

    // Go to next question after notification finishes
    setTimeout(() => {
      nextQuestion();
    }, 3800);
  };

  const handleErrorModalDismiss = () => {
    setErrorModalVisible(false);

    // Staggered notifications
    setTimeout(() => setNotificationsTrigger(n => n + 1), 100);
    setTimeout(() => setNotificationsTrigger(n => n + 1), 1200);
    setTimeout(() => setNotificationsTrigger(n => n + 1), 2400);

    // Go to next question
    setTimeout(() => {
      nextQuestion();
    }, 4500);
  };

  const handleCountdownComplete = () => {
    setCountdownVisible(false);
    setFbiCallVisible(true);
  };

  const handleFbiCallDismiss = () => {
    setFbiCallVisible(false);
    setScreenSmashVisible(true);
  };

  const handleScreenSmashComplete = () => {
    setScreenSmashVisible(false);
    setBsodVisible(true);
  };

  const handleBsodPress = () => {
    setBsodVisible(false);
    setUninstallVisible(true);
  };

  const handleUninstallComplete = () => {
    setUninstallVisible(false);
    setShowApologyModal(true);
  };

  const nextQuestion = () => {
    if (wrongCountRef.current >= 3) return; // Completely broken, cannot advance

    cardOpacity.value = withSequence(
      withTiming(0, { duration: 200 }),
      withTiming(1, { duration: 400 }),
    );
    setTimeout(() => {
      setSelected(null);
      if (currentQ + 1 >= randomizedQuestions.length) {
        navigation.navigate('Results', { wrongAnswers: wrongCountRef.current, score });
      } else {
        setCurrentQ(c => c + 1);
      }
    }, 200);
  };

  const handleAnswer = (index: number) => {
    if (selected !== null || crackSeverity >= 3) return;
    setSelected(index);

    if (index === question.correctIndex) {
      // Correct!
      triggerSuccessHaptic();
      const happySounds = [
        require('../../assets/sounds/yippee.mp3'),
        require('../../assets/sounds/airhorn.mp3'),
        require('../../assets/sounds/wow.mp3')
      ];
      playSound(happySounds[Math.floor(Math.random() * happySounds.length)]);
      
      setScore(s => s + 10);
      setTimeout(nextQuestion, 1500);
    } else {
      // WRONG - break the app!
      triggerErrorHaptic();
      setScore(s => s - 15); // Punish them with negative points!
      
      const newWrong = wrongCountRef.current + 1;
      wrongCountRef.current = newWrong;
      setWrongAnswers(newWrong);
      
      triggerChainReaction(newWrong);
    }
  };

  const handleLifelineSuccess = () => {
    setShowApologyModal(false);
    
    // Magic repair!
    setStability(100);
    setCrackSeverity(0);
    wrongCountRef.current = 0;
    setWrongAnswers(0);
    setSelected(null); // allow them to guess again
    setLifelineUsed(true); // Can only use it once

    // Reset UI positions
    mainContainerY.value = withTiming(0, { duration: 1000 });
    questionRotation.value = withTiming(0, { duration: 1000 });
    questionTranslateY.value = withTiming(0, { duration: 1000 });
  };

  const handleLifelineFail = () => {
    setShowApologyModal(false);
    // They stay broken!
  };

  const mainContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: mainContainerY.value + shakeY.value },
      { translateX: shakeX.value }
    ],
  }));

  const questionStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { rotate: `${questionRotation.value}deg` },
      { translateY: questionTranslateY.value }
    ],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%` as any,
  }));

  if (randomizedQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#06060f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06060f" />
      <AnimatedBackground variant={crackSeverity >= 3 ? 'chaos' : 'default'} />
      
      <ProceduralCrackedGlass severity={crackSeverity} />

      <Animated.View style={[styles.mainContent, mainContainerStyle]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.questionCounter}>
            <Text style={styles.questionCountText}>Question {currentQ + 1} of {randomizedQuestions.length}</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progressBarStyle]} />
          </View>
        </View>

        {/* Reality stability meter */}
        <RealityMeter stability={stability} chaosLevel={crackSeverity} />

        {/* Warning Badge */}
        {crackSeverity > 0 && crackSeverity < 3 && (
          <View style={styles.warningBadge}>
            <Text style={styles.warningText}>⚠️ CAUTION: APP COMPROMISED ⚠️</Text>
          </View>
        )}

        {/* Question card (can tilt) */}
        <Animated.View style={[styles.questionCard, questionStyle]}>
          <View style={styles.questionCardInner}>
            <Text style={styles.questionText}>{question.question}</Text>
            {selected !== null && selected !== question.correctIndex && (
              <Text style={styles.wrongFeedback}>
                😂 {question.funnyWrongFeedback}
              </Text>
            )}
          </View>
        </Animated.View>

        {/* Answer buttons */}
        <View style={styles.answersContainer}>
          {question.answers.map((answer, i) => (
            <AnswerButton
              key={i}
              text={answer}
              index={i}
              onPress={handleAnswer}
              selected={selected}
              correctIndex={question.correctIndex}
              disabled={selected !== null}
              globalCollapse={crackSeverity >= 3}
            />
          ))}
        </View>
      </Animated.View>

      {/* Climax UI */}
      <MomText visible={crackSeverity >= 3 && !showApologyModal} />
      <FragileRepairModal 
        visible={crackSeverity >= 3 && !showApologyModal} 
        onLifeline={() => setShowApologyModal(true)} 
        hasLifeline={!lifelineUsed}
      />

      <ApologyLetterModal
        visible={showApologyModal}
        onSuccess={handleLifelineSuccess}
        onFail={handleLifelineFail}
      />

      {/* Mock Notifications Dropdown */}
      <MockNotifications chaosLevel={crackSeverity} triggerCount={notificationsTrigger} />

      {/* Running Cat wrong answer effect */}
      <RunningCat visible={runningCatVisible} onComplete={handleCatComplete} />

      {/* Glitched system error dialog */}
      <FakeErrorModal
        visible={errorModalVisible}
        onDismiss={handleErrorModalDismiss}
        messageIndex={errorModalIndex}
      />

      {/* Catastrophic countdown */}
      <CountdownOverlay visible={countdownVisible} onComplete={handleCountdownComplete} />

      {/* FBI Incoming call */}
      <FakeFBICall visible={fbiCallVisible} onDismiss={handleFbiCallDismiss} />

      {/* FBI screen hammer smash */}
      <FBIScreenSmash visible={screenSmashVisible} onComplete={handleScreenSmashComplete} />

      {/* Blue Screen of Death */}
      <FakeBSOD visible={bsodVisible} onPress={handleBsodPress} />

      {/* App self-deletion progress bar */}
      <FakeUninstall visible={uninstallVisible} onComplete={handleUninstallComplete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
  mainContent: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  questionCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  questionCountText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    fontWeight: 'bold',
  },
  scoreText: {
    color: '#00e5ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#1a1a2e',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.NEON_PURPLE,
    borderRadius: 2,
  },
  warningBadge: {
    backgroundColor: 'rgba(255,0,51,0.2)',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff0033',
  },
  warningText: {
    color: '#ff0033',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  questionCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    backgroundColor: COLORS.BG_CARD,
    elevation: 8,
    overflow: 'hidden',
  },
  questionCardInner: {
    padding: 20,
  },
  questionText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  wrongFeedback: {
    color: COLORS.NEON_PINK,
    fontFamily: 'monospace',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '700',
    lineHeight: 16,
  },
  answersContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  answerWrapper: {
    borderRadius: 12,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  labelBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '900',
  },
  answerText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    lineHeight: 22,
  },
  feedbackIcon: {
    fontSize: 18,
  },
});

export default QuizScreen;
