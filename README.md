# :page_with_curl: SSAFY STOCK - 증권 주가 예측, 투자 전략 웹 서비스 개발

![로고](/uploads/795f3ddd6d8916d148ccacfa04d43c74/logo.png)

SSAFY STOCK은 증권 데이터 분석을 통한 주가예측, 투자 전략 웹 서비스 개발 서비스 입니다.

1. 증권 데이터 실시간 조회
    - 매일 변화하는 증권 데이터를 실시간으로 조회할 수 있도록 DB 구성, 시세 조회란에서 확인 가능
2. 트레이딩 전략 소개
    - 증권 거래액에 따른 다양한 트레이딩 전략 제공 (효율적 투자선, 볼린저 밴드-추세, 볼린저 밴드-반전, 삼중창 매매, 듀얼 모멘텀)
3. 백테스팅
    - 과거의 주가 데이터를 반영해 현재의 트레이딩 전략이 얼마나 효과적인지 가늠하는 백테스팅 기능 제공
4. 주가예측
    - RNN, LSTM을 사용한 딥러닝 기반의 주가 예측 서비스제공

[여기](http://ssafyfinance.com/)를 클릭해 사이트를 확인하세요 :smile:


## 📌 목차
[:page_with_curl: STORE - 파이썬 증권 데이터 프로젝트](#-store---파이썬 증권 데이터 프로젝트)

* [시작하기](#-시작하기)
  * [시작하기에 앞서](#시작하기에-앞서)
  * [설치하기](#설치하기)
  * [실행하기](#실행하기)
  * [배포하기](#배포하기)
  * [데모](#데모)
* [지원하는 브라우저](#-지원하는-브라우저)
* [사용된 도구](#-사용된-도구)
* [사용된 기술](#-사용된-기술)
  * [프론트엔드](#프론트엔드)
  * [백엔드](#백엔드)
* [Commit Convention](#-commit-convention)
* [저자](#-저자)
* [라이센스](#-라이센스)
* [참고](#참고)


## :runner: 시작하기

아래 방법을 따르시면 프로젝트를 실행시킬 수 있습니다.

### 시작하기에 앞서

* Windows 10
* Python 3.5.3
* django 3.0.2
* npm 6.14.8
* Visual Studio Code 1.48

### 설치하기

1. git clone으로 repository를 받습니다. 

   ```shell
   $ git clone https://lab.ssafy.com/s03-final/s03p31a106.git
   $ cd s03p31a106
   ```

2. requirements.txt에 명시된 패키지들을 pip를 이용해 다운로드받습니다. 

   ```shell
   $ pip install -r requirements.txt
   ```

### 실행하기

1. **백엔드** 서버를 실행합니다.

2. **프론트엔드**를 실행합니다.


### 배포하기

해당 서비스는 `AWS EC2, 가비아`를 이용하여 배포하였습니다.


### 데모

[여기](http://ssafyfinance.com/)를 클릭하세요.


## :globe_with_meridians: 지원하는 브라우저

| 크롬   | 사파리 | edge   | firefox |
| ------ | ------ | ------ | ------- |
| latest | latest | latest | latest  |


## :hammer_and_wrench: ​사용된 도구
* React
* django 3.0.2
* npm 6.14.8
* Visual Studio Code 1.48
* Docker

## :desktop_computer: 사용된 기술

![API](/uploads/1d53df7ec1f03e956c1c49137350e7ad/API.png)


#### 프론트엔드

| Technology | Description    | Official website          |
| ---------- | -------------- | ------------------------- |
| React      | Project UI, UX | https://ko.reactjs.org/   |
| BootStrap  | Project UI, UX | https://getbootstrap.com/ |


#### 백엔드

| Technology | Dscription                      | Official Website                        |
| ---------- | ------------------------------- | --------------------------------------- |
| Django     | RESTAPI_framework               | https://www.djangoproject.com/download/ |
| MariaDB    | 주식 종목 조회 API              | https://mariadb.org/                    |
| Tensorflow | RNN 딥러닝을 통한 주가예측 기능 | https://www.tensorflow.org/?hl=ko       |
| Docker     | 주식 가격 DB 자동 업데이트 파일 | https://www.docker.com/get-started      |




## :straight_ruler: Commit Convention

1. __branch 종류__

  - __develop-_[이니셜]___ : 각 개발자들이 작업하는 개인 공간.

2. __Commit 메세지 Format__  
   ___"[type]commit message, [issue Key] "___  
     _ex) git commit -m "[Add] <기능설명>, [jira Key]"_

  - __Add :__ 주식 종목 시세 일자별 조회 DB 구축
  - __Fix :__ 주식 종목 데이터 정보량 추가 중
  - __Modify :__ AWS E2C 서버에 DB 올리는 중
  - __Test :__ 테스트용 코드.
  - __Style :__ 단순 코드 포멧팅.(세미콜론 누락, 들여쓰기 등).
  - __Doc :__ 문서(.md 등) 수정.


## 👤 저자

* 정다비치 - Davichi Jeong - davichiar8@gmail.com - @davichiar
* 윤인하 - Inha Yoon / HiNew - dlsgk147@naver.com - @dlsgk147
* 손재민 - Jaemin Son - dlrjsspdlqjdkrl712@naver.com - @dlrjsspdlqjdkel712 
* 박명준 - Myung Jun Park - juneblack@naver.com - @juneblack
* 김영훈 - Younghoon Kim - kyhoon001@naver.com @kyhoon001


## :page_with_curl: 라이센스

```
Copyright (c) 2015 Juns Alen

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```


## 참고

* https://github.com/admin-dashboards/react-dashboard-materialpro-lite
