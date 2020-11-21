import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../../components/Articles/Single';
import { Actions } from "react-native-router-flux";

class ArticlesSingleContainer extends Component {
  constructor() {
    super();
    this.state = { loading: false, error: null, article: {}, tenSamPham: '', uploading: false };
  }

  // componentDidMount = () => this.fetchData();

  componentDidMount = () => {
    this.getDsLoaiSanPham();
    this.fetchData();
  }

  getDsLoaiSanPham = () => {
    const {getDsLoaiSanPham} = this.props;
    getDsLoaiSanPham();
  }

  onFormSubmit = async (data) => {
    const { onFormSubmit, images } = this.props;
    this.setState({ success: null, error: null, loading: true });
    try {
      const success = await onFormSubmit(data, images);
      this.setState({ success, error: null, loading: false });
    } catch (error) {
      this.setState({ loading: false, success: null, error: error.message });
    }
  }
  uploadImage = async (data) => {
    // const { uploadImage } = this.props;
    // uploadImage({...data, ...{single: true}});
    const { uploadImage } = this.props;
    this.setState({uploading: true})
    try {
      const res = await uploadImage({...data, ...{single: true}});
      res ? this.setState({uploading: false}) : setState({uploading: false})
    } catch (error) {
      
    }
  }
  onselectedLoaiSanPham = (data) => {
    this.setState({loaiSanPham: data})
  }
  onselectedloaiVatLieu = (data) => {
    this.setState({loaiVatLieu: data})
  }
  changeSPName = (data) => {
    this.setState({spName: data})
  }

  /**
   * Fetch Data
   */
  fetchData = async () => {
    const { fetchData, id } = this.props;

    this.setState({ loading: true, error: null });

    try {
      const article = await fetchData(id);
      this.setState({ 
        loading: false, 
        error: null, 
        article,
        loaiSanPham: article.categories[0].id,
        dai: article.dimensions.length,
        rong: article.dimensions.width,
        cao: article.dimensions.height,
        tenSanPham: article.name,
        giaBan: article.regular_price
       });
    } catch (err) {
      this.setState({ loading: false, error: err.message, article: {} });
    }
  };

  changeForm = (name, value) => {
    console.log(name);
    name === 'tenSanPham' ? this.setState({tenSanPham: value}) : null
    name === 'dai' ? this.setState({dai: value}) : null
    name === 'rong' ? this.setState({rong: value}) : null
    name === 'cao' ? this.setState({cao: value}) : null
    name === 'giaBan' ? this.setState({giaBan: value}) : null
  }

  /**
   * Render
   */
  render = () => {
    const { userInput, dsLoaiSanPham, images } = this.props;
    const { loading, error, article , loaiSanPham, loaiVatLieu, dai, rong, cao, tenSanPham, giaBan, uploading} = this.state;

    return <Layout loading={loading} error={error} article={article} reFetch={this.fetchData}
    dsLoaiSanPham={dsLoaiSanPham}  
    onFormSubmit={this.onFormSubmit}
    loaiSanPham={loaiSanPham}
    loaiVatLieu={loaiVatLieu}
    onselectedLoaiSanPham={this.onselectedLoaiSanPham}
    onselectedloaiVatLieu={this.onselectedloaiVatLieu}
    uploadImage={this.uploadImage}
    images={images}
    dai={dai}
    rong={rong}
    cao={cao}
    tenSanPham={tenSanPham}
    giaBan={giaBan}
    changeForm={this.changeForm}
    uploading={uploading}
    />;
  };
}

ArticlesSingleContainer.propTypes = {
  fetchData: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  
  dsLoaiSanPham: PropTypes.arrayOf(PropTypes.shape({})),
  userInput: PropTypes.shape({}).isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({})),
};

ArticlesSingleContainer.defaultProps = {
  id: null,
};

const mapStateToProps = (state) => ({
  dsLoaiSanPham: state.articles.dsLoaiSanPham || [],
  images: state.articles.SPimages || [],
  userInput: state.articles.userInput || {},
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: dispatch.articles.fetchSingle,
  onFormSubmit: dispatch.articles.update,
  getDsLoaiSanPham: dispatch.articles.getDsLoaiSanPham,
  uploadImage: dispatch.articles.uploadImage
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesSingleContainer);
