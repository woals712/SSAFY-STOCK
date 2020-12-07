import React, { Component } from 'react';
import {     
    Pagination,
    PaginationItem,
    PaginationLink,
} from 'reactstrap';
//import PropTypes from 'prop-types';

var global_page = 25;

/*
const propTypes = {
    data: PropTypes.array.isRequired,
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number,
    pageSize: PropTypes.number
}

const defaultProps = {
    initialPage: 1,
    pageSize: global_page,
}
*/

class Paginate extends Component {
	constructor(props) {
        super(props);
        this.state = { pager: {} };
    }

    componentWillMount() {
        // set page if items array isn't empty
        if (this.props.data && this.props.data.length) {
            this.setPage(this.props.initialPage);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // reset page if items array has changed
        if (this.props.data !== prevProps.data) {
            this.setPage(this.props.initialPage);
        }
    }

    setPage(page) {
        var { data, pageSize } = this.props;
        var pager = this.state.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }

        // get new pager object for specified page
        pager = this.getPager(data.length, page, pageSize);

        // get new page of items from items array
        var pageOfItems = data.slice(pager.startIndex, pager.endIndex + 1);

        // update state
        this.setState({ pager: pager });

        // call change page function in parent component
        this.props.onChangePage(pageOfItems);
    }

    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || global_page;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    render() {
        var pager = this.state.pager;

        if (!pager.pages || pager.pages.length <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }

        return (
            <Pagination>
                <PaginationItem className={pager.currentPage === 1 ? 'disabled' : ''} onClick={() => this.setPage(1)}>
                    <PaginationLink previous />
                </PaginationItem>
                <PaginationItem className={pager.currentPage === 1 ? 'disabled' : ''} onClick={() => this.setPage(pager.currentPage - 1)}>
                <PaginationLink>&lt;</PaginationLink>
                </PaginationItem>
                {pager.pages.map((page, index) =>
                    <PaginationItem key={index} className={pager.currentPage === page ? 'active' : ''} onClick={() => this.setPage(page)}>
                        <PaginationLink>{page}</PaginationLink>
                    </PaginationItem>
                )}
                <PaginationItem className={pager.currentPage === pager.totalPages ? 'disabled' : ''} onClick={() => this.setPage(pager.currentPage + 1)}>
                    <PaginationLink>&gt;</PaginationLink>
                </PaginationItem>
                <PaginationItem className={pager.currentPage === pager.totalPages ? 'disabled' : ''} onClick={() => this.setPage(pager.totalPages)}>
                    <PaginationLink next />
                </PaginationItem>
            </Pagination>
        );
    }
}

export default Paginate;
