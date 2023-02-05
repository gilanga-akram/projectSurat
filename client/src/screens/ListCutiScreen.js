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
  import React, { useEffect, useState, useRef } from 'react';
  import { leftArrow } from '../assets';
  import axios from 'axios';
  import host from '../utilities/host';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { toTitleCase, titleToSnakeCase } from '../utilities/snakeCaseToTitleCase';
  import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
  
  const { width } = Dimensions.get('screen');
  
  const ListCutiScreen = ({ navigation }) => {
    const [role, setRole] = useState();
    const [tableHead, setTableHead] = useState(['Nama', 'NIK', 'Total Cuti', 'Sisa Cuti']);
    const [tableData, setTableData] = useState([]);
    const [widthArr, setWidthArr] = useState([150, 150, 150, 150]);
    const [searchItem, setSearchItem] = useState('');
  
    useEffect(() => {
      handleApi();
      setTokenData();
    }, []);
  
    const setTokenData = async () => {
      const Role = await AsyncStorage.getItem('userRole');
      if (Role !== null) {
        setRole(Role);
      }
    }
  
    const handleApi = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const { data } = await axios({
          method: 'GET',
          url: `${host}/users/list-cuti`,
          headers: { token },
        });
        renderTableData(data);
      } catch (error) {
        console.log(error);
      }
    }
  
    const renderTableData = (data) => {
      const dataTemp = data.map((data) => {
        return [
          data.nama_karyawan,
          data.nik_karyawan,
          data.jumlah_hari,
          10 - Number(data.jumlah_hari),
        ];
      });
      setTableData(dataTemp);
    }

    const handleSearch = async (reset) => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const { data } = await axios({
          method: 'GET',
          url: `${host}/users/list-cuti?nik=${reset ? '' : searchItem}`,
          headers: { token },
        });
        renderTableData(data);
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={{ marginLeft: 16 }}>
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
                  Menu List Cuti
                </Text>
              </View>
            </View>
            
            <TextInput
              placeholder="NIK Karyawan"
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
            <TouchableOpacity
              style={{...styles.bottonSize, backgroundColor: 'red'}}
              onPress={() => {
                setSearchItem('');
                handleSearch(true);
              }}
            >
              <Text style={styles.textButton}>Reset</Text>
            </TouchableOpacity>
            <ScrollView horizontal={true} >
              <View style={styles.container}>
                <Table borderStyle={{borderWidth: 4, borderColor: '#c8e1ff'}}>
                  <Row data={tableHead} style={styles.head} textStyle={{...styles.text, fontWeight: 'bold'}} widthArr={widthArr} />
                  <Rows data={tableData} textStyle={styles.text} widthArr={widthArr} />
                </Table>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default ListCutiScreen;
  
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 0, marginRight: 10, paddingTop: 30, backgroundColor: '#fff', marginBottom: 50 },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6, color: 'black', textAlign: 'center' },
    btn: { marginLeft: 25, width: 100, height: 25, backgroundColor: '#78B7BB',  borderRadius: 2 },
    btnText: { textAlign: 'center', color: 'black' },
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
      marginBottom: 5,
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
  