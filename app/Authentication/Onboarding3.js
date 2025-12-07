// app/Onboarding3.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Onboarding3() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image source={{ uri: " " }} style={styles.image} />
      <Text style={styles.title}>Stay on Track</Text>
      <Text style={styles.subtitle}>Get personalised insights and reminders.</Text>

      <View style={{width:"90%",flexDirection:"row",justifyContent:"space-between",marginTop:36}}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>
        <TouchableOpacity style={styles.getStarted} onPress={() => router.replace("Authentication/Signup")}><Text style={{color:"#fff"}}>Get Started</Text></TouchableOpacity>
      </View>

      <Text style={styles.note}>By continuing you agree to our Terms & Privacy.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,alignItems:"center",paddingTop:70,backgroundColor:"#fff",paddingHorizontal:24},
  image:{width:"85%",height:260,resizeMode:"cover",borderRadius:12},
  title:{fontSize:26,fontWeight:"700",textAlign:"center",marginTop:12},
  subtitle:{textAlign:"center",color:"#555",marginTop:12,paddingHorizontal:10},
  back:{height:52,width:"45%",borderRadius:12,justifyContent:"center",alignItems:"center",borderWidth:1,borderColor:"#cbd5e1"},
  getStarted:{height:52,width:"45%",borderRadius:12,justifyContent:"center",alignItems:"center",backgroundColor:"#4c6ef5"},
  note:{marginTop:18,color:"#9aa0b4",textAlign:"center",width:"85%"}
});
