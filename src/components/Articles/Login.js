import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import {
  Container,
  Content,
  Text,
  Form,
  Item,
  Label,
  Input,
  Button,
  Picker,
  View,
  Icon,
  Thumbnail,

} from 'native-base';
import { ActivityIndicator } from "react-native";
import { Messages, Header, Spacer } from '../UI';
import { errorMessages } from '../../constants/messages';
import * as ImagePicker from 'expo-image-picker';

const ArticlesForm = ({
  error,
  loading,
  success,
  onFormSubmit,
  onLogout,
  defaultValues,
  username,
  password,
  logged
}) => {
  const { register, handleSubmit, errors, setValue, getValues } = useForm({ defaultValues });
  useEffect(() => {
    register({ name: 'username', value: 'mr.lync91@gmail.com' });
    register({ name: 'password', value: 'oX7C 5368 1p2C 8dBu 1D49 RqrG' });
  }, [register]);
  return (
    <Container>
      <Content padder>
        {error && <Messages message={error} />}
        {loading && <Messages type="info" message="Loading..." />}
        {success && <Messages type="success" message={success} />}
        <Form>
          <Item stackedLabel>
            <Label>Tên đăng nhập</Label>
            <Input
              type="text"
              autoCapitalize="none"
              keyboardType="default"
              onChangeText={(value) => setValue('username', value)}
              value={username}
            />
          </Item>
          <Item stackedLabel>
            <Label>Mật khẩu</Label>
            <Input
              type="text"
              autoCapitalize="none"
              keyboardType="default"
              onChangeText={(value) => setValue('password', value)}
              password={password}
            />
          </Item>
          {errors.email && <Text>{errors.email.message}</Text>}
          <Spacer size={20} />
          {logged ? (
            <Button block onPress={handleSubmit(onLogout)} disabled={loading}>
              { loading ? <ActivityIndicator /> : null}
              <Text>{loading ? 'Loading' : 'Đăng xuất'}</Text>
            </Button>
          ) : (
              <Button block onPress={handleSubmit(onFormSubmit)} disabled={loading}>
                { loading ? <ActivityIndicator /> : null}
                <Text>{loading ? 'Loading' : 'Đăng nhập'}</Text>
              </Button>
            )}
        </Form>
      </Content>
    </Container>
  );
};

ArticlesForm.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  success: PropTypes.string,
  defaultValues: PropTypes.shape({
    email: PropTypes.string,
  }),
  onFormSubmit: PropTypes.func.isRequired,
};

ArticlesForm.defaultProps = {
  error: null,
  success: null,
  loading: false,
  defaultValues: {},
};

export default ArticlesForm;
