import React, { useState } from 'react';
import { upgradeToProTest, downgradeToFree } from '../pro';

function UpgradeModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      // 테스트: 30일 Pro 활성화
      const result = await upgradeToProTest(30);
      if (result.success) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to upgrade:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-purple-500 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">👑</span>
              <div>
                <h2 className="text-3xl font-bold text-white">Pro 버전으로 업그레이드</h2>
                <p className="text-sm text-purple-200 mt-1">💳 정기 구독 서비스</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {/* 구독 설명 */}
          <div className="bg-blue-900 bg-opacity-40 border border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-blue-200">
              <span className="font-bold">💳 구독이란:</span> 한 번 결제하면 매달 자동으로 갱신되는 서비스입니다.
            </p>
            <p className="text-blue-300 text-sm mt-2">
              언제든지 취소 가능하며, 취소 후에는 요금이 청구되지 않습니다.
            </p>
          </div>

          {/* Feature Comparison - 더 명확하게 */}
          <div className="mb-8">
            <h3 className="text-white font-bold text-lg mb-4">📊 Free vs Pro 비교</h3>
            
            <div className="space-y-3">
              {/* Sessions */}
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div>
                  <span className="text-white font-medium">저장 가능한 세션</span>
                  <p className="text-xs text-gray-400 mt-1">탭 그룹을 몇 개까지 저장할 수 있나요?</p>
                </div>
                <div className="flex gap-6 text-sm font-bold">
                  <div className="text-center">
                    <div className="text-red-400 text-lg">5개</div>
                    <div className="text-xs text-gray-400">Free</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 text-lg">∞</div>
                    <div className="text-xs text-gray-400">Pro</div>
                  </div>
                </div>
              </div>

              {/* Ads */}
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div>
                  <span className="text-white font-medium">광고</span>
                  <p className="text-xs text-gray-400 mt-1">깨끗한 인터페이스</p>
                </div>
                <div className="flex gap-6 text-sm font-bold">
                  <div className="text-center">
                    <div className="text-red-400">표시됨</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400">제거됨</div>
                  </div>
                </div>
              </div>

              {/* Cloud Sync */}
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div>
                  <span className="text-white font-medium">클라우드 동기화</span>
                  <p className="text-xs text-gray-400 mt-1">여러 기기에서 세션 공유</p>
                </div>
                <div className="flex gap-6 text-sm font-bold">
                  <div className="text-center">
                    <div className="text-red-400">없음</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400">예정</div>
                  </div>
                </div>
              </div>

              {/* Priority Support */}
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600">
                <div>
                  <span className="text-white font-medium">우선 지원</span>
                  <p className="text-xs text-gray-400 mt-1">빠른 답변과 도움</p>
                </div>
                <div className="flex gap-6 text-sm font-bold">
                  <div className="text-center">
                    <div className="text-red-400">없음</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400">있음</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing - 크고 명확하게 */}
          <div className="bg-gradient-to-r from-yellow-900 to-orange-900 rounded-lg p-6 mb-6 border-2 border-yellow-600">
            <div className="text-center">
              <p className="text-gray-300 text-sm font-medium">💳 월간 구독 요금</p>
              <div className="mt-3">
                <span className="text-5xl font-bold text-white">$1.99</span>
                <span className="text-gray-300 text-lg">/월</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">또는 연간 $19.99 (월 $1.66)</p>
              <p className="text-yellow-200 text-xs mt-3">
                ✓ 언제든지 취소 가능
              </p>
            </div>
          </div>

          {/* Test Mode Notice */}
          <div className="bg-blue-900 bg-opacity-50 border border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-blue-200 text-sm">
              <span className="font-bold">🧪 테스트 모드:</span> 
            </p>
            <p className="text-blue-300 text-sm mt-2">
              지금은 테스트 페이지입니다. "Pro 업그레이드" 버튼을 누르면 실제 결제 없이 <strong>30일 무료 체험</strong>이 활성화됩니다.
            </p>
          </div>

          {/* Benefits List */}
          <div className="mb-6">
            <h4 className="text-white font-bold text-lg mb-4">🎁 Pro 버전을 선택한 이유:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 bg-gray-700 p-3 rounded">
                <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                <div>
                  <p className="text-white font-medium text-sm">무제한 세션</p>
                  <p className="text-gray-400 text-xs">제한 없이 탭 그룹 저장</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-700 p-3 rounded">
                <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                <div>
                  <p className="text-white font-medium text-sm">깨끗한 화면</p>
                  <p className="text-gray-400 text-xs">광고 없음</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-700 p-3 rounded">
                <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                <div>
                  <p className="text-white font-medium text-sm">동기화 준비</p>
                  <p className="text-gray-400 text-xs">여러 기기에서 공유 예정</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-700 p-3 rounded">
                <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                <div>
                  <p className="text-white font-medium text-sm">우선 지원</p>
                  <p className="text-gray-400 text-xs">빠른 고객 지원</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Quick */}
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="text-white font-bold mb-3">❓ 자주 묻는 질문</h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-white font-medium">구독을 취소하면?</p>
                <p className="text-gray-300">언제든 취소 가능, 현재 기한까지 Pro 사용 가능</p>
              </div>
              <div className
="border-t border-gray-600 pt-2 mt-2">
                <p className="text-white font-medium">결제 방법은?</p>
                <p className="text-gray-300">신용카드로 안전한 Stripe 결제 (실제 구현 시)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Buttons */}
        <div className="bg-gray-700 px-8 py-4 rounded-b-xl flex gap-3 border-t border-gray-600">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-bold transition"
          >
            나중에
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-500 rounded-lg text-white font-bold transition text-lg"
          >
            {loading ? '처리 중...' : '👑 Pro 구독하기 ($1.99/월)'}
          </button>
        </div>

        {/* Terms Notice */}
        <div className="bg-gray-800 px-8 py-3 rounded-b-xl text-center">
          <p className="text-gray-400 text-xs">
            "Pro 구독하기" 버튼을 누르면 구독이 시작됩니다.
            <br />
            <a href="#" className="text-blue-400 hover:underline">이용약관</a> 및 
            <a href="#" className="text-blue-400 hover:underline">개인정보 보호정책</a>에 동의합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UpgradeModal;
