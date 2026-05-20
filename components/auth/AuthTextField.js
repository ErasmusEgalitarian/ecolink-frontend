import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authColors } from "../../theme/authTheme";
import { styles } from "../../styles/components/AuthTextField.styles";

const AuthTextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  iconName = "person-outline",
  error = "",
  editable = true,
  keyboardType = "default",
  autoCapitalize = "none",
  secureTextEntry = false,
  showToggle = false,
  visible = false,
  onToggleVisibility,
  onFocus,
  onBlur,
  focused = false,
}) => {
  const hasError = Boolean(error);
  const iconColor = hasError ? authColors.error : authColors.textSecondary;

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.wrapper,
          focused && styles.wrapperFocused,
          hasError && styles.wrapperError,
        ]}
      >
        <Ionicons
          name={iconName}
          size={18}
          color={iconColor}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={authColors.textSecondary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          editable={editable}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {showToggle ? (
          <TouchableOpacity
            style={styles.toggle}
            onPress={onToggleVisibility}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={visible ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={authColors.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default AuthTextField;
