/********************************************************************/
/*   STRIPE: converting a polygonal model to triangle strips    
     Francine Evans, 1996.
     SUNY @ Stony Brook
     Advisors: Steven Skiena and Amitabh Varshney
     
     Modified by Elvir Azanli, 1998
*/
/********************************************************************/

/*---------------------------------------------------------------------*/
/*   STRIPE: sgi_triang.c
     File contains the routines that do the whole triangulation
     of polygons.
*/
/*---------------------------------------------------------------------*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "common.h"
#include "global.h"
#include "output.h"
#include "sgi_triang.h"
#include "struct.h"
#include "util.h"


int Adjacent(int id2,int id1, int *list, int size)
{
  /*	Return the vertex that is adjacent to id1,
	but is not id2, in the list of integers.
  */
  
  register int x=0;
  
  while (x < size)
    {
      if (*(list+x) == id1)
	{
	  if ((x != (size -1)) && (x != 0))
	    {
	      if ( *(list+x+1) != id2)
		return *(list+x+1);
	      else
		return *(list+x-1);
	    }
	  else if (x == (size -1))
	    {
	      if (*(list) != id2)
		return *(list);
	      else
		return *(list+x-1);
	    }
	  else
	    {
	      if (*(list+size-1) != id2)
		return *(list+size-1);
	      else
		return *(list+x+1);
	    }
	}
      x++;
    }
  /*   if there are degeneracies */
  return id1;
}


static void Rearrange_Index(int *index, int size)
{
  /*	If we are in the middle of a strip we must find the
	edge to start on, which is the last edge that we had
	transmitted.
  */
  int x,f,y,e1,e2,e3;
  register int increment = 1;
  int *temp;
  
  /*	Find where the input edge is in the input list */
  Last_Edge(&e1,&e2,&e3,0);
  for (y = 0; y < size; y++)
    {
      if (*(index+y) == e2)
	{
	  if ((y != (size - 1)) && (*(index+y+1) == e3))
	    break;
	  else if ((y == (size - 1)) && (*(index) == e3))
	    break;
	  else if ((y != 0) && (*(index+y-1) == e3))
	    {
	      increment = -1;
	      break;
	    }
	  else if ((y==0) && (*(index+size-1) == e3))
	    {
	      increment = -1;
	      break;
	    }
	}
      if (*(index+y) == e3)
	{
	  if ((y != (size - 1)) && (*(index+y+1) == e2))
	    break;
	  else if ((y == (size - 1)) && (*(index) == e2))
	    break;
	  else if ((y != 0) && (*(index+y-1) == e2))
            {
	      increment = -1;
	      break;
            }
	  else if ((y==0) && (*(index+size-1) == e2))
            {
	      increment = -1;
	      break;
            }
	}
      /*	Edge is not here, we are at the beginning */
      if ((y == (size-1)) && (increment != -1))
	return;
    }
  
  /*	Now put the list into a new list, starting with the
	input edge. Increment tells us whether we have to go 
	forward or backward.
  */
  /*	Was in good position already */
  if ((y == 0) && (increment == 1)) 
    return;
  
  temp = (int *) malloc(sizeof(int) * size);
  memcpy(temp,index,sizeof(int)*size);
  
  if (increment == 1)
    {
      x=0;
      for (f = y ; f< size; f++)
	{
	  *(index+x) = *(temp+f);
	  x++;
	}
      /*	Finish the rest of the list */	
      for(f = 0; f < y ; f++)
	{
	  *(index+x) = *(temp+f);
	  x++;
	}
    }
  else
    {
      x=0;
      for (f = y ; f >= 0; f--)
	{
	  *(index+x) = *(temp+f);
	  x++;
	}
      /*	Finish the rest of the list */	
      for(f = (size - 1); f > y ; f--)
	{
	  *(index+x) = *(temp+f);
	  x++;
	}
    }
}

static void Delete_From_List(int id,int *list, int *size)
{
  /*	Delete the occurence of id in the list.
	(list has size size)
  */
  
  int *temp;
  register int x,y=0;
  
  temp = (int *) malloc(sizeof(int) * (*size));
  for (x=0; x<(*size); x++)
    {
      if (*(list+x) != id)
	{
	  *(temp+y) = *(list+x);
	  y++;
	}
    }
  *(temp+y) = -1;
  *size = *size - (*size - y - 1);
  memcpy(list,temp,sizeof(int)*(*size));
}


void Build_SGI_Table(int num_faces)
{
  /*      Build a table that has the polygons sorted by the
	  number of adjacent polygons.
  */
  int x,y,size,tally=0;
  ListHead *pListHead;
  PF_FACES temp = NULL;
  
  /* For each face....*/
  for (x=0;x < num_faces;x++)
    {
      pListHead = PolFaces[x];
      temp = ( PF_FACES ) PeekList( pListHead, LISTHEAD, 0 );
      /*   Check each edge of the face and tally the number of adjacent
	   polygons to this face. 
      */                      
      if ( temp != NULL )
	{
	  /*      Size of the polygon */
	  size = temp->nPolSize;
	  if (size != 1)
	    {
	      for (y = 0; y< size; y++)
		{
		  if (y != (size-1))
		    tally += Num_Adj(*(temp->pPolygon+y),*(temp->pPolygon+y+1));
		  else
		    tally+= Num_Adj(*(temp->pPolygon),*(temp->pPolygon+(size-1)));
		}
	      
	      /*   Tally is the number of polygons that is adjacent to
		   the current polygon. 
	      */
	      /*      Now put the face in the proper bucket depending on tally. */
	      Add_Sgi_Adj(tally,x);
	      temp = NULL;
	      tally=0;
	    }
	}
    }
}


static void Triangulate_Quad(int out_edge1,int out_edge2,int in_edge1,
			     int in_edge2,int size,int *index,
			     int reversed,int where)
{
  int vertex4,vertex5;
  
  /*	This routine will nonblindly triangulate a quad, meaning
	that there is a definite input and a definite output
	edge that we must adhere to. Reversed will tell the orientation
	of the input edge. (Reversed is -1 is we do not have an input
	edge, in other words we are at the beginning of a strip.)
	Out_edge* is the output edge, and in_edge* is the input edge. 
	Index are the edges of the polygon
	and size is the size of the polygon. Begin is whether we are
	at the start of a new strip.
  */
  
  /*	If we do not have an input edge, then we can make our input
	edge whatever we like, therefore it will be easier to come
	out on the output edge.
  */
  if (reversed == -1)
    {
      vertex4 = Adjacent(out_edge1,out_edge2,index,size);
      vertex5 = Get_Other_Vertex(vertex4,out_edge1,out_edge2,index);
      Output_Tri(vertex5,vertex4,out_edge1,where);
      Output_Tri(vertex4,out_edge1,out_edge2,where);
      return;
    }
  
  /*	These are the 5 cases that we can have for the output edge */
  
  /*  Are they consecutive so that we form a triangle to
      peel off, but cannot use the whole quad?
  */
  
  if (in_edge2 == out_edge1) 
    {
      /*	Output the triangle that comes out the correct
		edge last. First output the triangle that comes out
		the wrong edge.
      */
      vertex4 = Get_Other_Vertex(in_edge1,in_edge2,out_edge2,index);
      Output_Tri(in_edge1,in_edge2,vertex4,where);
      Output_Tri(vertex4,in_edge2,out_edge2,where);
      return;
    }
  /*	The next case is where it is impossible to come out the
	edge that we want. So we will have to start a new strip to
	come out on that edge. We will output the one triangle
	that we can, and then start the new strip with the triangle
	that comes out on the edge that we want to come out on.
  */
  else if (in_edge1 == out_edge1)
    {
      /*	We want to output the first triangle (whose output
		edge is not the one that we want.
		We have to find the vertex that we need, which is
		the other vertex which we do not have.
      */
      vertex4 = Get_Other_Vertex(in_edge2,in_edge1,out_edge2,index);
      Output_Tri(in_edge2,in_edge1,vertex4,where);
      Output_Tri(vertex4,in_edge1,out_edge2,where);
      return;
    }
  
  /*	Consecutive cases again, but with the output edge reversed */
  else if (in_edge1 == out_edge2)
    {
      vertex4 = Get_Other_Vertex(in_edge1,in_edge2,out_edge1,index);
      Output_Tri(in_edge2,in_edge1,vertex4,where);
      Output_Tri(vertex4,in_edge1,out_edge1,where);
      return;
    }
  else if (in_edge2 == out_edge2)
    {
      vertex4 = Get_Other_Vertex(in_edge1,in_edge2,out_edge1,index);
      Output_Tri(in_edge1,in_edge2,vertex4,where);
      Output_Tri(vertex4,in_edge2,out_edge1,where);
      return;
    }
  
  /*	The final case is where we want to come out the opposite
	edge.
  */
  else
    {
      if( ((!reversed) &&
	   (out_edge1 == (Adjacent(in_edge1,in_edge2,index,size)))) ||
	  ((reversed) &&
	   (out_edge2 == (Adjacent(in_edge2,in_edge1,index,size)))))
	{
	  /*	We need to know the orientation of the input
		edge, so we know which way to put the diagonal.
                And also the output edge, so that we triangulate
                correctly.
	  */
	  Output_Tri(in_edge1,in_edge2,out_edge2,where);
	  Output_Tri(in_edge2,out_edge2,out_edge1,where);
	}
      else
	{
	  /*      Input and output orientation was reversed, so diagonal will
		  be reversed from above.
	  */
	  Output_Tri(in_edge1,in_edge2,out_edge1,where);
	  Output_Tri(in_edge2,out_edge1,out_edge2,where);
	}
      return;
    }
}

static void Triangulate_Polygon(int out_edge1,int out_edge2,int in_edge1,
				int in_edge2,int size,int *index,
				FILE *output,int reversed,int face_id,
				int where,int color1,int color2,int color3)
{
  /*	We have a polygon that we need to nonblindly triangulate.
	We will recursively try to triangulate it, until we are left
	with a polygon of size 4, which can use the quad routine
	from above. We will be taking off a triangle at a time
	and outputting it. We will have 3 cases similar to the
	cases for the quad above. The inputs to this routine
	are the same as for the quad routine.
  */
  
  int vertex4;
  int *temp;
  
  
  /*	Since we are calling this recursively, we have to check whether
	we are down to the case of the quad.
  */
  
  if (size == 4)
    {
      Triangulate_Quad(out_edge1,out_edge2,in_edge1,in_edge2,size,
		       index,reversed,where);
      return;
    }
  
  
  
  /*	We do not have a specified input edge, and therefore we
	can make it anything we like, as long as we still come out 
	the output edge that we want.
  */
  if (reversed  == -1)
    {
      /*	Get the vertex for the last triangle, which is
		the one coming out the output edge, before we do
		any deletions to the list. We will be doing this
		bottom up.
      */
      vertex4 = Adjacent(out_edge1,out_edge2,index,size);
      temp = (int *) malloc(sizeof(int) * size);
      memcpy(temp,index,sizeof(int)*size);
      Delete_From_List(out_edge2,index,&size);
      Triangulate_Polygon(out_edge1,vertex4,in_edge2,
			  vertex4,size-1,index,output,reversed,face_id,
			  where,color1,color2,color3);
      memcpy(index,temp,sizeof(int)*size);
      /*	Lastly do the triangle that comes out the output
		edge.
      */
      Output_Tri(vertex4,out_edge1,out_edge2,where);
      return;
    }
  
  /*	These are the 5 cases that we can have for the output edge */
  
  /*  Are they consecutive so that we form a triangle to
      peel off that comes out the correct output edge, 
      but we cannot use the whole polygon?
  */
  if (in_edge2 == out_edge1) 
    {
      /*	Output the triangle that comes out the correct
		edge last. First recursively do the rest of the
		polygon.
      */
      /*	Do the rest of the polygon without the triangle. 
		We will be doing a fan triangulation.
      */
      /*	Get the vertex adjacent to in_edge1, but is not
		in_edge2.
      */
      vertex4 = Adjacent(in_edge2,in_edge1,index,size);
      Output_Tri(in_edge1,in_edge2,vertex4,where);
      /*	Create a new edgelist without the triangle that
		was just outputted.
      */
      temp = (int *) malloc(sizeof(int) * size);
      memcpy(temp,index,sizeof(int)*size);
      Delete_From_List(in_edge1,index,&size);
      Triangulate_Polygon(out_edge1,out_edge2,in_edge2,
			  vertex4,size-1,index,output,!reversed,face_id,
			  where,color1,color2,color3);
      memcpy(index,temp,sizeof(int)*size);
      return;
    }
  
  /*	Next case is where it is again consecutive, but the triangle
	formed by the consecutive edges do not come out of the
	correct output edge. For this case, we can not do much to
	keep it sequential. Try and do the fan.
  */
  else if (in_edge1 == out_edge1)
    {
      /*	Get vertex adjacent to in_edge2, but is not in_edge1 */
      vertex4 = Adjacent(in_edge1,in_edge2,index,size);
      Output_Tri(in_edge1,in_edge2,vertex4,where);
      /*	Since that triangle goes out of the polygon (the
		output edge of it), we can make our new input edge
		anything we like, so we will try to make it good for
		the strip. (This will be like starting a new strip,
		all so that we can go out the correct output edge.)
      */
      temp = (int *) malloc(sizeof(int) * size);
      memcpy(temp,index,sizeof(int)*size);
      Delete_From_List(in_edge2,index,&size);
      Triangulate_Polygon(out_edge1,out_edge2,in_edge1,
			  vertex4,size-1,index,output,reversed,face_id,
			  where,color1,color2,color3);
      memcpy(index,temp,sizeof(int)*size);
      return;
    }
  /*	Consecutive cases again, but with the output edge reversed */
  else if (in_edge1 == out_edge2)
    {
      /*	Get vertex adjacent to in_edge2, but is not in_edge1 */
      vertex4 = Adjacent(in_edge1,in_edge2,index,size);
      Output_Tri(in_edge2,in_edge1,vertex4,where);
      temp = (int *) malloc(sizeof(int) * size);
      memcpy(temp,index,sizeof(int)*size);
      Delete_From_List(in_edge2,index,&size);
      Triangulate_Polygon(out_edge1,out_edge2,in_edge1,
			  vertex4,size-1,index,output,reversed,face_id,
			  where,color1,color2,color3);
      memcpy(index,temp,sizeof(int)*size);
      return;
    }
  else if (in_edge2 == out_edge2)
    {
      /*	Get vertex adjacent to in_edge2, but is not in_edge1 */
      vertex4 = Adjacent(in_edge2,in_edge1,index,size);
      Output_Tri(in_edge1,in_edge2,vertex4,where);
      temp = (int *) malloc(sizeof(int) * size);
      memcpy(temp,index,sizeof(int)*size);
      Delete_From_List(in_edge1,index,&size);
      Triangulate_Polygon(out_edge1,out_edge2,vertex4,
			  in_edge2,size-1,index,output,reversed,face_id,
			  where,color1,color2,color3);
      memcpy(index,temp,sizeof(int)*size);
      return;
    }
  
  /*	Else the edge is not consecutive, and it is sufficiently
	far away, for us not to make a conclusion at this time.
	So we can take off a triangle and recursively call this
	function.
  */
  else
    {
      vertex4 = Adjacent(in_edge2,in_edge1,index,size);
      Output_Tri(in_edge1,in_edge2,vertex4,where);
      temp = (int *) malloc(sizeof(int) * size);
      memcpy(temp,index,sizeof(int)*size);
      Delete_From_List(in_edge1,index,&size);
      Triangulate_Polygon(out_edge1,out_edge2,in_edge2,
			  vertex4,size-1,index,output,!reversed,face_id,
			  where,color1,color2,color3);
      memcpy(index,temp,sizeof(int)*size);
      return;
    }
}

static void Triangulate(int out_edge1,int out_edge2,int in_edge1,
			int in_edge2,int size,int *index,
			FILE *output,int reversed,int face_id, int where,
			int color1, int color2,int color3)
{
  /*	We have the info we need to triangulate a polygon */
  
  if (size == 4)
    Triangulate_Quad(out_edge1,out_edge2,in_edge1,in_edge2,size,
		     index,reversed,where);
  else
    Triangulate_Polygon(out_edge1,out_edge2,in_edge1,in_edge2,size,
			index,output,reversed,face_id,where,color1,color2,color3);
}

void Non_Blind_Triangulate(int size,int *index,
			   FILE *output,int next_face_id,int face_id,int where,
                           int color1,int color2,int color3)
{
  int id1,id2,id3;
  int nedge1,nedge2;
  int reversed;
  /*	We have a polygon that has to be triangulated and we cannot
	do it blindly, ie we will try to come out on the edge that
	has the least number of adjacencies
  */
  
  Last_Edge(&id1,&id2,&id3,0);
  /*	Find the edge that is adjacent to the new face ,
	also return whether the orientation is reversed in the
	face of the input edge, which is id2 and id3.
  */
  if (next_face_id == -1)
    {
      printf("The face is -1 and the size is %d\n",size);
      exit(0);
    }
  
  reversed = Get_Edge(&nedge1,&nedge2,index,next_face_id,size,id2,id3);
  /* Do the triangulation */
  
  /* If reversed is -1, the input edge is not in the polygon, 
     therefore we can have the input edge to be anything we like, 
     since we are at the beginning of a strip
  */
  Triangulate(nedge1,nedge2,id2,id3,size,index,output,reversed,
	      face_id, where,color1,color2,color3);
}



void Blind_Triangulate(int size, int *index, BOOL begin, int where)
{
  /*	save sides in temp array, we need it so we know
	about swaps.
  */
  int mode, decreasing,increasing,e1,e2,e3;
  
  /*	Rearrange the index list so that the input edge is first
   */
  if (!begin)
    Rearrange_Index(index,size);
  
  /*	We are given a polygon of more than 3 sides
	and want to triangulate it. We will output the
	triangles to the output file.
  */
  
  /*	Find where the input edge is in the input list */
  Last_Edge(&e1,&e2,&e3,0);
  if (( (!begin) && (*(index) == e2) ) || (begin))
    {
      Output_Tri(*(index+0),*(index+1),*(index+size-1),where);
      /*	If we have a quad, (chances are yes), then we know that
		we can just add one diagonal and be done. (divide the
		quad into 2 triangles.
      */
      if (size == 4)
        {
	  Output_Tri(*(index+1),*(index+size-1),*(index+2),where);
	  return;
        }
      increasing = 1;
      mode = 1;
      
    }
  else if (!begin)
    {
      Output_Tri(*(index+1),*(index+0),*(index+size-1),where);
      if (size == 4)
        {
	  Output_Tri(*(index+0),*(index+size-1),*(index+2),where);
	  return;
        }
      Output_Tri(*(index+0),*(index+size-1),*(index+2),where);
      increasing = 2;
      mode = 0;
    }
  if (size != 4)
    {
      /*	We do not have a quad, we have something bigger. */
      decreasing = size - 1;		
      do
	{
	  /*	Will be alternating diagonals, so we will be increasing
		and decreasing around the polygon.
	  */
	  if (mode)
	    {
	      Output_Tri(*(index+increasing),*(index+decreasing),
			 *(index+increasing+1),where);
	      increasing++;
	    }
	  else
	    {
	      Output_Tri(*(index+decreasing),*(index+increasing),
			 *(index+decreasing-1),where);
	      decreasing--;
	    }
	  mode = !mode;
	} while ((decreasing - increasing) >= 2);
      
    }
}
