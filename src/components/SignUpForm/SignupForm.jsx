import { useState, useEffect } from 'react';
import axios from 'axios';
import './SignUpForm.css';
import SignupCompleteModal from '../modals/SignupCompleteModal';

const SignUpForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [referral, setReferral] = useState('');
  const [errors, setErrors] = useState({});
  const [emailCheckMessage, setEmailCheckMessage] = useState({ text: '', styleClass: '' });
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState({ text: '', styleClass: '' });
  const [passwordMatchError, setPasswordMatchError] = useState({ text: '', styleClass: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        const response = await axios.post('http://34.22.76.114:8084/auth/sign-up', {
          email,
          name,
          password,
          birthDate: birthdate,
          nickname,
          agreeTerms: true,      // 약관 동의
          inflow: referral,
          gender,
          nicknameDuplicate: true // 닉네임 중복 확인 완료 예시
        });
  
        if (response.status === 200) {
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error('회원가입 중 오류 발생:', error);
        const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
        setErrors({ ...errors, submit: errorMessage });
      }
    } else {
      setErrors(getErrors());
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isFormValid = () => {
    return (
      name &&
      nickname &&
      email &&
      password &&
      confirmPassword &&
      gender &&
      birthdate &&
      referral &&
      isEmailValid() &&
      isNicknameValid() &&
      password === confirmPassword
    );
  };

  const getErrors = () => {
    const newErrors = {};
    if (!name) newErrors.name = '이름을 입력해주세요';
    if (!nickname) newErrors.nickname = '닉네임을 입력해주세요';
    else if (!isNicknameValid()) newErrors.nickname = '올바른 닉네임을 입력해주세요';
    if (!email) newErrors.email = '이메일을 입력해주세요';
    else if (!isEmailValid()) newErrors.email = '올바른 이메일 형식을 입력해주세요';
    if (!password) newErrors.password = '비밀번호를 입력해주세요';
    if (!confirmPassword) newErrors.confirmPassword = '비밀번호를 다시 입력해주세요';
    if (!gender) newErrors.gender = '성별을 선택해주세요';
    if (!birthdate) newErrors.birthdate = '생년월일을 입력해주세요';
    if (!referral) newErrors.referral = '경로를 선택해주세요';
    return newErrors;
  };

  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isNicknameValid = () => {
    const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,10}$/;
    return nicknameRegex.test(nickname);
  };

  const checkEmailDuplicate = async () => {
    if (!isEmailValid()) {
      setErrors((prevErrors) => ({ ...prevErrors, email: '올바른 이메일 형식을 입력해주세요' }));
      return;
    }

    try {
      const response = await axios.get(`/auth/check-duplicate/email?email=${email}`);
      setEmailCheckMessage({
        text: response.data.isDuplicate ? '이미 사용 중인 이메일입니다.' : '사용 가능한 이메일입니다!',
        styleClass: response.data.isDuplicate ? 'error-message' : 'success-message',
      });
    } catch (error) {
      console.error('이메일 중복 확인 오류:', error);
    }
  };

  const checkNicknameDuplicate = async () => {
    if (!nickname) {
      setNicknameCheckMessage({ text: '닉네임을 입력해주세요', styleClass: 'error-message' });
      setErrors((prevErrors) => ({ ...prevErrors, nickname: '' }));
      return;
    } else if (!isNicknameValid()) {
      setNicknameCheckMessage({ text: '올바른 닉네임을 입력해주세요', styleClass: 'error-message' });
      return;
    }

    try {
      const response = await axios.get(`/auth/check-duplicate/nickname?nickname=${nickname}`);
      setNicknameCheckMessage({
        text: response.data.isDuplicate ? '이미 사용 중인 닉네임입니다.' : '사용 가능한 닉네임입니다!',
        styleClass: response.data.isDuplicate ? 'error-message' : 'success-message',
      });
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error);
    }
  };

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordMatchError({ text: '비밀번호가 일치하지 않습니다.', styleClass: 'error-message' });
    } else {
      setPasswordMatchError({ text: '', styleClass: '' });
    }
  }, [password, confirmPassword]);

  return (
    <div className="signupform-container">
      <form className="signupform-form" onSubmit={handleSubmit}>
        <h2>Adore</h2>
        <div className="signupform-form-group">
          <label>이름</label>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
            }}
          />
          {errors.name && <p className="signupform-error-message">{errors.name}</p>}
        </div>
        <div className="signupform-form-group">
          <label>닉네임</label>
          <div className="signupform-input-group">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, nickname: '' }));
                setNicknameCheckMessage({ text: '', styleClass: '' });
              }}
            />
            <button type="button" className="signupform-duplicate-check-btn" onClick={checkNicknameDuplicate}>
              중복 확인
            </button>
          </div>
          {errors.nickname && !nicknameCheckMessage.text && (
            <p className="signupform-error-message">{errors.nickname}</p>
          )}
          {nicknameCheckMessage.text && (
            <p className={nicknameCheckMessage.styleClass}>{nicknameCheckMessage.text}</p>
          )}
        </div>
        <div className="signupform-form-group">
          <label>아이디(이메일)</label>
          <div className="signupform-input-group">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
                setEmailCheckMessage({ text: '', styleClass: '' });
              }}
            />
            <button type="button" className="signupform-duplicate-check-btn" onClick={checkEmailDuplicate}>
              중복 확인
            </button>
          </div>
          {errors.email && <p className="signupform-error-message">{errors.email}</p>}
          {emailCheckMessage.text && <p className={emailCheckMessage.styleClass}>{emailCheckMessage.text}</p>}
        </div>
        <div className="signupform-form-group">
          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
            }}
          />
          {errors.password && <p className="signupform-error-message">{errors.password}</p>}
        </div>

        <div className="signupform-form-group">
          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
            }}
          />
          {errors.confirmPassword && <p className="signupform-error-message">{errors.confirmPassword}</p>}
          {passwordMatchError.text && <p className={passwordMatchError.styleClass}>{passwordMatchError.text}</p>}
        </div>

        <div className="signupform-form-group signupform-horizontal-group">
          <div className="signupform-sub-group">
            <label>생년월일</label>
            <input
              type="date"
              placeholder="생년월일              "
              value={birthdate}
              onChange={(e) => {
                setBirthdate(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, birthdate: '' }));
              }}
            />
            {errors.birthdate && <p className="signupform-error-message">{errors.birthdate}</p>}
          </div>

          <div className="signupform-sub-group">
            <label>성별</label>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, gender: '' }));
              }}
            >
              <option value="">선택해주세요</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
            {errors.gender && <p className="signupform-error-message">{errors.gender}</p>}
          </div>

          <div className="signupform-sub-group">
            <label>유입경로</label>
            <select
              value={referral}
              onChange={(e) => {
                setReferral(e.target.value);
                setErrors((prevErrors) => ({ ...prevErrors, referral: '' }));
              }}
            >
              <option value="">선택해주세요</option>
              <option value="SEARCH">인터넷 검색</option>
              <option value="INTRODUCED">지인 소개</option>
            </select>
            {errors.referral && <p className="signupform-error-message">{errors.referral}</p>}
          </div>
        </div>

        <button type="submit" className="signupform-submit-btn">회원 가입</button>
        {errors.submit && <p className="signupform-error-message">{errors.submit}</p>}
      </form>

      <SignupCompleteModal show={isModalOpen} handleClose={handleCloseModal} />
    </div>
  );
};

export default SignUpForm;