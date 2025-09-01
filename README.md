# 🚀  Adore‑FE (2024.09 ~ 2024.12)

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React%20JS-61DAFB?logo=react&logoColor=white"/></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white"/></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white"/></a>
  <a href="https://www.jenkins.io/"><img src="https://img.shields.io/badge/Jenkins-000000?logo=jenkins&logoColor=white"/></a>
</p>

---
###  프로젝트 개요
**Adore‑FE**는 React, TypeScript, Vite 기반의 Web 서비스 입니다. 
<br/>
저는 이 프로젝트에서 **프론트엔드 전반**을 담당했습니다.

---

### 🛠️  기술 스택

| 영역         | 사용 기술 및 도구 |
|--------------|------------------|
| **Frontend** | <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white"/> <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white"/> |
| **스타일/UI**  | <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white"/> (확장 시 Tailwind / Styled-Components 가능) |
| **컨테이너화**  | <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white"/> <img src="https://img.shields.io/badge/docker--compose-2496ED?logo=docker&logoColor=white"/> |
| **CI/CD**    | <img src="https://img.shields.io/badge/Jenkins-D24939?logo=jenkins&logoColor=white"/> (Jenkinsfile 기반 파이프라인) |
| **품질 관리**  | <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white"/> |
| **빌드 설정**  | vite.config.ts · tsconfig.json |

---

###  디렉토리 구조
```text
.
├── public/                 # 정적 리소스 (index.html 등)
├── src/                    # 프론트엔드 소스 코드
├── Dockerfile              # Docker 이미지 정의
├── docker-compose.yml      # 컨테이너 실행 설정
├── Jenkinsfile             # CI/CD 파이프라인 구성
├── vite.config.ts          # Vite 설정
├── tsconfig.json           # TypeScript 설정
└── eslint.config.js        # ESLint 규칙 설정
```

---

###  기여 & 역할
- **프론트엔드 전체 개발**
- **코드 품질 관리 및 린팅 설정**: ESLint 기반 코드 일관성 유지

---

###  실행 가이드
```bash
# 개발 환경 실행
npm install
npm run dev

# Docker 환경 실행
docker-compose up --build
```

모든 커밋은 Jenkins 파이프라인을 통해 자동으로 빌드 및 릴리즈됩니다.

---

###  회고 / 성과 요약
- **배운 점**: 프론트엔드뿐 아니라 배포 흐름까지 아우르는 풀 스택 워크플로우 경험  
- **도전 과제**: Docker 기반 파일 경로, 빌드 캐시, 네트워크 설정 등 환경 문제 해결  
- **성과**: UI 구현에서 컨테이너 빌드, CI/CD 자동화까지 한 사람이 완수한 높은 완성도 프로젝트

---

###  향후 확장 방향
- 테스트 도입 (Jest + React Testing Library)
- 스타일 확장 (Tailwind CSS 등 UI 프레임워크 적용)
- 클라우드 기반 배포 환경 구성 (GitHub Actions, AWS/GCP 연동)

---

© 2025 Adore‑FE – Power by Frontend Engineering
