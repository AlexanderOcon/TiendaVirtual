import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Categoria = (props) => {
  return (
    <TouchableOpacity style={styles.contenedor}>
      <Ionicons name={props.icono} size={28} color="#7C7CFF" />
      <Text style={styles.nombre}>{props.nombre}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  nombre: {
    fontSize: 10,
    color: "#7C7CFF",
    marginTop: 6,
  },
});
export default Categoria;