cd /home/deploy/karaoke-frontend
docker rm $(docker stop $(docker ps -a -q -f ancestor=frontend))
docker build --rm -f Dockerfile -t frontend .
docker run --rm -d -p 80:80 frontend
