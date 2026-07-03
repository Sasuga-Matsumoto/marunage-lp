import { NextRequest, NextResponse } from 'next/server';
import {
  getTestsForPath,
  getCookieName,
  selectVariant,
  DEFAULT_COOKIE_MAX_AGE,
} from './lib/ab-tests';
import type { ProxyConfig } from 'next/server';

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const tests = getTestsForPath(pathname);

  if (tests.length === 0) {
    return NextResponse.next();
  }

  // 新規 variant を 1) request に反映してから 2) NextResponse を作る順序が重要。
  // これをやらないと初回訪問時の Server Component の cookies() に variant が見えず、
  // 必ず control 側にフォールバックしてしまう。
  const cookiesToSet: Array<{ name: string; value: string; maxAge: number }> = [];
  for (const test of tests) {
    const cookieName = getCookieName(test.id);
    const existingValue = request.cookies.get(cookieName)?.value;
    const isValid = existingValue && test.variants.includes(existingValue);
    if (!isValid) {
      const variant = selectVariant(test);
      const maxAge = test.cookieMaxAge ?? DEFAULT_COOKIE_MAX_AGE;
      // ① 同一リクエスト内で下流 Server Component の cookies() が読めるよう request にセット
      request.cookies.set(cookieName, variant);
      cookiesToSet.push({ name: cookieName, value: variant, maxAge });
    }
  }

  // ② request の変更を下流に伝えるため、headers を引き継いで NextResponse を生成
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // ③ ブラウザ側に永続化させるための Set-Cookie をレスポンスに付与
  const isProduction = process.env.NODE_ENV === 'production';
  for (const c of cookiesToSet) {
    response.cookies.set(c.name, c.value, {
      maxAge: c.maxAge,
      sameSite: 'lax',
      secure: isProduction,
      httpOnly: false,
      path: '/',
    });
  }

  return response;
}

export const config: ProxyConfig = {
  matcher: ['/', '/thanks-contact', '/thanks-download', '/download', '/contact'],
};
