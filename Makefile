repo = vikuko/pr-commitlint-action
version = ${VERSION}
tag = $(repo):$(version)

all:
	echo $(tag)

clean/dockerhub:
	rm -rf dockerhub/action

ncc: clean/dockerhub
	npm run build

docker/build: ncc
	docker build --tag $(tag) dockerhub

docker/push: docker/build
	docker push $(tag)
