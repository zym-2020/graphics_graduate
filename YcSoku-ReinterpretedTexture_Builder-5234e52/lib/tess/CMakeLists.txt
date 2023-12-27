cmake_minimum_required (VERSION 3.0)
set(CUR_PROJ_NAME 	tess)
set(CUR_PROJ_DIR	${LIB_DIR}/tess)
#添加源代码
add_source_by_dir(${CUR_PROJ_DIR}   all_files)
#设置包含目录
include_directories(${CUR_PROJ_DIR}/include)
include_directories(${CUR_PROJ_DIR}/src)
#设置生成库
add_library(${CUR_PROJ_NAME} STATIC ${all_files})
#设置链接目录
link_directories(${BIN_DIR})
default_output(${CUR_PROJ_NAME} ${BIN_DIR})
#设置vs工程属性
SET_PROPERTY(TARGET ${CUR_PROJ_NAME} PROPERTY FOLDER "lib")