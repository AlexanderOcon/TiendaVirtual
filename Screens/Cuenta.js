import { useState } from "react";
import {ActivityIndicator,KeyboardAvoidingView,Platform,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import {createUserWithEmailAndPassword,GoogleAuthProvider,sendPasswordResetEmail,signInWithCredential,signInWithEmailAndPassword,signInWithPopup,signOut,} from "firebase/auth";
import { auth } from "../firebase/config";

const mensajesError = {
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
  "auth/invalid-email": "Escribe un correo electrónico válido.",
  "auth/invalid-credential": "El correo o la contraseña no son correctos.",
  "auth/user-not-found": "No encontramos una cuenta con ese correo.",
  "auth/wrong-password": "La contraseña no es correcta.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
  "auth/too-many-requests": "Demasiados intentos. Espera un momento y vuelve a probar.",
  "auth/network-request-failed": "Revisa tu conexión e inténtalo de nuevo.",
};

export default function Cuenta({ usuario }) {
  const [modo, setModo] = useState("login");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoGoogle, setCargandoGoogle] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const iniciarConGoogle = async () => {
    setError("");
    setAviso("");
    setCargandoGoogle(true);

    try {
      if (Platform.OS === "web") {
        await signInWithPopup(auth, new GoogleAuthProvider());
        return;
      }

      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      });
      const resultado = await GoogleSignin.signIn();
      if (resultado.type === "cancelled") return;

      const idToken = resultado.data.idToken;
      if (!idToken) {
        setError("Google no devolvió un token de acceso. Revisa la configuración OAuth.");
        return;
      }

      await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
    } catch (googleError) {
      if (googleError.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (googleError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setError("Google Play Services no está disponible en este dispositivo.");
        return;
      }
      setError(
        googleError.code === "auth/account-exists-with-different-credential"
          ? "Ya existe una cuenta con este correo. Inicia sesión con el método asociado."
          : "No se pudo iniciar sesión con Google. Revisa OAuth y usa un development build en Android/iOS."
      );
    } finally {
      setCargandoGoogle(false);
    }
  };

  const enviar = async () => {
    setError("");
    setAviso("");

    if (!correo.trim()) {
      setError("Escribe tu correo electrónico.");
      return;
    }
    if (modo !== "reset" && !contrasena) {
      setError("Escribe tu contraseña.");
      return;
    }
    if (modo === "register" && contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    try {
      if (modo === "register") {
        await createUserWithEmailAndPassword(auth, correo.trim(), contrasena);
      } else if (modo === "reset") {
        await sendPasswordResetEmail(auth, correo.trim());
        setAviso("Te enviamos un enlace para restablecer tu contraseña.");
      } else {
        await signInWithEmailAndPassword(auth, correo.trim(), contrasena);
      }
    } catch (firebaseError) {
      setError(
        mensajesError[firebaseError.code] ||
          "No se pudo completar la solicitud. Inténtalo de nuevo."
      );
    } finally {
      setCargando(false);
    }
  };

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    setError("");
    setAviso("");
  };

  if (usuario) {
    return (
      <View style={styles.contenedorCuenta}>
        <View style={styles.iconoCuenta}>
          <Ionicons name="person-outline" size={30} color="#6857D9" />
        </View>
        <Text style={styles.titulo}>Tu cuenta</Text>
        <Text style={styles.descripcion}>Has iniciado sesión como</Text>
        <Text style={styles.correoUsuario}>{usuario.email}</Text>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.botonSecundario}
          onPress={() => signOut(auth)}
        >
          <Ionicons name="log-out-outline" size={19} color="#6857D9" />
          <Text style={styles.textoBotonSecundario}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const titulo =
    modo === "register"
      ? "Crea tu cuenta"
      : modo === "reset"
        ? "Recupera tu acceso"
        : "Bienvenido";

  return (
    <KeyboardAvoidingView
      style={styles.teclado}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.contenidoFormulario}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.marca}>
          <Ionicons name="bag-handle-outline" size={25} color="#6857D9" />
        </View>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descripcion}>
          {modo === "register"
            ? "Regístrate para tener tu cuenta de tienda."
            : modo === "reset"
              ? "Te enviaremos un enlace a tu correo."
              : "Ingresa con tu correo y contraseña."}
        </Text>

        <Text style={styles.etiqueta}>Correo electrónico</Text>
        <TextInput
          accessibilityLabel="Correo electrónico"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="nombre@correo.com"
          placeholderTextColor="#96939F"
          returnKeyType={modo === "reset" ? "send" : "next"}
          style={styles.campo}
          value={correo}
          onChangeText={setCorreo}
        />

        {modo !== "reset" && (
          <>
            <Text style={styles.etiqueta}>Contraseña</Text>
            <TextInput
              accessibilityLabel="Contraseña"
              autoCapitalize="none"
              autoComplete={modo === "register" ? "new-password" : "password"}
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#96939F"
              returnKeyType="done"
              secureTextEntry
              style={styles.campo}
              value={contrasena}
              onChangeText={setContrasena}
              onSubmitEditing={enviar}
            />
          </>
        )}

        {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
        {!!aviso && <Text accessibilityRole="alert" style={styles.aviso}>{aviso}</Text>}

        <TouchableOpacity
          accessibilityRole="button"
          disabled={cargando}
          onPress={enviar}
          style={[styles.botonPrincipal, cargando && styles.botonDeshabilitado]}
        >
          {cargando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBotonPrincipal}>
              {modo === "register"
                ? "Crear cuenta"
                : modo === "reset"
                  ? "Enviar enlace"
                  : "Iniciar sesión"}
            </Text>
          )}
        </TouchableOpacity>

        {modo !== "reset" && (
          <>
            <View style={styles.separadorGoogle}>
              <View style={styles.lineaSeparador} />
              <Text style={styles.textoSeparador}>o continúa con</Text>
              <View style={styles.lineaSeparador} />
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={cargando || cargandoGoogle}
              onPress={iniciarConGoogle}
              style={[
                styles.botonGoogle,
                (cargando || cargandoGoogle) && styles.botonDeshabilitado,
              ]}
            >
              {cargandoGoogle ? (
                <ActivityIndicator color="#4285F4" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={19} color="#4285F4" />
                  <Text style={styles.textoBotonGoogle}>Continuar con Google</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}

        {modo === "login" && (
          <TouchableOpacity onPress={() => cambiarModo("reset")} style={styles.enlace}>
            <Text style={styles.textoEnlace}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        )}

        <View style={styles.cambioModo}>
          <Text style={styles.textoCambio}>
            {modo === "register" ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}
          </Text>
          <TouchableOpacity
            onPress={() => cambiarModo(modo === "register" ? "login" : "register")}
          >
            <Text style={styles.textoEnlace}>
              {modo === "register" ? "Inicia sesión" : "Regístrate"}
            </Text>
          </TouchableOpacity>
        </View>

        {modo === "reset" && (
          <TouchableOpacity onPress={() => cambiarModo("login")} style={styles.enlace}>
            <Text style={styles.textoEnlace}>Volver a iniciar sesión</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  teclado: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contenidoFormulario: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingTop: 38,
    paddingBottom: 30,
  },
  marca: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#F0EEFF",
    marginBottom: 22,
  },
  titulo: {
    color: "#24222C",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 7,
  },
  descripcion: {
    color: "#777480",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
  },
  etiqueta: {
    color: "#383642",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  campo: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E3E1E9",
    borderRadius: 10,
    paddingHorizontal: 14,
    color: "#24222C",
    fontSize: 15,
    marginBottom: 18,
  },
  botonPrincipal: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#6857D9",
    marginTop: 4,
  },
  botonDeshabilitado: {
    opacity: 0.7,
  },
  separadorGoogle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  lineaSeparador: {
    flex: 1,
    height: 1,
    backgroundColor: "#E3E1E9",
  },
  textoSeparador: {
    color: "#777480",
    fontSize: 13,
  },
  botonGoogle: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#DADCE0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginTop: 14,
  },
  textoBotonGoogle: {
    color: "#383642",
    fontSize: 15,
    fontWeight: "600",
  },
  textoBotonPrincipal: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  enlace: {
    alignSelf: "center",
    paddingVertical: 15,
  },
  textoEnlace: {
    color: "#6857D9",
    fontSize: 14,
    fontWeight: "600",
  },
  cambioModo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 14,
  },
  textoCambio: {
    color: "#777480",
    fontSize: 14,
  },
  error: {
    color: "#B42318",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  aviso: {
    color: "#217A4B",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  contenedorCuenta: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },
  iconoCuenta: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#F0EEFF",
    marginBottom: 20,
  },
  correoUsuario: {
    color: "#383642",
    fontSize: 16,
    textAlign: "center",
    marginTop: -17,
    marginBottom: 26,
  },
  botonSecundario: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "#D8D3F5",
    borderRadius: 10,
  },
  textoBotonSecundario: {
    color: "#6857D9",
    fontSize: 14,
    fontWeight: "600",
  },
});