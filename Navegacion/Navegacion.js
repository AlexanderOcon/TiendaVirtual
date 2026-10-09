import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import Catalogo from "../Screens/CatalogoScreen";
import AdminProductos from "../Screens/AdminProductosScreen";
import FormularioProducto from "../Screens/FormularioProductoScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AdministracionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminProductos"
        component={AdminProductos}
        options={{ title: "Productos" }}
      />
      <Stack.Screen
        name="FormularioProducto"
        component={FormularioProducto}
        options={{ title: "Producto" }}
      />
    </Stack.Navigator>
  );
}

export default function Navegacion() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Catalogo"
          component={Catalogo}
          options={{
            title: "Catálogo",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Administracion"
          component={AdministracionStack}
          options={{
            title: "Administración",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flask-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}