import React, { useState } from 'react';

type ModalProps = {
  onClose: () => void;
  email: string;
};

export default function EmailVerificationModal({ onClose, email }: ModalProps) {
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  const handleResend = async () => {
    setSending(true);
    setSentMsg('');
    try {
      const res = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSentMsg('인증 이메일이 다시 발송되었습니다.');
      } else {
        const data = await res.json();
        setSentMsg(`발송 실패: ${data.message}`);
      }
    } catch (error) {
      setSentMsg('서버와 통신 중 오류가 발생했습니다.');
    }
    setSending(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(24, 23, 23, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 1)', padding: 24, borderRadius: 8, maxWidth: 400, textAlign: 'center',
        boxShadow: '0 0 10px rgba(140, 190, 219, 0.26)',
      }}>
        <p>회원가입 성공! 이메일 인증 후 로그인해주세요.</p>
        <p>가입하신 이메일: <b>{email}</b></p>

        <button
          onClick={handleResend}
          disabled={sending}
          style={{
            padding: '8px 20px',
            marginTop: 10,
            cursor: sending ? 'not-allowed' : 'pointer',
            borderRadius: 4,
            border: 'none',
            backgroundColor: '#1877f2',
            color: 'white',
            fontWeight: 'bold',
            marginRight : "5px"
          }}
        >
          {sending ? '발송 중...' : '인증 이메일 다시 보내기'}
        </button>

        {sentMsg && <p style={{ marginTop: 10, color: 'red' }}>{sentMsg}</p>}

        <button
          onClick={onClose}
          style={{
            marginTop: 20,
            padding: '8px 20px',
            cursor: 'pointer',
            borderRadius: 4,
            border: 'none',
            backgroundColor: '#1877f2',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}
