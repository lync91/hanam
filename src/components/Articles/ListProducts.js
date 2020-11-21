import React from 'react';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { FlatList, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, View, Button, Alert } from 'react-native';
import {
  Container, Card, CardItem, Body, Text, List, ListItem, Thumbnail, Left, Right, Item, Icon
} from 'native-base';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Error, Spacer } from '../UI';
import { errorMessages } from '../../constants/messages';
import { color } from 'react-native-reanimated';
import NumberFormat from 'react-number-format';


const ArticlesList = ({
  error, loading, reFetch, meta, dsSanPham, deleteSanPham
}) => {
  if (error) {
    return <Error content={error} tryAgain={reFetch} />;
  }

  if (dsSanPham.length < 1) {
    return <Error content={errorMessages.articlesEmpty} />;
  }
  const onDelete = (e) => {
    Alert.alert(
      "Cảng báo",
      "Sản phẩm này sẽ bị xóa khỏi trang web",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { text: "Đồng ý", onPress: () => deleteSanPham(e), }
      ],
      { cancelable: true }
    );
  }
  const renderLeftActions = (progress, dragX, item) => {
    const trans = dragX.interpolate({
      inputRange: [0, 55, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton color="red" onPress={(e) => onDelete(item)} style={{
        width: 50,
        justifyContent: 'center',
        paddingTop: 0,
        paddingLeft: 19,
        width: 56,
        marginLeft: 2,
        backgroundColor: 'red',
        color: 'white'
      }}>
        <Animated.Text
          style={[
            {
              transform: [{ translateX: trans }],
            },
          ]}>
          <Icon style={{ color: "white" }} name="md-trash" />
        </Animated.Text>
      </RectButton>
    );
  };
  function format(x) {
    if (isNaN(x)) return "";

    const n = x.toString().split('.');
    return n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (n.length > 1 ? "." + n[1] : "");
  }
  return (
    <Container style={{ padding: 5 }}>
      <FlatList
        data={dsSanPham}
        onRefresh={() => reFetch({ forceSync: true })}
        refreshing={loading}
        renderItem={({ item }) => (
          <View>
            <Swipeable renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, item)}>
              <RectButton onPress={() => Actions.articlesSingle({ id: item.id, title: item.name })}>
                <Item>
                  <Thumbnail style={{ marginRight: 8 }} square source={{ uri: item.image }} />
                  <View>
                    <Text>{item.name}</Text>
                    <Item>
                      <Text style={{ fontSize: 12 }}>Loại sản phẩm: {item.categories} | </Text>
                      <Text style={{ fontSize: 12 }}>Giá bán: {format(item.regular_price)}</Text>
                    </Item>
                  </View>
                </Item>
              </RectButton>
            </Swipeable>
          </View>
        )}
        keyExtractor={(item) => `${item.id}-${item.name}`}
        ListFooterComponent={(meta && meta.page && meta.lastPage && meta.page < meta.lastPage)
          ? () => (
            <React.Fragment>
              <Spacer size={20} />
              <RectButton
                onPress={() => reFetch({ incrementPage: true })}
                style={{ width: '100%', height: 50, backgroundColor: '#ff6be1', justifyContent: 'center', alignItems: 'center' }}
              >
                <Text style={{ color: 'white' }}>Tải thêm</Text>
              </RectButton>
            </React.Fragment>
          ) : null}
      />
      <Spacer size={20} />
    </Container>
  );
};

ArticlesList.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  listFlat: PropTypes.arrayOf(
    PropTypes.shape({
      placeholder: PropTypes.bool,
      id: PropTypes.number,
      name: PropTypes.string,
      date: PropTypes.string,
      content: PropTypes.string,
      excerpt: PropTypes.string,
      image: PropTypes.string,
    }),
  ),
  reFetch: PropTypes.func,
  meta: PropTypes.shape({ page: PropTypes.number, lastPage: PropTypes.number }),
};

ArticlesList.defaultProps = {
  listFlat: [],
  error: null,
  reFetch: null,
  meta: { page: null, lastPage: null },
  loading: false,
};

export default ArticlesList;
