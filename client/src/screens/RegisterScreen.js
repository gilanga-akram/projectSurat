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
import React, {useState,useRef} from 'react';
import {leftArrow} from '../assets';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import host from '../utilities/host';
import SelectDropdown from 'react-native-select-dropdown';
import { toTitleCase, titleToSnakeCase } from '../utilities/snakeCaseToTitleCase';

const {height, width} = Dimensions.get('screen');

const RegisterScreen = ({navigation, route}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState({
    fullname: '',
    username: '',
    jabatan: 'direktur_surat_masuk',
  });
  const dropdownRefTipe = useRef({});
  const [jabatanDropdown, setJabatanDropdown] = useState(route.params.dropdownList);
  const [jabatan, setJabatan] = useState('');
 
  const registerUser = async () => {
    try {
      let newJabatan = ''
      if (jabatan === 'Direktur UPT Labkesda') {
        newJabatan = 'direktur_surat_masuk'
      } else if (jabatan === 'Kepala Subbag Tata Usaha') {
        newJabatan = 'direktur_surat_keluar'
      } else if (jabatan === 'Administrasi Umum') {
        newJabatan = 'staff_surat_masuk'
      } else if (jabatan === 'Staff') {
        newJabatan = 'staff_surat_keluar'
      } else {
        console.log('isi jabatan');
        return;
      }
      const body = {
        ...value, 
        jabatan: newJabatan
      }
      
      const token = await AsyncStorage.getItem('userToken');
      await axios({
        method: 'POST',
        url: host + '/users/register',
        data: body,
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
              <Text style={{color: 'black'}}>Fullname</Text>
              <TextInput
                placeholder="fullname"
                autoCapitalize="none"
                style={styles.inputSize}
                onChangeText={text => setValue({...value, fullname: text})}
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
              <Text style={{color: 'black'}}>Jabatan</Text>
              <SelectDropdown
                ref={dropdownRefTipe}
                defaultValueByIndex={0}
                data={jabatanDropdown}
                onSelect={(selectedItem) => {
                  setJabatan(selectedItem);
                }}
                buttonStyle={{ width: 330 }}
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
