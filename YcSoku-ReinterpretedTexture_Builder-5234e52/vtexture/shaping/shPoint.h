#ifndef __SH_POINT_H__
#define __SH_POINT_H__
#include "shapeTypes.h"
namespace shaping{
	class CShapePoint:public ShapePoint
	{
		SH_OBJECT();
	public:	
		CShapePoint(double x,double y,double z){m_point.X=x;m_point.Y=y;m_point.Z=z;}
	public:	
		virtual point_t				point(){return m_point;}
		virtual double				x(){return m_point.X;}
		virtual double				y(){return m_point.Z;}
		virtual double 				z(){return m_point.Z;}
	public:
		static CShapePoint* create(double x,double y,double z){return new CShapePoint(x,y,z);}
	public:
		point_t m_point;
	};
}
#endif