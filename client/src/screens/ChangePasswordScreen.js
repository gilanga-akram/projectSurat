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
  
  const ChangePasswordScreen = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleError, setModalVisibleError] = useState(false);
    const [value, setValue] = useState({
      oldPassword: '',
      newPassword: '',
    });
  
    const ChangePasswordApi = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        await axios({
          method: 'PUT',
          url: host + '/users/change-password',
          data: value,
          headers: {token},
        });
        setModalVisible(true);
      } catch (error) {
        if (error?.response?.status >= 400) {
            setModalVisibleError(true);
        }
        console.log(error);
      }
    };
  
    const handleCloseModal = () => {
      setModalVisible(false);
      navigation.navigate('Home');
    };

    const handleCloseModalError = () => {
        setModalVisibleError(false);
      }
  
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flexDirection: 'column', flex: 1}}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleError}
            onRequestClose={() => {
            handleCloseModalError();
            }}
        >
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Password Salah</Text>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => handleCloseModalError()}
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
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Change Password Sukses</Text>
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
                    Change Password
                  </Text>
                </View>
              </View>
            </View>
            <ScrollView>
              <View style={{marginHorizontal: 16, marginTop: 20}}>
                <Text style={{color: 'black'}}>Password Lama</Text>
                <TextInput
                  placeholder="password lama"
                  autoCapitalize="none"
                  style={styles.inputSize}
                  onChangeText={text => setValue({...value, oldPassword: text})}
                  value={value.oldPassword}
                  secureTextEntry={true}
                />
              </View>
              <View style={{marginHorizontal: 16, marginTop: 10}}>
                <Text style={{color: 'black'}}>Password Baru</Text>
                <TextInput
                  placeholder="password baru"
                  autoCapitalize="none"
                  style={styles.inputSize}
                  onChangeText={text => setValue({...value, newPassword: text})}
                  value={value.newPassword}
                  secureTextEntry={true}
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
              onPress={() => ChangePasswordApi()}
            >
              <Text style={{fontSize: 20, fontWeight: '700', color: 'white'}}>
                Change Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  };
  
  export default ChangePasswordScreen;
  
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
      color: 'black'
    },
  });
  