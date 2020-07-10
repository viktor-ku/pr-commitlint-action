repo = vikuko/pr-commitlint-action
rev = latest
tag = $(repo):$(rev)

all:
	echo all

clean/dockerhub:
	rm -rf dockerhub/action

ncc: clean/dockerhub
	npm run build

docker/build: ncc
	docker build --tag $(tag) dockerhub

docker/push: docker/build
	docker push $(tag)
