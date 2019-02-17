HOMEWORK_NUMBERS = 1

deps:
	git clone https://github.com/szecsi/WebGLMath

hw_1: animated_texture

animated_texture:
	firefox animated_texture/index.html

all:
	$(foreach var,$(HOMEWORK_NUMBERS),make hw_$(var);)


.PHONY: deps all animated_texture hw_1
