import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "logged_user";

export const saveUser = async (user: any) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async () => {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
};

export const logout = async () => {
    await AsyncStorage.removeItem(USER_KEY);
};
