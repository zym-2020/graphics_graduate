#ifndef __C_SHAPE_PLINE_SIMPLIFY_H__
#define __C_SHAPE_PLINE_SIMPLIFY_H__
#include "psimpl.h"
#include "shMulti.h"
#include <algorithm>
#include <vector>
#include <functional>
namespace shaping{
	class CShapePLineSimplify
	{
	public:
		//!fwd iterator for pline wrap
		template<int DIM>
		class pline_fwd_iterator_t
		{
		public:
			typedef std::forward_iterator_tag iterator_category;
			typedef double value_type;
			typedef int difference_type;
			typedef double* pointer;
			typedef double& reference;
		public:
			pline_fwd_iterator_t(ShapePLine* pline):
				m_pline(pline),m_it(0)
			{
					
			}
			bool operator!=(const pline_fwd_iterator_t& other)
			{
				return m_it!=other.m_it;
			}
			
			bool operator==(const pline_fwd_iterator_t& other)
			{
				return m_it==other.m_it;
			}
			
			void makeEnd()
			{
				m_it= m_pline->np()*DIM;
			}
			pline_fwd_iterator_t& operator++(){
				m_it++;
				return *this;
			}
			pline_fwd_iterator_t& operator--(){
				m_it--;
				return *this;
			}
			double operator->(){
				int i=m_it%DIM;
				if(i==0) 
					return m_pline->p(m_it/DIM).X;
				else  if(i==1)
					return m_pline->p(m_it/DIM).Y;
				else  
					return m_pline->p(m_it/DIM).Z;
			}
			
			double operator*(){
				int i=m_it%DIM;
				if(i==0) 
					return m_pline->p(m_it/DIM).X;
				else  if(i==1)
					return m_pline->p(m_it/DIM).Y;
				else  
					return m_pline->p(m_it/DIM).Z;
			}
		public:
			int 		 m_it;
			ShapePLine* m_pline;
		};
		//iterator for back insert 
		template<int DIM>
		class pline_back_insert_iterator_t
		{
		public:
			typedef std::forward_iterator_tag iterator_category;
			typedef double value_type;
			typedef int difference_type;
			typedef double* pointer;
			typedef double& reference;
		public:
			pline_back_insert_iterator_t(CShapePLine* pline,int i=0):
				m_pline(pline),m_it(i)
			{
				static point_t tmp;
				while(m_pline->np()<=i)
				{
					m_pline->addPoint(tmp);
				}
			}
			pline_back_insert_iterator_t& operator++(){
				static point_t tmp;
				m_it++;
				if(m_pline->np()<=m_it/DIM)
					m_pline->addPoint(tmp);
				return *this;
			}
			
			pline_back_insert_iterator_t& operator--(){
				m_it--;
				return *this;
			}
			double& operator*(){
				int i=m_it/DIM;
				int k=m_it%DIM;
				if(k==0) 
					return  m_pline->m_points[i].X;
				else 
					if(k==1)
					return  m_pline->m_points[i].Y;
				else 
					return  m_pline->m_points[i].Z;
			}
		public:
			int 		 m_it;
			CShapePLine* m_pline;
		};
	public:
		template<int DIM>
		static CShapePLine* simplify_nth_point(ShapePLine* pline,int n)
		{
			CShapePLine* rtval = CShapePLine::create(pline->isClosed());
			pline_fwd_iterator_t<DIM> it(pline),end(pline);
			end.makeEnd();

			pline_back_insert_iterator_t<DIM> result(rtval);
			psimpl::simplify_nth_point<DIM,pline_fwd_iterator_t<DIM>,pline_back_insert_iterator_t<DIM>>(it,end,n,result);
			rtval->m_points.pop_back();
			return rtval;
		}
		
		template<int DIM>
		static CShapePLine* simplify_douglas_peucker(ShapePLine* pline,double e)
		{
			CShapePLine* rtval = CShapePLine::create(pline->isClosed());
			pline_fwd_iterator_t<DIM> it(pline),end(pline);
			end.makeEnd();

			pline_back_insert_iterator_t<DIM> result(rtval);
			psimpl::simplify_douglas_peucker<DIM,pline_fwd_iterator_t<DIM>,pline_back_insert_iterator_t<DIM>>(it,end,e,result);
			rtval->m_points.pop_back();
			return rtval;
		}

		template<int DIM>
		static CShapePLine* simplify_douglas_peucker_n(ShapePLine* pline,int n)
		{
			CShapePLine* rtval = CShapePLine::create(pline->isClosed());
			pline_fwd_iterator_t<DIM> it(pline),end(pline);
			end.makeEnd();

			pline_back_insert_iterator_t<DIM> result(rtval);
			psimpl::simplify_douglas_peucker_n<DIM,pline_fwd_iterator_t<DIM>,pline_back_insert_iterator_t<DIM>>(it,end,n,result);
			rtval->m_points.pop_back();
			return rtval;
		}

		template<int DIM>
		static CShapePLine* simplify_radial_distance(ShapePLine* pline,double e)
		{
			CShapePLine* rtval = CShapePLine::create(pline->isClosed());
			pline_fwd_iterator_t<DIM> it(pline),end(pline);
			end.makeEnd();

			pline_back_insert_iterator_t<DIM> result(rtval);
			psimpl::simplify_radial_distance<DIM,pline_fwd_iterator_t<DIM>,pline_back_insert_iterator_t<DIM>>(it,end,e,result);
			rtval->m_points.pop_back();
			return rtval;
		}

		template<int DIM>
		static CShapePLine* simplify_lang(ShapePLine* pline,double e,int ahead)
		{
			CShapePLine* rtval = CShapePLine::create(pline->isClosed());
			pline_fwd_iterator_t<DIM> it(pline),end(pline);
			end.makeEnd();

			pline_back_insert_iterator_t<DIM> result(rtval);
			psimpl::simplify_lang<DIM,pline_fwd_iterator_t<DIM>,pline_back_insert_iterator_t<DIM>>(it,end,e,ahead,result);

			return rtval;
		}
		
		template<int DIM>
		static CShapePLine* simplify_opheim(ShapePLine* pline,double mine,double maxe)
		{
			CShapePLine* rtval = CShapePLine::create(pline->isClosed());
			pline_fwd_iterator_t<DIM> it(pline),end(pline);
			end.makeEnd();

			pline_back_insert_iterator_t<DIM> result(rtval);
			psimpl::simplify_opheim<DIM,pline_fwd_iterator_t<DIM>,pline_back_insert_iterator_t<DIM>>(it,end,mine,maxe,result);
			rtval->m_points.pop_back();
			return rtval;
		}

		template<int DIM>
		static CShapePLine* simplify_reumann_witkam(ShapePLine* pline,double e)
		{
			CShapePLine* rtval = CShapePLine::create(pline->isClosed());
			pline_fwd_iterator_t<DIM> it(pline),end(pline);
			end.makeEnd();

			pline_back_insert_iterator_t<DIM> result(rtval);
			psimpl::simplify_reumann_witkam<DIM,pline_fwd_iterator_t<DIM>,pline_back_insert_iterator_t<DIM>>(it,end,e,result);
			rtval->m_points.pop_back();
			return rtval;
		}

		template<int DIM>
		static CShapePLine* simplify_perpendicular_distance(ShapePLine* pline,double e)
		{
			CShapePLine* rtval = CShapePLine::create(pline->isClosed());
			pline_fwd_iterator_t<DIM> it(pline),end(pline);
			end.makeEnd();

			pline_back_insert_iterator_t<DIM> result(rtval);
			psimpl::simplify_perpendicular_distance<DIM,pline_fwd_iterator_t<DIM>,pline_back_insert_iterator_t<DIM>>(it,end,e,result);
			rtval->m_points.pop_back();//ǿ��ɾ��һ���� why?
			return rtval;
		}

	};
}

#endif