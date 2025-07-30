import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">페이지를 찾을 수 없습니다.</p>
        <Link href="/">
          <a className="text-botanical-accent hover:text-botanical-dark underline">
            홈으로 돌아가기
          </a>
        </Link>
      </div>
    </div>
  );
}