import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Producto = (props) => {
  return (
    <View style={styles.tarjeta}>
      <View style={[styles.contenedorImagen, { backgroundColor: props.color }]}>
        <Image source={{ uri: props.imagen }} style={styles.imagen} />
      </View>
      <View style={styles.informacion}>
        <View style={styles.filaPrecio}>
          <Text style={styles.precio}>$ {props.precio}</Text>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={20} color="#BFC2D9" />
          </TouchableOpacity>
        </View>
        <Text style={styles.nombre} numberOfLines={1}>
          {props.nombre}
        </Text>
        <Text style={styles.tiempo}>{props.tiempo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tarjeta: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    elevation: 2,
  },
  contenedorImagen: {
    height: 185,
    justifyContent: "center",
    alignItems: "center",
  },
  imagen: {
    width: "85%",
    height: "90%",
    resizeMode: "contain",
  },
  informacion: {
    padding: 8,
  },
  filaPrecio: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  precio: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  nombre: {
    fontSize: 11,
    color: "#555",
    marginTop: 4,
  },
  tiempo: {
    fontSize: 9,
    color: "#AAAAAA",
    marginTop: 5,
  },
});
export default Producto;