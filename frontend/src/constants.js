// 컨트랙트 주소
export const CONTRACT_ADDRESS = "0xa41c79ce08e3d1214ea76c4061bedb635b979e68";

// 결제 및 조회를 위해 필요한 최소한의 함수 명세서 (Human-Readable ABI)
export const CONTRACT_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function mint(address to, uint256 amount)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];