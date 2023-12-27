#ifndef __MP_SHAPE_TYPES_H__
#define __MP_SHAPE_TYPES_H__
#include "shObject.h"
namespace shaping{
	typedef	Vector3dd point_t;
	class ShapeVertexAttribs;
	//!Shape
	class ShapeObject:public shObject
	{
	public:
		//!几何类型
		virtual int	 type()=0;
		virtual bool isPoint()		{return false;}
		virtual bool isPLine()		{return false;}
		virtual bool isPolygon()	{return false;}
		virtual bool isMeshBuffer()	{return false;}
		virtual bool isMulti()		{return false;}
		virtual int	 np()			{return 0;}
		//!
		template<class T>
		T* cast(){ return (T*)this;}
	};
	
	//!点
	class ShapePoint:public ShapeObject
	{
	public:
		enum {Type=1};
	public:
		//!几何类型
		virtual int type()	{return Type;}
		//!x
		virtual double		x()=0;
		//!y
		virtual double		y()=0;
		//!z
		virtual double 		z()=0;
		//!点类型
		virtual bool		isPoint()		{return true;}
		virtual int			np()			{return 1;}
	};
	
	//!点结构
	class ShapeVertexBuffer:public ShapeObject
	{
	public:
		//!点数
		virtual int					 	np()=0;					//点数
		//!点
		virtual point_t					p(int index)=0;			//获取点
		//!指针
		virtual point_t*				points()=0;				//点缓冲
		//!顶点属性集合
		virtual	ShapeVertexAttribs*	attribs(){return NULL;} //属性集合
	};
	typedef ShapeVertexBuffer  ShapePoints;
	/*
		顶点属性集合
	*/
	class ShapeVertexAttribs
	{
	public:
		virtual	bool 	hasColors()			=0;
		virtual bool	hasNormals()		=0;
		virtual bool	hasTexCoords()		=0;
		virtual bool	hasTexCoords2()		=0;
		virtual bool	hasWeights()		=0;
		virtual bool	hasTokens()			=0;
		
		virtual color_t						color(int index)=0;
		virtual color_t*					colors()=0;
		virtual	Vector3df					normal(int index)=0;
		virtual Vector3df*					normals()=0;	
		virtual Vector2df					texcoord(int index)=0;
		virtual Vector2df*					texcoords()=0;
		virtual Vector2df					texcoord2(int index)=0;
		virtual const Vector2df*			texcoords2()=0;
		virtual float						weight(int index)=0;
		virtual float*						weights()=0;
		virtual int							token(int index)=0;
		virtual int*						tokens()=0;
	};
	
	//!路径
	class ShapePLine:public ShapeVertexBuffer
	{
	public:
		enum {Type=2};
	public:
		//!几何类型
		virtual int  type()	   {return Type;}
		//!是否是路径
		virtual bool isPLine() {return true;}
		//!是否是洞
		virtual bool isHole()  {return false;}
		//!是否封闭
		virtual bool isClosed(){return false;}
	};

	//!多边形
	class ShapePLines:public ShapeObject
	{
	public:
		enum {Type=3};
		enum {plgUnknown,plgOGC,plgGPC};
	public:	
		//!几何类型
		virtual int     	  type(){return Type;}
		//!npath
		virtual int     	  count()=0;
		//!活动几何对象
		virtual ShapePLine*   item(int index)=0;
		//!是否多边形
		virtual bool   		  isPolygon(){return true;}
		//!是否是一半的多边形
		virtual int			  style(){return plgUnknown;}
		//!
		virtual int	 np()			{
			int n=0;
			for(int i=0;i<count();i++)
			{
				n+=item(i)->np();
			}
			return n;
		}
	};

	class ShapeIndexBuffer
	{
	public:
		//!索引数
		virtual int 				nindex()=0;
		//!活动索引
		virtual int 				index(int i)=0;
		//!得到索引Buffer
		virtual u16*				data()=0;
	};

	//!三角形几何对象
	class ShapeMeshBuffer:public ShapeVertexBuffer
	{
	public:
		enum {Type = 4};
		enum ePrimitve{eNullPrimitive=-1,ePoints=0,eLines,eLineStrip,eLineLoop,eTriangleList,eTriangleFan,eTriangleStrip};
	public:
		//!集合类型
		virtual	int				    type(){return Type;}
		virtual bool isMeshBuffer()	{return true;}
		//!patchType
		virtual int					primitive()=0;
		//!获得索引
		virtual ShapeIndexBuffer*	indices()=0;
	};
	
	//!多Shape对象
	class ShapeMulti:public ShapeObject
	{
	public:
		enum {Type=5};
	public:
		//!类型
		virtual int 		 type(){return Type;}
		//!个数
		virtual int 		 count()=0;
		virtual bool		 isMulti(){return true;}
		//!项目
		virtual ShapeObject* item(int i)=0;
		virtual int	 np() {
			int n=0;
			for(int i=0;i<count();i++)
			{
				n+=item(i)->np();
			}
			return n;
		}
	};

	//!顶点序列
	class Path2D:public shObject
	{
	public:
		//!重置序列
		virtual void rewind(uint id)=0;
		//!\return 参照AGG定义
		virtual uint vertex(double* x,double* y)=0;
	public:
		double cx;
		double cy;
	};
	//!创建扩展序列
	class PathEx:public Path2D
	{
	public:
		virtual void			move_to(double x,double y)=0;
		virtual void			line_to(double x,double y)=0;
		template<class pointType>
		void					poly(pointType* points,int np,bool closed)
		{
			move_to(points[0].X,points[0].Y);
			for(int i=1;i<np;i++){
				line_to(points[i].X,points[i].Y);
			}
			if(closed)close();
		}
		virtual	void			join(Path2D* path)=0;
		virtual void			concat(Path2D* path)=0;
		virtual void			close()=0;
	};
}
#endif