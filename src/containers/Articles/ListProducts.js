import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../../components/Articles/ListProducts';

class ArticlesListContainer extends Component {
  constructor(props) {
    super();

    // Prioritize (web) page route over last meta value
    const page = props.page || props.meta.page;

    this.state = {
      error: null, loading: false, page: parseInt(page, 10) || 1,
    };
  }

  componentDidMount = () => this.fetchData();

  /**
   * If the page prop changes, update state
  */
  componentDidUpdate = (prevProps) => {
    const { page } = this.props;
    const { page: prevPage } = prevProps;
    
    if (page !== prevPage) {
      // eslint-disable-next-line
      this.setState({
        error: null, loading: false, page: parseInt(page, 10) || 1,
      }, this.fetchData);
    }
  }

  /**
   * Fetch Data
   */
  fetchData = async ({ forceSync = false, incrementPage = false } = {}) => {
    const { fetchData } = this.props;

    let { page } = this.state;
    page = incrementPage ? page + 1 : page; // Force fetch the next page worth of data when requested
    page = forceSync ? 1 : page; // Start from scratch

    this.setState({ loading: true, error: null, page });

    try {
      await fetchData({ forceSync, page });
      this.setState({ loading: false, error: null });
    } catch (err) {
      this.setState({ loading: false, error: err.message });
    }
  };
  deleteSanPham = async (item) => {
    const { deleteSanPham } = this.props;
    const data = await deleteSanPham(item.id);
  }
  /**
   * Render
   */
  render = () => {
    const {
      listPaginated, pagination, meta, dsSanPham,
    } = this.props;
    const { error, page, loading } = this.state;

    return (
      <Layout
        page={page}
        meta={meta}
        error={error}
        loading={loading}
        dsSanPham={dsSanPham}
        listPaginated={listPaginated}
        pagination={pagination}
        reFetch={this.fetchData}
        deleteSanPham={this.deleteSanPham}
      />
    );
  };
}

ArticlesListContainer.propTypes = {
  dsSanPham: PropTypes.arrayOf(PropTypes.shape({})),
  listFlat: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  listPaginated: PropTypes.shape({}).isRequired,
  meta: PropTypes.shape({
    page: PropTypes.number,
  }).isRequired,
  fetchData: PropTypes.func.isRequired,
  deleteSanPham: PropTypes.func.isRequired,
  pagination: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  page: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool,
};

ArticlesListContainer.defaultProps = {
  page: 1,
};

const mapStateToProps = (state) => ({
  dsSanPham: state.articles.dsSanPham || [],
  listFlat: state.articles.listFlat || [],
  listPaginated: state.articles.listPaginated || {},
  meta: state.articles.meta || [],
  pagination: state.articles.pagination || {},
  loading: state.articles.loading || false
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: dispatch.articles.getDsSanPham,
  deleteSanPham: dispatch.articles.deleteSanPham
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticlesListContainer);
