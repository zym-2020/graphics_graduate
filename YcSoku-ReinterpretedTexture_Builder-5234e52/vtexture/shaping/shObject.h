#ifndef __SH_OBJECT_H__
#define __SH_OBJECT_H__
#include <vector>
namespace shaping{
	typedef unsigned 		color_t;
	typedef unsigned 		uint;
	typedef unsigned 		u32;
	typedef unsigned char  u8;
	typedef unsigned short  u16;
	typedef float 			f32;
	typedef double 			f64;
	class shObject
	{
	public:
		virtual ~shObject(){} 
		virtual uint addRef()=0; 
		virtual uint release()=0; 
		virtual uint getReferenceCounter()=0;
	};

	/////////////////////////////////////////////////
	#define SH_OBJECT()\
		u32 ReferenceCounter=1;\
	public:\
	virtual uint getReferenceCounter(){return ReferenceCounter;}\
	virtual uint addRef(){\
			ReferenceCounter++;return ReferenceCounter;}\
	virtual uint release(){\
				ReferenceCounter--;\
				if(!ReferenceCounter){delete this;return 0;};\
				return ReferenceCounter;}\
	private:

	///////////////////////////////////////////////////
	template<class iT>
	inline void ReleaseUnknown(iT*& p)
	{
		if(p)
			p->release();
		p=NULL;
	}
	template<class iT>
	inline void AddUnknown(iT*& p)
	{
		if(p)
			p->addRef();
	}

	template<typename T>
	struct vector2d
	{
		vector2d(T x=0,T y=0):X(x),Y(y){}
		template<class T2Like>
		vector2d(const T2Like& other):X(other.X),Y(other.Y){}
		bool operator==(const vector2d<T>& other){
			return X=other.X && Y = other.Y;
		}
		T X;
		T Y;
	};
	typedef vector2d<f32> vector2df;
	typedef vector2d<f64> vector2dd;

	template<typename T>
	struct vector3d
	{
		vector3d(T x=0,T y=0,T z=0):X(x),Y(y),Z(z){}
		template<class T3Like>
		vector3d(const T3Like& other):X(other.X),Y(other.Y),Z(other.Z){}
		bool operator==(const vector3d<T>& other){
			return X=other.X && Y = other.Y&&Z=other.Z;
		}

		T X;
		T Y;
		T Z;
	};
	typedef vector2d<f32> vector2df,Vector2df;
	typedef vector2d<f64> vector2dd,Vector2dd,Point2dd;
	typedef vector3d<f32> vector3df,Vector3df;
	typedef vector3d<f64> vector3dd,Vector3dd,Point3dd;

	template<typename T>
	struct box2d
	{
		typedef box2d<T> selfType;
		box2d(T x0=0.0,T y0=0.0,T x1=0.0,T y1=0.0):MinEdge(x0,y0),MaxEdge(x1,y1)
		{
		}
		template<class point2Like>
		box2d(const point2Like& a,const point2Like& b):MinEdge(a),MaxEdge(b)
		{
		}
		box2d(const box2d<T>& other):MinEdge(other.MinEdge),MaxEdge(other.MaxEdge)
		{
		}
		selfType& addInternalBox(const box2d<T>& other)
		{
			if(MinEdge.X>other.MinEdge.X)MinEdge.X=other.MinEdge.X;
			if(MinEdge.Y>other.MinEdge.Y)MinEdge.Y=other.MinEdge.Y; 

			if(MaxEdge.X<other.MaxEdge.X)MaxEdge.X=other.MaxEdge.X;
			if(MaxEdge.Y<other.MaxEdge.Y)MaxEdge.Y=other.MaxEdge.Y; 
			return *this;
		}
		template<class point2Like>
		selfType& addInternalPoint(const point2Like& point)
		{
			if(MinEdge.X>point.X)MinEdge.X=point.X;
			if(MinEdge.Y>point.Y)MinEdge.Y=point.Y; 

			if(MaxEdge.X<point.X)MaxEdge.X=point.X;
			if(MaxEdge.Y<point.Y)MaxEdge.Y=point.Y; 
			return *this;
		}
		vector2d<T> MinEdge;
		vector2d<T> MaxEdge;
	};
	typedef box2d<f32> box2df,Box2df;
	typedef box2d<f64> box2dd,Box2dd;



	template<typename T>
	struct box3d
	{
		typedef box3d<T> selfType;
		box3d(T x0=0.0,T y0=0.0,T z0=0.0,T x1=0.0,T y1=0.0,T z1=0.0):MinEdge(x0,y0,z0),MaxEdge(x1,y1,z1)
		{
		}
		template<class point3Like>
		box3d(const point3Like& a,const point3Like& b):MinEdge(a),MaxEdge(b)
		{
		}
		box3d(const box3d<T>& other):MinEdge(other.MinEdge),MaxEdge(other.MaxEdge)
		{
		}
		selfType& addInternalBox(const box3d<T>& other)
		{
			if(MinEdge.X>other.MinEdge.X)MinEdge.X=other.MinEdge.X;
			if(MinEdge.Y>other.MinEdge.Y)MinEdge.Y=other.MinEdge.Y;
			if(MinEdge.Z>other.MinEdge.Z)MinEdge.Z=other.MinEdge.Z;

			if(MaxEdge.X<other.MaxEdge.X)MaxEdge.X=other.MaxEdge.X;
			if(MaxEdge.Y<other.MaxEdge.Y)MaxEdge.Y=other.MaxEdge.Y;
			if(MaxEdge.Z<other.MaxEdge.Z)MaxEdge.Z=other.MaxEdge.Z;
			return *this;
		}
		template<class point3Like>
		selfType& addInternalPoint(const point3Like& point)
		{
			if(MinEdge.X>point.X)MinEdge.X=point.X;
			if(MinEdge.Y>point.Y)MinEdge.Y=point.Y;
			if(MinEdge.Z>point.Z)MinEdge.Z=point.Z;

			if(MaxEdge.X<point.X)MaxEdge.X=point.X;
			if(MaxEdge.Y<point.Y)MaxEdge.Y=point.Y;
			if(MaxEdge.Z<point.Z)MaxEdge.Z=point.Z;
			return *this;
		}
		vector3d<T> MinEdge;
		vector3d<T> MaxEdge;
	};
	typedef box3d<f32> box3df,Box3df;
	typedef box3d<f64> box3dd,Box3dd;

	inline color_t make_color_argb(u8 a,u8 r,u8 g,u8 b)
	{
		return (u32(b)<<24)|(u32(g)<<16)|(u32(r)<<8)||u32(a);
	}
}

#define VDATA(v) v.data()

#endif