import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {leftArrow} from '../assets';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../utilities/host';

const {height, width} = Dimensions.get('screen');

const RegisterScreen = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState({
    nama: '',
    username: '',
    email: '',
    role: 'helper',
  });

  const registerUser = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios({
        method: 'POST',
        url: host + '/users/register',
        data: value,
        headers: {token},
      });
      setModalVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'column', flex: 1}}>
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
              <Text style={styles.modalText}>Register User Sukses</Text>
              <View>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => handleCloseModal()}
                >
                  <Text style={styles.textStyle}>Done</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View>
          <View>
            <View
              style={{
                position: 'relative',
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 16,
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
                <Text
                  style={{fontWeight: '700', fontSize: 20, color: '#3AB4F2'}}
                >
                  Register User
                </Text>
              </View>
            </View>
          </View>
          <ScrollView>
            <View style={{marginHorizontal: 16, marginTop: 20}}>
              <Text style={{color: 'black'}}>nama</Text>
              <TextInput
                placeholder="nama"
                autoCapitalize="none"
                style={styles.inputSize}
                onChangeText={text => setValue({...value, nama: text})}
                value={value.nama}
              />
            </View>
            <View style={{marginHorizontal: 16, marginTop: 10}}>
              <Text style={{color: 'black'}}>Username</Text>
              <TextInput
                placeholder="username"
                autoCapitalize="none"
                style={styles.inputSize}
                onChangeText={text => setValue({...value, username: text})}
                value={value.username}
              />
            </View>
            <View style={{marginHorizontal: 16, marginTop: 10}}>
              <Text style={{color: 'black'}}>Email</Text>
              <TextInput
                placeholder="email"
                autoCapitalize="none"
                style={styles.inputSize}
                onChangeText={text => setValue({...value, email: text})}
                value={value.email}
              />
            </View>
          </ScrollView>
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity
            style={{
              width: width - 32,
              marginLeft: 16,
              height: 50,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'green',
            }}
            onPress={() => registerUser()}
          >
            <Text style={{fontSize: 20, fontWeight: '700', color: 'white'}}>
              Daftar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  inputSize: {
    width: width - 32,
    marginTop: 5,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    color: 'blue',
  },
  inputSizeText: {
    width: width - 32,
    marginTop: 5,
    height: 200,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    color: 'blue',
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
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
