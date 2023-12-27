# ReinterpretedTexture_Builder
A texture builder for the [web prototype system](https://github.com/YcSoku/ReinterpretedTexture_Rendering) about a vector point symbol rendering method based on the texture structure. It can transfer TrueType or SVG symbols to reinterpreted textures.

This builder is developed by C++ and Python. The C++ program (vtexture) need to be built before using Python codes.


# Building vtexture
(Cmake version >= 3.15)

```
cd ReinterpretedTexture_Builder

mkdir build
cd build

cmake -DCMAKE_BUILD_TYPE=Debug ..
build
```
