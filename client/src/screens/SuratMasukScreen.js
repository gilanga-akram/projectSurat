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
import RenderHtml from 'react-native-render-html';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import SelectDropdown from 'react-native-select-dropdown';

const { width } = Dimensions.get('screen');

const SuratMasukScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleSetujuiSurat, setModalVisibleSetujuiSurat] = useState(false);
  const [modalVisibleConfirmationDeleteSurat, setModalVisibleConfirmationDeleteSurat] = useState(false);
  const [modalVisibleMenolakSurat, setModalVisibleMenolakSurat] = useState(false);
  const [dataSuratSingle, setDataSuratSingle] = useState('');
  const [suratModal, setSuratModal] = useState({});
  const [suratId, setSuratId] = useState(0);
  const [role, setRole] = useState();
  const [tableHead, setTableHead] = useState(['Tanggal Surat', 'Tipe Surat', 'Name Pengirim', 'Nama Penerima', 'Status Surat', 'Sifat Surat', 'Action']);
  const [tableData, setTableData] = useState([]);
  const [widthArr, setWidthArr] = useState([150, 150, 150, 150, 150, 150, 150]);
  const [tipeSuratDropdown, setTipeSuratDropdown] = useState(['Magang', 'Cuti', 'Cek Lab', 'Kerjasama']);
  const [tipeSurat, setTipeSurat] = useState('');
  const [statusSuratDropdown, setStatusSuratDropdown] = useState(['Dibuat', 'Disetujui', 'Ditolak']);
  const [statusSurat, setStatusSurat] = useState('');
  const [sifatSuratDropdown, setSifatSuratDropdown] = useState(['Penting', 'Tidak Penting']);
  const [sifatSurat, setSifatSurat] = useState('');
  const dropdownRefTipe = useRef({});
  const dropdownRefStatus = useRef({});
  const dropdownRefSifat = useRef({});

  useEffect(() => {
    handleApi();
    setTokenData();
    dropdownRefTipe.current.reset();
    dropdownRefStatus.current.reset();
    dropdownRefSifat.current.reset();
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
        url: `${host}/surat/all`,
        headers: { token },
      });
      renderTableData(data);
    } catch (error) {
      console.log(error);
    }
  }

  const renderTableData = (data) => {
    const dataTemp = data.allDataSurat.map((data) => {
      return [
        data.tanggal_surat,
        toTitleCase(data.tipe_template_surat),
        data.nama_pengirim,
        data.nama_penerima,
        toTitleCase(data.status_surat),
        data.is_important ? 'Penting' : 'Tidak Penting',
        <TouchableOpacity onPress={() => handleModal(data)}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Detail</Text>
          </View>
        </TouchableOpacity>
      ];
    });
    setTableData(dataTemp);
  }

  const handleApiSuratSingle = async (suratId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const { data } = await axios({
        method: 'GET',
        url: `${host}/surat/single/${suratId}`,
        headers: { token },
      });
      setDataSuratSingle(data.isiSurat);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = async () => {
    try {
      let search = [];
      if (tipeSurat) search.push(`tipe_template_surat=${tipeSurat}`);
      if (statusSurat) search.push(`status_surat=${statusSurat}`);
      if (sifatSurat) search.push(`is_important=${sifatSurat}`);
      if (search.length) search = search.join('&');
      else search = '';
      const token = await AsyncStorage.getItem('userToken');
      const { data } = await axios({
        method: 'GET',
        url: `${host}/surat/all?${search}`,
        headers: { token },
      });
      renderTableData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchReset = async () => {
    dropdownRefTipe.current.reset();
    dropdownRefStatus.current.reset();
    dropdownRefSifat.current.reset();
    handleApi();
  };

  const handleModal = async surat => {
    await handleApiSuratSingle(surat.surat_id);
    setSuratModal(surat);
    setModalVisible(true)
    setSuratId(surat.surat_id);
  };

  const handleConfirmationDeleteSurat = async () => {
    try {
      await setModalVisible(false)
      setModalVisibleConfirmationDeleteSurat(false);
      setModalVisibleMenolakSurat(false);
      const token = await AsyncStorage.getItem('userToken');
      await axios({
        method: 'DELETE',
        url: `${host}/surat/delete/${suratId}`,
        headers: { token },
      });
      handleApi();
      
    } catch (error) {
      console.log(error)
    }
  }



  const handleChangeStatusConfirmation = async (statusSurat) => {
    try {
      await setModalVisible(false)
      setModalVisibleConfirmationDeleteSurat(false);
      setModalVisibleMenolakSurat(false);
      setModalVisibleSetujuiSurat(false);
      const token = await AsyncStorage.getItem('userToken');
      await axios({
        method: 'PUT',
        url: `${host}/surat/change-status/${suratId}`,
        headers: { token },
        data: {
          status_surat: statusSurat,
        }
      });
      handleApi();
      
    } catch (error) {
      console.log(error)
    }
  };

  const handleModalConfirmation = (tipe) => {
    setModalVisible(false);
    if (tipe === 'deleteSurat') {
      setModalVisibleConfirmationDeleteSurat(true);
    } else if (tipe === 'tolakSurat') {
      setModalVisibleMenolakSurat(true);
    } else if (tipe === 'setujuiSurat') {
      setModalVisibleSetujuiSurat(true);
    }
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setModalVisibleConfirmationDeleteSurat(false);
    setModalVisibleMenolakSurat(false);
    setModalVisibleSetujuiSurat(false);
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ marginLeft: 16 }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleSetujuiSurat}
          onRequestClose={() => {
            setModalVisibleSetujuiSurat(false);
          }}
        >
          <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Apakah Anda Yakin Ingin Menyutujui Surat?</Text>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    style={[styles.button, styles.confimButton]}
                    onPress={() => handleChangeStatusConfirmation('disetujui')}
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
            visible={modalVisibleMenolakSurat}
            onRequestClose={() => {
              setModalVisibleMenolakSurat(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Apakah Anda Yakin Ingin Menolak Surat?</Text>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    style={[styles.button, styles.confimButton]}
                    onPress={() => handleChangeStatusConfirmation('ditolak')}
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
            visible={modalVisibleConfirmationDeleteSurat}
            onRequestClose={() => {
              setModalVisibleConfirmationDeleteSurat(false);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Apakah Anda Yakin Ingin Delete Surat?</Text>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    style={[styles.button, styles.confimButton]}
                    onPress={() => handleConfirmationDeleteSurat()}
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
                <ScrollView>
                  <Text style={styles.modalText}>Tanggal Surat: </Text>
                  <Text style={{...styles.modalText, fontWeight: 'bold'}}>{suratModal?.tanggal_surat} </Text>
                  <Text style={styles.modalText}>Status Surat: </Text>
                  <Text style={{...styles.modalText, fontWeight: 'bold'}}>{toTitleCase(suratModal.status_surat)} </Text>
                  <Text style={styles.modalText}>Tipe Surat: </Text>
                  <Text style={{...styles.modalText, fontWeight: 'bold'}}>{toTitleCase(suratModal.tipe_template_surat)} </Text>
                  <Text style={styles.modalText}>Sifat Surat: </Text>
                  <Text style={{...styles.modalText, fontWeight: 'bold'}}>{toTitleCase(suratModal.is_important ? 'Penting' : 'Tidak Penting')} </Text>
                  <Text style={styles.modalText}>Nama Pengirim:  </Text>
                  <Text style={{...styles.modalText, fontWeight: 'bold'}}>{suratModal?.nama_pengirim} </Text>
                  <Text style={styles.modalText}>Nama Penerima:  </Text>
                  <Text style={{...styles.modalText, fontWeight: 'bold'}}>{suratModal?.nama_penerima} </Text>
                  <Text style={styles.modalText}>Isi Surat:</Text>
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: dataSuratSingle }}
                  />
                  <Text style={styles.modalText}>Action Surat:</Text>
                  {
                    suratModal.status_surat !== 'dibuat' ? <></> : 
                    <View style={{flexDirection: 'row', marginTop: 15}}>
                      <Pressable
                        style={[styles.button, styles.buttonClose, { backgroundColor: 'red', }]}
                        onPress={() => handleModalConfirmation('deleteSurat')}
                      >
                        <Text style={styles.textStyle}>Delete Surat</Text>
                      </Pressable>
                    </View>
                  }
                  {
                    (role === 'direktur_surat_masuk' || role === 'direktur_surat_keluar') && suratModal.status_surat !== 'dibuat' ? <></> : 
                    <>
                      <View style={{flexDirection: 'row', marginTop: 15}}>
                        <Pressable
                          style={[styles.button, styles.buttonClose, { backgroundColor: 'green', }]}
                          onPress={() => handleModalConfirmation('setujuiSurat')}
                        >
                          <Text style={styles.textStyle}>Setujui</Text>
                        </Pressable>
                      </View>
                      <View style={{flexDirection: 'row', marginTop: 15}}>
                        <Pressable
                          style={[styles.button, styles.buttonClose, { backgroundColor: 'orange', }]}
                          onPress={() => handleModalConfirmation('tolakSurat')}
                        >
                          <Text style={styles.textStyle}>Tolak</Text>
                        </Pressable>
                      </View>
                    </>
                  }
                  <View style={{flexDirection: 'row', marginTop: 15}}>
                    <Pressable
                      style={[styles.button, styles.buttonClose, { backgroundColor: 'blue', }]}
                      onPress={() => handleCloseModal()}
                    >
                      <Text style={styles.textStyle}>Cancel</Text>
                    </Pressable>
                  </View>
                </ScrollView>
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
                Menu List Surat
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'black', fontWeight: 'bold' }}>Tipe Surat:</Text>
            <SelectDropdown
              ref={dropdownRefTipe}
              defaultValueByIndex={0}
              data={tipeSuratDropdown}
              onSelect={(selectedItem) => {
                setTipeSurat(titleToSnakeCase(selectedItem));
              }}
            />
            <Text style={{ color: 'black', fontWeight: 'bold' }}>Status Surat:</Text>
            <SelectDropdown
              ref={dropdownRefStatus}
              defaultValueByIndex={0}
              data={statusSuratDropdown}
              onSelect={(selectedItem) => {
                setStatusSurat(titleToSnakeCase(selectedItem));
              }}
            />
            <Text style={{ color: 'black', fontWeight: 'bold' }}>Sifat Surat:</Text>
            <SelectDropdown
              ref={dropdownRefSifat}
              defaultValueByIndex={0}
              data={sifatSuratDropdown}
              onSelect={(selectedItem) => {
                if (selectedItem === 'Penting') {
                  setSifatSurat(true);
                } else {
                  setSifatSurat(false);
                }
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.bottonSize}
            onPress={() => handleSearch()}
          >
            <Text style={styles.textButton}>Cari</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.bottonSize, backgroundColor: 'red'}}
            onPress={() => handleSearchReset()}
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

export default SuratMasukScreen;

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
