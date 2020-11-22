import React from 'react';
import { Scene, Tabs, Stack, Actions } from 'react-native-router-flux';
import { Icon } from 'native-base';
import DefaultProps from '../constants/navigation';
import AppConfig from '../constants/config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArticlesForm, ArticlesList, ArticlesSingle, ListProducts, Login } from '../containers';

import AboutComponent from '../components/About';

const Index = (
  <Stack hideNavBar>
    <Scene hideNavBar>
      <Tabs
        key="tabbar"
        swipeEnabled
        type="replace"
        showLabel={false}
        // tabBarOnPress={(e) => isLogged(e)}
        {...DefaultProps.tabProps}
      >
        <Stack
          key="home"
          title={"Cài đặt"}
          icon={() => <Icon name="planet" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="home" component={Login} />
        </Stack>
        <Stack
          key="articlesList"
          title="Danh sách sản phẩm"
          icon={() => <Icon name="list" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="articlesList" component={ListProducts} />
          <Scene key="articlesSingle" component={ArticlesSingle} />
        </Stack>
        <Stack
          key="form"
          title="Thêm sản phẩm"
          icon={() => <Icon name="add" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="form" component={ArticlesForm} />
        </Stack>
      </Tabs>
    </Scene>
  </Stack>
);
const isLogged = async (e) => {
  const logged = JSON.parse(await AsyncStorage.getItem('@Auth:logged')); 
  if (!logged) {
   Actions.home(); 
  } else {
    Actions[e.navigation.state.key]();
  }
  return;
}
export default Index;
