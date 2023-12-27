#ifndef __SH_SHAPE_PATCH_H__
#define __SH_SHAPE_PATCH_H__
#include "shVertexBuffer.h"
namespace shaping{
	//!·������
	class CShapeMeshBuffer:public CShapeVertexBuffer<ShapeMeshBuffer>,ShapeIndexBuffer
	{
		SH_OBJECT();
	public:
		CShapeMeshBuffer(int prim){m_primitive=prim;}
		virtual int					primitive() {return m_primitive;}
		virtual int 				nindex()	{return m_index_buffer.size();}
		virtual int 				index(int i){return m_index_buffer[i];}
		virtual u16*				data()		{return m_index_buffer.data();}
		virtual ShapeIndexBuffer*	indices(){return this;}
	public:
		void makeIndexBuffer(int size){return m_index_buffer.resize(size);}
		void addIndex(int index){m_index_buffer.push_back(index);}
		void setPrimitive(int prim){m_primitive=prim;}
		void setIndex(int i, int idx){ m_index_buffer[i] = idx; }
		void copy(ShapeMeshBuffer* patch)
		{
			CShapeVertexBuffer<ShapeMeshBuffer>::copyVertexBuffer(patch);
			m_primitive = patch->primitive();
			if(patch->indices())
			{
				makeIndexBuffer(patch->indices()->nindex());
				memcpy(m_index_buffer.data(),patch->indices()->data(),sizeof(u16)*patch->indices()->nindex());
			}
			else 
			{
				makeIndexBuffer(0);
			}
		}
	public:
		static CShapeMeshBuffer* create(int prim){return new CShapeMeshBuffer(prim);}
	public:
		std::vector<u16>	m_index_buffer;
		char				m_primitive;
		std::vector<u16>	m_segmentList;
	};
}
#endif