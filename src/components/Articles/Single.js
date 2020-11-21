import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import {
  Container, Content, Card, CardItem, Body, H3, Text, Form, Item, Label, Picker, View, Input, Icon, Button, Thumbnail
} from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import { Loading, Error, Spacer } from '../UI';
import { errorMessages } from '../../constants/messages';

const ArticlesSingle = ({
  error, loading, article, reFetch, 
  onFormSubmit, 
  defaultValues,
  dsLoaiSanPham, 
  onselectedLoaiSanPham, 
  onselectedloaiVatLieu, 
  loaiSanPham, 
  loaiVatLieu, 
  changeSPName, 
  uploadImage,
  images,
  dai,
  rong,
  cao,
  changeForm,
  tenSanPham,
  giaBan,
  uploading
}) => {
  if (error) {
    return <Error content={error} tryAgain={reFetch} />;
  }

  if (loading) {
    return <Loading content={loading} />;
  }

  if (Object.keys(article).length < 1) {
    return <Error content={errorMessages.articles404} />;
  }

  const { register, handleSubmit, errors, setValue, getValues } = useForm({ defaultValues });
  useEffect(() => {
    register({ name: 'id', value: article.id})
    register({ name: 'loaiSamPham', value: '158' });
    register({ name: 'loaiSamPhamName', value: 'Bàn' });
    register({ name: 'loaiVatLieu', value: 'Inox' });
    // register({ name: 'loaiVatLieuName' });
    // register({ name: 'loaiVatLieu' });
    register({ name: 'quyCach' });
    register({ name: 'tenSanPham' });
    register({ name: 'giaBan', value: article.regular_price });
    register({ name: 'dai', value: article.dimensions.length });
    register({ name: 'rong', value: article.dimensions.width });
    register({ name: 'cao', value: article.dimensions.height });
    register({ name: 'images'})
  }, [register]);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      // setImage(result.uri);
      setValue('images', result.uri);
      const data = {
        file: result.uri,
        title: 'test'
      }
      uploadImage(data)
    }
  };

  const selectedLoaiSanPham = (data, index) => {
    setValue("loaiSamPhamName", dsLoaiSanPham[index].name);
    setValue("loaiSamPham", data);
    onselectedLoaiSanPham(data);
  }
  const selectedLoaiVatLieu = (data, index) => {
    // setValue("loaiVatLieuName", data);
    setValue('loaiVatLieu', data);
    onselectedloaiVatLieu(data);
  }
  const nameRender = () => {
    const dai = getValues('dai') ? ` ${getValues('dai')}` : '';
    const rong = getValues('rong') ? `x${getValues('rong')}` : '';
    const cao = getValues('cao') ? `x${getValues('cao')}` : '';
    const name = `${getValues('loaiSamPhamName')} ${getValues('loaiVatLieu')}${dai}${rong}${cao}`;
    changeSPName(name);
    setValue('tenSanPham', name)
  }
  const onchangeForm = (name, value) => {
    setValue(name, value);
    changeForm(name, value);
  }

  return (
    <Container>
      <Content padder>
        {error && <Messages message={error} />}
        {loading && <Messages type="info" message="Loading..." />}
        <Form>
        <Item stackedLabel>
            <Label>Tên sản phẩm</Label>
            <Input
              type="text"
              autoCapitalize="none"
              keyboardType="default"
              onChangeText={(value) => onchangeForm('tenSanPham', value)}
              value={tenSanPham}
            />
          </Item>
          {/* <Item stackedLabel>
            <Label>Loại sản phẩm</Label>
            <Picker
              note
              mode="dropdown"
              style={{ width: "100%" }}
              onValueChange={selectedLoaiSanPham}
              selectedValue={loaiSanPham}
            >
              {dsLoaiSanPham.map((item, key) => (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
              ))}
            </Picker>
          </Item> */}
          {/* <Item stackedLabel>
            <Label>Loại vật liệu</Label>
            <Picker
              note
              mode="dropdown"
              style={{ width: "100%" }}
              onValueChange={selectedLoaiVatLieu}
              selectedValue={loaiVatLieu}
            >
              <Picker.Item label="Inox" value="Inox" />
              <Picker.Item label="Sắt" value="Sắt" />
              <Picker.Item label="Gỗ tự nhiên" value="Gỗ tự nhiên" />
              <Picker.Item label="Gỗ chàm" value="Gỗ chàm" />
              <Picker.Item label="Gỗ căm xe" value="Gỗ căm xe" />
              <Picker.Item label="Gỗ ghép" value="Gỗ ghép" />
              <Picker.Item label="Gỗ ép" value="Gỗ ép" />
            </Picker>
          </Item> */}
          <Item stackedLabel>
            <Label>Kích thước (mm)</Label>
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 6 }}>
              <View style={{ width: "25%", backgroundColor: 'powderblue' }}>
                <Input
                  type="text"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  onChangeText={(value) => onchangeForm('dai', value)}
                  value={dai}
                />
              </View>
              <View style={{ width: 20, backgroundColor: 'skyblue' }}><Text style={{ paddingTop: 11, paddingLeft: 6, alignContent: "center" }}>x</Text></View>
              <View style={{ width: "25%", backgroundColor: 'powderblue' }}>
                <Input
                  type="text"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  onChangeText={(value) => onchangeForm('rong', value)}
                  value={rong}
                />
              </View>
              <View style={{ width: 20, backgroundColor: 'skyblue' }}><Text style={{ paddingTop: 11, paddingLeft: 6, alignContent: "center" }}>x</Text></View>
              <View style={{ width: "25%", backgroundColor: 'powderblue' }}>
                <Input
                  type="text"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  onChangeText={(value) => onchangeForm('cao', value)}
                  value={cao}
                />
              </View>
            </View>
          </Item>
          {/* <Item stackedLabel>
            <Label>Quy cách</Label>
            <Input
              type="text"
              autoCapitalize="none"
              keyboardType="default"
              onChangeText={(value) => setValue('quyCach', value)}
            />
          </Item> */}
          <Item stackedLabel>
            <Label>Giá bán</Label>
            <Input
              type="text"
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={(value) => onchangeForm('giaBan', value)}
              value={giaBan}
            />
          </Item>
          <Item>
            {/* <Text>{JSON.stringify(images)}</Text> */}
            {images.map((item, key) => (
              item ? <Thumbnail key={key} square source={{ uri: item.src }} /> : null
            ))}
            { uploading ? <ActivityIndicator /> : null }
            <Button rounded info onPress={pickImage} style={{ marginVertical: 8, marginLeft: 5 }}><Icon name="image" /></Button>
          </Item>
          {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}
          {errors.email && <Text>{errors.email.message}</Text>}
          <Spacer size={20} />
          <Button block onPress={handleSubmit(onFormSubmit)} disabled={loading}>
            { loading ? <ActivityIndicator /> : null }
            <Text>{loading ? 'Loading' : 'Lưu'}</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

ArticlesSingle.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  article: PropTypes.shape(),
  reFetch: PropTypes.func,
};

ArticlesSingle.defaultProps = {
  error: null,
  loading: false,
  article: {},
  reFetch: null,
};

export default ArticlesSingle;
