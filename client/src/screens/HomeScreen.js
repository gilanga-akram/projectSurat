import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {findStuff, scan, logout} from '../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

import {AuthContext} from '../components/Context';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/id';
moment.locale('id');

const {width} = Dimensions.get('screen');

const Home = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [role, setRole] = useState();
  const [nama, setNama] = useState();

  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = async () => {
    try {
      const Role = await AsyncStorage.getItem('userRole');
      const Token = await AsyncStorage.getItem('userToken');
      const Nama = await AsyncStorage.getItem('userName');
      if (Role !== null) {
        setRole(Role);
        setNama(Nama);
      }
    } catch (e) {
      console.log('error');
    }
  };

  return (
    <SafeAreaView>
      <View style={{marginHorizontal: 16, marginTop: 20}}>
        <ScrollView>
          <TouchableOpacity style={{marginBottom: 30}}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 20,
                color: '#3AB4F2',
                fontStyle: 'italic',
              }}
            >
              Welcome Back,
            </Text>
            <Text style={{fontWeight: '700', fontSize: 30, color: '#3AB4F2'}}>
              {nama}
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {role === 'admin' ? (
              <>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    width: width - 32,
                    height: 120,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#3AB4F2',
                    marginTop: 20,
                    flexDirection: 'row',
                  }}
                  onPress={() => navigation.navigate('SearchUser')}
                >
                  <Image source={findStuff} style={{width: 100, height: 100}} />
                  <Text
                    style={{
                      color: '#3AB4F2',
                      fontSize: 30,
                      fontWeight: '700',
                      marginTop: 10,
                      marginLeft: 20,
                    }}
                  >
                    Menu User
                  </Text>
                </TouchableOpacity>
              </>
            ) : role === 'direktur_surat_masuk' || role === 'staff_surat_masuk' ? (
              <>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    width: width - 32,
                    height: 120,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#3AB4F2',
                    marginTop: 20,
                    flexDirection: 'row',
                  }}
                  onPress={() => navigation.navigate('Search')}
                >
                  <Image source={findStuff} style={{width: 100, height: 100}} />
                  <Text
                    style={{
                      color: '#3AB4F2',
                      fontSize: 25,
                      fontWeight: '700',
                      marginTop: 10,
                      marginLeft: 20,
                    }}
                  >
                    Surat Masuk
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    width: width - 32,
                    height: 120,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#3AB4F2',
                    marginTop: 20,
                    flexDirection: 'row',
                  }}
                  onPress={() => navigation.navigate('ChangePassword')}
                >
                  <Image source={scan} style={{width: 100, height: 100}} />
                  <Text
                    style={{
                      color: '#3AB4F2',
                      fontSize: 18,
                      fontWeight: '700',
                      marginTop: 10,
                      marginLeft: 20,
                    }}
                  >
                    Change Password
                  </Text>
                </TouchableOpacity>
              </>
            ) : role === 'direktur_surat_keluar' || role === 'staff_surat_keluar' ? (
              <>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    width: width - 32,
                    height: 120,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#3AB4F2',
                    marginTop: 20,
                    flexDirection: 'row',
                  }}
                  onPress={() => navigation.navigate('Search')}
                >
                  <Image source={findStuff} style={{width: 100, height: 100}} />
                  <Text
                    style={{
                      color: '#3AB4F2',
                      fontSize: 25,
                      fontWeight: '700',
                      marginTop: 10,
                      marginLeft: 20,
                    }}
                  >
                    Surat Keluar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    width: width - 32,
                    height: 120,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#3AB4F2',
                    marginTop: 20,
                    flexDirection: 'row',
                  }}
                  onPress={() => navigation.navigate('ChangePassword')}
                >
                  <Image source={scan} style={{width: 100, height: 100}} />
                  <Text
                    style={{
                      color: '#3AB4F2',
                      fontSize: 18,
                      fontWeight: '700',
                      marginTop: 10,
                      marginLeft: 20,
                    }}
                  >
                    Change Password
                  </Text>
                </TouchableOpacity>
              </>
            ) : <></>}
            <TouchableOpacity
              style={{
                alignItems: 'center',
                width: width - 32,
                height: 120,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: '#3AB4F2',
                marginTop: 20,
                flexDirection: 'row',
              }}
              onPress={() => signOut()}
            >
              <Image source={logout} style={{width: 100, height: 100}} />
              <Text
                style={{
                  color: '#3AB4F2',
                  fontSize: 30,
                  fontWeight: '700',
                  marginTop: 10,
                  marginLeft: 20,
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
