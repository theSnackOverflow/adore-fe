// src/components/CustomerSupport/CustomerSupportSidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const CustomerSupportSidebar = () => {
  return (
    <div className="sidebar">
      <h3>공지사항</h3>
      <ul>
      <li>
          <NavLink to="../customersupport/noticelist" activeClassName="active-link">
            공지사항 목록
          </NavLink>
        </li>
      </ul>
        <h3>고객지원</h3>
        <ul>
          <li><NavLink to="/customersupport/inquirylist" activeClassName="active-link">
            내 문의 목록
          </NavLink></li>
          <li><NavLink to="/customersupport/inquiryform" activeClassName="active-link">
            문의하기
          </NavLink></li>
      </ul>
    </div>
  );
};

export default CustomerSupportSidebar;