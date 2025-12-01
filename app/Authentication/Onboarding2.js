// app/Onboarding2.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Onboarding2() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://images.unsplash.com/photo-1523475496153-3d6ccf8f9d5a?w=1200&q=80&auto=format&fit=crop" }} style={styles.image} />
      <Text style={styles.title}>Save Automatically</Text>
      <Text style={styles.subtitle}>Set smart rules and automatic savings.</Text>

      <View style={{width:"90%",flexDirection:"row",justifyContent:"space-between",marginTop:36}}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>
        <TouchableOpacity style={styles.next} onPress={() => router.push("Authentication/Onboarding3")}><Text style={{color:"#fff"}}>Next</Text></TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.replace("Authentication/Login")}><Text style={styles.skip}>Skip</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,alignItems:"center",paddingTop:70,backgroundColor:"#fff",paddingHorizontal:24},
  image:{width:"85%",height:260,resizeMode:"cover",borderRadius:12},
  title:{fontSize:26,fontWeight:"700",textAlign:"center",marginTop:12},
  subtitle:{textAlign:"center",color:"#555",marginTop:12,paddingHorizontal:10},
  back:{height:52,width:"45%",borderRadius:12,justifyContent:"center",alignItems:"center",borderWidth:1,borderColor:"#cbd5e1"},
  next:{height:52,width:"45%",borderRadius:12,justifyContent:"center",alignItems:"center",backgroundColor:"#4c6ef5"},
  skip:{marginTop:18,color:"#777"}
});
