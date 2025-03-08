import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 这里替换为实际的登录逻辑
    if (email === "admin@example.com" && password === "password") {
      return NextResponse.json({ 
        success: true, 
        message: "登录成功",
        user: { email, id: 1 }
      });
    }

    return NextResponse.json(
      { success: false, message: "邮箱或密码错误" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
} 