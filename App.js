import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Catalogo from "./Screens/Catalogo";

export default function App() {
  return (
    <View style={styles.container}>
      <Catalogo />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
});
