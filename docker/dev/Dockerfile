FROM strongloop/node

MAINTAINER David You <bmfrog2@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN sudo apt-get update

# set locale ko_KR

RUN sudo apt-get install -y locales
RUN sudo dpkg-reconfigure locales 
RUN sudo locale-gen C.UTF-8 
RUN sudo /usr/sbin/update-locale LANG=C.UTF-8
	
# Install needed default locale for Makefly
RUN echo 'ko_KR.UTF-8 UTF-8' | sudo tee --append /etc/locale.gen
RUN sudo locale-gen

# Set default locale for the environment
ENV LC_ALL C.UTF-8
ENV LANG ko_KR.UTF-8
ENV LANGUAGE ko_KR.UTF-8

RUN sudo apt-get update

# Install 
RUN sudo apt-get install -y build-essential

# Node update
RUN sudo npm cache clean -f
RUN sudo npm install -g n
RUN sudo n stable

# Install 
RUN sudo npm install -g gulp 
RUN sudo npm install -g bower
RUN sudo npm install -g grunt-cli

WORKDIR /work/

EXPOSE 3000 35729 6800

