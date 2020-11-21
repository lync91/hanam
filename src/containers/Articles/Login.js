import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../../components/Articles/Login';

class ArticlesFormContainer extends Component {
  constructor() {
    super();
    this.state = { error: null, success: null, loading: false, loaiVatLieu: 'Inox', loaiSanPham: 158, uploading: false };
  }

  componentDidMount = () => {
    const {getLogin} = this.props
    this.getDsLoaiSanPham();
    getLogin(); 
  }

  getDsLoaiSanPham = () => {
    const {getDsLoaiSanPham} = this.props;
    getDsLoaiSanPham();
  }

  /**
   * On Form Submission
   */
  onFormSubmit = async (data) => {
    const { login } = this.props;
    this.setState({ success: null, error: null, loading: true });
    try {
      const success = await login(data);
      this.setState({ success, error: null, loading: false });
    } catch (error) {
      this.setState({ loading: false, success: null, error: error.message });
    }
  }
  onLogout = () => {
    const {onLogout} = this.props;
    onLogout()
  }
  /**
   * Render
   */
  render = () => {
    const { userInput, dsLoaiSanPham, username, password, logged} = this.props;
    const { error, loading, success, } = this.state;

    return (
      <Layout
        error={error}
        loading={loading}
        success={success}
        defaultValues={userInput}
        dsLoaiSanPham={dsLoaiSanPham}
        onFormSubmit={this.onFormSubmit}
        username={username}
        password={password}
        logged={logged}
        onLogout={this.onLogout}
      />
    );
  }
}

ArticlesFormContainer.propTypes = {
  userInput: PropTypes.shape({}).isRequired,
  login: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};
ArticlesFormContainer.defaultProps = {
  images: []
}

const mapStateToProps = (state) => ({
  dsLoaiSanPham: state.articles.dsLoaiSanPham || [],
  images: state.articles.images || [],
  userInput: state.articles.userInput || {},
  username: state.articles.username || {},
  password: state.articles.password,
  logged: state.articles.logged || false
});

const mapDispatchToProps = (dispatch) => ({
  login: dispatch.articles.login,
  getDsLoaiSanPham: dispatch.articles.getDsLoaiSanPham,
  uploadImage: dispatch.articles.uploadImage,
  getLogin: dispatch.articles.getLogin,
  onLogout: dispatch.articles.onLogout
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesFormContainer);
