import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { leftArrow } from '../assets';
import axios from 'axios';
import host from '../utilities/host';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatSnakeCaseToTitleCase } from '../utilities/snakeCaseToTitleCase';

const { width } = Dimensions.get('screen');

const SearchScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleEditUser, setModalVisibleEditUser] = useState(false);
  const [modalVisibleConfirmationDeleteUser, setModalVisibleConfirmationDeleteUser] = useState(false);
  const [modalVisibleConfimationResetPassword, setModalVisibleConfimationResetPassword] = useState(false);
  const [searchItem, setSearchItem] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [dataUser, setDataUser] = useState([]);
  const [userModal, setUserModal] = useState({});
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    handleApi();
  }, []);

  const handleApi = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const { data } = await axios({
        method: 'GET',
        url: `${host}/users/list`,
        headers: { token },
      });
      setDataUser(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const { data } = await axios({
        method: 'GET',
        url: `${host}/users/list?search=${searchItem}`,
        headers: { token },
      });
      setDataUser(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModal = user => {
    setUserModal(user);
    setModalVisible(true)
    setUserId(user.user_id);
    setNamaLengkap(user.fullname);

  };

  const handleConfirmationDeleteUser = async () => {
    try {
      await setModalVisible(false)
      setModalVisibleConfirmationDeleteUser(false);
      setModalVisibleConfimationResetPassword(false);
      const token = await AsyncStorage.getItem('userToken');
      await axios({
        method: 'DELETE',
        url: `${host}/users/delete/${userId}`,
        headers: { token },
      });
      searchItem ? handleSearch() : handleApi();
      
    } catch (error) {
      console.log(error)
    }
  }



  const handleResetPasswordConfirmation = async () => {
    try {
      await setModalVisible(false)
      setModalVisibleConfirmationDeleteUser(false);
      setModalVisibleConfimationResetPassword(false);
      const token = await AsyncStorage.getItem('userToken');
      await axios({
        method: 'PUT',
        url: `${host}/users/reset-password/${userId}`,
        headers: { token },
      });
      searchItem ? handleSearch() : handleApi();
      
    } catch (error) {
      console.log(error)
    }
  };

  const handleEditUser = async () => {
    try {
      await setModalVisible(false)
      setModalVisibleConfirmationDeleteUser(false);
      setModalVisibleConfimationResetPassword(false);
      setModalVisibleEditUser(false);
      const token = await AsyncStorage.getItem('userToken');
      await axios({
        method: 'PUT',
        url: `${host}/users/edit/${userId}`,
        headers: { token },
        data: {
          fullname: namaLengkap,
        }
      });
      searchItem ? handleSearch() : handleApi();
      
    } catch (error) {
      console.log(error)
    }
  };

  const handleModalConfirmation = (tipe) => {
    setModalVisible(false);
    if (tipe === 'deleteUser') {
      setModalVisibleConfirmationDeleteUser(true);
    } else if (tipe === 'resetPassword') {
      setModalVisibleConfimationResetPassword(true);
    } else if (tipe === 'editUser') {
      setModalVisibleEditUser(true);
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setModalVisibleConfirmationDeleteUser(false);
    setModalVisibleConfimationResetPassword(false);
    setModalVisibleEditUser(false);
  }

  const handleTable = () => {
    return dataUser.map((user) => {
      return (
        <View style={{ marginBottom: 10 }} key={user.user_id}>
          <View style={{ flexDirection: 'row' }} key={user.user_id}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'black' }}>{user.fullname}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 20, }}>
              <Text style={{ color: 'black' }}>{formatSnakeCaseToTitleCase(user.jabatan)}</Text>
            </View>
            <View
              style={{
                marginLeft: 15,
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-evenly',
              }}
            >
              <TouchableOpacity
                style={{ backgroundColor: 'blue', borderRadius: 5, margin: 5, width: 60 }}
                onPress={() => handleModal(user)}
              >
                <Text style={{ padding: 5, color: 'white', fontWeight: 'bold' }}>Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>
      )
    })
  }

  return (
    <SafeAreaView>
      <View style={{ marginLeft: 16 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleEditUser}
        onRequestClose={() => {
          setModalVisibleEditUser(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit User</Text>
            <Text style={styles.modalText}>Nama Lengkap: </Text>
            <TextInput
              placeholder="Nama Lengkap"
              autoCapitalize="none"
              style={styles.inputSizeEditUser}
              onChangeText={text => setNamaLengkap(text)}
              value={namaLengkap}
            />
            <View style={{flexDirection: 'row'}}>
              <Pressable
                style={[styles.button, styles.confimButton]}
                onPress={() => handleEditUser()}
              >
                <Text style={styles.textStyle}>Confirm</Text>
              </Pressable>
              <Pressable
                style={[styles.button, { backgroundColor: 'orange', }]}
                onPress={() => handleCloseModal()}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleConfimationResetPassword}
          onRequestClose={() => {
            setModalVisibleConfimationResetPassword(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Apakah Anda Yakin Ingin Reset Password User?</Text>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[styles.button, styles.confimButton]}
                  onPress={() => handleResetPasswordConfirmation()}
                >
                  <Text style={styles.textStyle}>Ya</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, { backgroundColor: 'orange', }]}
                  onPress={() => handleCloseModal()}
                >
                  <Text style={styles.textStyle}>Tidak</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleConfirmationDeleteUser}
          onRequestClose={() => {
            setModalVisibleConfirmationDeleteUser(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Apakah Anda Yakin Ingin Delete User?</Text>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={[styles.button, styles.confimButton]}
                  onPress={() => handleConfirmationDeleteUser()}
                >
                  <Text style={styles.textStyle}>Ya</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, { backgroundColor: 'orange', }]}
                  onPress={() => handleCloseModal()}
                >
                  <Text style={styles.textStyle}>Tidak</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Nama Lengkap: </Text>
              <Text style={{...styles.modalText, fontWeight: 'bold'}}>{userModal?.fullname} </Text>
              <Text style={styles.modalText}>Username: </Text>
              <Text style={{...styles.modalText, fontWeight: 'bold'}}>{userModal?.username} </Text>
              <Text style={styles.modalText}>Jabatan:  </Text>
              <Text style={{...styles.modalText, fontWeight: 'bold'}}>{userModal?.jabatan} </Text>
              <Text style={styles.modalText}>Action User:</Text>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Pressable
                  style={[styles.button, styles.buttonClose, { backgroundColor: 'red', }]}
                  onPress={() => handleModalConfirmation('deleteUser')}
                >
                  <Text style={styles.textStyle}>Delete User</Text>
                </Pressable>
              </View>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Pressable
                  style={[styles.button, styles.buttonClose, { backgroundColor: 'green', }]}
                  onPress={() => handleModalConfirmation('editUser')}
                >
                  <Text style={styles.textStyle}>Edit User</Text>
                </Pressable>
              </View>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Pressable
                  style={[styles.button, styles.buttonClose, { backgroundColor: 'orange', }]}
                  onPress={() => handleModalConfirmation('resetPassword')}
                >
                  <Text style={styles.textStyle}>Reset Password</Text>
                </Pressable>
              </View>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <Pressable
                  style={[styles.button, styles.buttonClose, { backgroundColor: 'blue', }]}
                  onPress={() => handleCloseModal()}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              left: 16,
            }}
            onPress={() => navigation.goBack()}
          >
            <Image source={leftArrow} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontWeight: '700', fontSize: 20, color: '#3AB4F2' }}>
              Menu List User
            </Text>
          </View>
        </View>

        <TextInput
          placeholder="Nama User"
          autoCapitalize="none"
          style={styles.inputSize}
          onChangeText={text => setSearchItem(text)}
          value={searchItem}
        />
        <TouchableOpacity
          style={styles.bottonSize}
          onPress={() => handleSearch()}
        >
          <Text style={styles.textButton}>Cari</Text>
        </TouchableOpacity>
        <View>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            <View style={{ flex: 1, marginLeft: 20 }}>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>Nama</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 20 }}>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>Jabatan</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={{ fontWeight: 'bold', color: 'black' }}>Action</Text>
            </View>
          </View>
          <View style={{marginHorizontal: 16, marginTop: 20, height:400}}>
            <ScrollView>
              {dataUser.length > 0 ? handleTable() : <></>}
            </ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  inputSize: {
    width: width - 36,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 50,
    color: 'blue',
  },
  inputSizeEditUser: {
    width: width - 100,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'grey',
    paddingLeft: 20,
    paddingRight: 50,
    color: 'black',
  },
  bottonSize: {
    width: width - 36,
    height: 50,
    borderRadius: 10,
    marginBottom: 30,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: width - 50,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
    width: 100
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  confimButton: {
    backgroundColor: 'green',
  },
  buttonClose: {
    backgroundColor: 'red',
    width: 223
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black'
  },
});
