# 版本要求
cmake_minimum_required(VERSION 3.15.0)
# 解决方案名称
project(VTexture)


#启用分组功能
SET_PROPERTY(GLOBAL PROPERTY USE_FOLDERS ON)

# 工程文件中使用相对路径
SET(CMAKE_SUPPRESS_REGENERATION 1)
SET(CMAKE_USE_RELATIVE_PATHS ON)
# 支持IF(A) ELSE()的写法
SET(CMAKE_ALLOW_LOOSE_LOOP_CONSTRUCTS ON)

############################################################################
# 定义一系列宏，方便工程操作

# 宏：add_sourcefile 添加path所有文件到变量var中
macro (add_sourcefile path var)
	aux_source_directory(${path} TEMP_SRC_LISTS)
	set(${var} ${${var}} ${TEMP_SRC_LISTS})
endmacro()

# 宏：source_group_by_dir 将所有文件按文件夹分组，前提是source_files中已经有文件了
macro(source_group_by_dir refPath source_files)
    if(MSVC)
		set(sgbd_cur_dir ${refPath})
        foreach(sgbd_file ${${source_files}})
			string(REGEX REPLACE ${sgbd_cur_dir}/\(.*\) \\1 sgbd_fpath ${sgbd_file})
            string(REGEX REPLACE "\(.*\)/.*" \\1 sgbd_group_name ${sgbd_fpath})
            string(COMPARE EQUAL ${sgbd_fpath} ${sgbd_group_name} sgbd_nogroup)
            string(REPLACE "/" "\\" sgbd_group_name ${sgbd_group_name})
            if(sgbd_nogroup)
                set(sgbd_group_name "\\")
            endif(sgbd_nogroup)
            source_group(${sgbd_group_name} FILES ${sgbd_file})
        endforeach(sgbd_file)
    endif(MSVC)
endmacro(source_group_by_dir)

# 宏：add_source_by_dir 将文件夹refPath下的所有.h/.cpp/.c添加到source_files 并按子文件夹分组
macro(add_source_by_dir refPath source_files)
	file(GLOB_RECURSE ${source_files} 
	${refPath}/*.h
	${refPath}/*.hpp
	${refPath}/*.cpp 
	${refPath}/*.cc 
	${refPath}/*.c)
	source_group_by_dir(${refPath}  ${source_files} ) 
endmacro(add_source_by_dir)

# 宏：add_mfc_source_by_dir 将文件夹refPath下的所有.h/.cpp/.c添加到source_files 并按子文件夹分组
macro(add_mfc_source_by_dir refPath source_files)
	file(GLOB_RECURSE ${source_files} 
	${refPath}/*.h
	${refPath}/*.cpp 
	${CUR_PROJ_DIR}/*.ico 
	${CUR_PROJ_DIR}/*.bmp
	${CUR_PROJ_DIR}/*.rc
	${CUR_PROJ_DIR}/*.rc2)
	source_group_by_dir(${refPath}  ${source_files} ) 
endmacro(add_mfc_source_by_dir)

# 宏：defualt_output 默认输出动态库和静态库到ouputdir下
macro (default_output targetname ouputdir)
	set_target_properties(${targetname} PROPERTIES
						RUNTIME_OUTPUT_DIRECTORY ${ouputdir}
						ARCHIVE_OUTPUT_DIRECTORY ${ouputdir}
						LIBRARY_OUTPUT_DIRECTORY ${ouputdir})
endmacro()


# 宏：install_header_by_dir 将refPath下所有头文件按文件夹安装布署到installPath下
macro(install_header_by_dir refPath installPath)
	file(GLOB_RECURSE source_files
	${refPath}/*.h
	${refPath}/*.hpp)
	
	set(sgbd_cur_dir ${refPath})
	foreach(sgbd_file ${source_files})
		#从文件名中截取出相对路径sgbd_group_name
		string(REGEX REPLACE ${sgbd_cur_dir}/\(.*\) \\1 sgbd_fpath ${sgbd_file})
		string(REGEX REPLACE "\(.*\)/.*" \\1 sgbd_group_name ${sgbd_fpath})
		string(COMPARE EQUAL ${sgbd_fpath} ${sgbd_group_name} sgbd_nogroup)
		string(REPLACE "/" "\\" sgbd_group_name ${sgbd_group_name})
		if(sgbd_nogroup)
			set(sgbd_group_name "\\")
		endif(sgbd_nogroup)
		
		#将文件安装布置到安装路径下的相对路径
		install(FILES ${sgbd_file}
			DESTINATION ${installPath}/${sgbd_group_name})
	endforeach(sgbd_file)
endmacro(install_header_by_dir)

# 宏：default_install 默认安装动态库和静态库到bin\lib下，并安装头文件到include下
macro (default_install targetname headfilesdir bindir libdir incdir)
	install(TARGETS ${targetname}
			RUNTIME DESTINATION ${bindir}
			LIBRARY DESTINATION ${bindir}
			ARCHIVE DESTINATION ${libdir})
			
	install_header_by_dir(${headfilesdir} ${incdir})
endmacro()

# 宏：default_install 默认安装动态库和静态库到bin\lib下，并安装头文件到include下
#macro (add_SlnPath)
#	set(DATA_DIR -DDATA_DIR="${SLN_DIR}")
#	add_definitions(${DATA_DIR})
#endmacro()

############################################################################
# 定义工程的顶级路径及子路径， 
SET(SLN_DIR		${CMAKE_CURRENT_SOURCE_DIR})
SET(BIN_DIR		${CMAKE_BINARY_DIR}/bin/${CMAKE_BUILD_TYPE})
SET(BUILD_DIR	${CMAKE_BINARY_DIR}/build/${CMAKE_BUILD_TYPE})
#SET(XDK_DIR		${SLN_DIR}/nkgis)
SET(LIB_DIR		${SLN_DIR}/lib)

############################################################################
# 定义工程的安装路径，需要用户自定义修改
SET(INSTALL_DIR	${CMAKE_BINARY_DIR}/install)
SET(INS_BIN_DIR	${INSTALL_DIR}/bin)
SET(INS_LIB_DIR	${INSTALL_DIR}/lib)
SET(INS_INC_DIR	${INSTALL_DIR}/include)


#include(CheckCXXCompilerFlag)
#CHECK_CXX_COMPILER_FLAG("-std=c++11" COMPILER_SUPPORTS_CXX11)
#CHECK_CXX_COMPILER_FLAG("-std=c++0x" COMPILER_SUPPORTS_CXX0X)
#if(COMPILER_SUPPORTS_CXX11)
#        set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
#elseif(COMPILER_SUPPORTS_CXX0X)
#        set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++0x")
#else()
#     message(STATUS "The compiler ${CMAKE_CXX_COMPILER} has no C++11 support. Please use a different C++ compiler.")
#endif()

set(CMAKE_CXX_STANDARD 17)

if (NOT ${CMAKE_GENERATOR} MATCHES "Visual Studio")
	if(${CMAKE_BUILD_TYPE} STREQUAL Debug)
		add_definitions(-D_DEBUG)
		message(STATUS "generating DEBUG version!!!")
	endif()
endif()

add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
add_compile_options("$<$<CXX_COMPILER_ID:MSVC>:/utf-8>")

add_compile_options("$<$<C_COMPILER_ID:GNU>:-fPIC>")
add_compile_options("$<$<CXX_COMPILER_ID:GNU>:-fPIC>")
add_compile_options("$<$<C_COMPILER_ID:Clang>:-fPIC>")
add_compile_options("$<$<CXX_COMPILER_ID:Clang>:-fPIC>")

############################################################################
#添加工程
add_subdirectory(vtexture)
add_subdirectory(lib)






