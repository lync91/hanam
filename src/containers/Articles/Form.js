import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../../components/Articles/Form';

class ArticlesFormContainer extends Component {
  constructor() {
    super();
    this.state = { error: null, success: null, loading: false, loaiVatLieu: 'Inox', loaiSanPham: 158, uploading: false };
  }

  componentDidMount = () => {
    this.getDsLoaiSanPham();
  }

  getDsLoaiSanPham = () => {
    const {getDsLoaiSanPham} = this.props;
    getDsLoaiSanPham();
  }

  /**
   * On Form Submission
   */
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
    const { uploadImage } = this.props;
    this.setState({uploading: true})
    try {
      const res = await uploadImage(data);
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
   * Render
   */
  render = () => {
    const { userInput, dsLoaiSanPham, images } = this.props;
    const { error, loading, success, loaiSanPham, loaiVatLieu, spName, uploading } = this.state;

    return (
      <Layout
        error={error}
        loading={loading}
        success={success}
        defaultValues={userInput}
        dsLoaiSanPham={dsLoaiSanPham}
        onFormSubmit={this.onFormSubmit}
        loaiSanPham={loaiSanPham}
        loaiVatLieu={loaiVatLieu}
        onselectedLoaiSanPham={this.onselectedLoaiSanPham}
        onselectedloaiVatLieu={this.onselectedloaiVatLieu}
        changeSPName={this.changeSPName}
        spName={spName}
        uploadImage={this.uploadImage}
        images={images}
        uploading={uploading}
      />
    );
  }
}

ArticlesFormContainer.propTypes = {
  dsLoaiSanPham: PropTypes.arrayOf(PropTypes.shape({})),
  userInput: PropTypes.shape({}).isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({})),
};
ArticlesFormContainer.defaultProps = {
  images: []
}

const mapStateToProps = (state) => ({
  dsLoaiSanPham: state.articles.dsLoaiSanPham || [],
  images: state.articles.images || [],
  userInput: state.articles.userInput || {},
});

const mapDispatchToProps = (dispatch) => ({
  onFormSubmit: dispatch.articles.save,
  getDsLoaiSanPham: dispatch.articles.getDsLoaiSanPham,
  uploadImage: dispatch.articles.uploadImage
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesFormContainer);
