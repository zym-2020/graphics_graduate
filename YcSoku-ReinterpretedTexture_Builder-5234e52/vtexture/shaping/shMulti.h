#ifndef __SH_SHAPE_MULTI_H__
#define __SH_SHAPE_MULTI_H__
#include "shPoint.h"
#include "shPLine.h"
#include "shPLines.h"
#include "shMeshBuffer.h"
namespace shaping{
	//!Shape的集合
	class CShapeMulti:public ShapeMulti
	{
		SH_OBJECT();
	public:
		CShapeMulti(){}
		~CShapeMulti()
		{
			for(int i=0;i<m_items.size();i++)
			{
				m_items[i]->release();
			}
		}
		//!个数
		virtual int  count()
		{
			return m_items.size();
		}
		//!项目
		virtual ShapeObject*	item(int i)
		{
			return m_items[i];
		}
	public:
		void add(CShapePoint* p)     {m_items.push_back(p);p->addRef();}
		void add(CShapePLine* path)   {m_items.push_back(path);path->addRef();}
		void add(CShapePLines* poly){m_items.push_back(poly);poly->addRef();}
		void add(CShapeMeshBuffer* patch) {m_items.push_back(patch);patch->addRef();}
		void add(CShapeMulti* multi) {m_items.push_back(multi);multi->addRef();}
		void addReadOnly(ShapeObject* shape) {m_items.push_back(shape);shape->addRef();}
	public:
		static CShapeMulti* create(){return new CShapeMulti();}
	public:	
		std::vector<ShapeObject*>	m_items;
	};
	
	//!实现对Shape的克隆操作
	class CShapeUtils
	{
	public:
		static CShapePoint* clone(ShapePoint* point)
		{
			return CShapePoint::create(point->x(),point->y(),point->z());
		}
		static CShapePLine* clone(ShapePLine* path)
		{
			CShapePLine* path2 = CShapePLine::create(path->isClosed());
			path2->copyVertexBuffer(path);
			return path2;
		}
		
		static CShapePLines* clone(ShapePLines* poly)
		{
			CShapePLines* poly2 = CShapePLines::create(NULL);
			for(int i=0;i<poly->count();i++)
			{
				CShapePLine* path = clone(poly->item(i));
				poly2->add(path);
				path->release();
			}
			return poly2;
		};
		
		static CShapeMeshBuffer* clone(ShapeMeshBuffer* patch)
		{
			CShapeMeshBuffer* patch2 = CShapeMeshBuffer::create(patch->primitive());
			patch2->copy(patch);
			return patch2;
		}
		
		static CShapeMulti* clone(ShapeMulti* multi)
		{
			CShapeMulti* multi2 = CShapeMulti::create();
	
			for(int i=0;i<multi->count();i++)
			{
				ShapeObject* shape = multi->item(i);
				if(shape->type()==ShapePoint::Type)
				{
					CShapePoint* p = clone(static_cast<ShapePoint*>(shape));
					multi2->add(p);
					p->release();
				}
				else if(shape->type()==ShapePLine::Type)
				{
					CShapePLine* path = clone(static_cast<ShapePLine*>(shape));
					multi2->add(path);
					path->release();
				}
				else if(shape->type()==ShapePLines::Type)
				{
					CShapePLines* poly = clone(static_cast<ShapePLines*>(shape));
					multi2->add(poly);
					poly->release();
				}
				else if(shape->type()==ShapeMeshBuffer::Type)
				{
					CShapeMeshBuffer* patch = clone(static_cast<ShapeMeshBuffer*>(shape));
					multi2->add(patch);
					patch->release();
				}
				else if(shape->type()==ShapeMulti::Type)
				{
					CShapeMulti* multi3 = clone(static_cast<ShapeMulti*>(shape));
					multi2->add(multi3);
					multi3->release();
				}
			}
			return multi2;
		}
		
		static ShapeObject* clone(ShapeObject* shape)
		{	
			if(shape->type()==ShapePoint::Type)
			{
				return (clone(static_cast<ShapePoint*>(shape)));
			}
			if(shape->type()==ShapePLine::Type)
			{
				return (clone(static_cast<ShapePLine*>(shape)));
			}
			if(shape->type()==ShapePLines::Type)
			{
				return (clone(static_cast<ShapePLines*>(shape)));
			}
			if(shape->type()==ShapeMeshBuffer::Type)
			{
				return (clone(static_cast<ShapeMeshBuffer*>(shape)));
			}
			if(shape->type()==ShapeMulti::Type)
			{
				return (clone(static_cast<ShapeMulti*>(shape)));
			}
			return NULL;
		}

		// static double computeLength(ShapePLine* path)
		// {
		// 	if(path->np()<1)
		// 		return 0;
		
		// 	double s =0;
		// 	for(int i=1;i<path->np();i++)
		// 	{
		// 		s+=path->p(i-1).getDistanceFrom(path->p(i));
		// 	}
		// 	if(path->isClosed())
		// 	{
		// 		s+=path->p(path->np()-1).getDistanceFrom(path->p(0));
		// 	}
		// 	return s;
		// };

		static Box3dd computeBoundingBox(ShapeVertexBuffer* points)
		{
			if(points->np()<1)
				return Box3dd();
			Box3dd bound(points->p(0),points->p(0));
			for(int i=1;i<points->np();i++)
			{
				bound.addInternalPoint(points->p(i));
			}
			return bound;
		};
		static Box3dd computeBoundingBox(ShapePLines* poly)
		{
			if(poly->count()<1)
				return Box3dd();
			Box3dd bound = computeBoundingBox(poly->item(0));
			for(int i=1;i<poly->count();i++)
			{
				bound.addInternalBox(computeBoundingBox(poly->item(i)));
			}
			return bound;
		}

		static Box3dd computeBoundingBox(ShapeMulti* multi)
		{
			Box3dd bound(1e20,1e20,1e20,-1e20,-1e20,-1e20);
			
			for(int i=0;i<multi->count();i++)
			{
				ShapeObject* sh = multi->item(i);
				if(sh->isPLine()||sh->isMeshBuffer())
					bound.addInternalBox(computeBoundingBox(static_cast<ShapeVertexBuffer*>(sh)));
				if(sh->isPolygon())
					bound.addInternalBox(computeBoundingBox(static_cast<ShapePLines*>(sh)));
				if(sh->isMulti())
					bound.addInternalBox(computeBoundingBox(static_cast<ShapeMulti*>(sh)));
			}
			return bound;
		}

		static Box3dd computeBoundingBox(ShapeObject* shape)
		{
			ShapeObject* sh = shape;
			if(sh->isPLine()||sh->isMeshBuffer())
				return (computeBoundingBox(static_cast<ShapeVertexBuffer*>(sh)));
			if(sh->isPolygon())
				return (computeBoundingBox(static_cast<ShapePLines*>(sh)));
			if(sh->isMulti())
				return (computeBoundingBox(static_cast<ShapeMulti*>(sh)));
			else 
				return Box3dd(1e10,1e10,1e10,-1e10,-1e10,-1e10);
		}
	};
}
#endif