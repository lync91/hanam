import moment from 'moment';
import Api from '../lib/api';
import HandleErrorMessage from '../lib/format-error-messages';
import initialState from '../store/articles';
import Config from '../constants/config';
import { getFeaturedImageUrl } from '../lib/images';
import { ucfirst, stripHtml } from '../lib/string';
import { errorMessages, successMessages } from '../constants/messages';
import pagination from '../lib/pagination';
import base64 from 'react-native-base64';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * Transform the endpoint data structure into our redux store format
 * @param {obj} item
 */
const transform = (item) => ({
  id: item.id || 0,
  name: item.title && item.title.rendered ? ucfirst(stripHtml(item.title.rendered)) : '',
  content: item.content && item.content.rendered ? stripHtml(item.content.rendered) : '',
  contentRaw: item.content && item.content.rendered,
  excerpt: item.excerpt && item.excerpt.rendered ? stripHtml(item.excerpt.rendered) : '',
  date: moment(item.date).format(Config.dateFormat) || '',
  slug: item.slug || null,
  link: item.link || null,
  image: getFeaturedImageUrl(item),
});

const transSanPham = (item) => ({
  id: item.id || 0,
  name: item.name || 'Sản phẩm chưa đặt tên',
  image: item.images.length > 0 ? item.images[0].src : 'https://dogohanam.net/wp-content/uploads/woocommerce-placeholder-100x100.png',
  categories: item.categories[0].name,
  regular_price: item.regular_price,
  price: item.price
})
const transDsLoaiSanPham = (item) => ({
  id: item.id || 0,
  name: item.name || 'Loại sản phẩm chưa đặt tên',
})

export default {
  namespace: 'articles',

  /**
   *  Initial state
   */
  state: initialState,

  /**
   * Effects/Actions
   */
  effects: (dispatch) => ({
    /**
     * Get a list from the API
     * @param {obj} rootState
     * @returns {Promise}
     */
    async fetchList({ forceSync = false, page = 1 } = {}, rootState) {
      const { articles = {} } = rootState;
      const { lastSync = {}, meta = {} } = articles;
      const { lastPage } = meta;

      // Only sync when it's been 5mins since last sync
      if (lastSync[page]) {
        if (!forceSync && moment().isBefore(moment(lastSync[page]).add(5, 'minutes'))) {
          return true;
        }
      }

      // We've reached the end of the list
      if (page && lastPage && page > lastPage) {
        throw HandleErrorMessage({ message: `Page ${page} does not exist` });
      }

      try {
        const response = await Api.get(`/v2/posts?per_page=4&page=${page}&orderby=modified&_embed`);
        const { data, headers } = response;

        return !data || data.length < 1
          ? true
          : dispatch.articles.replace({ data, headers, page });
      } catch (error) {
        throw HandleErrorMessage(error);
      }
    },


    async getDsSanPham({ forceSync = false, page = 1 } = {}, rootState) {
      dispatch.articles.changeLoading(true);
      const { articles = {} } = rootState;
      const { lastSync = {}, meta = {} } = articles;
      const { lastPage } = meta;
      // Only sync when it's been 5mins since last sync
      if (lastSync[page]) {
        if (!forceSync && moment().isBefore(moment(lastSync[page]).add(5, 'minutes'))) {
          return true;
        }
      }
      // We've reached the end of the list
      if (page && lastPage && page > lastPage) {
        throw HandleErrorMessage({ message: `Page ${page} does not exist` });
      }
      try {
        const response = await Api.get(`/wc/v3/products?page=${page}`);
        const { data, headers } = response;
        return !data || data.length < 1
          ? true
          : dispatch.articles.updateDsSanPham({ data, headers, page });
      } catch (error) {
        throw HandleErrorMessage(error);
      }
    },
    async getDsLoaiSanPham({ forceSync = false, page = 1 } = {}, rootState) {
      const { articles = {} } = rootState;
      const { lastSync = {}, meta = {} } = articles;
      const { lastPage } = meta;
      if (page && lastPage && page > lastPage) {
        throw HandleErrorMessage({ message: `Page ${page} does not exist` });
      }
      try {
        const response = await Api.get('/wc/v3/products/categories');
        const { data } = response;
        return data ? dispatch.articles.updateDsLoaiSanPham({ data }) : null;
      } catch (error) {
        throw HandleErrorMessage(error);
      }
    },
    /**
     * Get a single item from the API
     * @param {number} id
     * @returns {Promise[obj]}
     */
    async fetchSingle(id) {
      try {
        const response = await Api.get(`/wc/v3/products/${id}`)
        const { data } = response;
        if (!data) {
          throw new Error({ message: errorMessages.articles404 });
        }
        dispatch.articles.replaceImages({ images: data.images })
        return data;
      } catch (error) {
        throw HandleErrorMessage(error);
      }
    },
    async deleteSanPham(id) {
      try {
        const response = await Api.delete(`/wc/v3/products/${id}`)
        const { data } = response;
        if (!data) {
          throw new Error({ message: errorMessages.articles404 });
        }
        dispatch.articles.removeSanPham(id)
        return data;
      } catch (error) {
        throw HandleErrorMessage(error);
      }
    },

    /**
     * Save date to redux store
     * @param {obj} data
     * @returns {Promise[obj]}
     */
    async save(details, state) {
      const dimensions = {
        length: details.dai,
        width: details.rong,
        height: details.cao
      };
      const dt = {
        name: details.tenSanPham,
        type: 'simple',
        regular_price: details.giaBan,
        categories: [{ id: details.loaiSamPham }],
        images: state.articles.images.filter(item => item != null),
        dimensions: dimensions
      }
      const response = await Api.post('/wc/v3/products', dt);
      const { data, headers } = response;
      dispatch.articles.clearImages();
      return 'Đã tạo sản phẩm thảnh công'
    },
    async update(details, state) {
      const dimensions = {
        length: details.dai,
        width: details.rong,
        height: details.cao
      };
      const dt = {
        name: details.tenSanPham,
        type: 'simple',
        regular_price: details.giaBan,
        categories: [{ id: details.loaiSamPham }],
        images: state.articles.SPimages.filter(item => item != null),
        dimensions: dimensions
      }
      const response = await Api.put(`/wc/v3/products/${details.id}`, dt);
      const { data, headers } = response;
      dispatch.articles.updateSanPham(data)
      return 'Đã sửa sản phẩm thảnh công';
    },
    async uploadImage(image) {
      const form = new FormData();
      const photoData = await FileSystem.getInfoAsync(image.file);
      const asset = Asset.fromURI(image.file);
      const photo = {
        uri: Platform.OS === 'android' ? image.file : image.file.replace('file://', ''),
        type: `image/${asset.type}`,
        name: `${photoData.modificationTime}.${asset.type}`
      }
      form.append('file', photo);
      const response = await Api.post('/wp/v2/media', form);
      const { data, headers } = response;
      const media = data.media_details.sizes;
      const imageDetails = {
        thumbnail: media.thumbnail.source_url,
        src: media.full.source_url
      }
      image.single ? dispatch.articles.addSPImage({ imageDetails }) : dispatch.articles.addImage({ imageDetails })
      return true;
    },
    async login(form) {
      let username = form.username;
      let password = form.password;
      let auth = base64.encode(`${username}:${password}`);
      // config.headers.common['Authorization'] = `Basic ${auth}`;
      try {
        const response = await Api.get('/wp/v2/users/me', {headers: {Authorization: `Basic ${auth}`}});
        const { data, headers } = response;
        await AsyncStorage.setItem('@Auth:username', username);
        await AsyncStorage.setItem('@Auth:password', password);
        await AsyncStorage.setItem('@Auth:logged', 'true');
        const loggin = {
          username: username,
          password: password,
          logged: true
        }
        dispatch.articles.updateLogin(loggin)
        return "Đăng nhập thành công";
      } catch (error) {
        console.log(error);
        throw HandleErrorMessage({...error, ...{message: 'Đăng nhập không thành công'}});
      }
    },
    async getLogin() {
      const data = {
        username: await AsyncStorage.getItem('@Auth:username'),
        password: await AsyncStorage.getItem('@Auth:password'),
        logged: await AsyncStorage.getItem('@Auth:logged'),
      }
      dispatch.articles.updateLogin(data)
    },
    async onLogout() {
      await AsyncStorage.setItem('@Auth:username', '');
      await AsyncStorage.setItem('@Auth:password', '');
      await AsyncStorage.setItem('@Auth:logged', 'false');
      const data = {
        username: '',
        password: '',
        logged: false,
      }
      dispatch.articles.updateLogin(data)
    }
  }),

  /**
   * Reducers
   */
  reducers: {
    /**
     * Replace list in store
     * @param {obj} state
     * @param {obj} payload
     */
    replace(state, payload) {
      let newList = null;
      const { data, headers, page } = payload;

      // Loop data array, saving items in a usable format
      if (data && typeof data === 'object') {
        newList = data.map((item) => transform(item));
      }

      // Create our paginated and flat lists
      const listPaginated = page === 1 ? { [page]: newList } : { ...state.listPaginated, [page]: newList };
      const listFlat = Object.keys(listPaginated).map((k) => listPaginated[k]).flat() || [];

      return newList
        ? {
          ...state,
          listPaginated,
          listFlat,
          lastSync: page === 1
            ? { [page]: moment().format() }
            : { ...state.lastSync, [page]: moment().format() },
          meta: {
            page,
            lastPage: parseInt(headers['x-wp-totalpages'], 10) || null,
            total: parseInt(headers['x-wp-total'], 10) || null,
          },
          pagination: pagination(headers['x-wp-totalpages'], '/articles/'),
        }
        : initialState;
    },

    /**
     * Save form data
     * @param {obj} state
     * @param {obj} payload
     */
    replaceUserInput(state, payload) {
      return {
        ...state,
        userInput: payload,
      };
    },
    removeSanPham(state, payload) {
      // const newList = state.dsSanPham.filter(item => item.id != payload);
      const listPaginated = Object.keys(state.listPaginated).map((k) => state.listPaginated[k].filter(item => item.id != payload));
      const dsSanPham = Object.keys(listPaginated).map((k) => listPaginated[k]).flat() || [];
      return {
        ...state,
        dsSanPham,
        listPaginated
      }
    },
    updateSanPham(state, payload) {
      const listPaginated = Object.keys(state.listPaginated).map((k) => state.listPaginated[k].map(item => item.id != payload.id ? item : transSanPham(payload)));
      const dsSanPham = Object.keys(listPaginated).map((k) => listPaginated[k]).flat() || [];
      return {
        ...state,
        dsSanPham,
        listPaginated
      }
    },
    updateDsSanPham(state, payload) {
      let newList = null;
      const { data, headers, page } = payload;
      // Loop data array, saving items in a usable format
      if (data && typeof data === 'object') {
        newList = data.map((item) => transSanPham(item));
      }

      // Create our paginated and flat lists
      const listPaginated = page === 1 ? { [page]: newList } : { ...state.listPaginated, [page]: newList };
      const dsSanPham = Object.keys(listPaginated).map((k) => listPaginated[k]).flat() || [];
      return newList
        ? {
          ...state,
          listPaginated,
          dsSanPham,
          loading: false,
          lastSync: page === 1
            ? { [page]: moment().format() }
            : { ...state.lastSync, [page]: moment().format() },
          meta: {
            page,
            lastPage: parseInt(headers['x-wp-totalpages'], 10) || null,
            total: parseInt(headers['x-wp-total'], 10) || null,
          },
          pagination: pagination(headers['x-wp-totalpages'], '/articles/'),
        }
        : initialState;
    },
    updateDsLoaiSanPham(state, payload) {
      const list = payload.data;
      const newList = list.map(item => transDsLoaiSanPham(item));
      return {
        ...state,
        dsLoaiSanPham: newList,
        images: []
      }
    },
    replaceImages(state, payload) {
      return {
        ...state,
        SPimages: payload.images
      }
    },
    addImage(state, payload) {
      return {
        ...state,
        images: state.images ? [...state.images, payload.imageDetails] : [payload.imageDetails]
      }
    },
    addSPImage(state, payload) {
      return {
        ...state,
        SPimages: state.SPimages ? [...state.SPimages, payload.imageDetails] : [payload.imageDetails]
      }
    },
    clearImages(state, payload) {
      return {
        ...state,
        images: []
      }
    },
    changeLoading(state, payload) {
      return {
        ...state,
        loading: payload
      }
    },
    updateLogin(state, payload) {
      return {
        ...state,
        ...payload
      }
    }
  },
};
