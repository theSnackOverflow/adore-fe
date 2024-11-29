import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home/Home';
import LoginForm from './components/LoginForm/LoginForm';
import SignUpForm from './components/SignUpForm/SignupForm';
import PasswordChange from './components/MyPage/PasswordChange';
import PersonalInfoEdit from './components/MyPage/PersonalInfoEdit';
import AccountDelete from './components/MyPage/AccountDelete';
import ReviewForm from './components/MyPage/ReviewForm';
import MyReviewList from './components/MyPage/MyReviewList';
import NoticeList from './components/CustomerSupport/NoticeList';
import InquiryForm from './components/CustomerSupport/InquiryForm';
import InquiryList from './components/CustomerSupport/InquiryList';
import PerfumeList from './components/PerfumeRecommendation/PerfumeList';
import NoteList from './components/PerfumeRecommendation/NoteList';
import SurveyIntro from './components/PerfumeRecommendation/SurveyIntro';
import SurveyResult from './components/PerfumeRecommendation/SurveyResult';
import SurveyResultList from './components/PerfumeRecommendation/SurveyResultList'; // 추가된 SurveyResultList
import OtherReviewList from './components/PerfumeRecommendation/OtherReviewList';
import ReviewDetail from './components/PerfumeRecommendation/ReviewDetail';
import FriendInfoInput from './components/FriendRecommendation/FriendInfoInput';
import FriendResult from './components/FriendRecommendation/FriendResult';
import UserList from './components/Admin/UserManagement/UserList';
import UserInfoEdit from './components/Admin/UserManagement/UserInfoEdit';
import UserRegistration from './components/Admin/UserManagement/UserRegistration';
import ReportList from './components/Admin/UserManagement/ReportList';
import ReportDetail from './components/Admin/UserManagement/ReportDetail';
import AdminPerfumeList from './components/Admin/PerfumeManagement/AdminPerfumeList';
import AdminNoteList from './components/Admin/PerfumeManagement/AdminNoteList';
import NoteRegistration from './components/Admin/PerfumeManagement/NoteRegistration';
import NoteInfoEdit from './components/Admin/PerfumeManagement/NoteInfoEdit';
import PerfumeInfoEdit from './components/Admin/PerfumeManagement/PerfumeInfoEdit';
import PerfumeRegistration from './components/Admin/PerfumeManagement/PerfumeRegistration';
import AdminInquiryList from './components/Admin/InquiryManagement/AdminInquiryList';
import AdminNoticeList from './components/Admin/NoticeManagement/AdminNoticeList';
import AdminNoticeCreate from './components/Admin/NoticeManagement/AdminNoticeCreate';
import AdminNoticeEdit from './components/Admin/NoticeManagement/AdminNoticeEdit';
import AdminSurveyList from './components/Admin/SurveyManagement/AdminSurveyList';
import AdminSurveyDetail from './components/Admin/SurveyManagement/AdminSurveyDetail';
import AdminSurveyCreate from './components/Admin/SurveyManagement/AdminSurveyCreate';
import AdminStatistics from './components/Admin/StatisticsManagement/AdminStatistics'; // 관리자 통계 페이지 추가
import FriendResultList from './components/FriendRecommendation/FriendResultList';
import axios from 'axios';
import { removeCookie, getCookie, setCookie } from './lib/CookieUtil';
import { isLogin, extractRole } from './lib/Auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isLogin());
  const [userRole, setUserRole] = useState(() => (isLoggedIn ? extractRole() : "GUEST"));

  const gatewayURL = import.meta.env.VITE_GATEWAY_URL;
  const instance = axios.create({
    baseURL: gatewayURL,
    timeout: 5000,
  });

  instance.interceptors.request.use(
    (config) => {
      const accessToken = getCookie('accessToken');
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleLogin = async (email, password) => {
    try {
      const response = await instance.post('/api/auth/login', { email, password }, { withCredentials: true });

      if (response.status === 200) {
        setCookie('accessToken', response.data.accessToken);
        setIsLoggedIn(true);
        setUserRole(extractRole());
        return extractRole().toString();
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleLogout = async () => {
    const response = await instance.get('/api/auth/logout', { withCredentials: true });
    if (response.status === 200) {
      console.log("Logout success:", response.data);
      removeCookie('accessToken');
      setIsLoggedIn(false);
      setUserRole("GUEST");
    }
  };

  useEffect(() => {
    setIsLoggedIn(isLogin());
    setUserRole(isLogin() ? extractRole() : "GUEST");
  }, []);

  const PrivateRoute = ({ element }) => {
    return userRole === "USER" ? element : <Navigate to="/login" replace />;
  };
  
  const AdminRoute = ({ element }) => {
    return userRole === "ADMIN" ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <div className="app">
        <Header userRole={userRole} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SignUpForm" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />

          {/* MyPage 관련 라우트 */}
          <Route path="/MyPage/PasswordChange" element={<PrivateRoute element={<PasswordChange />} />} />
          <Route path="/MyPage/PersonalInfoEdit" element={<PrivateRoute element={<PersonalInfoEdit />} />} />
          <Route path="/MyPage/AccountDelete" element={<PrivateRoute element={<AccountDelete />} />} />
          <Route path="/MyPage/ReviewForm" element={<PrivateRoute element={<ReviewForm />} />} />
          <Route path="/MyPage/MyReviewList" element={<PrivateRoute element={<MyReviewList />} />} />

          {/* Customer Support 관련 라우트 */}
          <Route path="/CustomerSupport/NoticeList" element={<PrivateRoute element={<NoticeList />} />} />
          <Route path="/CustomerSupport/InquiryForm" element={<PrivateRoute element={<InquiryForm />} />} />
          <Route path="/CustomerSupport/InquiryList" element={<PrivateRoute element={<InquiryList />} />} />

          {/* Perfume Recommendation 관련 라우트 */}
          <Route path="/perfumerecommendation/perfumelist" element={<PrivateRoute element={<PerfumeList />} />} />
          <Route path="/perfumerecommendation/notelist" element={<PrivateRoute element={<NoteList />} />} />
          <Route path="/perfumerecommendation/surveyintro" element={<PrivateRoute element={<SurveyIntro />} />} />
          <Route path="/perfumerecommendation/surveyresult/:userAnsId" element={<PrivateRoute element={<SurveyResult />} />} />
          <Route path="/perfumerecommendation/surveyresultlist" element={<PrivateRoute element={<SurveyResultList />} />} /> {/* 추가된 SurveyResultList */}
          <Route path="/perfumerecommendation/otherreviewlist" element={<PrivateRoute element={<OtherReviewList />} />} />
          <Route path="/perfumerecommendation/reviewdetail/:reviewId" element={<PrivateRoute element={<ReviewDetail />} />} />

          {/* Friend Recommendation 관련 라우트 */}
          <Route path="/friendrecommendation/friendinfoinput" element={<PrivateRoute element={<FriendInfoInput />} />} />
          <Route path="/friendrecommendation/friendresult/:friendId" element={<PrivateRoute element={<FriendResult />} />} />
          <Route path="/friendrecommendation/friendresult" element={<PrivateRoute element={<FriendResultList />} />} />

          {/* Admin Routes */}
          <Route path="/Admin/UserManagement/UserList" element={<AdminRoute element={<UserList />} />} />
          <Route path="/Admin/UserManagement/UserInfoEdit" element={<AdminRoute element={<UserInfoEdit />} />} />
          <Route path="/Admin/UserManagement/UserRegistration" element={<AdminRoute element={<UserRegistration />} />} />
          <Route path="/Admin/UserManagement/ReportList" element={<AdminRoute element={<ReportList />} />} />
          <Route path="/Admin/UserManagement/ReportDetail" element={<AdminRoute element={<ReportDetail />} />} />

          {/* Admin Perfume & Note Routes */}
          <Route path="/Admin/PerfumeManagement/AdminPerfumeList" element={<AdminRoute element={<AdminPerfumeList />} />} />
          <Route path="/Admin/PerfumeManagement/PerfumeInfoEdit" element={<AdminRoute element={<PerfumeInfoEdit />} />} />
          <Route path="/Admin/PerfumeManagement/PerfumeRegistration" element={<AdminRoute element={<PerfumeRegistration />} />} />
          <Route path="/admin/perfumemanagement/adminnotelist" element={<AdminRoute element={<AdminNoteList />} />} />
          <Route path="/Admin/PerfumeManagement/NoteRegistration" element={<AdminRoute element={<NoteRegistration />} />} />
          <Route path="/admin/perfumemanagement/noteinfoedit" element={<AdminRoute element={<NoteInfoEdit />} />} />

          <Route path="/Admin/InquiryManagement/AdminInquiryList" element={<AdminRoute element={<AdminInquiryList />} />} />

          {/* Notice Management Routes */}
          <Route path="/Admin/NoticeManagement/AdminNoticeList" element={<AdminRoute element={<AdminNoticeList />} />} />
          <Route path="/Admin/NoticeManagement/AdminNoticeCreate" element={<AdminRoute element={<AdminNoticeCreate />} />} />
          <Route path="/Admin/NoticeManagement/AdminNoticeEdit" element={<AdminRoute element={<AdminNoticeEdit />} />} />

          {/* Survey Management Routes */}
          <Route path="/Admin/SurveyManagement/AdminSurveyList" element={<AdminRoute element={<AdminSurveyList />} />} />
          <Route path="/Admin/SurveyManagement/AdminSurveyDetail/:surveyId" element={<AdminRoute element={<AdminSurveyDetail />} />} />
          <Route path="/Admin/SurveyManagement/AdminSurveyCreate" element={<AdminRoute element={<AdminSurveyCreate />} />} />

          {/* Statistics Management Route */}
          <Route path="/Admin/StatisticsManagement/AdminStatistics" element={<AdminRoute element={<AdminStatistics />} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;