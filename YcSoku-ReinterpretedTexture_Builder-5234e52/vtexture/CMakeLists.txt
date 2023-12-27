cmake_minimum_required (VERSION 3.5)
set(CUR_PROJ_NAME 	vtexture)
set(CUR_PROJ_DIR	${SLN_DIR}/vtexture)
#添加源代码
add_source_by_dir(${CUR_PROJ_DIR}   all_files)
#设置包含目录
include_directories(${CUR_PROJ_DIR}/include)
include_directories(${CUR_PROJ_DIR}/src)
include_directories(${CUR_PROJ_DIR}/aggsvg)
include_directories(${CUR_PROJ_DIR}/aggfreetype)
include_directories(${CUR_PROJ_DIR}/shaping)
include_directories(${LIB_DIR}/agg/include)
include_directories(${LIB_DIR}/gpc)
include_directories(${LIB_DIR}/tess/include)
include_directories(${LIB_DIR}/strips)
include_directories(${LIB_DIR}/freetype/include)


#设置生成库
add_executable(${CUR_PROJ_NAME}  ${all_files})
#设置链接目录
link_directories(${BIN_DIR})

target_link_libraries(${CUR_PROJ_NAME}  expat agg gpc tess strips freetype)

default_output(${CUR_PROJ_NAME} ${BIN_DIR})
#设置vs工程属性
SET_PROPERTY(TARGET ${CUR_PROJ_NAME} PROPERTY FOLDER "lib")