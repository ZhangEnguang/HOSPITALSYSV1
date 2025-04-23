import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 获取查询参数
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'horizontal';

    console.log('项目编辑路由 - 接收参数:', { id, type });

    // 验证参数
    if (!id) {
      console.error('项目编辑路由 - 缺少项目ID参数');
      return NextResponse.json({ error: '缺少项目ID参数' }, { status: 400 });
    }

    // 根据项目类型构建不同的重定向URL
    let redirectUrl = '';
    
    if (type === 'school') {
      redirectUrl = `/projects/edit/school/${id}`;
    } else if (type === 'vertical') {
      redirectUrl = `/projects/edit/vertical/${id}`;
    } else {
      // 默认为横向项目
      redirectUrl = `/projects/edit/${id}`;
    }

    console.log('项目编辑路由 - 重定向到:', redirectUrl);

    // 构建完整的URL
    const fullRedirectUrl = new URL(redirectUrl, request.url);
    console.log('项目编辑路由 - 完整URL:', fullRedirectUrl.toString());

    // 返回重定向响应
    return NextResponse.redirect(fullRedirectUrl);
  } catch (error) {
    console.error('项目编辑路由错误:', error);
    return NextResponse.json({ error: '处理请求时出错' }, { status: 500 });
  }
} 