import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/superbase-client';
import { PageCreationData } from '@/types/page';

export async function POST(request: NextRequest) {
  try {
    const data: PageCreationData = await request.json();
    
    // Create the page
    const { data: pageData, error: pageError } = await supabase
      .from('page')
      .insert({
        title: data.title,
        slug: data.slug,
        page_type: data.page_type,
        template_type: data.template_type,
        parent_id: data.parent_id,
        is_main_nav: data.is_main_nav,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
        website_id: data.website_id,
        is_published: false, // Start as draft
        sort_order: 0,
        content: '', // Empty content initially
      })
      .select()
      .single();

    if (pageError) {
      return NextResponse.json({ error: pageError.message }, { status: 400 });
    }

    // If there are category IDs, create the relationships
    if (data.category_ids && data.category_ids.length > 0) {
      const categoryRelations = data.category_ids.map(categoryId => ({
        page_id: pageData.id,
        category_id: categoryId,
      }));

      const { error: categoryError } = await supabase
        .from('page_page_category')
        .insert(categoryRelations);

      if (categoryError) {
        console.error('Error creating category relations:', categoryError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ 
      success: true, 
      page: pageData 
    });

  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('website_id');
    const pageType = searchParams.get('page_type');
    const isMainNav = searchParams.get('is_main_nav');

    let query = supabase
      .from('page')
      .select(`
        *,
        parent_page:parent_id(id, title, slug),
        sub_pages:page!parent_id(id, title, slug, page_type)
      `);

    if (websiteId) {
      query = query.eq('website_id', websiteId);
    }

    if (pageType) {
      query = query.eq('page_type', pageType);
    }

    if (isMainNav === 'true') {
      query = query.eq('is_main_nav', true);
    }

    const { data, error } = await query.order('sort_order');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ pages: data });

  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('id');
    
    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const updates = await request.json();
    
    const { data, error } = await supabase
      .from('page')
      .update(updates)
      .eq('id', pageId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      page: data 
    });

  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}
