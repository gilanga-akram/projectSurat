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
  
  const BuatSuratScreen = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibleError, setModalVisibleError] = useState(false);
    const [suratModal, setSuratModal] = useState({});
    const [role, setRole] = useState();
    const [tipeSuratDropdown, setTipeSuratDropdown] = useState(route.params.dropdownList);
    const [tipeSurat, setTipeSurat] = useState('');
    const [isImportantDropdown, setIsImportantDropdown] = useState(['Tidak', 'Iya']);
    const [isImportant, setIsImportant] = useState('');
    const dropdownRefTipe = useRef({});
    const dropdownRefIsImportant = useRef({});
    const [loading, setLoading] = useState(false);
    const [errMessage, setErrMessage] = useState('Error');
    const [value, setValue] = useState({
        nama_pengirim: '',
        jabatan_pengirim: '',
        alamat_pengirim: '',
        no_hp_pengirim: '',
        email_pengirim: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        nama_penerima: '',
        alamat_penerima: '',
        jabatan_penerima: '',
        alasan_cuti: '',
        nik_karyawan: '',
        tanggal_surat: '',
    });
    const [dataSuratSingle, setDataSuratSingle] = useState('');
  
    useEffect(() => {
      setTokenData();
      dropdownRefTipe.current.reset();
      dropdownRefIsImportant.current.reset();
    }, []);
  
    const setTokenData = async () => {
      const Role = await AsyncStorage.getItem('userRole');
      if (Role !== null) {
        setRole(Role);
      }
    }
  
    const handleReset = async () => {
        dropdownRefTipe.current.reset();
        dropdownRefIsImportant.current.reset();
        setTipeSurat('');
        setIsImportant('');
        setValue({
            nama_pengirim: '',
            jabatan_pengirim: '',
            alamat_pengirim: '',
            no_hp_pengirim: '',
            email_pengirim: '',
            tanggal_mulai: '',
            tanggal_selesai: '',
            nama_penerima: '',
            alamat_penerima: '',
            jabatan_penerima: '',
            alasan_cuti: '',
            nik_karyawan: '',
            tanggal_surat: '',
        })
    };

    const handleBuatSurat = async () => {
        try {
            setLoading(true);
            if (!isImportant) {
              setErrMessage('Surat Penting atau Tidak Wajib Diisi');
              setModalVisibleError(true);
              return 'handle modal error';
            }
            if (tipeSurat === 'magang') {
                if (!value.nama_pengirim,
                    !value.alamat_pengirim,
                    !value.no_hp_pengirim,
                    !value.email_pengirim,
                    !value.tanggal_mulai,
                    !value.tanggal_selesai,
                    !value.nama_penerima,
                    !value.alamat_penerima,
                    !value.tanggal_surat) {
                      setErrMessage('Isi Semua Data');
                      setModalVisibleError(true);
                      return;
                }
                const token = await AsyncStorage.getItem('userToken');
                const { data } = await axios({
                    method: 'POST',
                    url: `${host}/surat/show-surat`,
                    headers: { token },
                    data: {
                        tipe_surat: 'magang',
                        nama_pengirim: value.nama_pengirim,
                        alamat_pengirim: value.alamat_pengirim,
                        no_hp_pengirim: value.no_hp_pengirim,
                        email_pengirim: value.email_pengirim,
                        tanggal_mulai: value.tanggal_mulai,
                        tanggal_selesai: value.tanggal_selesai,
                        nama_penerima: value.nama_penerima,
                        alamat_penerima: value.alamat_penerima,
                        tanggal_surat: value.tanggal_surat,
                    },
                });
                setDataSuratSingle(data.isiSurat);
                setModalVisible(true);
            } else if (tipeSurat === 'cuti') {
                if (!value.nama_pengirim,
                    !value.jabatan_pengirim,
                    !value.alamat_pengirim,
                    !value.no_hp_pengirim,
                    !value.email_pengirim,
                    !value.tanggal_mulai,
                    !value.tanggal_selesai,
                    !value.nama_penerima,
                    !value.alamat_penerima,
                    !value.jabatan_penerima,
                    !value.alasan_cuti,
                    !value.nik_karyawan,
                    !value.tanggal_surat) {
                      setErrMessage('Isi Semua Data');
                      setModalVisibleError(true);
                      return;
                }
                const token = await AsyncStorage.getItem('userToken');
                const { data } = await axios({
                    method: 'POST',
                    url: `${host}/surat/show-surat`,
                    headers: { token },
                    data: {
                        tipe_surat: 'cuti',
                        nama_pengirim: value.nama_pengirim,
                        jabatan_pengirim: value.jabatan_pengirim,
                        alamat_pengirim: value.alamat_pengirim,
                        no_hp_pengirim: value.no_hp_pengirim,
                        email_pengirim: value.email_pengirim,
                        tanggal_mulai: value.tanggal_mulai,
                        tanggal_selesai: value.tanggal_selesai,
                        nama_penerima: value.nama_penerima,
                        alamat_penerima: value.alamat_penerima,
                        jabatan_penerima: value.jabatan_penerima,
                        alasan_cuti: value.alasan_cuti,
                        nik_karyawan: value.nik_karyawan,
                        tanggal_surat: value.tanggal_surat,
                    },
                });
                setDataSuratSingle(data.isiSurat);
                setModalVisible(true);
            }else if (tipeSurat === 'kerjasama' || tipeSurat === 'disposisi') {
              if (!value.nama_pengirim,
                  !value.jabatan_pengirim,
                  !value.alamat_pengirim,
                  !value.nama_penerima,
                  !value.alamat_penerima,
                  !value.jabatan_penerima,
                  !value.tanggal_surat) {
                    setErrMessage('Isi Semua Data');
                    setModalVisibleError(true);
                    return;
              }
              const token = await AsyncStorage.getItem('userToken');
              const { data } = await axios({
                  method: 'POST',
                  url: `${host}/surat/show-surat`,
                  headers: { token },
                  data: {
                      tipe_surat: tipeSurat === 'kerjasama' ? 'kerjasama' : 'ceklab',
                      nama_pengirim: value.nama_pengirim,
                      jabatan_pengirim: value.jabatan_pengirim,
                      alamat_pengirim: value.alamat_pengirim,
                      nama_penerima: value.nama_penerima,
                      alamat_penerima: value.alamat_penerima,
                      jabatan_penerima: value.jabatan_penerima,
                      tanggal_surat: value.tanggal_surat,
                  },
              });
              setDataSuratSingle(data.isiSurat);
              setModalVisible(true);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleCloseModal = () => {
        setModalVisible(false)
        setModalVisibleError(false)
        setErrMessage('Error');
    }

    const handleCreateAPI = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        await axios({
            method: 'POST',
            url: `${host}/surat/create`,
            headers: { token },
            data: {
                tipe_template_surat: tipeSurat === 'disposisi' ? 'ceklab' : tipeSurat,
                nama_pengirim: value.nama_pengirim,
                jabatan_pengirim: value.jabatan_pengirim,
                alamat_pengirim: value.alamat_pengirim,
                no_hp_pengirim: value.no_hp_pengirim,
                email_pengirim: value.email_pengirim,
                tanggal_mulai: value.tanggal_mulai,
                tanggal_selesai: value.tanggal_selesai,
                nama_penerima: value.nama_penerima,
                alamat_penerima: value.alamat_penerima,
                jabatan_penerima: value.jabatan_penerima,
                alasan_cuti: value.alasan_cuti,
                nik_karyawan: value.nik_karyawan,
                tanggal_surat: value.tanggal_surat,
                is_important: isImportant === 'iya' ? true : false,
            },
        });
        setModalVisible(false);
        navigation.navigate('Home');
      } catch (err) {
        if (err.response) {
          if (err.response.data.msg === 'Jatah Cuti Sudah Habis') {
            console.log('masukk');
            setErrMessage(err.response.data.msg);
            setModalVisible(false);
            setModalVisibleError(true);
          }
        }
      }
    }
  
    return (
      <SafeAreaView>
        <ScrollView>
          <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleError}
                onRequestClose={() => {
                    setModalVisibleError(false);
                }}
            >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                      <ScrollView>
                        <Text style={styles.modalText}>{errMessage}</Text>
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                          <Pressable
                            style={{
                              borderRadius: 10,
                              padding: 10,
                              elevation: 2,
                              marginHorizontal: 10,
                              width: 223,
                              backgroundColor: 'blue'
                            }}
                            onPress={() => handleCloseModal()}
                          >
                          <Text style={styles.textStyle}>Close</Text>
                          </Pressable>
                      </View>
                      </ScrollView>
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
                    <RenderHtml
                        contentWidth={width}
                        source={{ html: dataSuratSingle }}
                    />
                    <Text style={styles.modalText}>Action Surat:</Text>
                    <View style={{flexDirection: 'row', marginTop: 15}}>
                        <Pressable
                            style={[styles.button, styles.buttonClose, { backgroundColor: 'green', }]}
                            onPress={() => handleCreateAPI()}
                        >
                            <Text style={styles.textStyle}>Buat Surat</Text>
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
                    </ScrollView>
                </View>
                </View>
            </Modal>
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
                  Buat Surat { role === 'staff_surat_masuk' ? 'Masuk' : 'Keluar' }
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
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Apakah Surat Termasuk Penting?:</Text>
              <SelectDropdown
                ref={dropdownRefIsImportant}
                defaultValueByIndex={0}
                data={isImportantDropdown}
                onSelect={(selectedItem) => {
                  setIsImportant(titleToSnakeCase(selectedItem));
                }}
              />
            </View>
            <TouchableOpacity
              style={{...styles.bottonSize, backgroundColor: 'red'}}
              onPress={() => handleReset()}
            >
              <Text style={styles.textButton}>Reset</Text>
            </TouchableOpacity>
            <ScrollView>
                {/* CODE DISINI */}
                {
                tipeSurat === 'magang' ?
                    <View style={{marginHorizontal: 16, marginTop: 20}}>
                        <Text style={{color: 'black'}}>Nama Pengirim</Text>
                        <TextInput
                        placeholder="Nama Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, nama_pengirim: text})}
                        value={value.nama_pengirim}
                        />
                        <Text style={{color: 'black'}}>Alamat Pengirim</Text>
                        <TextInput
                        placeholder="Alamat Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, alamat_pengirim: text})}
                        value={value.alamat_pengirim}
                        />
                        <Text style={{color: 'black'}}>No HP Pengirim</Text>
                        <TextInput
                        placeholder="No HP Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, no_hp_pengirim: text})}
                        value={value.no_hp_pengirim}
                        />
                        <Text style={{color: 'black'}}>Email Pengirim</Text>
                        <TextInput
                        placeholder="Email Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, email_pengirim: text})}
                        value={value.email_pengirim}
                        />
                        <Text style={{color: 'black'}}>Tanggal Mulai</Text>
                        <TextInput
                        placeholder="Tanggal Mulai"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, tanggal_mulai: text})}
                        value={value.tanggal_mulai}
                        />
                        <Text style={{color: 'black'}}>Tanggal Selesai</Text>
                        <TextInput
                        placeholder="Tanggal Selesai"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, tanggal_selesai: text})}
                        value={value.tanggal_selesai}
                        />
                        <Text style={{color: 'black'}}>Nama Penerima</Text>
                        <TextInput
                        placeholder="Nama Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, nama_penerima: text})}
                        value={value.nama_penerima}
                        />
                        <Text style={{color: 'black'}}>Alamat Penerima</Text>
                        <TextInput
                        placeholder="Alamat Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, alamat_penerima: text})}
                        value={value.alamat_penerima}
                        />
                        <Text style={{color: 'black'}}>Tanggal Surat</Text>
                        <TextInput
                        placeholder="Tanggal Surat"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, tanggal_surat: text})}
                        value={value.tanggal_surat}
                        />
                    </View>
                : tipeSurat === 'cuti' ? 
                    <View style={{marginHorizontal: 16, marginTop: 20}}>
                        <Text style={{color: 'black'}}>Nama Pengirim</Text>
                        <TextInput
                        placeholder="Nama Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, nama_pengirim: text})}
                        value={value.nama_pengirim}
                        />
                        <Text style={{color: 'black'}}>Jabatan Pengirim</Text>
                        <TextInput
                        placeholder="Jabatan Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, jabatan_pengirim: text})}
                        value={value.jabatan_pengirim}
                        />
                        <Text style={{color: 'black'}}>Alamat Pengirim</Text>
                        <TextInput
                        placeholder="Alamat Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, alamat_pengirim: text})}
                        value={value.alamat_pengirim}
                        />
                        <Text style={{color: 'black'}}>No HP Pengirim</Text>
                        <TextInput
                        placeholder="No HP Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, no_hp_pengirim: text})}
                        value={value.no_hp_pengirim}
                        />
                        <Text style={{color: 'black'}}>Email Pengirim</Text>
                        <TextInput
                        placeholder="Email Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, email_pengirim: text})}
                        value={value.email_pengirim}
                        />
                        <Text style={{color: 'black'}}>Tanggal Mulai</Text>
                        <TextInput
                        placeholder="Tanggal Mulai"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, tanggal_mulai: text})}
                        value={value.tanggal_mulai}
                        />
                        <Text style={{color: 'black'}}>Tanggal Selesai</Text>
                        <TextInput
                        placeholder="Tanggal Selesai"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, tanggal_selesai: text})}
                        value={value.tanggal_selesai}
                        />
                        <Text style={{color: 'black'}}>Nama Penerima</Text>
                        <TextInput
                        placeholder="Nama Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, nama_penerima: text})}
                        value={value.nama_penerima}
                        />
                        <Text style={{color: 'black'}}>Alamat Penerima</Text>
                        <TextInput
                        placeholder="Alamat Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, alamat_penerima: text})}
                        value={value.alamat_penerima}
                        />
                        <Text style={{color: 'black'}}>Jabatan Penerima</Text>
                        <TextInput
                        placeholder="Jabatan Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, jabatan_penerima: text})}
                        value={value.jabatan_penerima}
                        />
                        <Text style={{color: 'black'}}>Alasan Cuti</Text>
                        <TextInput
                        placeholder="Alasan Cuti"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, alasan_cuti: text})}
                        value={value.alasan_cuti}
                        />
                        <Text style={{color: 'black'}}>NIK Karyawan</Text>
                        <TextInput
                        placeholder="NIK Karyawan"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, nik_karyawan: text})}
                        value={value.nik_karyawan}
                        />
                        <Text style={{color: 'black'}}>Tanggal Surat</Text>
                        <TextInput
                        placeholder="Tanggal Surat"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, tanggal_surat: text})}
                        value={value.tanggal_surat}
                        />
                    </View>
                : tipeSurat === 'kerjasama' ? 
                    <View style={{marginHorizontal: 16, marginTop: 20}}>
                        <Text style={{color: 'black'}}>Nama Pengirim</Text>
                        <TextInput
                        placeholder="Nama Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, nama_pengirim: text})}
                        value={value.nama_pengirim}
                        />
                        <Text style={{color: 'black'}}>Jabatan Pengirim</Text>
                        <TextInput
                        placeholder="Jabatan Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, jabatan_pengirim: text})}
                        value={value.jabatan_pengirim}
                        />
                        <Text style={{color: 'black'}}>Alamat Pengirim</Text>
                        <TextInput
                        placeholder="Alamat Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, alamat_pengirim: text})}
                        value={value.alamat_pengirim}
                        />
                        <Text style={{color: 'black'}}>Nama Penerima</Text>
                        <TextInput
                        placeholder="Nama Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, nama_penerima: text})}
                        value={value.nama_penerima}
                        />
                        <Text style={{color: 'black'}}>Alamat Penerima</Text>
                        <TextInput
                        placeholder="Alamat Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, alamat_penerima: text})}
                        value={value.alamat_penerima}
                        />
                        <Text style={{color: 'black'}}>Jabatan Penerima</Text>
                        <TextInput
                        placeholder="Jabatan Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, jabatan_penerima: text})}
                        value={value.jabatan_penerima}
                        />
                        <Text style={{color: 'black'}}>Tanggal Surat</Text>
                        <TextInput
                        placeholder="Tanggal Surat"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, tanggal_surat: text})}
                        value={value.tanggal_surat}
                        />
                    </View>
                : tipeSurat === 'disposisi' ? 
                    <View style={{marginHorizontal: 16, marginTop: 20}}>
                        <Text style={{color: 'black'}}>Nama Pengirim</Text>
                        <TextInput
                        placeholder="Nama Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, nama_pengirim: text})}
                        value={value.nama_pengirim}
                        />
                        <Text style={{color: 'black'}}>Jabatan Pengirim</Text>
                        <TextInput
                        placeholder="Jabatan Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, jabatan_pengirim: text})}
                        value={value.jabatan_pengirim}
                        />
                        <Text style={{color: 'black'}}>Alamat Pengirim</Text>
                        <TextInput
                        placeholder="Alamat Pengirim"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, alamat_pengirim: text})}
                        value={value.alamat_pengirim}
                        />
                        <Text style={{color: 'black'}}>Nama Penerima</Text>
                        <TextInput
                        placeholder="Nama Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, nama_penerima: text})}
                        value={value.nama_penerima}
                        />
                        <Text style={{color: 'black'}}>Alamat Penerima</Text>
                        <TextInput
                        placeholder="Alamat Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, alamat_penerima: text})}
                        value={value.alamat_penerima}
                        />
                        <Text style={{color: 'black'}}>Jabatan Penerima</Text>
                        <TextInput
                        placeholder="Jabatan Penerima"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, jabatan_penerima: text})}
                        value={value.jabatan_penerima}
                        />
                        <Text style={{color: 'black'}}>Tanggal Surat</Text>
                        <TextInput
                        placeholder="Tanggal Surat"
                        autoCapitalize="none"
                        style={styles.inputSize}
                        onChangeText={text => setValue({...value, tanggal_surat: text})}
                        value={value.tanggal_surat}
                        />
                    </View>
                :
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Text style={{color: 'black'}}>Silahkan Pilih Tipe Surat</Text>
                    </View>
                }

                {
                    tipeSurat ?
                    loading ? 
                        <TouchableOpacity
                            style={{...styles.bottonSize, marginBottom: 50, backgroundColor: 'green'}}
                            onPress={() => {}}
                        >
                            <Text style={styles.textButton}>...</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity
                            style={{...styles.bottonSize, marginBottom: 50, backgroundColor: 'green'}}
                            onPress={() => handleBuatSurat()}
                        >
                            <Text style={styles.textButton}>Buat Surat</Text>
                        </TouchableOpacity> : <></>
                }
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default BuatSuratScreen;
  
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
      marginLeft: -20,
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
  