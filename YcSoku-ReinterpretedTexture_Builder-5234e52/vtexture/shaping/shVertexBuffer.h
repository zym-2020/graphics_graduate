#ifndef __SH_VERTEX_BUFFER_H__
#define __SH_VERTEX_BUFFER_H__
#include "shapeTypes.h"
namespace shaping{
	template<class iT>
	class CShapeVertexBuffer:public iT,private ShapeVertexAttribs
	{
	public:
		CShapeVertexBuffer(){
			m_has_colors = m_has_normals = 
			m_has_tex_coords=m_has_tex_coords2=
			m_has_weights=m_has_tokens=false;
		}		
		virtual ~CShapeVertexBuffer(){}
		virtual int					np()					{return m_points.size();		}
		virtual point_t				p(int index)			{return m_points[index];		}
		virtual point_t*			points()				{return VDATA(m_points);		}
		virtual ShapeVertexAttribs* attribs()				{return this;			}
		
		virtual	bool 	hasColors()						{return m_has_colors;		}
		virtual bool	hasNormals()					{return m_has_normals;		}
		virtual bool	hasTexCoords()					{return m_has_tex_coords;	}
		virtual bool	hasTexCoords2()					{return m_has_tex_coords2;	}
		virtual bool	hasWeights()					{return m_has_weights;		}
		virtual bool	hasTokens()						{return m_has_tokens;}

		virtual int					nattrib()				{return np();}
		virtual color_t 			color(int index)		{return m_colors[index];	    }
		virtual color_t* 	
									colors()				{return VDATA(m_colors);	    }
		virtual	Vector3df			normal(int index)		{return m_normals[index];	    }
		virtual	Vector3df*			normals()				{return VDATA(m_normals);	}
		virtual Vector2df			texcoord(int index)		{return m_tex_coords[index];	}
		virtual	Vector2df*			texcoords()				{return VDATA(m_tex_coords); }
		virtual Vector2df			texcoord2(int index)	{return m_tex_coords2[index];	}
		virtual	Vector2df*			texcoords2()			{return VDATA(m_tex_coords2);		}
		virtual float				weight(int index)		{return m_weights[index];		}
		virtual	float*				weights()				{return VDATA(m_weights);	}
		virtual int					token(int index)		{return m_tokens[index];		}
		virtual int*				tokens()				{return VDATA(m_tokens);	}
	public:
		//!���컺����
		void makeVertexBuffer(int size,bool c=false,bool n=false,bool t=false, bool tk=false,bool t2=false,bool w=false)
		{
			m_points.resize(size);
			if(c)  enableColors();
			if(n)  enableNormals();
			if(t)  enableTexCoords();
			if(t2) enableTexCoords2();
			if(w)  enableWeights();
			if(tk) enableTokens();
		}
		
		void enableColors(){if(m_has_colors)return; m_has_colors=true;m_colors.resize(m_points.size());}
		void enableNormals(){if(m_has_normals)return; m_has_normals=true;m_normals.resize(m_points.size());}
		void enableTexCoords(){if(m_has_tex_coords)return; m_has_tex_coords=true; m_tex_coords.resize(m_points.size());}
		void enableTexCoords2(){if(m_has_tex_coords2)return; m_has_tex_coords2=true;m_tex_coords2.resize(m_points.size());}
		void enableWeights(){if(m_has_weights)return; m_has_weights=true;m_weights.resize(m_points.size());}
		void enableTokens(){if(m_has_tokens)return; m_has_tokens=true;m_tokens.resize(m_points.size());}
		
		void addPoint(const point_t& p){m_points.push_back(p);
			if(hasColors()){m_colors.push_back(0x0);}
			if(hasNormals()){m_normals.push_back(vector3df(0,0,0));}
			if(hasTexCoords()){m_tex_coords.push_back(vector2df(0,0));}
			if(hasTexCoords2()){m_tex_coords2.push_back(vector2df(0,0));}
			if(hasWeights()){m_weights.push_back(0.0);}
			if(hasTokens()){m_tokens.push_back(1);}
		}	
		void setPoint(int i,const point_t& p)			{if(m_points.size()>1)m_points[i]=p;}
		void setColor (int i,const color_t& c)	{if(m_colors.size()>i)m_colors[i]=c;}
		void setNormal(int i,const vector3df&  n)	{if(m_normals.size()>i)m_normals[i]=n;};
		void setTexCoord (int i,const Vector2df& t)	{if(m_tex_coords.size()>i)m_tex_coords[i]=t;};
		void setTexCoord2 (int i,const Vector2df& t)	{if(m_tex_coords2.size()>i)m_tex_coords2[i]=t;};
		void setWeight(int i,float w)					{if(m_weights.size()>i)m_weights[i]=w;};
		void setToken(int i,int tk)					{if(m_tokens.size()>i)m_tokens[i]=tk;};
		
		void modifyLastColor(const color_t& c){setColor(m_points.size()-1,c);}
		void modifyLastNormal(const Vector3df& n){setNormal(m_points.size()-1,n);}
		void modifyLastTexCoord(const Vector2df& t){setTexCoord(m_points.size()-1,t);}
		void modifyLastTexCoord2(const Vector2df& t){setTexCoord2(m_points.size()-1,t);}
		void modifyLastWeight(float& w){setWeight(m_points.size()-1,w);}
		void modifyLastToken(int tk){setToken(m_points.size()-1,tk);}
		void modifyAllColor(const color_t& c) { for(int i=0;i<np();i++)setColor(i, c); }

		void resetColorSize(int size) { m_colors.resize(size); }
	public:
		void copyVertexBuffer(ShapeVertexBuffer* vb)
		{
			m_points.resize(vb->np());
			if(vb->points())
			{
				memcpy(&m_points[0],vb->points(),sizeof(point_t)*vb->np());
			}
			else
			{
				for(int i=0,np = vb->np();i<np;i++)
				{
					m_points[i]=vb->p(i);
				}
			}
			if(vb->attribs())
			{
				if(vb->attribs()->hasColors())
				{
					enableColors();
					memcpy(VDATA(m_colors),vb->attribs()->colors(),sizeof(color_t)*vb->np());
				}
				if(vb->attribs()->hasNormals())
				{
					enableNormals();
					memcpy(VDATA(m_normals),vb->attribs()->normals(),sizeof(Vector3df)*vb->np());
				}
				if(vb->attribs()->hasTexCoords())
				{
					enableTexCoords();
					memcpy(VDATA(m_tex_coords),vb->attribs()->texcoords(),sizeof(Vector2df)*vb->np());
				}
				if(vb->attribs()->hasTexCoords2())
				{
					enableTexCoords2();
					memcpy(VDATA(m_tex_coords2),vb->attribs()->texcoords2(),sizeof(Vector2df)*vb->np());
				}
				if(vb->attribs()->hasWeights())
				{
					enableWeights();
					memcpy(VDATA(m_weights),vb->attribs()->weights(),sizeof(float)*vb->np());
				}
				if(vb->attribs()->hasTokens())
				{
					enableTokens();
					memcpy(VDATA(m_tokens),vb->attribs()->tokens(),sizeof(int)*vb->np());
				}
			}
		}
	public:
		std::vector<point_t>				m_points;
		std::vector<color_t>				m_colors;
		std::vector<Vector3df>				m_normals;
		std::vector<Vector2df>				m_tex_coords;
		std::vector<Vector2df>				m_tex_coords2;
		std::vector<float>					m_weights;
		std::vector<int>					m_tokens;
	protected:
		struct 
		{
			bool m_has_colors:1;
			bool m_has_normals:1;
			bool m_has_tex_coords:1;
			bool m_has_tex_coords2:1;
			bool m_has_weights:1;
			bool m_has_tokens:1;
			bool m_closed:1;
			bool m_hole:1;
		};
	};
}
#endif