#ifndef __VTEXTURE_BUILD_H__
#define __VTEXTURE_BUILD_H__
#include "agg_svg_parser.h"
#include "shObject.h"
#include "shapeTypes.h"
namespace vt
{
    class VTextureBuild
    {
    public:
        VTextureBuild();
        ~VTextureBuild();
        void parseSVG(const char* fn);
        void add(agg::rgba color,shaping::ShapePLines* path);
        void build();
        void load_paths_file(const char* pfn);
        void write(const char* baseFn,bool wpath=true,bool wtriangle=true,bool wstrip=true);
        void write_paths_file(const char* fn);
        void write_triangles_file(const char* fn);
        void write_stripes_file(const char* fn);
    public:
        agg::trans_affine begin(double minx,double miny,double maxx,double maxy);
        void display(agg::rgba8 color,shaping::Path2D* path2d,agg::filling_rule_e fillMode);
        void end();
    private:
        agg::svg::path_renderer m_svg;
        agg::svg::parser        m_parser;
        shaping::box2dd         m_bounding_box;
        double                  m_error_distance;
        std::vector<std::pair<agg::rgba,shaping::ShapePLines*>>         m_color_paths;
        std::vector<std::pair<agg::rgba,shaping::ShapeMeshBuffer*>>     m_triangles_list;
        std::vector<std::pair<int,std::vector<int>>>                    m_stripes_list;
    };
}
#endif