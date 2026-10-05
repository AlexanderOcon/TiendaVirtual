import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import Catalogo from "./Screens/Catalogo";
import Cuenta from "./Screens/Cuenta";
import { auth } from "./firebase/config";

export default function App() {
  const [seccion, setSeccion] = useState("tienda");
  const [usuario, setUsuario] = useState(null);
  const [verificandoSesion, setVerificandoSesion] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, (usuarioActual) => {
        setUsuario(usuarioActual);
        setVerificandoSesion(false);
      }),
    []
  );

  return (
    <View style={styles.container}>
      {verificandoSesion ? (
        <View style={styles.cargando}>
          <ActivityIndicator size="large" color="#6857D9" />
        </View>
      ) : !usuario ? (
        <Cuenta usuario={null} />
      ) : (
        <>
          <View style={styles.contenido}>
            {seccion === "tienda" ? <Catalogo /> : <Cuenta usuario={usuario} />}
          </View>
          <View style={styles.navegacion}>
            <BotonNavegacion
              etiqueta="Tienda"
              icono="storefront-outline"
              activo={seccion === "tienda"}
              onPress={() => setSeccion("tienda")}
            />
            <BotonNavegacion
              etiqueta="Mi cuenta"
              icono="person-circle-outline"
              activo={seccion === "cuenta"}
              onPress={() => setSeccion("cuenta")}
            />
          </View>
        </>
      )}
      <StatusBar style="dark" />
    </View>
  );
}

function BotonNavegacion({ etiqueta, icono, activo, onPress }) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: activo }}
      onPress={onPress}
      style={styles.botonNavegacion}
    >
      <Ionicons name={icono} size={22} color={activo ? "#6857D9" : "#77777F"} />
      <Text style={[styles.etiquetaNavegacion, activo && styles.etiquetaActiva]}>
        {etiqueta}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  contenido: {
    flex: 1,
  },
  cargando: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  navegacion: {
    minHeight: 64,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ECEBF1",
    backgroundColor: "#FFFFFF",
    paddingBottom: 6,
  },
  botonNavegacion: {
    minWidth: 104,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  etiquetaNavegacion: {
    fontSize: 12,
    color: "#77777F",
  },
  etiquetaActiva: {
    color: "#6857D9",
    fontWeight: "600",
  },
});
