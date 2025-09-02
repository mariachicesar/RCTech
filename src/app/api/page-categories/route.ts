import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/superbase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('website_id');

    let query = supabase
      .from('page_category')
      .select(`
        *,
        parent_category:parent_id(id, name, slug),
        sub_categories:page_category!parent_id(id, name, slug)
      `);

    if (websiteId) {
      query = query.eq('website_id', parseInt(websiteId));
    }

    const { data, error } = await query
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ categories: data });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { data: categoryData, error } = await supabase
      .from('page_category')
      .insert(data)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      category: categoryData 
    });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
