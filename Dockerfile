FROM node:8

USER node

RUN mkdir -p /home/node/src
WORKDIR /home/node/src

CMD ["/bin/bash"]

# 1. build image
# docker build -t upload-rsync .

# 2a. create container
# docker run -ti -v ${PWD}:/home/node/src --name upload-rsync upload-rsync

# 2b. after that start or stop
# docker start -i upload-rsync
# docker stop upload-rsync
# docker rm upload-rsync
