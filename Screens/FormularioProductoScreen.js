import { useEffect, useState } from "react";
import {ActivityIndicator,KeyboardAvoidingView,Platform,Pressable,ScrollView,StyleSheet,Text,TextInput,View,} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import {addDoc,collection,doc,getDoc,getDocs,updateDoc,} from "firebase/firestore";
import { db } from "../firebase/config";

const initialValues = {
  nombre: "",
  precio: "",
  imagen: "",
  tiempo: "",
  descripcion: "",
  color: "#F4F4F4",
  categoriaId: "",
};

const NewProducto = ({ navigation, route }) => {
  const productId = route.params?.productId;
  const id = Array.isArray(productId) ? productId[0] : productId;
  const editando = Boolean(id);
  const [formulario, setFormulario] = useState(initialValues);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(editando);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarFormulario = async () => {
      try {
        const categoriasSnapshot = await getDocs(collection(db, "categorias"));
        setCategorias(
          categoriasSnapshot.docs.map((categoria) => ({
            id: categoria.id,
            ...categoria.data(),
          })),
        );

        if (id) {
          const productoSnapshot = await getDoc(doc(db, "Productos", id));
          if (!productoSnapshot.exists()) {
            setError("El producto que intentas editar ya no existe.");
            return;
          }
          const producto = productoSnapshot.data();
          setFormulario({
            ...initialValues,
            ...producto,
            precio: String(producto.precio ?? ""),
          });
        }
      } catch (e) {
        console.error("Error cargando el formulario de producto:", e);
        setError("No fue posible cargar los datos. Intenta nuevamente.");
      } finally {
        setCargando(false);
      }
    };

    cargarFormulario();
  }, [id]);

  const cambiarCampo = (campo, valor) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  };

  const guardarProducto = async () => {
    const nombre = formulario.nombre.trim();
    const precio = Number(formulario.precio);

    if (!nombre || !formulario.precio.trim() || !Number.isFinite(precio) || precio < 0) {
      setError("Ingresa un nombre y un precio válido (cero o mayor).");
      return;
    }

    setError("");
    setGuardando(true);
    const datos = {
      nombre,
      precio,
      imagen: formulario.imagen.trim(),
      tiempo: formulario.tiempo.trim(),
      descripcion: formulario.descripcion.trim(),
      color: formulario.color.trim() || "#F4F4F4",
      categoriaId: formulario.categoriaId || null,
    };

    try {
      if (id) {
        await updateDoc(doc(db, "Productos", id), datos);
      } else {
        await addDoc(collection(db, "Productos"), datos);
      }
      navigation.goBack();
    } catch (e) {
      console.error("Error guardando producto:", e);
      setError("No fue posible guardar el producto. Intenta nuevamente.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator color="#5546D7" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.contenedor}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.intro}>
            <View style={styles.icono}>
              <Ionicons
                name={editando ? "create-outline" : "cube-outline"}
                size={25}
                color="#5546D7"
              />
            </View>
            <Text style={styles.titulo}>
              {editando ? "Editar producto" : "Nuevo producto"}
            </Text>
            <Text style={styles.subtitulo}>
              Completa los datos para {editando ? "actualizar" : "agregar"} el producto.
            </Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.etiqueta}>Nombre del producto *</Text>
          <TextInput
            value={formulario.nombre}
            onChangeText={(valor) => cambiarCampo("nombre", valor)}
            placeholder="Ej. Tenis deportivos"
            placeholderTextColor="#9B9AAF"
            style={styles.input}
            maxLength={100}
            returnKeyType="next"
          />

          <Text style={styles.etiqueta}>Categoría</Text>
          {categorias.length > 0 ? (
            <View style={styles.selectorContainer}>
              <Picker
                selectedValue={formulario.categoriaId || ""}
                onValueChange={(valor) => cambiarCampo("categoriaId", valor)}
                mode="dropdown"
                style={styles.selector}
              >
                <Picker.Item label="Selecciona una categoría" value="" />
                {categorias.map((categoria) => (
                  <Picker.Item
                    key={categoria.id}
                    label={categoria.nombre || "Categoría"}
                    value={categoria.id}
                  />
                ))}
              </Picker>
            </View>
          ) : (
            <Text style={styles.ayudaCategoria}>
              No hay categorías disponibles; puedes guardar el producto sin categoría.
            </Text>
          )}

          <Text style={styles.etiqueta}>Precio *</Text>
          <View style={styles.precioInput}>
            <Text style={styles.simboloPrecio}>C$</Text>
            <TextInput
              value={formulario.precio}
              onChangeText={(valor) => cambiarCampo("precio", valor)}
              placeholder="0.00"
              placeholderTextColor="#9B9AAF"
              style={styles.inputPrecio}
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.etiqueta}>URL de la imagen</Text>
          <TextInput
            value={formulario.imagen}
            onChangeText={(valor) => cambiarCampo("imagen", valor)}
            placeholder="https://..."
            placeholderTextColor="#9B9AAF"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="url"
          />

          <Text style={styles.etiqueta}>Tiempo</Text>
          <TextInput
            value={formulario.tiempo}
            onChangeText={(valor) => cambiarCampo("tiempo", valor)}
            placeholder="Ej. hace 10 horas"
            placeholderTextColor="#9B9AAF"
            style={styles.input}
          />

          <Text style={styles.etiqueta}>Color</Text>
          <TextInput
            value={formulario.color}
            onChangeText={(valor) => cambiarCampo("color", valor)}
            placeholder="Ej. #F4F4F4"
            placeholderTextColor="#9B9AAF"
            style={styles.input}
            autoCapitalize="characters"
          />

          <Text style={styles.etiqueta}>Descripción</Text>
          <TextInput
            value={formulario.descripcion}
            onChangeText={(valor) => cambiarCampo("descripcion", valor)}
            placeholder="Detalles del producto"
            placeholderTextColor="#9B9AAF"
            style={[styles.input, styles.inputDescripcion]}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />

          <Pressable
            accessibilityRole="button"
            disabled={guardando}
            style={[styles.botonGuardar, guardando && styles.botonDeshabilitado]}
            onPress={guardarProducto}
          >
            {guardando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.textoGuardar}>
                  {editando ? "Guardar cambios" : "Agregar producto"}
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={guardando}
            style={styles.botonCancelar}
            onPress={() => {
              if (!guardando) navigation.goBack();
            }}
          >
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F7F7FC" },
  contenedor: { flex: 1 },
  contenido: { padding: 20, paddingBottom: 32 },
  intro: { alignItems: "center", marginBottom: 24 },
  icono: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEECFF",
    marginBottom: 12,
  },
  titulo: { color: "#29283C", fontSize: 23, fontWeight: "800" },
  subtitulo: {
    color: "#77768F",
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
  },
  etiqueta: {
    color: "#39384D",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 15,
  },
  input: {
    minHeight: 49,
    borderWidth: 1,
    borderColor: "#E5E4EF",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    color: "#29283C",
    fontSize: 14,
  },
  precioInput: {
    minHeight: 49,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E4EF",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
  },
  simboloPrecio: { color: "#77768F", fontSize: 15, fontWeight: "700" },
  inputPrecio: { flex: 1, color: "#29283C", fontSize: 14, paddingLeft: 10 },
  inputDescripcion: { minHeight: 94, paddingTop: 13 },
  selectorContainer: {
    minHeight: 49,
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E4EF",
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: "center",
  },
  selector: { color: "#29283C" },
  ayudaCategoria: { color: "#77768F", fontSize: 12, lineHeight: 18 },
  error: {
    color: "#B8324A",
    backgroundColor: "#FFF0F2",
    borderRadius: 10,
    padding: 11,
    fontSize: 12,
    lineHeight: 18,
  },
  botonGuardar: {
    height: 52,
    borderRadius: 13,
    marginTop: 27,
    backgroundColor: "#5546D7",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  botonDeshabilitado: { opacity: 0.7 },
  textoGuardar: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  botonCancelar: { alignItems: "center", padding: 15, marginTop: 4 },
  textoCancelar: { color: "#77768F", fontSize: 14, fontWeight: "600" },
  cargando: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default NewProducto;