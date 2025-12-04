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
      return <Ionicons name="albums-outline" size={22} color={color} />;
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

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#18493F" />
          </TouchableOpacity>
          <Text style={styles.title}>Transactions</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* SPLIT BUTTON SECTION */}
        <TouchableOpacity
          style={styles.splitBtn}
          onPress={() => router.push("/Group/Create")}
        >
          <Ionicons name="git-branch-outline" size={22} color="#fff" />
          <Text style={styles.splitText}>Create Split</Text>
        </TouchableOpacity>

        {/* FILTER SECTION */}
        <View style={styles.filterBar}>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setSortMode(sortMode === "mode" ? "" : "mode")}
          >
            <Ionicons name="filter-outline" size={18} color="#18493F" />
            <Text style={styles.filterLabel}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* DROPDOWNS */}
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
          contentContainerStyle={{ paddingBottom: 120 }}
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
      style={styles.itemRow}
      onPress={() => onPress(item)}
    >
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

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#18493F",
    marginLeft: 12,
  },

  /* SPLIT BUTTON */
  splitBtn: {
    flexDirection: "row",
    backgroundColor: "#196F63",
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 14,
  },
  splitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  /* FILTER BAR */
  filterBar: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterBtn: {
    flexDirection: "row",
    padding: 10,
    borderColor: "#CDE7E1",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#F8FFFD",
    alignItems: "center",
    gap: 8,
    width: 120,
  },
  filterLabel: {
    fontWeight: "600",
    color: "#18493F",
  },

  filterOptions: {
    backgroundColor: "#F3FAF8",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  filterOption: {
    paddingVertical: 10,
  },
  filterOptionText: {
    fontWeight: "700",
    color: "#18493F",
  },

  /* SELECT BOX */
  selectBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#EAF6F3",
    borderRadius: 8,
    margin: 4,
  },
  activeOption: {
    backgroundColor: "#196F63",
  },
  optionText: {
    fontWeight: "600",
    color: "#18493F",
  },
  activeOptionText: {
    color: "#fff",
  },

  /* LIST ITEM */
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    backgroundColor: "#fff",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
  },
  itemCat: {
    fontSize: 13,
    color: "#789",
  },

  amount: {
    fontSize: 18,
    fontWeight: "700",
  },

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
