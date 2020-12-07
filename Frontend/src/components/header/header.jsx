import React, { useState } from "react";
import CompanyContext from "../../contexts/company"
import {
    Nav,
    NavItem,
    NavLink,
    Navbar,
    NavbarBrand,
    Collapse,
    Form,
    Input
} from 'reactstrap';

import logolighticon from '../../assets/images/logo-icon.png';
import logolighttext from '../../assets/images/logo-text.png';

const Header = (e) => {
    const showMobilemenu = () => {
        document.getElementById('main-wrapper').classList.toggle('show-sidebar');
    }

    const toggleMenu = () => {
        document.getElementById('search').classList.toggle('show-search');
    }

    const [targetCompany, setTargetCompany] = useState('')

    return (
        <header className="topbar navbarbg" data-navbarbg="skin4">
            <Navbar className="top-navbar" dark expand="md">
                <div className="navbar-header" id="logobg" data-logobg="skin4">
                    <NavbarBrand href="/">
                        <b className="logo-icon">
                            <img
                                src={logolighticon}
                                alt="homepage"
                                className="light-logo"
                            />
                        </b>
                        <span className="logo-text">
                            <img
                                src={logolighttext}
                                className="light-logo"
                                alt="homepage"
                            />
                        </span>
                    </NavbarBrand>
                    <button
                        className="btn-link nav-toggler d-block d-md-none text-white"
                        onClick={() => showMobilemenu()}
                    >
                        <i className="ti-menu ti-close" />
                    </button>
                </div>
                <Collapse
                    className="navbarbg"
                    navbar
                    data-navbarbg="skin4"
                >
                    <Nav className="float-left" navbar>
                        <NavItem className="hidden-sm-down search-box">
                            <NavLink
                                href="#"
                                className="hidden-sm-down"
                                onClick={toggleMenu.bind(null)}
                            >
                                <i className="ti-search" />
                                &nbsp;&nbsp;&nbsp;&nbsp; 원하는 기업을 입력해주세요 (시세 조회)
                            </NavLink>
                            <CompanyContext.Consumer>
                                {({actions}) => (
                                    <Form className="app-search" id="search" onSubmit={e => 
                                        {
                                            actions.setCompany(targetCompany);
                                            e.preventDefault();
                                        }}>
                                        <Input 
                                            type="text"
                                            value={targetCompany}
                                            onChange={e => setTargetCompany(e.target.value)}
                                            placeholder="&nbsp;&nbsp;원하는 기업을 입력해주세요 (시세 조회)" 
                                        />
                                        <button className="btn-link srh-btn" onClick={toggleMenu.bind(null)}>
                                            <i className="ti-close" />
                                        </button>
                                    </Form>
                                )}
                            </CompanyContext.Consumer>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </header>
    );
}
export default Header;
