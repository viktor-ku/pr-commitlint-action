repo = vikuko/pr-commitlint-action

all:
	echo $(ARGS)

ncc:
	npm run build

docker/build: ncc
	docker build --tag $(repo):latest dockerhub

docker/push: docker/build
	docker push $(repo):latest
