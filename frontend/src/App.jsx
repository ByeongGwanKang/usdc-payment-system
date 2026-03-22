import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants';

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("0");
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState(null); // 트랜잭션 해시 상태 추가

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const balanceWei = await contract.balanceOf(accounts[0]);
        setBalance(ethers.formatUnits(balanceWei, 18));
      } catch (error) {
        console.error("지갑 연결 실패:", error);
      }
    } else {
      alert("메타마스크를 설치해주세요.");
    }
  };

  const handlePayment = async () => {
    if (!account) return alert("먼저 지갑을 연결하세요.");
    if (!recipient || !amount) return alert("수신자 주소와 수량을 입력하세요.");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const parsedAmount = ethers.parseUnits(amount, 18);
      
      console.log("트랜잭션 서명 요청 중...");
      const tx = await contract.transfer(recipient, parsedAmount);
      
      console.log("트랜잭션 전송 완료. 블록 확정 대기 중... Hash:", tx.hash);
      await tx.wait(); 
      
      // 결제 완료 후 상태 업데이트
      setTxHash(tx.hash);
      alert("결제가 성공적으로 완료되었습니다!");
      
      const balanceWei = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(balanceWei, 18));
      
    } catch (error) {
      console.error("결제 트랜잭션 실패:", error);
      alert("결제 처리 중 오류가 발생했습니다. 콘솔 창을 확인하세요.");
    }
  };

  return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '50px auto' }}>
        <h1>USDC 결제 시스템</h1>
      <button onClick={connectWallet} style={{ padding: '10px', marginBottom: '20px', cursor: 'pointer' }}>
        지갑 연결하기
      </button>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p><strong>내 지갑:</strong> {account ? account : "연결되지 않음"}</p>
        <p><strong>보유 잔액:</strong> {balance} mUSDC</p>
      </div>

      <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3 style={{ marginTop: '0' }}>결제하기 (mUSDC 전송)</h3>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="text" 
            placeholder="수신자 지갑 주소 (0x...)" 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="number" 
            placeholder="보낼 수량" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button onClick={handlePayment} style={{ padding: '10px 15px', width: '100%', cursor: 'pointer' }}>
          전송
        </button>
      </div>

      {/* 결제 완료 영수증 출력 섹션 */}
      {txHash && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eef', border: '1px solid #ccd', borderRadius: '5px' }}>
          <h4 style={{ marginTop: '0', color: '#0056b3' }}>✅ 결제 완료 영수증</h4>
          <p style={{ wordBreak: 'break-all', fontSize: '14px' }}><strong>트랜잭션 해시:</strong> <br/> {txHash}</p>
          <a 
            href={`https://sepolia.etherscan.io/tx/${txHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#0056b3', fontWeight: 'bold', textDecoration: 'none' }}
          >
            Etherscan에서 거래 내역 확인하기 ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default App;