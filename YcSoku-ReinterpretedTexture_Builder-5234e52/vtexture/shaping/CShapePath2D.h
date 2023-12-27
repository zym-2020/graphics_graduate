#ifndef __C_SHAPE_CONV_DRAW_PATH_H__
#define __C_SHAPE_CONV_DRAW_PATH_H__
#include "shMulti.h"
#include "includeAgg.h"
#include "CShapePLineSimplify.h"
namespace shaping
{
	//===================================================================
	//!可以考虑缓存数据以加快速度
	class CShapePath2D : public Path2D
	{
	public:
		CShapePath2D(ShapePLines *poly)
			: polygon(poly)
		{
			polygon->addRef();
			closed = true;
			rewind(0);
		}

		CShapePath2D(ShapePLine *path)
			: current_path(path)
		{
			path->addRef();
			closed = path->isClosed();
			polygon = NULL;
			rewind(0);
		}
		~CShapePath2D()
		{
			if (polygon)
				polygon->release();
			else
				current_path->release();
		}

		//!重置序列
		virtual void rewind(uint id)
		{
			ipath = -1;
			ivertex = -1;
		}

		//!\return 参照AGG定义
		virtual uint vertex(double *x, double *y)
		{
			if (ivertex == -1)
			{
				ipath++;
				if (polygon != NULL)
				{
					if (ipath < polygon->count())
						current_path = polygon->item(ipath);
					else
						return agg::path_cmd_stop;
				}
				else
				{
					if (ipath > 0)
						return agg::path_cmd_stop;
				}
			}
			int cmd = agg::path_cmd_move_to;
			ivertex++;

			if (ivertex > current_path->np() - 1)
			{
				ivertex = -1;
				return agg::path_cmd_end_poly | (closed ? agg::path_flags_close : 0);
			}
			if (ivertex > 0)
				cmd = agg::path_cmd_line_to;

			Point3dd pp = current_path->p(ivertex);
			*x = pp.X;
			*y = pp.Y;
			return cmd;
		}

	public:
		int ipath;
		int ivertex;
		shaping::ShapePLine *current_path;
		shaping::ShapePLines *polygon;
		bool closed;
	};

	template <class path_t>
	CShapePLines *create_plines_from_vs(path_t *vs, float e = 0)
	{
		shaping::CShapePLines *polygon = shaping::CShapePLines::create();
		shaping::CShapePLine *path = NULL;
		double x, y;
		double lastX = 12345.12345, lastY = 12345.12345;
		int cmd;
		while ((cmd = vs->vertex(&x, &y)) != agg::path_cmd_stop)
		{
			// if(fabs(lastX-x)+fabs(lastY-y)<e)
			//	continue;
			if (agg::is_move_to(cmd))
			{
				if (path)
				{
					shaping::CShapePLine *path2 = shaping::CShapePLineSimplify::simplify_douglas_peucker<2> (path, e);
					polygon->add(path2);
					path2->release();
					path->release();
					path = NULL;
				}
				path = shaping::CShapePLine::create(false);
				path->addPoint(shaping::point_t(x, y, 0));
			}
			if (agg::is_line_to(cmd))
			{
				path->addPoint(shaping::point_t(x, y, 0));
			}
			if (agg::is_close(cmd))
			{
				path->close();
			}
			lastX = x;
			lastY = y;
		}
		if (path)
		{
			shaping::CShapePLine *path2 = shaping::CShapePLineSimplify::simplify_douglas_peucker<2>(path, e);
			polygon->add(path2);
			path2->release();
			path->release();
			path = NULL;
		}
		return polygon;
	}

}
#endif
