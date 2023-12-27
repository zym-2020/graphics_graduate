#include "VTextureBuild.h"
#include "CShapePath2D.h"
#include "includeAgg.h"
#include "CShapeTriangulationGLU.h"
#include "Strips.h"
#include <iostream>
#include <fstream>
#include <string>
using namespace std;

namespace vt
{
    VTextureBuild::VTextureBuild() : m_parser(m_svg)
    {
    }
    VTextureBuild::~VTextureBuild()
    {
        for (auto it = m_color_paths.begin(), end = m_color_paths.end(); it != end; it++)
        {
            it->second->release();
        }
        for (auto it = m_triangles_list.begin(), end = m_triangles_list.end(); it != end; it++)
        {
            it->second->release();
        }
    }

    void VTextureBuild::parseSVG(const char *fn)
    {
        m_parser.parse(fn);
        auto &bbx = m_bounding_box;
        m_svg.bounding_rect(&bbx.MinEdge.X, &bbx.MinEdge.Y, &bbx.MaxEdge.X, &bbx.MaxEdge.Y);
        double d1  = fabs(bbx.MaxEdge.X-bbx.MinEdge.X);
        double d2  = fabs(bbx.MaxEdge.Y-bbx.MinEdge.Y);
        d1 = d2>d1?d2:d1;
        m_error_distance=d1/64;
        m_svg.display(this);
    }

    void VTextureBuild::add(agg::rgba color, shaping::ShapePLines *path)
    {
        m_color_paths.push_back(std::pair(color, path));
    }

    void VTextureBuild::build()
    {
        shaping::CTrianglizeControlDefault defctrl;
        shaping::CShapeTriangulationGLU glu(&defctrl);

        for (auto it = m_color_paths.begin(), end = m_color_paths.end(); it != end; it++)
        {
            shaping::CShapeMeshBuffer *mb = glu.triangulate(it->second);
            assert(mb->primitive() == shaping::ShapeMeshBuffer::eTriangleList);
            m_triangles_list.push_back(std::pair(it->first, mb));
        }
        int pathid = 0;
        for (auto it = m_triangles_list.begin(), end = m_triangles_list.end(); it != end; it++, pathid++)
        {
            Striper striper;
            STRIPERCREATE param;
            STRIPERRESULT result;
            auto mb = it->second;
            param.AskForWords = false;
            param.ConnectAllStrips = true;
            param.NbFaces = mb->indices()->nindex() / 3;
            param.WFaces = mb->indices()->data();
            param.SGIAlgorithm = true;
            param.OneSided = false;

            striper.Init(param);
            striper.Compute(result);
            shaping::u32 *stripes = (shaping::u32 *)result.StripRuns;
            int v = 0;
            for (int i = 0; i < result.NbStrips; i++)
            {
                std::vector<int> strips;
                for (int k = 0, n = result.StripLengths[i]; k < n; k++)
                {
                    // printf("%d ",stripes[v]);
                    strips.push_back(stripes[v]);
                    v++;
                }
                m_stripes_list.push_back(std::pair(pathid, strips));
            }
        }
    }

    void VTextureBuild::write_paths_file(const char *fn)
    {
        FILE *stream = fopen(fn, "w");
        int k = 0;
        auto &bbx = m_bounding_box;
        fprintf(stream, "%f,%f,%f,%f\n", bbx.MinEdge.X, bbx.MinEdge.Y, bbx.MaxEdge.X, bbx.MaxEdge.Y);
        for (auto it = m_color_paths.begin(), end = m_color_paths.end(); it != end; it++)
        {
            agg::rgba colorf = it->first;
            fprintf(stream, "%d;%f,%f,%f,%f;", k++, colorf.r, colorf.g, colorf.b, colorf.a);
            shaping::ShapePLines *plines = it->second;
            for (int i = 0, ln = plines->count(); i < ln; i++)
            {
                auto item = plines->item(i);
                for (int k = 0, np = item->np(); k < np; k++)
                {
                    auto p = item->p(k);
                    if (k != np - 1)
                        fprintf(stream, "%f %f,", p.X, p.Y);
                    else
                        fprintf(stream, "%f %f", p.X, p.Y);
                }
                if (i != ln - 1)
                    fprintf(stream, ";");
            }
            fprintf(stream, "\n");
        }
        fclose(stream);
    }

    void VTextureBuild::write_triangles_file(const char *fn)
    {
        /////triangles data
        FILE *stream = fopen(fn, "w");
        auto &bbx = m_bounding_box;
        fprintf(stream, "%f,%f,%f,%f\n", bbx.MinEdge.X, bbx.MinEdge.Y, bbx.MaxEdge.X, bbx.MaxEdge.Y);
        int k = 0;
        for (auto it = m_triangles_list.begin(), end = m_triangles_list.end(); it != end; it++)
        {
            agg::rgba colorf = it->first;
            fprintf(stream, "%d;%f,%f,%f,%f;", k++, colorf.r, colorf.g, colorf.b, colorf.a);
            auto mb = it->second;
            for (int i = 0, np = mb->np(); i < np; i++)
            {
                auto p = mb->p(i);
                if (i != np - 1)
                    fprintf(stream, "%f %f,", p.X, p.Y);
                else
                    fprintf(stream, "%f %f", p.X, p.Y);
            }
            fprintf(stream, ";");
            auto ib = mb->indices();
            for (int i = 0, n = ib->nindex(); i < n; i++)
            {
                auto p = ib->index(i);
                if (i != n - 1)
                    fprintf(stream, "%d,", p);
                else
                    fprintf(stream, "%d\n", p);
            }
        }
        fclose(stream);
    }

    void VTextureBuild::write_stripes_file(const char *fn)
    {
        /////triangles data
        FILE *stream = fopen(fn, "w");
        int k = 0;
        for (auto it = m_stripes_list.begin(); it != m_stripes_list.end(); it++)
        {
            fprintf(stream, "%d;%d;", k++, it->first);
            auto &stripe = it->second;
            for (int i = 0, n = stripe.size(); i < n; i++)
            {
                auto z = stripe[i];
                if (i != n - 1)
                    fprintf(stream, "%d,", z);
                else
                    fprintf(stream, "%d\n", z);
            }
        }
        fclose(stream);
    }

    void VTextureBuild::write(const char *baseFn, bool wpath, bool wtriangle, bool wstrip)
    {
        /////path data
        std::string base0(baseFn);
        if (wpath)
            write_paths_file((base0 + ".p.txt").c_str());
        if (wtriangle)
            write_triangles_file((base0 + ".t.txt").c_str());
        if (wstrip)
            write_stripes_file((base0 + ".s.txt").c_str());
    }

    ////////////////////////////////////////////////////////////////////////////////////////
    agg::trans_affine VTextureBuild::begin(double minx, double miny, double maxx, double maxy)
    {
        return agg::trans_affine();
    }

    void VTextureBuild::display(agg::rgba8 color, shaping::Path2D *path2d, agg::filling_rule_e fillMode)
    {
        agg::rgba colorf = color;
        //agg::conv_curve curve(*path2d);
        shaping::CShapePLines *plines = shaping::create_plines_from_vs(path2d,(m_error_distance/10));
        add(colorf, plines);
    }

    void VTextureBuild::end()
    {
    }
    static inline bool string2double(const char *str, double &result)
    {
        sscanf(str, "%lf", &result);
        return true;
    }

    static inline bool string2double(std::string const &value, double &result)
    {
        return string2double(value.c_str(), result);
    }

    static inline bool istoken(char p, const char *chs)
    {
        const char *pc = reinterpret_cast<const char *>(chs);
        while (*pc != '\0' && p != *pc)
            pc++;
        return *pc != '\0';
    }
    static inline void tokenize(char *source, vector<char *> &tokens, const char *chs = ",| ")
    {
        char *p = source;
        char *pre = p;
        while (*p != '\0')
        {
            if (istoken(*p, chs))
            {
                *p = '\0';
                pre = p + 1;
            }
            if (pre != NULL && istoken(*pre, chs))
                pre++;
            else if (pre != NULL)
            {
                tokens.push_back(pre);
                pre = NULL;
            }
            p++;
        }
    }

    static inline void tokenize(const char *source, vector<string> &tokens, const char *chs = ",| ")
    {
        char *cp = new char[strlen(source) + 1];
        strcpy(cp, source);
        vector<char *> vs;
        tokenize(cp, vs, chs);
        for (vector<char *>::iterator it = vs.begin(); it != vs.end(); it++)
        {
            tokens.push_back(string(*it));
        }
        delete[] cp;
    }

    void VTextureBuild::load_paths_file(const char *pfn)
    {
        std::fstream fs;
        fs.open(pfn, ios::in);
        string line;
        std::getline(fs, line);
        vector<string> tokens;
        tokenize(line.c_str(), tokens);
        string2double(tokens[0], m_bounding_box.MinEdge.X);
        string2double(tokens[1], m_bounding_box.MinEdge.Y);
        string2double(tokens[2], m_bounding_box.MaxEdge.X);
        string2double(tokens[3], m_bounding_box.MaxEdge.Y);

        while (!fs.eof())
        {
            std::getline(fs, line);
            if(line.size()==0)
                continue;
            tokens.clear();
            tokenize(line.c_str(), tokens, ";");
            agg::rgba color;
            vector<string> tks;
            tokenize(tokens[1].c_str(), tks);
            string2double(tks[0], color.r);
            string2double(tks[1], color.g);
            string2double(tks[2], color.b);
            string2double(tks[3], color.a);

            shaping::CShapePLines *plines = shaping::CShapePLines::create();
            for (int i = 2, nt = tokens.size(); i < nt; i++)
            {
                tks.clear();
                tokenize(tokens[i].c_str(), tks, " ,");
                shaping::CShapePLine *pline = shaping::CShapePLine::create();
                shaping::point_t pt;
                for (int p = 0, np2 = tks.size(); p < np2; p += 2)
                {
                    string2double(tks[p+0], pt.X);
                    string2double(tks[p+1], pt.Y);
                    pline->addPoint(pt);
                }
                plines->add(pline);
                pline->release();
            }
            m_color_paths.push_back(std::pair(color, plines));
        }
    }
}