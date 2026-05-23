import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORE_KEY = '@chaos_quiz_high_score';
const GAMES_PLAYED_KEY = '@chaos_quiz_games_played';
const BEST_WRONG_KEY = '@chaos_quiz_best_wrong';

export const saveHighScore = async (score: number): Promise<void> => {
  try {
    const existing = await getHighScore();
    if (score > existing) {
      await AsyncStorage.setItem(HIGH_SCORE_KEY, score.toString());
    }
  } catch (e) {
    console.warn('Failed to save high score', e);
  }
};

export const getHighScore = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(HIGH_SCORE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch (e) {
    return 0;
  }
};

export const incrementGamesPlayed = async (): Promise<void> => {
  try {
    const games = await getGamesPlayed();
    await AsyncStorage.setItem(GAMES_PLAYED_KEY, (games + 1).toString());
  } catch (e) {
    console.warn('Failed to increment games played', e);
  }
};

export const getGamesPlayed = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(GAMES_PLAYED_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch (e) {
    return 0;
  }
};

export const saveMostWrongAnswers = async (wrong: number): Promise<void> => {
  try {
    const existing = await getMostWrongAnswers();
    if (wrong > existing) {
      await AsyncStorage.setItem(BEST_WRONG_KEY, wrong.toString());
    }
  } catch (e) {
    console.warn('Failed to save most wrong', e);
  }
};

export const getMostWrongAnswers = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(BEST_WRONG_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch (e) {
    return 0;
  }
};
