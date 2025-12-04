// app/Transactions/TransactionsScreen.js
import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";

import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import {
  getActivity,
  deleteTransaction,
} from "../../services/expenseService";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

/* ICONS */
function getCategoryIcon(category, color) {
  switch ((category || "").toLowerCase()) {
    case "food":
      return <MaterialIcons name="fastfood" size={26} color={color} />;
    case "shopping":
      return <MaterialIcons name="shopping-cart" size={26} color={color} />;
    case "travel":
      return <FontAwesome5 name="bus" size={22} color={color} />;
    case "rent":
      return <Ionicons name="home" size={26} color={color} />;
    case "income":
      return <Ionicons name="arrow-up-circle" size={26} color={color} />;
    default:
      return <Ionicons name="ellipse" size={22} color={color} />;
  }
}

export default function TransactionsScreen() {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);
  const router = useRouter();

  const [sortMode, setSortMode] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const CATEGORIES = ["Food", "Shopping", "Travel", "Rent", "Income", "Others"];

  /** LOAD DATA **/
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getActivity();
      setActivity(res.data.activity || []);
    } catch (e) {
      console.log("Activity error:", e);
    } finally {
      setLoading(false);
    }
  };

  /** FILTERING **/
  const filteredData = useMemo(() => {
    let data = [...activity];

    if (selectedMonth) {
      data = data.filter((item) => {
        const m = new Date(item.createdAt).getMonth();
        return MONTHS[m] === selectedMonth;
      });
    }

    if (selectedCategory) {
      data = data.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return data;
  }, [activity, selectedMonth, selectedCategory]);

  /** ACTIONS **/
  const renderRightActions = (item) => (
    <TouchableOpacity
      style={styles.deleteBtn}
      onPress={() => handleDelete(item)}
    >
      <Ionicons name="trash" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const renderLeftActions = (item) => (
    <TouchableOpacity
      style={styles.editBtn}
      onPress={() => handleEdit(item)}
    >
      <Ionicons name="create" size={24} color="#fff" />
    </TouchableOpacity>
  );

  const handleDelete = async (item) => {
    await deleteTransaction(item._id, item.type);
    load();
  };

  const handleEdit = (item) => {
    router.push(`/Transactions/Edit?id=${item._id}&type=${item.type}`);
  };

  const handleDetail = (item) => {
    router.push(`/Transactions/detail?id=${item._id}&type=${item.type}`);
  };

  /** LOADING **/
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>

        {/* HEADER WITH BACK BUTTON */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#18493F" />
          </TouchableOpacity>

          <Text style={styles.heading}>Transactions</Text>

          <View style={{ width: 30 }} /> 
        </View>

        {/* SORT BAR */}
        <View style={styles.sortBar}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setSortMode(sortMode === "mode" ? "" : "mode")}
          >
            <Text style={styles.dropdownText}>
              {selectedMonth || selectedCategory ? "Filtered" : "Sort By"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#18493F" />
          </TouchableOpacity>
        </View>

        {/* SORT OPTIONS */}
        {sortMode === "mode" && (
          <View style={styles.sortOptions}>
            <TouchableOpacity
              style={styles.sortBtn}
              onPress={() => setSortMode("month")}
            >
              <Text style={styles.sortBtnText}>Sort by Month</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sortBtn}
              onPress={() => setSortMode("category")}
            >
              <Text style={styles.sortBtnText}>Sort by Category</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MONTH SELECT */}
        {sortMode === "month" && (
          <View style={styles.selectBox}>
            {MONTHS.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.option,
                  selectedMonth === m && styles.activeOption,
                ]}
                onPress={() => setSelectedMonth(m)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedMonth === m && styles.activeOptionText,
                  ]}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* CATEGORY SELECT */}
        {sortMode === "category" && (
          <View style={styles.selectBox}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.option,
                  selectedCategory === c && styles.activeOption,
                ]}
                onPress={() => setSelectedCategory(c)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedCategory === c && styles.activeOptionText,
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TRANSACTION LIST */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => renderRightActions(item)}
              renderLeftActions={() => renderLeftActions(item)}
            >
              <TransactionItem item={item} onPress={handleDetail} />
            </Swipeable>
          )}
        />

        <BottomNav active="tx" />
      </View>
    </GestureHandlerRootView>
  );
}

/* ROW COMPONENT */
function TransactionItem({ item, onPress }) {
  const isIncome = item.type === "income";
  const color = isIncome ? "#198754" : "#D9534F";

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPress(item)}
    >
      <View style={styles.left}>
        {getCategoryIcon(item.category, color)}
        <Text style={styles.title}>{item.title}</Text>
      </View>

      <Text style={[styles.amount, { color }]}>
        {isIncome ? "+" : "-"}₹{item.amount}
      </Text>
    </TouchableOpacity>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 55 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#18493F",
  },

  /* SORT */
  sortBar: { flexDirection: "row", marginBottom: 10 },
  dropdown: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
    borderColor: "#CDE7E1",
    alignItems: "center",
    justifyContent: "space-between",
    width: 150,
    backgroundColor: "#F8FFFD",
  },
  dropdownText: { fontWeight: "600", color: "#18493F" },

  sortOptions: {
    backgroundColor: "#F3FAF8",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  sortBtn: { padding: 10 },
  sortBtnText: { fontWeight: "700", color: "#18493F" },

  selectBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#EAF6F3",
    borderRadius: 8,
    margin: 4,
  },
  activeOption: { backgroundColor: "#196F63" },
  optionText: { fontWeight: "600", color: "#18493F" },
  activeOptionText: { color: "#fff" },

  /* ROW CARD */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },

  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { fontSize: 16, fontWeight: "600", color: "#18493F" },
  amount: { fontSize: 18, fontWeight: "700" },

  deleteBtn: {
    width: 80,
    backgroundColor: "#D9534F",
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    width: 80,
    backgroundColor: "#198754",
    justifyContent: "center",
    alignItems: "center",
  },
});
