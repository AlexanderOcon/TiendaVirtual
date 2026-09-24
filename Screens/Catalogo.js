import { View, Text, TextInput, ScrollView, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Categoria from "../components/Categoria";
import Producto from "../components/Producto";

const Catalogo = () => {

  const categorias = [

    { id: 1, nombre: "Fashion", icono: "shirt-outline" },
    { id: 2, nombre: "Cars", icono: "car-outline" },
    { id: 3, nombre: "Babies", icono: "woman-outline" },
    { id: 4, nombre: "Home", icono: "home-outline" },
    { id: 5, nombre: "Sport", icono: "bicycle-outline" },
    { id: 6, nombre: "Technology", icono: "laptop-outline" },
    { id: 7, nombre: "Music", icono: "musical-notes-outline" },
  ];

  const productos = [
    { id: 1, nombre: "A Room of One's Own", precio: "12", tiempo: "4 hours ago", color: "#78B8D8", imagen: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500" },
    { id: 2, nombre: "Laptop Lenovo Yoga G15", precio: "1200", tiempo: "4 hours ago", color: "#78B8D8", imagen: "https://www.imeqmo.com/web/image/product.template/25845/image_512" },
    { id: 3, nombre: "Wireless headphones", precio: "50", tiempo: "8 hours ago", color: "#abe865", imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { id: 4, nombre: "White sneakers", precio: "27", tiempo: "10 hours ago", color: "#F5AFC1", imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
    { id: 5, nombre: "Minimalist chair", precio: "89", tiempo: "1 day ago", color: "#D8C0FF", imagen: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500" },
    { id: 6, nombre: "Smartwatch Pro", precio: "180", tiempo: "2 days ago", color: "#B7E4C7", imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { id: 7, nombre: "Classic backpack", precio: "65", tiempo: "3 days ago", color: "#F5D5A8", imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
    { id: 8, nombre: "Coffee table lamp", precio: "42", tiempo: "5 days ago", color: "#A8D8FF", imagen: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500" },
    { id: 9, nombre: "Leather watch", precio: "95", tiempo: "6 days ago", color: "#F7C8C8", imagen: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500" },
    { id: 10, nombre: "Running shoes", precio: "74", tiempo: "1 week ago", color: "#B9E8FF", imagen: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=500" },
    { id: 11, nombre: "Portable speaker", precio: "58", tiempo: "1 week ago", color: "#D9F7B8", imagen: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=500" },
    { id: 12, nombre: "Travel mug", precio: "24", tiempo: "2 weeks ago", color: "#F9D9B7", imagen: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500" },
    { id: 13, nombre: "Bluetooth earbud", precio: "39", tiempo: "3 weeks ago", color: "#CDE8FF", imagen: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500" },
    { id: 14, nombre: "Desk organizer", precio: "32", tiempo: "3 weeks ago", color: "#E7D5FF", imagen: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500" },
    { id: 15, nombre: "Winter jacket", precio: "110", tiempo: "1 month ago", color: "#D1F0C1", imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500" },
    { id: 16, nombre: "Canvas tote bag", precio: "28", tiempo: "1 month ago", color: "#F8D7A7", imagen: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500" },
    { id: 17, nombre: "Gaming mouse", precio: "45", tiempo: "1 month ago", color: "#B8E1D2", imagen: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500" },
    { id: 18, nombre: "Office chair", precio: "210", tiempo: "2 months ago", color: "#FFD7B5", imagen: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500" },
    { id: 19, nombre: "Cactus pot", precio: "18", tiempo: "2 months ago", color: "#C9E7B5", imagen: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500" },
    { id: 20, nombre: "Mountain bike", precio: "620", tiempo: "3 months ago", color: "#C7D9FF", imagen: "https://images.unsplash.com/photo-1558980664-10e7170b5df9?w=500" },
    { id: 21, nombre: "Sunglasses", precio: "34", tiempo: "3 months ago", color: "#FFD9E6", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRpgEwY4aV83vebD9ZTXKguA72okeikBkiowVkEMgoNQ&s=1024" },
    { id: 22, nombre: "Camera tripod", precio: "76", tiempo: "4 months ago", color: "#D9D2FF", imagen: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500" },
  ];

  return (
    <ScrollView style={styles.contenedor}>
      <View style={styles.buscador}>
        <Ionicons name="search-outline" size={18} color="#7C7CFF" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#B5B5D5"
          style={styles.input}
        />
      </View>

      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.categorias}
      >
        {categorias.map((categoria) => (
          <Categoria 
          key={categoria.id} 
          nombre={categoria.nombre} 
          icono={categoria.icono}
          />
        ))}
      </ScrollView>

      <View style={styles.linea} />
      <Text style={styles.titulo}>News</Text>

      <View style={styles.productos}>
        <FlatList
          data={productos}
          renderItem={({ item }) => (
            <Producto
              nombre={item.nombre}
              precio={item.precio}
              tiempo={item.tiempo}
              color={item.color}
              imagen={item.imagen}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal={false}
          columnWrapperStyle= {{ justifyContent: "space-between" }}
          scrollEnabled={false}
          numColumns={2}         
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    marginTop: 40,
  },
  buscador: {
    height: 55,
    backgroundColor: "#F5F4FC",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 12,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 12,
    marginLeft: 8,
  },
  categorias: {
    marginBottom: 10,
  },
  linea: {
    height: 3,
    backgroundColor: "#AAAAAA",
    marginHorizontal: -10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginTop: 15,
    marginBottom: 10,
  },
  productos: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default Catalogo;