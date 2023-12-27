#ifndef __C_SHAPE_TRIANGLUATION_GLU_H__
#define __C_SHAPE_TRIANGLUATION_GLU_H__
#ifdef _WIN32
	#include <Windows.h>
	#include <gl/GLU.h>
	#define GLAPIENTRY GLAPIENTRY
#else
	#include "sk_glu.h"
#endif
#include "shMulti.h"
#include <string>
#include <list>
#include <algorithm>

//#define  Sk_gluDeleteTess		gluDeleteTess;
//#define  Sk_gluTessProperty		gluTessProperty;
//#define  Sk_gluGetTessProperty	gluGetTessProperty;
//#define  Sk_gluTessNormal		gluTessNormal;
//#define  Sk_gluTessCallback		gluTessCallback;
//#define  Sk_gluTessVertex		gluTessVertex;
//#define  Sk_gluTessBeginPolygon gluTessBeginPolygon;
//#define  Sk_gluTessBeginContour gluTessBeginPolygon;
//#define  Sk_gluTessEndContour	gluTessEndContour;
//#define  Sk_gluTessEndPolygon	gluTessEndPolygon;

namespace shaping{
using namespace std;
	//!三角化控制器
	class TrianglizeControl
	{
	public:
		//!将点投影到平面上
		virtual int  input(const Point3dd& src,Point3dd& point,int id)=0;
		//!获得插值点
		virtual void output(const Point3dd& src,Point3dd& point,color_t& color,Vector3df& normal,Vector2df& texcoord)=0;
		//!重新插值
		virtual void reinterpolate(const Point2dd& src,Point3dd& point,color_t& color,Vector3df& normal,Vector2df& texcoord)=0;
	};

	//!三角化控制器
	class CTrianglizeControlDefault:public TrianglizeControl
	{
	public:
		CTrianglizeControlDefault(bool ufch=false, double h=0)
			:use_force_height(ufch),height(h)
		{
			//height = h;
		}
		bool use_force_height;
		double height;
		//!将点投影到平面上
		virtual int  input(const Point3dd& src,Point3dd& point,int id)
		{
			point =src;
			return id;
		}
		//!获得插值点
		virtual void output(const Point3dd& src,Point3dd& point,color_t& color,Vector3df& normal,Vector2df& texcoord)
		{
			point = src;
			if (use_force_height)
				point.Z = height;
		}
		//!重新插值
		virtual void reinterpolate(const Point2dd& src,Point3dd& point,color_t& color,Vector3df& normal,Vector2df& texcoord)
		{
			point=Vector3dd(src.X,src.Y, height);
		}
	};
	
	//!基于GLU的三角化算法
	class CShapeTriangulationGLU
	{
		typedef CShapeTriangulationGLU selfType;
	public:
		//!构造函数
		CShapeTriangulationGLU(TrianglizeControl* control):m_control(control){}

		//!三角化
		CShapeMeshBuffer* triangulate(ShapePLine* path)
		{
			class CShapePolyWrap:public ShapePLines
			{
				SH_OBJECT();
			public:
				CShapePolyWrap(ShapePLine* path):m_path(path){}
				int count(){return 1;}
				ShapePLine* item(int){return m_path;}
				ShapePLine* m_path;
			};
			CShapePolyWrap poly(path);
			CShapeMeshBuffer* patch = triangulate(&poly);
			patch->m_segmentList.resize(patch->m_points.size());
			for (int i = 0; i < patch->m_points.size(); ++i)
			{
				patch->m_segmentList[i] = i;
			}
			return patch;
		}
		
		//!三角化
		CShapeMeshBuffer* triangulate(ShapePLines* poly)
		{
			typedef void (GLAPIENTRY *GluTessCallbackType)();
			Point3dd   tp;
			int		   id=0;
			
			GLUtesselator* tess = gluNewTess();//创建tess对象
			//注册回调函数
			gluTessCallback(tess,GLU_TESS_BEGIN_DATA,(GluTessCallbackType)CShapeTriangulationGLU::beginDataCB);
			gluTessCallback(tess,GLU_TESS_END_DATA,(GluTessCallbackType)CShapeTriangulationGLU::endDataCB);
			gluTessCallback(tess,GLU_TESS_VERTEX_DATA,(GluTessCallbackType)CShapeTriangulationGLU::vertexDataCB);
			gluTessCallback(tess,GLU_TESS_EDGE_FLAG_DATA,(GluTessCallbackType)CShapeTriangulationGLU::edgeFlagDataCB);
			gluTessCallback(tess,GLU_TESS_COMBINE_DATA,(GluTessCallbackType)CShapeTriangulationGLU::combineDataCB);
			gluTessCallback(tess,GLU_TESS_ERROR_DATA,(GluTessCallbackType)CShapeTriangulationGLU::errorDataCB);
			//开始输入多边形
			gluTessBeginPolygon(tess,(void*)this);//开始多边形
			m_patch= CShapeMeshBuffer::create(ShapeMeshBuffer::eTriangleList);
			m_patch->makeVertexBuffer(0,true,true,true);
			for(int i=0;i<poly->count();i++)
			{
				ShapePLine* path = poly->item(i);
				gluTessBeginContour(tess);
				for(int k=0;k<path->np();k++)
				{	
					Point3dd p;
					int data = m_control->input(path->p(k),p,id++);
					Point3dd		 point;
					color_t color;
					Vector3df		 normal;
					Vector2df		 texcoord;
					m_control->output(path->p(k),point,color,normal,texcoord);
					m_patch->addPoint(point);
					m_patch->modifyLastColor(color);
					m_patch->modifyLastNormal(normal);
					m_patch->modifyLastTexCoord(texcoord);
					
					gluTessVertex(tess,&p.X,(void**)size_t(data));
				}
				gluTessEndContour(tess);
			}//
			gluTessEndPolygon(tess);
			gluDeleteTess(tess);
			CShapeMeshBuffer* patch = m_patch;
			m_patch=NULL;

			return patch;
		}
	private:
		TrianglizeControl* 	m_control;
		CShapeMeshBuffer*			m_patch;
	private:	
		void GLAPIENTRY beginData(GLenum type)
		{
			if(type==GL_TRIANGLES)
				m_patch->setPrimitive(ShapeMeshBuffer::eTriangleList);
			if(type==GL_TRIANGLE_FAN)
				m_patch->setPrimitive(ShapeMeshBuffer::eTriangleFan);
			if(type==GL_TRIANGLE_STRIP)
				m_patch->setPrimitive(ShapeMeshBuffer::eTriangleStrip);
			m_patch->makeIndexBuffer(0);
		}
		void GLAPIENTRY endData(){}
		void GLAPIENTRY vertexData(int id){
			m_patch->addIndex(id);
		}
		void GLAPIENTRY edgeFlagData(GLboolean flag){
		}
		void GLAPIENTRY combineData(GLdouble coords[3],void* vertex_data[4], GLfloat weight[4],void** outData)
		{
			m_patch->addPoint(point_t(coords[0],coords[1],coords[2]));
			*((size_t*)outData)=(m_patch->np()-1);
		}
		void GLAPIENTRY errorData(GLenum errno1){
		}
	private:
		static void GLAPIENTRY  beginDataCB(GLenum type,selfType* thiz){
			thiz->beginData(type);
		}
		static	void GLAPIENTRY endDataCB(selfType* thiz){
			thiz->endData();
		}
		static	void GLAPIENTRY vertexDataCB(void* id,selfType* thiz){
			thiz->vertexData((size_t)id);
		}
		static	void GLAPIENTRY edgeFlagDataCB(GLboolean flag,selfType* thiz){
			thiz->edgeFlagData(flag);
		}
		static	void GLAPIENTRY combineDataCB(GLdouble coords[3],void* vertex_data[4], GLfloat weight[4],void** outData,selfType* thiz)
		{
			thiz->combineData(coords,vertex_data,weight,outData);
		}
		static	void GLAPIENTRY errorDataCB(GLenum errno1,selfType* thiz){
			thiz->errorData(errno1);
		}
	};

	inline void sh_mesh_buffer_merge(shaping::CShapeMeshBuffer* target,shaping::CShapeMeshBuffer* src)
	{
		int offset=target->np();
		for(int i=0;i<src->np();i++)
		{
			target->addPoint(src->p(i));
			target->setColor(target->np()-1,src->color(i));
			target->setNormal(target->np()-1,src->normal(i));
		}

		for(int i=0;i<src->nindex();i++)
		{
			target->addIndex(offset+src->index(i));
		}
	}
}
#endif