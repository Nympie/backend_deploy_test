# 1. 운영체제 및 프로그램 설치하기 (하나하나 입력하는 방식)
# FROM ubuntu:22.04

# RUN sudo apt install nodejs
# RUN sudo npm install -g yarn


# 1. 운영체제 및 프로그램 설치하기 (모두 깔려있는 것 한번에 다운받는 방식)
FROM node:16

# 2. 내 컴퓨터에 있는 폴더나 파일을 도커 컴퓨터 안에 복사하기
# COPY 시 디렉토리가 없으면 자동으로 생성

# 도커는 이전 build가 있을 경우 새로운 build 시 cache에 build한 것들을 저장해 놓고 가져다가 쓴다.
# 다만, 한번이라도 cache와 매칭이 되지 않는 라인이 생길 시 그 하단 부분은 전부 새로 실행한다.
COPY ./package.json /myDirectory/
COPY ./yarn.lock /myDirectory/
WORKDIR /myDirectory
RUN yarn install --ignore-engines
# RUN yarn install

# 이를 해결하기 위해 순서를 바꿔주면 된다.
COPY . .

# CMD와 RUN 모두 실행이지만 RUN은 build 후 image에 포함되지만 CMD는 포함되지 않으며, CMD는 파일내 단 한번만 사용가능하다.
# 3. 도커안에서 파일 실행시키기
CMD yarn nodemon ./index.js


# docker stop으론 프로그램을 중지하는거지 가상머신을 삭제한게 아니다 이를 삭제하기 위해선 docker rm containerId를 사용해야 한다.
# docker ps -a를 하면 가상머신의 리스트를 볼 수 있고 -q를 해주면 containerId 리스트를 받아올 수 있다.
# 리눅스에서 백틱은 (``) 명령어상 먼저 실행하게 해준다. 즉, 리스트를 먼저 불러오고 docker rm을 진행하는 것이다.

# docker ps -a -q
# docker rm containerId
# docker rm `docker ps -a -q`

# docker system prune -a를 치면 정지된 프로그램과 이미지들을 전부 삭제해준다. cache도 삭제해준다.
# docker system prune -a