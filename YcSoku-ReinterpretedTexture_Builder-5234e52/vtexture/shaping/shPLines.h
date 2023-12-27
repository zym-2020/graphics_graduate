#ifndef __SH_POLYLINES_H__
#define __SH_POLYLINES_H__
#include "shPLine.h"
namespace shaping{
	//!·������
	class CShapePLines:public ShapePLines
	{
		SH_OBJECT();
	public:
		CShapePLines(CShapePLine* path=NULL)
		{
			m_style = plgOGC;
			if(path)
			{
				m_items.push_back(path);
				path->addRef();
			}
		}
		~CShapePLines()
		{
			for(int i=0;i<m_items.size();i++)
			{
				m_items[i]->release();
			}
		}
		//!�Ƿ���һ��Ķ����
		virtual int			  style()		  {return m_style;}
		//!�Ƿ���һ��Ķ����
		virtual void		  style(int style){ m_style=style;}
		//!npath
		virtual int     	  count(){return m_items.size();}
		//!����ζ���
		virtual ShapePLine*   item(int index){return m_items[index];}
		//!���
		virtual bool		  add(CShapePLine* path)
		{
			m_items.push_back(static_cast<CShapePLine*>(path));
			path->addRef();
			return true;
		}
	public:
		static CShapePLines* create(CShapePLine* path=NULL){return new CShapePLines(path);}
	public:
		std::vector<CShapePLine*>	 m_items;
		char					 	m_style;
	};
}
#endif