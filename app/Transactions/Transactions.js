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
import { getActivity, deleteTransaction } from "../../services/expenseService";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

/* ---------------- ICON PICKER ---------------- */
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
    case "split group":
      return <Ionicons name="git-branch-outline" size={26} color={color} />;
    default:
      return <Ionicons name="albums-outline" size={22} color={color} />;
  }
}

function TransactionsScreen() {
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

  const CATEGORIES = [
    "Food","Shopping","Travel","Rent","Income","Split Group","Others"
  ];

  /* ---------------- LOAD ACTIVITY ---------------- */
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

  /* ---------------- FILTERING ---------------- */
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

  /* ---------------- SPLIT GROUP CHECK ---------------- */
  const isSplit = (item) =>
    (item.category || "").toLowerCase() === "split group";

  /* ---------------- ACTIONS ---------------- */
  const handleDelete = async (item) => {
    if (isSplit(item)) return;
    await deleteTransaction(item._id, item.type);
    load();
  };

  const handleEdit = (item) => {
    if (isSplit(item)) return;
    router.push(`/Transactions/Edit?id=${item._id}&type=${item.type}`);
  };

  const handleDetail = (item) => {
    if (isSplit(item)) return;
    router.push(`/Transactions/Detail?id=${item._id}&type=${item.type}`);
  };

  /* ---------------- SWIPE ACTIONS ---------------- */
  const renderRightActions = (item) =>
    isSplit(item) ? null : (
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item)}
      >
        <Ionicons name="trash" size={24} color="#fff" />
      </TouchableOpacity>
    );

  const renderLeftActions = (item) =>
    isSplit(item) ? null : (
      <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
        <Ionicons name="create" size={24} color="#fff" />
      </TouchableOpacity>
    );

  /* ---------------- LOADING ---------------- */
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Transactions</Text>
        </View>

        {/* SPLIT GROUP BUTTON */}
        <TouchableOpacity
          style={styles.splitBtn}
          onPress={() => router.push("/Group/GroupsListScreen")}
        >
          <Ionicons name="git-branch-outline" size={22} color="#fff" />
          <Text style={styles.splitText}>Create Split</Text>
        </TouchableOpacity>

        {/* FILTER BUTTON */}
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setSortMode(sortMode === "mode" ? "" : "mode")}
          >
            <Ionicons name="filter-outline" size={18} color="#18493F" />
            <Text style={styles.filterLabel}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* FILTER MODES */}
        {sortMode === "mode" && (
          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setSortMode("month")}
            >
              <Text style={styles.filterOptionText}>Sort by Month</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => setSortMode("category")}
            >
              <Text style={styles.filterOptionText}>Sort by Category</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MONTH SELECTOR */}
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

        {/* CATEGORY SELECTOR */}
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

        {/* TRANSACTIONS LIST */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 130 }}
          renderItem={({ item }) => (
            <Swipeable
              enabled={!isSplit(item)}
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

/* ---------------- SINGLE ITEM ROW ---------------- */
function TransactionItem({ item, onPress }) {
  const isIncome = item.type === "income";
  const color = isIncome ? "#198754" : "#D9534F";

  return (
    <TouchableOpacity style={styles.itemCard} onPress={() => onPress(item)}>
      <View style={styles.itemLeft}>
        {getCategoryIcon(item.category, color)}

        <View>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemCat}>{item.category}</Text>
        </View>
      </View>

      <Text style={[styles.amount, { color }]}>
        {isIncome ? "+" : "-"}₹{item.amount}
      </Text>
    </TouchableOpacity>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* HEADER */
  headerWrapper: {
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,

    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { padding: 6, marginRight: 12 },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  /* SPLIT */
  splitBtn: {
    marginTop: -15,
    marginHorizontal: 20,

    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  splitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  /* FILTERS */
  filterBar: { paddingHorizontal: 20, marginTop: 16, marginBottom: 6 },
  filterBtn: {
    flexDirection: "row",
    padding: 10,
    borderColor: "#CDE7E1",
    borderWidth: 1,

    backgroundColor: "#F8FFFD",
    borderRadius: 12,

    alignItems: "center",
    gap: 8,
    width: 120,
  },
  filterLabel: { fontWeight: "600", color: "#18493F" },

  filterOptions: {
    backgroundColor: "#F1F8F6",
    padding: 14,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  filterOption: { paddingVertical: 8 },
  filterOptionText: { fontSize: 16, fontWeight: "700", color: "#18493F" },

  /* SELECT BOXES */
  selectBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 20,
    marginBottom: 10,
  },

  option: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#E7F5EF",
    borderRadius: 12,
    margin: 4,
  },
  activeOption: { backgroundColor: "#196F63" },

  optionText: { fontWeight: "700", color: "#18493F" },
  activeOptionText: { color: "#fff" },

  /* TRANSACTION CARD */
  itemCard: {
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,

    backgroundColor: "#F8FFFD",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E1F1EC",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemTitle: { fontSize: 16, fontWeight: "700", color: "#18493F" },
  itemCat: { fontSize: 13, color: "#6F7E78", marginTop: 2 },

  amount: { fontSize: 18, fontWeight: "800" },

  /* SWIPE BUTTONS */
  deleteBtn: {
    width: 80,
    backgroundColor: "#D9534F",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  editBtn: {
    width: 80,
    backgroundColor: "#198754",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});

export default TransactionsScreen;
