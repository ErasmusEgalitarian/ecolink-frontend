import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Picker, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import api from '../api';
import { Ionicons } from '@expo/vector-icons';

const AdminRoleScreen = ({ navigation }) => {

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErro(null);

      const response_users = await api.get('/users');
      setUsers(response_users.data);

    } catch (error) {
      setErro('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setErro(null);
      
      const response_roles = await api.get('/roles');
      setRoles(response_roles.data);

    } catch (error) {
      setErro('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setSelectedRoleId(user.roleId._id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedRoleId(roles[0]._id);
    setModalVisible(false);
  };

  const saveRole = async () => {
    const selectedRole = roles.find(r => r._id === selectedRoleId);

    try {
      await api.put(`/roles/edit/${selectedUser._id}`, {
        roleId: selectedRole._id
      });
      fetchData();
    } catch (error) {
      console.error('Failed to update role:', error);
      const message = error.response?.data?.error || 'Failed to update role';
      setErro(message);
    } finally {
      closeModal();
    }
  };

  const renderItem = ({ item: user }) => (
  <View style={styles.card}>
    <View style={styles.cardLeft}>
      <Text style={styles.cardText}>{user.username}</Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleBadgeText}>{user.roleId.name}</Text>
      </View>
    </View>
    <TouchableOpacity onPress={() => openModal(user)}>
        <Ionicons size={24} color="#007bff" name="create-outline" />
    </TouchableOpacity>
  </View>
);

  return (
    <View style={styles.parent} >

      {erro && (
        <Text style={styles.errorText}>{erro}</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
        />
      )}

      {/* edit user role modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Level</Text>
            <Text style={styles.modalSubtitle}>User: {selectedUser?.username}</Text>
            <Picker
              selectedValue={selectedRoleId ?? ''}
              onValueChange={(itemValue) => setSelectedRoleId(itemValue)}
              style={styles.picker}
            >
              {roles.map((role) => (
                <Picker.Item key={role._id} label={role.name} value={role._id} />
              ))}
            </Picker>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={closeModal} />
              <Button title="Save" onPress={saveRole} />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 12,
  },
  errorText: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    color: 'red',
    fontSize: 16,
  },
    roleBadge: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
})
export default AdminRoleScreen;
