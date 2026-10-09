import { useCallback, useState } from "react";
import {ActivityIndicator,Alert,FlatList,Image,Pressable,RefreshControl,StyleSheet,Text,View,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase/config";

const VistaAdmin = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  const cargarProductos = useCallback(async (actualizar = false) => {
    if (actualizar) {
      setActualizando(true);
    } else {
      setCargando(true);
    }
    setError("");

    try {
      const resultado = await getDocs(collection(db, "Productos"));
      setProductos(
        resultado.docs.map((producto) => ({
          id: producto.id,
          ...producto.data(),
        })),
      );
    } catch (e) {
      console.error("Error cargando productos para administración:", e);
      setError("No fue posible cargar los productos. Intenta nuevamente.");
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarProductos();
    }, [cargarProductos]),
  );

  const eliminarProducto = (producto) => {
    Alert.alert(
      "Eliminar producto",`¿Deseas eliminar "${producto.nombre || "este producto"}"?'`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "Productos", producto.id));
              setProductos((actuales) =>
                actuales.filter((actual) => actual.id !== producto.id),
              );
            } catch (e) {
              console.error("Error eliminando producto:", e);
              Alert.alert(
                "No se pudo eliminar",
                "Ocurrió un error al eliminar el producto. Intenta nuevamente.",
              );
            }
          },
        },
      ],
    );
  };

  const renderProducto = ({ item }) => (
    <View style={styles.tarjeta}>
      {item.imagen ? (
        <Image source={{ uri: item.imagen }} style={styles.imagen} />
      ) : (
        <View style={styles.imagenVacia}>
          <Ionicons name="image-outline" size={28} color="#AAA9C2" />
        </View>
      )}
      <View style={styles.detalles}>
        <Text style={styles.nombre} numberOfLines={2}>
          {item.nombre || "Producto sin nombre"}
        </Text>
        <Text style={styles.precio}>${Number(item.precio || 0).toFixed(2)}</Text>
        <View style={styles.acciones}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Editar ${item.nombre || "producto"}`}
            style={styles.botonEditar}
            onPress={() =>
              navigation.navigate("FormularioProducto", { productId: item.id })
            }
          >
            <Ionicons name="create-outline" size={17} color="#5546D7" />
            <Text style={styles.textoEditar}>Editar</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Eliminar ${item.nombre || "producto"}`}
            style={styles.botonEliminar}
            onPress={() => eliminarProducto(item)}
          >
            <Ionicons name="trash-outline" size={17} color="#D94A62" />
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.contenedor} edges={["top"]}>
      <View style={styles.encabezado}>
        <View>
          <Text style={styles.etiqueta}>GESTIÓN DE TIENDA</Text>
          <Text style={styles.titulo}>Productos</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          style={styles.botonAgregar}
          onPress={() => navigation.navigate("FormularioProducto")}
        >
          <Ionicons name="add" size={21} color="#FFFFFF" />
          <Text style={styles.textoAgregar}>Agregar</Text>
        </Pressable>
      </View>

      {error ? (
        <Pressable
          accessibilityRole="button"
          style={styles.error}
          onPress={() => cargarProductos()}
        >
          <Text style={styles.textoError}>{error} Toca para reintentar.</Text>
        </Pressable>
      ) : null}

      {cargando ? (
        <ActivityIndicator style={styles.cargando} color="#5546D7" size="large" />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={renderProducto}
          contentContainerStyle={[
            styles.lista,
            productos.length === 0 && styles.listaVacia,
          ]}
          refreshControl={
            <RefreshControl
              refreshing={actualizando}
              onRefresh={() => cargarProductos(true)}
              tintColor="#5546D7"
            />
          }
          ListEmptyComponent={
            <View style={styles.vacio}>
              <Ionicons name="cube-outline" size={42} color="#AAA9C2" />
              <Text style={styles.vacioTitulo}>Aún no hay productos</Text>
              <Text style={styles.vacioDetalle}>
                Agrega el primer producto para mostrarlo en el catálogo.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#F7F7FC" },
  encabezado: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  etiqueta: {
    color: "#77768F",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  titulo: { color: "#242337", fontSize: 27, fontWeight: "800", marginTop: 3 },
  botonAgregar: {
    backgroundColor: "#5546D7",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  textoAgregar: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  lista: { paddingHorizontal: 16, paddingBottom: 20 },
  listaVacia: { flexGrow: 1 },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    marginBottom: 12,
    minHeight: 132,
    elevation: 2,
    shadowColor: "#27244F",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  imagen: {
    width: 104,
    height: 108,
    borderRadius: 12,
    backgroundColor: "#F2F1FA",
    resizeMode: "contain",
  },
  imagenVacia: {
    width: 104,
    height: 108,
    borderRadius: 12,
    backgroundColor: "#F2F1FA",
    alignItems: "center",
    justifyContent: "center",
  },
  detalles: { flex: 1, paddingLeft: 13, justifyContent: "space-between" },
  nombre: { color: "#29283C", fontSize: 15, fontWeight: "700" },
  precio: { color: "#5546D7", fontSize: 16, fontWeight: "800", marginTop: 5 },
  acciones: { flexDirection: "row", alignItems: "center", gap: 9 },
  botonEditar: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: "#F0EEFF",
  },
  textoEditar: { color: "#5546D7", fontSize: 12, fontWeight: "700" },
  botonEliminar: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: "#FFF0F2",
  },
  cargando: { flex: 1 },
  vacio: { alignItems: "center", justifyContent: "center", flex: 1, padding: 32 },
  vacioTitulo: { color: "#333248", fontSize: 17, fontWeight: "700", marginTop: 14 },
  vacioDetalle: {
    color: "#77768F",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 6,
  },
  error: {
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#FFF0F2",
    borderRadius: 10,
  },
  textoError: { color: "#B8324A", fontSize: 12 },
});

export default VistaAdmin;