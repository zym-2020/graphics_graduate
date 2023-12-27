#ifndef __SH_PLINE_H__
#define __SH_PLINE_H__
#include "shVertexBuffer.h"
namespace shaping{
	//!Â·¾¶¶ÔÏó
	class CShapePLine:public CShapeVertexBuffer<ShapePLine>
	{
		SH_OBJECT();
	public:
		CShapePLine(bool closed=false){m_closed=closed;}
		~CShapePLine(){}
		void close()  {m_closed=true;}
		void makeHole(){m_hole = true;}
	public:
		static CShapePLine* create(bool closed=false){return new CShapePLine(closed);}	
	public:
		bool isClosed(){return   m_closed;}
		bool isHole()  {return   m_hole;}

	};
}
#endif