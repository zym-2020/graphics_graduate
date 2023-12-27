#ifndef __AGG_PATH__
#define __AGG_PATH__
#include "shapeTypes.h"
#include "agg_path_storage.h"
#include <vector>
namespace shaping{
	template<class kernel_t>
	class path2d_agg_cache_t :public Path2D
	{
	public:
		path2d_agg_cache_t() {}
		virtual void rewind(uint id) { return kernel.rewind(id); }
		virtual uint vertex(double* x, double* y) { return kernel.vertex(x, y); }
	public:
		kernel_t kernel;
	};
	typedef agg::path_base<agg::vertex_stl_storage<std::vector<agg::vertex_d> > > stl_double_path_storage;
	typedef path2d_agg_cache_t<stl_double_path_storage> AggPath2D;


	template<typename kernel_t>
	class path2d_agg_adaptor_t:public Path2D
	{
		SH_OBJECT();
	public:
		path2d_agg_adaptor_t(kernel_t& k):kernel(k){}
		virtual void rewind(uint id) { return kernel.rewind(id); }
		virtual uint vertex(double* x, double* y) { return kernel.vertex(x, y); }
	public:
		kernel_t& kernel;
	};
}
#endif