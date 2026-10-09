import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Navegacion from "./Navegacion/Navegacion";

export default function App() {
  return (
    <View style={styles.container}>
      <Navegacion />
      <StatusBar style="dark" />
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
