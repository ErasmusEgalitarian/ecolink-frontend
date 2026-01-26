import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "../styles/components/CreatePickupCards.styles";

const materialIcons = {
  metal: require("../assets/materialIcons/recycleMetal.png"),
  plastic: require("../assets/materialIcons/recyclePlastic.png"),
  paper: require("../assets/materialIcons/recyclePaper.png"),
  glass: require("../assets/materialIcons/recycleGlass.png"),
};

const CreatePickupCards = ({ onItemsChange, resetTrigger }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([{ id: "0", text: "", isNew: true }]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [selectedPill, setSelectedPill] = useState(null);
  const [quantity, setQuantity] = useState(null);

  useEffect(() => {
    if (resetTrigger) {
      setItems([{ id: "0", text: "", isNew: true }]); // Reset items
      onItemsChange([]); // Notify parent that items are cleared
    }
  }, [resetTrigger]);
  const updateItems = (updatedItems) => {
    setItems(updatedItems);
    onItemsChange && onItemsChange(updatedItems);
  };

  // Function to open the modal
  const openModal = (itemId) => {
    setEditingItemId(itemId);
    setIsModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalVisible(false);
    setEditingItemId(null);
  };

  // Function to get the background color based on the selected type
  const getCardBackgroundColor = (type) => {
    switch (type) {
      case t("Pickup.metal"):
        return "#FFD900";
      case t("Pickup.plastic"):
        return "#FF2E17";
      case t("Pickup.paper"):
        return "#0B369C";
      case t("Pickup.glass"):
        return "#AFD34D";
      default:
        return "#DCEAAF";
    }
  };

  // Function to handle adding or updating an item
  const handleAddOrUpdateItem = () => {
    // Check if `selectedPill` and `quantity` are filled
    if (!selectedPill || !quantity || quantity.trim() === "") {
      Alert.alert("Error", t("Pickup.errorMessage"));
      return;
    }

    // Update the current card with the selected type and quantity
    const updatedItems = items.map((item) =>
      item.id === editingItemId
        ? {
            ...item,
            text: `${selectedPill}: ${quantity}`,
            isNew: false,
            type: selectedPill,
            quantity: quantity,
          }
        : item,
    );

    // If the item is a new card, add a new "Add" card below
    if (
      editingItemId === "0" ||
      items.find((item) => item.id === editingItemId)?.isNew
    ) {
      updatedItems.push({ id: Date.now().toString(), text: "", isNew: true });
    }

    updateItems(updatedItems);
    setItems(updatedItems);

    setQuantity("");
    setSelectedPill(null);

    closeModal();
  };

  // Function to handle deleting an item
  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    onItemsChange && onItemsChange(updatedItems);
  };

  // Render each item in the FlatList
  const renderItem = ({ item }) => {
    const iconSource = materialIcons[item.type?.toLowerCase()] || null;

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: item.isNew ? "#AFD34D" : "#ECECEC" },
        ]}
      >
        {/* Delete button */}
        {!item.isNew && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={() => handleDeleteItem(item.id)}
          >
            <Icon name="trash" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Row for icon and text */}
        <View style={styles.cardContent}>
          {/* Material Icon */}
          {!item.isNew && iconSource && (
            <Image style={styles.materialIcon} source={iconSource} />
          )}

          {/* Card text */}
          <View style={styles.cardTXTContainer}>
            <Text
              style={[
                styles.cardTXT,
                { color: item.isNew ? "white" : "#333333" },
              ]}
            >
              {item.isNew ? t("Pickup.cardTXT") : `${item.type}`}
            </Text>
            {!item.isNew && (
              <Text style={[styles.cardTXT, { fontSize: 16 }]}>
                {item.isNew ? t("Pickup.cardTXT") : `${item.quantity} kg`}
              </Text>
            )}
          </View>
        </View>

        {/* Add button */}
        {item.isNew && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => openModal(item.id)}
          >
            <Icon name="add" size={24} color="#AFD34D" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.creationContainer}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{t("Pickup.cardTXT")}</Text>
            <Text style={styles.modalInputTXT}>{t("Pickup.type")}</Text>
            <View style={styles.containerPills}>
              {[
                { type: t("Pickup.metal"), color: "#0052CC" },
                { type: t("Pickup.plastic"), color: "#FFDD00" },
                { type: t("Pickup.paper"), color: "#FF5733" },
                { type: t("Pickup.glass"), color: "#6ABF4B" },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.pillButtons,
                    selectedPill === item.type && {
                      backgroundColor: item.color,
                    },
                  ]}
                  onPress={() => setSelectedPill(item.type)}
                >
                  <Text
                    style={
                      selectedPill === item.type
                        ? styles.selectedPillText
                        : styles.pillText
                    }
                  >
                    {item.type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalInputTXT}>{t("Pickup.quantity")}</Text>
            <Text style={styles.modalInputTXTExtra}>
              {t("Pickup.quantityExtra")}
            </Text>

            <TextInput
              style={styles.input}
              onChangeText={(text) => setQuantity(text)}
              value={quantity}
              placeholder=""
              keyboardType="numeric"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button2, { backgroundColor: "#D9D9D9" }]}
                onPress={closeModal}
              >
                <Text style={styles.buttonText}>
                  {t("Pickup.buttonDecline")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button2, { backgroundColor: "#AFD34D" }]}
                onPress={handleAddOrUpdateItem}
              >
                <Text style={styles.buttonText}>
                  {t("Pickup.buttonAccept")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* List of items */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default CreatePickupCards;
