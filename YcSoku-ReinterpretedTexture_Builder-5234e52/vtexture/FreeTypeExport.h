#ifndef __FREE_TYPE_EXPORT_H__
#define __FREE_TYPE_EXPORT_H__
#include "agg_font_freetype.h"
#include <string>
namespace vt{
    typedef agg::font_engine_freetype_int32						font_engine_freetype_t;
	typedef agg::font_cache_manager<font_engine_freetype_t>		font_cache_manager_freetype_t;
	
    class FreeTypeExport
    {
    public:
        FreeTypeExport();
        bool init(const char* font,const char* out_path,int size);
        void export_glyph(wchar_t ch);
        void export_plus(const char* txt);
    private:
        std::string                         m_font;
        std::string                         m_out_path; 
        std::string                         m_font_name;    
        int                                 m_font_size;
		font_engine_freetype_t				m_font_engine;
		font_cache_manager_freetype_t		m_font_cache;
    };
}
#endif