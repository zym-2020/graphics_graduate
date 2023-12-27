#include "FreeTypeExport.h"
#include "shAggPath2D.h"
#include "CShapePath2D.h"
#include "shMulti.h"
namespace vt
{
    FreeTypeExport::FreeTypeExport() : m_font_cache(m_font_engine)
    {
        m_font_size = 16;
    }

    bool FreeTypeExport::init(const char *font, const char *out_path, int size)
    {
        m_font = font;
        m_out_path = out_path;
        m_font_size = size;
        bool b1 = m_font_engine.load_font(font, 0, agg::glyph_ren_outline);
        // m_font_engine.char_map(FT_ENCODING_APPLE_ROMAN);
        m_font_engine.char_map(FT_ENCODING_UNICODE);
        // FT_Encoding ixn = m_font_engine.char_map();

        //m_font_engine.char_map(FT_ENCODING_NONE);
        m_font_engine.height(size);
        m_font_engine.width(size);
        m_font_engine.hinting(true);
        m_font_engine.flip_y(true);
        int e = 0, b = 0;
        e = m_font.find_last_of('.');
        b = m_font.find_last_of('/');
        if (b == std::string::npos)
            b = m_font.find_last_of('\\');
        m_font_name = m_font.substr(b+1, e - b-1);
        return b1;
    }
    template <class boxT>
    void write_paths_file(shaping::ShapePLines *plines, const boxT &bbx, const char *fn)
    {
        FILE *stream = fopen(fn, "w");
        int k = 0;
        fprintf(stream, "%f,%f,%f,%f\n", bbx.MinEdge.X, bbx.MinEdge.Y, bbx.MaxEdge.X, bbx.MaxEdge.Y);
        fprintf(stream, "%d;%f,%f,%f,%f;", 0,0.0, 0.0, 0.0, 1.0);
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
        fclose(stream);
    }

    void FreeTypeExport::export_glyph(wchar_t ch)
    {
        typedef agg::conv_curve<font_engine_freetype_t::path_adaptor_type> font_curve_t;
        font_curve_t font_curve(m_font_cache.path_adaptor());
        shaping::path2d_agg_adaptor_t<font_curve_t> pathVS(font_curve);
        const agg::glyph_cache *glyph = m_font_cache.glyph(ch);
        if (glyph)
        {
            m_font_cache.init_embedded_adaptors(glyph, 0, 0+m_font_size);
            shaping::ShapePLines *plines = shaping::create_plines_from_vs(&pathVS);
            char outfn[1024];
            sprintf(outfn, "%s/%s-%d-%d.glphy.txt", m_out_path.c_str(), m_font_name.c_str(), m_font_size,(int)ch);
            printf("%s....",outfn);
            write_paths_file(plines, shaping::box2dd(0, 0, m_font_size, m_font_size), outfn);
            printf("done\n");
            plines->release();
        }
    }

    wchar_t next(const char* &pstr)
    {
        if (*pstr == '\0')
            return 0;
        if (*pstr == '\\')
        {
            pstr++;
            std::string buf;
            while (isnumber(*pstr))
            {
                buf.append(1,*pstr);
                pstr++;
            }
            return atoi(buf.c_str());
        }
        else if (*pstr == '-')
        {
            pstr++;
            return L'\n';
        }
        else
        {
            return *pstr++;
        }
    }
    void FreeTypeExport::export_plus(const char *txt)
    {
        const char *p = txt;
        wchar_t ch = next(p);
        while (*p)
        {
            wchar_t nch = next(p);
            if (nch == '\n')
            {
                wchar_t ch2 = next(p);
                while (ch < ch2)
                {
                    export_glyph(ch);
                    ch++;
                }
                wchar_t nch = next(p);
            }
            else
            {
                export_glyph(ch);
                ch = nch;
            }
        }
        if(ch)
        {
            export_glyph(ch);
        }
    }
}
