set(CUR_PROJ_NAME poly2tri) 
set(CUR_PROJ_DIR ${LIB_DIR}/poly2tri)


#将本工程路径下的所有文件添加到all_files中
add_source_by_dir(${CUR_PROJ_DIR} all_files)

#设置本工程的引用路径
include_directories(${CUR_PROJ_DIR})

#设置本工程的编译
add_library(${CUR_PROJ_NAME} STATIC ${all_files})

#设置本工程的输出
default_output(${CUR_PROJ_NAME} ${BIN_DIR})
SET_PROPERTY(TARGET ${CUR_PROJ_NAME} PROPERTY FOLDER "lib")