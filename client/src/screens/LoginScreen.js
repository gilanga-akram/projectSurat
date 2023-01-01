import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from 'react-native';
import React, {useState, useContext} from 'react';
import axios from 'axios';
import host from '../utilities/host';
import {AuthContext} from '../components/Context';

const {height, width} = Dimensions.get('screen');

const Login = ({navigation}) => {
  const [failed, setFailed] = useState(false);
  const [value, setValue] = useState({
    username: '',
    password: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [forgotPasswordUsername, setForgotPasswordUsername] = useState('');

  const {signIn} = useContext(AuthContext);

  const failLogin = () => {
    setFailed(true);
    setTimeout(() => {
      setFailed(false);
    }, 2000);
  };

  const loginHanddle = (username, password) => {
    axios({
      method: 'post',
      url: `${host}/users/login`,
      data: {
        username: username,
        password: password,
      },
    })
      .then(({data}) => {
        signIn(data.access_token, data.user_data.jabatan, data.user_data.fullname);
      })
      .catch(err => {
        failLogin();
        console.log(err);
      })
      .finally(() => {

      });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setForgotPasswordUsername('');
  }

  const handleForgotPassword = () => {
    setModalVisible(true);
  }
  
  const handleForgotApi = async () => {
    await axios({
      method: 'GET',
      url: `${host}/users/forgot-password/${forgotPasswordUsername}`,
    });
    setModalVisible(false);
    // axios
    setForgotPasswordUsername('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3AB4F2" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            handleCloseModal();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Masukan Username Anda:</Text>
              <View style={{flexDirection: 'column', alignItems: 'center', marginTop: 5}}>
                <TextInput
                  placeholder="Enter Your Username"
                  autoCapitalize="none"
                  style={styles.inputSizeForgot}
                  onChangeText={text => setForgotPasswordUsername(text)}
                  value={forgotPasswordUsername}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose, { backgroundColor: 'green', marginBottom: 10, marginTop: 20 }]}
                  onPress={() => handleForgotApi()}
                >
                  <Text style={styles.textStyle}>Submit</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => handleCloseModal()}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View style={{flex: 1, alignItems: 'center'}}>
          <View style={{flex: 1, marginTop: 100}}>
            <Text style={styles.title}>E-Office</Text>
            <Image
              style={styles.tinyLogo}
              source={require('../assets/employee.png')}
            />
          </View>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            {failed && (
              <View style={{marginBottom: 10}}>
                <Text style={{color: 'red'}}>Username atau Password salah</Text>
              </View>
            )}
            <TextInput
              placeholder="Enter Your Username"
              autoCapitalize="none"
              style={styles.inputSize}
              onChangeText={text => setValue({...value, username: text})}
              value={value.username}
            />
            <TextInput
              placeholder="Enter Your Password"
              autoCapitalize="none"
              secureTextEntry
              style={styles.inputSize}
              onChangeText={text => setValue({...value, password: text})}
              value={value.password}
            />
            <TouchableOpacity style={{ marginBottom: 10, alignItems: 'center' }} onPress={() => handleForgotPassword()}>
              <Text style={{ color: 'red', fontSize: 15, fontWeight: '700' }}>Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottonSize}
              onPress={() => loginHanddle(value.username, value.password)}
            >
              <Text style={styles.textButton}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3AB4F2',
  },
  title: {
    fontWeight: '700',
    fontSize: 25,
    color: 'red',
    textAlign: 'center',
    marginBottom: 50,
  },
  tinyLogo: {
    width: 350,
    height: 250,
    marginBottom: 50,
  },
  inputSize: {
    width: width - 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 50,
    color: 'blue',
  },
  inputSizeForgot: {
    width: width - 138,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: 'grey',
    paddingLeft: 20,
    paddingRight: 50,
    color: 'white',
  },
  bottonSize: {
    width: width - 50,
    height: 50,
    borderRadius: 10,
    // marginTop: 30,
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
